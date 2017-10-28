import { RenpyFile } from './RenpyFile';
import * as LiteScript from './include/LiteScript';
import * as Utilities from './Utilities';
import * as Renpy from './include/Renpy';

let placeTranslation = Utilities.readDictionary<Renpy.NameWithId>('rs_names.txt', source => ({ name: source[0], id: source[1] }));
let characterTranslation = Utilities.readDictionary<Renpy.NameWithId>('rs_characters.txt', source => ({ name: source[0], id: source[1] }));

// DEBUG support
import * as File from 'fs';
import * as _ from 'lodash';
import * as ReadLine from 'readline-sync';
let outputFile: string[] = new Array<string>();
function debug(unique: boolean = true): void {
    if (unique) outputFile = _.uniq(outputFile);
    File.writeFileSync('debug.txt', outputFile.join('\n'));
}

export function generateRenpyCode(project: LiteScript.Project, position: string): void {
    RenpyFile.basePath = position;
    saveGlobalVariables(project);
    saveGlobalResources(project);
    let imageNameList: Renpy.NameWithId[] = new Array<Renpy.NameWithId>();
    project.files.forEach(file => {
        findAllImageName(file.entrance, imageNameList, []);
    });
    project.files.forEach(file => {
        saveFile(file, imageNameList);
    });
    saveDebugInformation(project, imageNameList);
    debug();
}

function saveGlobalVariables(project: LiteScript.Project): void {
    let varInitFile = new RenpyFile('variables');
    varInitFile.pythonInit();
    varInitFile.indent();
    project.variables.forEach(variable => {
        varInitFile.defineVariable(variable);
    });
    varInitFile.unindent();
    varInitFile.save();
}

function saveGlobalResources(project: LiteScript.Project): void {
    let resourceFile = new RenpyFile('resources');
    resourceFile.init(-1);
    resourceFile.indent();
    project.galleries.forEach(resource => {
        resourceFile.defineImage(resource);
    });
    project.resources.forEach(resource => {
        if (resource.type == LiteScript.ResourceType.Animation)
            resourceFile.defineAnimation(resource);
        else if (resource.type == LiteScript.ResourceType.Character)
            resourceFile.defineConsant(`${RenpyFile.prefix.character}_${resource.id}`, `Character("${(resource as LiteScript.CharacterResource).extraData}", who_color="#0099FF")`);
        else if (resource.type == LiteScript.ResourceType.Effect)
            resourceFile.defineConsant(`${RenpyFile.prefix.effect}_${resource.id}`, getEffectString(resource));
        else if (resource.type == LiteScript.ResourceType.Image)
            resourceFile.defineImage(resource);
    });
    resourceFile.unindent();
    resourceFile.save();
}

function saveDebugInformation(project: LiteScript.Project, imageNameList: Renpy.NameWithId[]): void {
    let localFile = new RenpyFile('debug');
    imageNameList.forEach(v => {
        localFile.comment(`Image id: ${v.name} -> ${v.id}`);
    });
    localFile.save();
}

function saveFile(source: LiteScript.File, imageNameList: Renpy.NameWithId[]): void {
    let localFile = new RenpyFile(`file_${source.id}`);
    localFile.comment(`LM2RENPY Converter ©2017 GILESFVK ËKITES (同人サークル　ギレスフク　エキテス)`);
    localFile.comment();
    localFile.comment(`From LiveMaker Scene: ${source.id} (${source.name})`);
    localFile.line();
    let mappedBlockId: string[] = new Array<string>();
    let ayumiGlobalMapInfo: string[] = new Array<string>();
    loadBlock(source.entrance, imageNameList, mappedBlockId, ayumiGlobalMapInfo, localFile);
    localFile.save();
}

function findAyumiGlobalGroup(block: LiteScript.Block, currentList: string[]): string[] {
    if (currentList.includes(block.id)) return currentList;
    currentList.push(block.id);
    if (block.type == LiteScript.BlockType.Menu) {
        if (block.name.startsWith('School inside')|| block.name.startsWith('School outside') || block.name.startsWith('Misaki') || block.name.startsWith('Hotel')) {
            block.nextBlocks.forEach(v => {
                if (v.target.name.startsWith('Target') || v.target.name.startsWith('Conversation') || v.target.name.startsWith('Character'))
                    currentList.push(v.target.id);
            });
            return currentList;
        } else
            throw `Cannot analyse next block with id ${block.id} for Ayumi Global map: Name ${block.name} is not a part of pre-defined map`;
    }
    block.nextBlocks.forEach(v => {
        findAyumiGlobalGroup(v.target, currentList);
    });
    return currentList;
}

function showGalleryImageIfNeeded(image: LiteScript.ImageResource | LiteScript.AnimationResource, localFile: RenpyFile, project: LiteScript.Project): void {
    if (image.extraData) {
        image.extraData.forEach(v => {
            if (!project.galleries.includes(v.source)) return;
            localFile.comment(`Gallery unlock: ${v.source.path}`);
            localFile.show(`${RenpyFile.prefix.imageResource}_${v.source.id}`, false, false, `${RenpyFile.prefix.imageResource}_${v.source.id}`, null, -100);
            localFile.hide(`${RenpyFile.prefix.imageResource}_${v.source.id}`);
            localFile.line();
        });
    } else {
        if (!project.galleries.includes(image as LiteScript.ImageResource)) return;
        localFile.comment(`Gallery unlock: ${image.path}`);
        localFile.show(`${RenpyFile.prefix.imageResource}_${image.id}`, false, false, `${RenpyFile.prefix.imageResource}_${image.id}`, null, -100);
        localFile.hide(`${RenpyFile.prefix.imageResource}_${image.id}`);
        localFile.line();
    }
}

function loadBlock(block: LiteScript.Block, imageNameList: Renpy.NameWithId[], mappedBlockId: string[], ayumiGlobalMapInfo: string[], localFile: RenpyFile): void {
    if (mappedBlockId.includes(block.id)) return;
    mappedBlockId.push(block.id);
    localFile.label(`${RenpyFile.prefix.block}_${block.id}`);
    localFile.indent(1);
    localFile.comment(`Node: ${block.id} (${block.name})`);
    if (block.type == LiteScript.BlockType.SceneStart) {
        block.file.variables.forEach(variable => {
            localFile.defineVariable(variable);
        });
    } else if (block.type == LiteScript.BlockType.SceneEnd) {
        block.file.variables.forEach(variable => {
            localFile.undefineVariable(variable);
        });
    } else if (block.type == LiteScript.BlockType.Jump) {
        block.file.variables.forEach(variable => {
            localFile.undefineVariable(variable);
        });
        localFile.jump(`${RenpyFile.prefix.block}_${block.content<LiteScript.BlockDataJump>().target.id}`);
    } else if (block.type == LiteScript.BlockType.Call) {
        let content = block.content<LiteScript.BlockDataCall>();
        if (content.page != null)
            localFile.systemScreen(content.page);
        else
            localFile.call(`${RenpyFile.prefix.block}_${content.target.id}`);
    } else if (block.type == LiteScript.BlockType.Menu) {
        if (ayumiGlobalMapInfo.includes(block.id)) {
            let extraParams = /([^XCTLA]+)\s([XCTLA]+)/g.exec(block.name);
            let conversations = block.nextBlocks.filter(v => v.target.name.startsWith('Conversation'));
            let targets = block.nextBlocks.filter(v => v.target.name.startsWith('Target'));
            let allowChangeTime = extraParams[2][0] == 'X' ? 'False' : 'True';
            let allowAbandon = extraParams[2][3] == 'X' ? 'False' : 'True';
            for (let i = 0; i < conversations.length; i++) {
                for (let j = 0; j < targets.length; j++) {
                    if (i == 0 && j == 0)
                        localFile.if(`judge_lm_condition(${Utilities.stringifyCondition(Utilities.removeSelectorCondition(conversations[i].condition))}) and judge_lm_condition(${Utilities.stringifyCondition(Utilities.removeSelectorCondition(targets[j].condition))})`);
                    else
                        localFile.elif(`judge_lm_condition(${Utilities.stringifyCondition(Utilities.removeSelectorCondition(conversations[i].condition))}) and judge_lm_condition(${Utilities.stringifyCondition(Utilities.removeSelectorCondition(targets[j].condition))})`);
                    localFile.indent();
                    localFile.call(`scb_global_map(sys_ayumi_global_map_time, sys_ayumi_global_map_character , "${extraParams[1].toLowerCase().replace(/\s/g, '_')}", ${allowChangeTime}, ${allowAbandon}, talk_label="block_${conversations[i].target.id}", target_label="block_${targets[j].target.id}")`);
                    localFile.unindent();
                }
            }
            localFile.python(`del sys_ayumi_global_map_time`);
            localFile.python(`del sys_ayumi_global_map_character`);
        } else
            localFile.callMenu(block.content<LiteScript.BlockDataMenu>());
    } else if (block.type == LiteScript.BlockType.Input) {
        localFile.callInput(block.content<LiteScript.BlockDataInput>());
    } else if (block.type == LiteScript.BlockType.Choice) {
        localFile.callChoice(block.content<LiteScript.BlockDataChoice>());
    } else if (block.type == LiteScript.BlockType.Calculator) {
        let content = block.content<LiteScript.BlockDataCalculator>();
        content.variables.forEach(variable => {
            localFile.defineVariable(variable);
        });
        loadCalculator(content.codes, localFile, block);
        content.variables.forEach(variable => {
            localFile.undefineVariable(variable);
        });
    } else if (block.type == LiteScript.BlockType.Normal) {
        if (block.name == 'School outside' || block.name == 'School inside' || block.name == 'Misaki' || block.name == 'Hotel') {
            ayumiGlobalMapInfo = findAyumiGlobalGroup(block, []);
        }
        let content = block.content<LiteScript.BlockDataNormal>();
        loadNormal(content.items, localFile, block, imageNameList, ayumiGlobalMapInfo);
    }
    if (block.nextBlocks.length > 0 && !(ayumiGlobalMapInfo.includes(block.id) && (block.name.startsWith('Target') || block.name.startsWith('Conversation') || block.name.startsWith('Character')))) {
        localFile.line();
        localFile.indent(1);
        block.nextBlocks.forEach(next => {
            localFile.if(`judge_lm_condition(${Utilities.stringifyCondition(next.condition)})`);
            localFile.indent();
            localFile.jump(`${RenpyFile.prefix.block}_${next.target.id}`);
            localFile.unindent();
        });
    }
    localFile.indent(1);
    localFile.line();
    localFile.return();
    localFile.unindent();
    localFile.line();
    block.nextBlocks.forEach(next => {
        loadBlock(next.target, imageNameList, mappedBlockId, ayumiGlobalMapInfo, localFile);
    });
}

function loadCalculator(codes: LiteScript.Code[], localFile: RenpyFile, block: LiteScript.Block): void {
    let i = 0;
    let currentWhile: LiteScript.CalculatorDataWhile = null;
    let whileIndent: number = -1;
    while (i < codes.length) {
        let code = codes[i];
        localFile.indent(code.scopeIndent + 1);
        if (code.type == LiteScript.CalculatorType.While) {
            let content = code.content<LiteScript.CalculatorDataWhile>();
            if (content.init)
                localFile.python(content.init);
            localFile.while(content.condition);
            localFile.indent();
            currentWhile = content;
            whileIndent = code.scopeIndent;
        } else if (code.type == LiteScript.CalculatorType.Continue) {
            let content = code.content<LiteScript.CalcualtorDataConditionBase>();
            if (content.condition == 'True')
                localFile.continue();
            else {
                localFile.if(content.condition);
                localFile.indent();
                localFile.python(currentWhile.loop);
                localFile.continue();
                localFile.unindent();
            }
        } else if (code.type == LiteScript.CalculatorType.Break) {
            let content = code.content<LiteScript.CalcualtorDataConditionBase>();
            if (content.condition == 'True')
                localFile.break();
            else {
                localFile.if(content.condition);
                localFile.indent();
                localFile.break();
                localFile.unindent();
            }
        } else {
            if (whileIndent > -1 && code.scopeIndent <= whileIndent) {
                localFile.indent(whileIndent + 2);
                if (currentWhile.loop)
                    localFile.python(currentWhile.loop);
                localFile.indent(code.scopeIndent + 1);
                currentWhile = null;
                whileIndent = -1;
                localFile.endWhile();
            }
            if (code.type == LiteScript.CalculatorType.Call) { // 不处理CALL
                let content = code.content<LiteScript.CalculatorDataCall>();
                console.warn(`WARNING: Ignore call at block with i ${block.id}, this function is not supported by Ren\'Py`);
                console.warn(`\tTarget: ${content.target}`);
                localFile.comment(`WARNING: Call ${content.target} with parameter ${content.param.join(', ')} will be ignored`);
                localFile.python('True == True');
            } else if (code.type == LiteScript.CalculatorType.ShouldConvertManual) { // 不处理TEXTINS
                let content = code.content<LiteScript.CalculatorDataShouldConvertManual>();
                console.warn(`WARNING: Ignore textins at block with i ${block.id}, this function is not supported by Ren\'Py`);
                console.warn(`\tContent: ${content.content}`);
                localFile.comment(`WARNING: TextIns ${JSON.stringify(content.content)} will be ignored`);
                localFile.python('True == True');
            } else if (code.type == LiteScript.CalculatorType.Pause) {
                let content = code.content<LiteScript.CalculatorDataPause>();
                if (content.condition != null) // 不处理WAIT的条件
                    localFile.comment(`WARNING: Ignore condition of wait ${content.condition}`);
                if (content.time > 0)
                    localFile.pause(content.time);
            } else if (code.type == LiteScript.CalculatorType.CreateVariable) {
                let content = code.content<LiteScript.CalculatorDataVariable>();
                localFile.defineVariable(content.content);
            } else if (code.type == LiteScript.CalculatorType.ClearVariable) {
                localFile.python(`del ${code.content<LiteScript.CalculatorDataVariable>().content.name}`);
            } else if (code.type == LiteScript.CalculatorType.PlaySound) {
                let content = code.content<LiteScript.CalculatorDataSound>();
                if (typeof content.source == 'string')
                    localFile.pythonSound(content.name, content.source, content.repeat);
                else
                    localFile.pythonSound(content.name, `"${content.source.path}"`, content.repeat);
            } else if (code.type == LiteScript.CalculatorType.DeleteObject) {
                localFile.pythonHide(code.content<LiteScript.CalculatorDataDeleteObject>().content);
            } else if (code.type == LiteScript.CalculatorType.StopMedia) {
                let content = code.content<LiteScript.CalculatorDataStopMedia>();
                localFile.pythonStopSound(content.name, content.fadeTime);
            } else if (code.type == LiteScript.CalculatorType.If) {
                localFile.if(code.content<LiteScript.CalcualtorDataConditionBase>().condition);
            } else if (code.type == LiteScript.CalculatorType.Elseif) {
                localFile.elif(code.content<LiteScript.CalcualtorDataConditionBase>().condition);
            } else if (code.type == LiteScript.CalculatorType.Else) {
                localFile.else();
            } else if (code.type == LiteScript.CalculatorType.CreateImage) {
                let content = code.content<LiteScript.CalculatorDataCreateImage>();
                if (typeof content.source == 'string')
                    localFile.pythonShow(content.name, content.source, null, content.priority);
                else
                    localFile.pythonShow(content.name, `"${content.source.path}"`, null, content.priority);
            } else if (code.type == LiteScript.CalculatorType.RawCode) {
                let content = code.content<LiteScript.CalculatorDataRawCode>();
                if (content.content.startsWith('SetArray')) {
                    let reg = new RegExp('(\\w+)[,\\)]', "g");
                    let matched: string[];
                    let params: string[] = new Array<string>();
                    while (matched = reg.exec(content.content))
                        params.push(matched[1].trim());
                    let result = params[0];
                    params.splice(0, 1);
                    let arrayContent: string = '0';
                    for (let i = params.length - 1; i > -1; i--) {
                        arrayContent = `[${arrayContent}] * ${params[i]}`;
                    }
                    localFile.python(`${result} = ${arrayContent}`);
                } else {
                    if (content.content.includes('TrimArray'))
                        content.content = content.content.replace(/TrimArray\([\s]*([^(),\s]+)[\s]*\)/g, '$1 = [e for e in $1 if e != 0]');
                    if (content.content.includes('StringToArray'))
                        content.content = content.content.replace(/StringToArray\([\s]*([^(),]*),[\s]*([^(),\s]*)[\s]*\)/g, '$2 = $1.split("\\n")');
                    if (content.content.includes('UniqueArray'))
                        content.content = content.content.replace(/UniqueArray\(([^()]+)\)/g, '$1 = list(set($1))');
                    localFile.python(content.content.replace(/FirstName/g, 'persistent.FirstName')
                                                    .replace(/LastName/g, 'persistent.LastName')
                                                    .replace(/SystemStoryCache/g, 'persistent.SystemStoryCache')
                                                    .replace(/GClickWarningShown/g, 'persistent.GClickWarningShown')
                                                    .replace(/SYSMusicAvailable/g, 'persistent.SYSMusicAvailable')
                                                    .replace(/IsFirstLaunch/g, 'persistent.IsFirstLaunch'));
                }
            }
        }
        i++;
    }
}

function findAllImageName(block: LiteScript.Block, imageNameList: Renpy.NameWithId[], mappedBlockId: string[]): void {
    if (mappedBlockId.includes(block.id)) return;
    mappedBlockId.push(block.id);
    if (block.type == LiteScript.BlockType.Normal) {
        let commands = block.content<LiteScript.BlockDataNormal>().items;
        commands.forEach(command => {
            if (command.type == LiteScript.CommandType.Image) {
                let content = command.content<LiteScript.CommandContentImage>();
                let result = imageNameList.find(v => v.name == content.name);
                if (!result)
                imageNameList.push({
                    name: content.name,
                    id: Utilities.newUUID()
                });
            } else if (command.type == LiteScript.CommandType.DestroyImage) {
                let content = command.content<LiteScript.CommandContentDestroyImage>();
                content.target.forEach(target => {
                    let result = imageNameList.find(v => v.name == target);
                    if (!result)
                        imageNameList.push({
                            name: target,
                            id: Utilities.newUUID()
                        });
                });
            }
        });
    }
    block.nextBlocks.forEach(next => {
        findAllImageName(next.target, imageNameList, mappedBlockId);
    });
}

function loadNormal(commands: LiteScript.Command[], localFile: RenpyFile, block: LiteScript.Block, imageNameList: Renpy.NameWithId[], ayumiGlobalMapInfo: string[]): void {
    let i = 0;
    let activeCharacter: LiteScript.CharacterResource = null;
    while (i < commands.length) {
        let command = commands[i];
        if (command.type == LiteScript.CommandType.Dialogue) {
            let dialogueText = '';
            let content = command.content<LiteScript.CommandContentDialogue>();
            let currentCharacter = content.character;
            while (i < commands.length && (command.type & (LiteScript.CommandType.Dialogue | LiteScript.CommandType.Wait | LiteScript.CommandType.WaitForClick | LiteScript.CommandType.ChangeTextSpeed | LiteScript.CommandType.ShowVariableContent)) != 0) {
                if (command.type == LiteScript.CommandType.Dialogue) {
                    if (content.character != currentCharacter) break;
                    content = command.content<LiteScript.CommandContentDialogue>();
                    dialogueText += styleText(content.texts);
                } else if (command.type == LiteScript.CommandType.Wait) {
                    dialogueText += `{w=${command.content<LiteScript.CommandContentTimeTarget>().time / 1000}}`;
                } else if (command.type == LiteScript.CommandType.ShowVariableContent) {
                    dialogueText += `[${command.content<LiteScript.CommandContentNameTarget>().name}]`;
                } else {
                    dialogueText += '{w}';
                }
                i ++;
                command = commands[i];
            }
            if (command && command.type != LiteScript.CommandType.WaitAndClear)
                dialogueText += '{nw}';
            dialogueText = removeUselessCharacter(dialogueText);
            if (activeCharacter == currentCharacter)
                localFile.extend(dialogueText);
            else {
                activeCharacter = currentCharacter;
                localFile.text(activeCharacter, dialogueText);
            }
            i --;
        } else if (command.type == LiteScript.CommandType.WaitAndClear) {
            activeCharacter = null;
            localFile.line();
        } else if (command.type == LiteScript.CommandType.ShowMessageBox) {
            localFile.window(true);
            localFile.line();
        } else if (command.type == LiteScript.CommandType.HideMessageBox) {
            localFile.window(false);
            localFile.line();
        } else if (command.type == LiteScript.CommandType.SetMessageBoxTarget) {
            localFile.python(`set_window("${command.content<LiteScript.CommandContentNameTarget>().name}")`);
        } else if (command.type == LiteScript.CommandType.Sound) {
            let commandContent = command.content<LiteScript.CommandContentSound>();
            localFile.sound(commandContent.source, findSoundtrack(commandContent.track));
            localFile.line();
        } else if (command.type == LiteScript.CommandType.StopSound) {
            let commandContent = command.content<LiteScript.CommandContentStopSound>();
            localFile.stopSound(findSoundtrack(commandContent.track), commandContent.time / 1000);
            localFile.line();
        } else if (command.type == LiteScript.CommandType.Wait) {
            localFile.pause(command.content<LiteScript.CommandContentTimeTarget>().time / 1000);
            localFile.line();
        } else if (command.type == LiteScript.CommandType.DestroyImage) {
            let commandContent = command.content<LiteScript.CommandContentDestroyImage>();
            commandContent.target.forEach(target => {
                if (target == '表示') {
                    if (block.name.startsWith('School') || block.name.startsWith('Misaki'))
                        localFile.python('set_place_title()');
                    else
                        localFile.python('set_place_title(_("故事中"))');
                } else {
                    let name = imageNameList.find(v => v.name == target);
                    if (!name)
                        throw `Cannot hide image with name ${target}: No pre-defined tag for this name`;
                    localFile.hide(`tag_${name.id}`);
                }
            });
            if (commandContent.effect)
                localFile.with(`${RenpyFile.prefix.effect}_${commandContent.effect.id}`);
            localFile.line();
        } else if (command.type == LiteScript.CommandType.ChangeImage) {
            let commandContent = command.content<LiteScript.CommandContentChangeImage>();
            if (commandContent.name == '表示') {
                if (commandContent.source.path.endsWith('Title.lcm')) {
                    // ignore
                } else {
                    let nameList = commandContent.source.path.split('/');
                    let translatedName = placeTranslation.find(v => v.name == nameList[nameList.length - 1]);
                    if (translatedName) {
                        localFile.python(`set_place_title(_("${translatedName.id}"))`);
                    }
                }
            } else {
                if (ayumiGlobalMapInfo.includes(block.id) && (commandContent.name == '背景' || commandContent.name == '注意' || commandContent.name == '表示２' || commandContent.name == '天気') || block.name.startsWith('Target') || block.name.startsWith('Conversation') || block.name.startsWith('Character')) {
                    // ignore
                } else {
                    let name = imageNameList.find(v => v.name == commandContent.name);
                    if (!name)
                        throw `Cannot change image with name ${commandContent.name}: No pre-defined tag for this name`;
                    showGalleryImageIfNeeded(commandContent.source, localFile, block.file.project);
                    localFile.show(`${RenpyFile.prefix.imageResource}_${commandContent.source.id}`, false, false, `tag_${name.id}`, null, null);
                    if (commandContent.effect)
                    localFile.with(`${RenpyFile.prefix.effect}_${commandContent.effect.id}`);
                    localFile.line();
                }
            }
        } else if (command.type == LiteScript.CommandType.Image) {
            let commandContent = command.content<LiteScript.CommandContentImage>();
            if (commandContent.name == '表示') {
                if (commandContent.source.path.endsWith('Title.lcm')) {
                    // ignore
                } else {
                    let nameList = commandContent.source.path.split('/');
                    let translatedName = placeTranslation.find(v => v.name == nameList[nameList.length - 1]);
                    if (translatedName) {
                        localFile.python(`set_place_title(_("${translatedName.id}"))`);
                    }
                }
            } else {
                if (ayumiGlobalMapInfo.includes(block.id)) {
                    if (commandContent.name == '背景' || commandContent.name == '注意' || commandContent.name == '表示２' || commandContent.name == '天気' || block.name.startsWith('Target') || block.name.startsWith('Conversation') || block.name.startsWith('Character')) {
                        // ignore
                    } else if (commandContent.name == '友') {
                        let path = /グラフィック\\Chapter (\d)\\Moving\\([^\/]+)\\([^\/]+)\.\S*/g.exec(commandContent.source.path);
                        localFile.python(`sys_ayumi_global_map_character = "${characterTranslation.find(v => v.name == path[2]).id}"`);
                        localFile.python(`sys_ayumi_global_map_time = "${path[3].toLowerCase()}"`);
                    }
                } else {
                    let name = imageNameList.find(v => v.name == commandContent.name);
                    if (!name)
                        throw `Cannot show image with name ${commandContent.name}: No pre-defined tag for this name`;
                    showGalleryImageIfNeeded(commandContent.source, localFile, block.file.project);
                    let transform = getTransformName(commandContent.position);
                    localFile.show(`${RenpyFile.prefix.imageResource}_${commandContent.source.id}`, false, false, `tag_${name.id}`, transform, commandContent.priority);
                    if (commandContent.effect)
                    localFile.with(`${RenpyFile.prefix.effect}_${commandContent.effect.id}`);
                    localFile.line();
                    if (commandContent.mode == LiteScript.RepeatMode.WaitUntilFinish) {
                        localFile.pause();
                        localFile.line();
                    }
                }
            }
        }
        i ++;
    }
}

function getTransformName(position: LiteScript.Point): string {
    let result: string = '';
    if (position.percentageModeX && position.percentageModeY) {
        if ((position.x == 0 || position.x == 0.5 || position.x == 1) && (position.y == 0 || position.y == 0.5 || position.y == 1)) {
            if (position.x == 0)
                result += 'left';
            else if (position.x == 0.5)
                result += 'center';
            else
                result += 'right';
            result += '_';
            if (position.y == 0)
                result += 'top';
            else if (position.y == 0.5)
                result += 'center';
            else
                result += 'bottom';
        } else
        result += `Transform(xanchor=${position.x}, yanchor=${position.y})`;
    } else {
        let params: string[] = new Array<string>();
        if (position.percentageModeX)
            params.push(`xanchor=${position.x.toFixed(1)}`);
        else
            params.push(`xpos=${position.x}`);
        if (position.percentageModeY)
            params.push(`yanchor=${position.y.toFixed(1)}`);
        else
            params.push(`ypos=${position.y}`);
        result = `Transform(${params.join(', ')})`;
    }
    return result;
}

function styleText(text: LiteScript.Text[]): string {
    let result = '';
    text.forEach(item => {
        let itemResult = '';
        if (typeof item.text == 'string')
            itemResult = item.text;
        else
            itemResult = `[${item.text.name}]`;
        if (item.bold)
            itemResult = `{b}${itemResult}{/b}`;
        if (item.color && item.color != '')
            itemResult = `{color=${item.color}}${itemResult}{/color}`;
        if (item.italic)
            itemResult = `{i}${itemResult}{/i}`;
        if (item.size && item.size > 0)
            itemResult = `{size=${item.size}}${itemResult}{/size}`;
        if (item.underline)
            itemResult = `{u}${itemResult}{/u}`;
        itemResult = itemResult.replace(/\n/g, '\\n');
        itemResult = itemResult.replace(/　/g, '');
        result += itemResult;
    });
    return result;
}

function removeUselessCharacter(text: string): string {
    text = text.replace(/\\n/g, '');
    text = text.replace(/「/g, '');
    text = text.replace(/」/g, '');
    if (text.endsWith('{w}'))
        text = text.substring(0, text.lastIndexOf('{w}'));
    if (text.endsWith('{w}{nw}'))
        text = text.substring(0, text.lastIndexOf('{w}{nw}'));
    return text;
}

function findSoundtrack(track: LiteScript.Soundtrack): Renpy.SoundChannel {
    switch(track) {
        case LiteScript.Soundtrack.BGM:
            return Renpy.SoundChannel.Bgm;
        case LiteScript.Soundtrack.BGM2:
            return Renpy.SoundChannel.Bgm2;
        case LiteScript.Soundtrack.Effect:
            return Renpy.SoundChannel.Effect;
        case LiteScript.Soundtrack.Effect2:
            return Renpy.SoundChannel.Effect2;
        case LiteScript.Soundtrack.Voice:
            return Renpy.SoundChannel.Voice;
        case LiteScript.Soundtrack.Voice2:
            return Renpy.SoundChannel.Voice2;
        default:
            throw `Cannot find soundtrack with type ${track}`;
    }
}

function getEffectString(target: LiteScript.EffectResource): string {
    switch (target.extraData.type) {
        case LiteScript.EffectType.None:
            return 'None';
        case LiteScript.EffectType.Fade:
            return `Dissolve(${target.extraData.time / 1000})`
        case LiteScript.EffectType.BlindHorizontal:
            return `ImageDissolve("lib/lmeffect/blind_h.png", ${target.extraData.time / 1000}, reverse=${target.extraData.reverse ? 'True' : 'False'})`;
        case LiteScript.EffectType.BlindVertical:
            return `ImageDissolve("lib/lmeffect/blind_v.png", ${target.extraData.time / 1000}, reverse=${target.extraData.reverse ? 'True' : 'False'})`;
        case LiteScript.EffectType.CurtainHorizontal:
            return `ImageDissolve("lib/lmeffect/curtain_h.png", ${target.extraData.time / 1000}, reverse=${target.extraData.reverse ? 'True' : 'False'})`;
        case LiteScript.EffectType.CurtainVertical:
            return `ImageDissolve("lib/lmeffect/curtain_v.png", ${target.extraData.time / 1000}, reverse=${target.extraData.reverse ? 'True' : 'False'})`;
        case LiteScript.EffectType.ScrollHorizontal:
            return `PushMove(${target.extraData.time / 1000}, "push${target.extraData.reverse ? 'right' : 'left'}")`;
        case LiteScript.EffectType.ScrollVertical:
            return `PushMove(${target.extraData.time / 1000}, "push${target.extraData.reverse ? 'up' : 'down'}")`;
        case LiteScript.EffectType.Grid:
            return `ImageDissolve("lib/lmeffect/grid.png", ${target.extraData.time / 1000}, reverse=${target.extraData.reverse ? 'True' : 'False'})`;
        case LiteScript.EffectType.GridHorizontal:
            return `ImageDissolve("lib/lmeffect/grid_h.png", ${target.extraData.time / 1000}, reverse=${target.extraData.reverse ? 'True' : 'False'})`;
        case LiteScript.EffectType.GridVertical:
            return `ImageDissolve("lib/lmeffect/grid_v.png", ${target.extraData.time / 1000}, reverse=${target.extraData.reverse ? 'True' : 'False'})`;
        case LiteScript.EffectType.Dither:
            return `ImageDissolve("lib/lmeffect/dither.png", ${target.extraData.time / 1000}, reverse=${target.extraData.reverse ? 'True' : 'False'})`;
        case LiteScript.EffectType.White:
            return `Fade(${target.extraData.time / 1000}, 0.0, ${target.extraData.time / 1000}, color="#FFFFFF")`;
        case LiteScript.EffectType.Black:
            return `Fade(${target.extraData.time / 1000}, 0.0, ${target.extraData.time / 1000}, color="#000000")`;
        case LiteScript.EffectType.Flash:
            return `Fade(${target.extraData.time / 4000}, 0.0, ${target.extraData.time / 4000 * 3}, color="#FFFFFF")`;
        case LiteScript.EffectType.Mosaic:
            return `Pixellate(${target.extraData.time, 10})`;
        case LiteScript.EffectType.ScratchHorizontal: // 无法实现，使用Mosaic替代
            return `Pixellate(${target.extraData.time, 10}) # Origin: ScratchHorizontal`;
        case LiteScript.EffectType.ScratchVertical: // 无法实现，使用Mosaic替代
            return `Pixellate(${target.extraData.time, 10}) # Origin: ScratchVertical`;
        case LiteScript.EffectType.Spot: // 无法实现，采用中心淡入淡出替代
            return `ImageDissolve("lib/lmeffect/center.png", ${target.extraData.time / 1000}, reverse=${target.extraData.reverse ? 'True' : 'False'})`;
        case LiteScript.EffectType.Mask: // AYUMI里此效果等价于Fade
            return `Dissolve(${target.extraData.time / 1000}) # Origin: Mask`;
        case LiteScript.EffectType.MaskWhite: // AYUMI里此效果等价于Fade
            return `Dissolve(${target.extraData.time / 1000}) # Origin MaskWhite`;
        case LiteScript.EffectType.MaskBlack: // AYUMI里此效果等价于Fade
            return `Dissolve(${target.extraData.time / 1000}) # Origin: MaskBlack`;
        case LiteScript.EffectType.ZoomSmall:
            return `OldMoveTransition(${target.extraData.time / 1000}, enter_factory=ZoomInOut(0.01, 1.0))`;
        case LiteScript.EffectType.ZoomBig:
            return `OldMoveTransition(${target.extraData.time / 1000}, enter_factory=ZoomInOut(1.0, 0.01))`;
        case LiteScript.EffectType.ZoomIn:
            return `OldMoveTransition(${target.extraData.time / 1000}, enter_factory=ZoomInOut(0.01, 1.0), leave_factory=ZoomInOut(1.0, 0.01))`;
        case LiteScript.EffectType.Ripple: // 无法实现，采用中心淡入淡出替代
            return `ImageDissolve("lib/lmeffect/center.png", ${target.extraData.time / 1000}, reverse=${target.extraData.reverse ? 'True' : 'False'}) # Origin: Ripple`;
        case LiteScript.EffectType.BlurWhite: // 模糊效果性能消耗过大，舍弃之
            return `Fade(${target.extraData.time / 1000}, 0.0, ${target.extraData.time / 1000}, color="#FFFFFF") # Origin: BlurWhite`;
        case LiteScript.EffectType.BlurBlack: // 模糊效果性能消耗过大，舍弃之
            return `Fade(${target.extraData.time / 1000}, 0.0, ${target.extraData.time / 1000}, color="#000000") # Origin: BlurBlack`;
        case LiteScript.EffectType.TwistHorizontal: // 无法实现，采用CropMove替代
            return `CropMove(${target.extraData.time / 1000}, "slide${target.extraData.reverse ? 'right' : 'left'}") # Origin: TwistHorizontal`;
        case LiteScript.EffectType.TwistVertical: // 无法实现，采用CropMove替代
            return `CropMove(${target.extraData.time / 1000}, "slide${target.extraData.reverse ? 'up' : 'bottom'}") # Origin: TwistVertical`;
        case LiteScript.EffectType.Crack: // 无法实现，采用震动+淡出替代
            return `ComposeTransition(Shake((0.5, 1.0, 0.5, 1.0), ${target.extraData.time / 1000}, dist=5), after=dissolve) # Origin: Crack`
        case LiteScript.EffectType.Clockhand:
            return `ImageDissolve("lib/lmeffect/circle.png", ${target.extraData.time / 1000}, reverse=${target.extraData.reverse ? 'True' : 'False'})`;
        case LiteScript.EffectType.RubberHorizontal: // 无法实现，使用Mosaic替代
            return `Pixellate(${target.extraData.time, 10}) # Origin: RubberHorizontal`;
        case LiteScript.EffectType.RubberVertical: // 无法实现，使用Mosaic替代
            return `Pixellate(${target.extraData.time, 10}) # Origin: RubberVertical`;
        case LiteScript.EffectType.FanCenter:
            return `ImageDissolve("lib/lmeffect/fan.png", ${target.extraData.time / 1000}, reverse=${target.extraData.reverse ? 'True' : 'False'})`;
        case LiteScript.EffectType.FanBorder:
            return `ImageDissolve("lib/lmeffect/fan_h.png", ${target.extraData.time / 1000}, reverse=${target.extraData.reverse ? 'True' : 'False'})`;
        case LiteScript.EffectType.Circle:
            return `ImageDissolve("lib/lmeffect/center.png", ${target.extraData.time / 1000}, reverse=${target.extraData.reverse ? 'True' : 'False'})`;
        case LiteScript.EffectType.BlockCoil:
            return `ImageDissolve("lib/lmeffect/block.png", ${target.extraData.time / 1000}, reverse=${target.extraData.reverse ? 'True' : 'False'})`;
        case LiteScript.EffectType.BlockRandom:
            return `ImageDissolve("lib/lmeffect/block_random.png", ${target.extraData.time / 1000}, reverse=${target.extraData.reverse ? 'True' : 'False'})`;
    }
}
