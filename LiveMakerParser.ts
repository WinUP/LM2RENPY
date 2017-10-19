import * as GeneralScript from './include/GeneralScript';
import * as LiveProject from './include/LiveMakerProject';
import * as LiveScene from './include/LiveMakerSceneCode';
import * as Utilities from './Utilities';
import * as Converter from './Converter';
import * as LiveMenu from './include/LiveMakerMenu';

import * as Iconv from 'iconv-lite';
import * as Path from 'path';
import * as File from 'fs';
import * as Xml from 'fast-xml-parser';
import * as _ from 'lodash';

export const PROJECT_RESOURCE_ROOT = 'C:\\Users\\lghol\\OneDrive\\Backup\\SCB Project\\runimage\\';

let Analysis: {
    dialogueBox: number,
    scene: number,
    block: number,
    file: number,
    menuOption: number,
    jump: number,
    command: number
} = {
    dialogueBox: 0,
    scene: 0,
    block: 0,
    file: 0,
    menuOption: 0,
    jump: 0,
    command: 0
};

export function parseProject(source: LiveProject.Project): GeneralScript.Project {
    console.log('Loading project structure...');
    source = JSON.parse(JSON.stringify(source).replace(/&quot;/g, '\\"')
                                              .replace(/&amp;/g, '&')
                                              .replace(/&lt;/g, '<')
                                              .replace(/&gt;/g, '>')
                                              .replace(/&#9;/g, ' '));
    let sceneResult: LiveProject.Scene[] = [];
    let generalProject: GeneralScript.Project = {
        title: source.Title,
        screenSize: { width: source.ScreenCX, height: source.ScreenCY },
        backgroundColor: source.BGColor,
        scene: [],
        variable: Utilities.findItemInChildren(source.Var).map(v => Converter.sceneVariable(v)),
        dialogueBox: [],
        gallery: Utilities.arrayIfNeeded(source.CGMode.List.Item),
        extendedResource: {
            menuFile: {},
            animationFile: {}
        }
    };

    console.log('Loading messageboxes...');
    // Messagebox
    Utilities.arrayIfNeeded(source.MessageBox.Item).forEach(messagebox => {
        Analysis.dialogueBox ++;
        console.log(`Find messagebox with name "${messagebox.Name}"`);
        generalProject.dialogueBox.push({
            name: messagebox.Name,
            font: {
                size: messagebox.Font.Size,
                color: messagebox.Font.Color,
                borderSize: messagebox.Font.Border,
                borderColor: messagebox.Font.BorderColor,
                fontFamily: messagebox.Font.Name
            },
            backgroundColor: messagebox.BGColor,
            backgroundImage: messagebox.BGFile,
            area: {
                x: messagebox.PosX - (messagebox.Width / 2),
                y: messagebox.PosY - (messagebox.Height / 2),
                width: messagebox.Width,
                height: messagebox.Height
            },
            margin: {
                top: messagebox.BGMarginT,
                bottom: messagebox.BGMarginB,
                left: messagebox.BGMarginL,
                right: messagebox.BGMarginR
            },
            cursor: {
                image: messagebox.CsrClick,
                position: { x: messagebox.CsrPosX, y: messagebox.CsrPosY },
                clickToContinueImage: messagebox.SEClick
            },
            alpha: +messagebox.BGAlpha
        });
    });

    console.log('Loading scenes...');
    // Scene
    Utilities.arrayIfNeeded(source.Folder.Item).forEach(scene => {
        Analysis.scene ++;
        console.log(`Find scene ${Utilities.hexName(scene.ID)} with name "${scene.Caption}"`);
        let result: GeneralScript.Scene = {
            id: scene.ID,
            name: scene.Caption,
            variable: Utilities.findItemInChildren(scene.Var).map(v => Converter.sceneVariable(v)),
            entrance: null,
            block: []
        };
        Utilities.findItemInChildren(scene.Node).forEach(node => {
            Analysis.block ++;
            console.log(`\t[Node] ${Utilities.hexName(node.ID)}（${node.Caption}）`);
            let block: GeneralScript.Block = {
                id: node.ID,
                name: node.Caption,
                next: [],
                data: null,
                type: Converter.blockType(node.Type)
            }
            result.block.push(block);
            if (block.type == GeneralScript.BlockType.Calculator) {
                let nodeData = node as LiveProject.NodeCalc;
                let targetData: GeneralScript.BlockDataCalculator = {
                    variable: Utilities.findItemInChildren(nodeData.Var).map(v => Converter.sceneVariable(v)),
                    code: Utilities.findItemInChildren(nodeData.Calc).map(v => parseCode(v))
                };
                block.data = targetData;
            } else if (block.type == GeneralScript.BlockType.Menu) {
                let nodeData = node as LiveProject.NodeMenu;
                let targetData: GeneralScript.BlockDataMenu = {
                    name: nodeData.Source,
                    fadeIn: nodeData.FadeinTime,
                    fadeOut: nodeData.FadeoutTime,
                    canCancel: Converter.boolean(nodeData.CancelEnabled),
                    hoverSound: nodeData.SoundHover,
                    clickSound: nodeData.SoundSelect,
                    timeLimitation: nodeData.TimeLimit,
                    condition: []
                };
                targetData.condition = Utilities.findItemInChildren(nodeData.VisibleCond).map(condition => {
                    let menuCondition: GeneralScript.MenuCondition = {
                        choice: condition.Name,
                        condition: Converter.condition(condition.Cond)
                    };
                    return menuCondition;
                });
                block.data = targetData;
                if (!Utilities.isMenuSaved(generalProject, nodeData.Source)) {
                    generalProject.extendedResource.menuFile[nodeData.Source] = parseMenu(nodeData);
                }
            } else if (block.type == GeneralScript.BlockType.Choice) {
                let nodeData = node as LiveProject.NodeChoice;
                let targetData: GeneralScript.BlockDataChoice = {
                    choice: [],
                    hoverSound: nodeData.SoundHover,
                    selectSound: nodeData.SoundSelect,
                    time: null,
                    align: Converter.align(nodeData.HAlign)
                }
                block.data = targetData;
                targetData.choice = Utilities.findItemInChildren(nodeData.Menu).map(v => ({
                    title: v.Caption,
                    condition: v.Cond
                }));
                if (typeof nodeData.TimeLimit == 'string') {
                    if (!Utilities.isAnimationSaved(generalProject, nodeData.TimeLimit)) {
                        let animation = parseAnimation(Path.resolve(PROJECT_RESOURCE_ROOT, nodeData.TimeLimit));
                        generalProject.extendedResource.animationFile[nodeData.TimeLimit] = animation;
                    }
                }
                targetData.time = nodeData.TimeLimit;
            } else if (block.type == GeneralScript.BlockType.Input) {
                let nodeData = node as LiveProject.NodeInput;
                let targetData: GeneralScript.BlockDataInput = {
                    title: nodeData.Prompt,
                    content:[]
                };
                block.data = targetData;
                targetData.content = Utilities.findItemInChildren(nodeData.Text).map(v =>({
                    maxLength: v.MaxLen,
                    minLength: v.MinLen,
                    storedVariableName: v.Param,
                    title: v.Caption
                }));
            } else if (block.type == GeneralScript.BlockType.Jump) {
                let nodeData = node as LiveProject.NodeJump;
                let targetData: GeneralScript.BlockDataJump = {
                    target: nodeData.Target
                };
                block.data = targetData;
            } else if (block.type == GeneralScript.BlockType.Call) {
                let nodeData = node as LiveProject.NodeNavigate;
                let targetData: GeneralScript.BlockDataNavigator = {
                    target: nodeData.Target
                };
                block.data = targetData;
                if (nodeData.TargetPage && nodeData.TargetPage != '') {
                    targetData.target = -1;
                    if (nodeData.TargetPage == 'ロード')
                        targetData.page = GeneralScript.SystemPage.Load;
                    else if (nodeData.TargetPage == 'セーブ')
                        targetData.page = GeneralScript.SystemPage.Save;
                    else if (nodeData.TargetPage == 'ＣＧモード')
                        targetData.page = GeneralScript.SystemPage.Gallery;
                }
            } else if (block.type == GeneralScript.BlockType.Normal) {
                let nodeData = node as LiveProject.NodeNormal;
                let targetData: GeneralScript.BlockDataNormal = {
                    content: []
                };
                block.data = targetData;
                let path = `data/${Utilities.hexName(nodeData.ID)}.lns`
                console.log(`\t\t -> SceneContent ${path}`);
                let content: string = '';
                if (File.existsSync(path)) {
                    content = Iconv.decode(File.readFileSync(path), 'shift-jis');
                    Analysis.file ++;
                }
                targetData.content = parseSceneCode(content, generalProject);
            } else if (block.type == GeneralScript.BlockType.Exit || block.type == GeneralScript.BlockType.SceneEnd || block.type == GeneralScript.BlockType.SceneStart) {
                block.data = {};
            }
            let jumpItem: GeneralScript.TargetWithCondition[] = Utilities.findItemInChildren(node.Jump).map(jump => {
                Analysis.jump ++;
                return {
                    target: jump.ID,
                    condition: Converter.condition(jump.Cond)
                };
            });
            block.next = jumpItem;
            if (block.type == GeneralScript.BlockType.SceneStart)
                result.entrance = block.id;
        });
        generalProject.scene.push(result);
    });

    // Analysis
    console.log(`\nAnalysis: ${Analysis.scene} scenes, ${Analysis.block} blocks, ${Analysis.file} files, ${Analysis.jump} jumps, ${Analysis.menuOption} menu options, ${Analysis.command} commands`)
    return generalProject;
}

function parseSceneCode(content: string, project: GeneralScript.Project): GeneralScript.Command[] {
    content = content.replace(/[\r\n]/g, '').replace(/<BR>/g, '\n');
    let result: LiveScene.Command[] = [];
    let i = 0;
    let currentCommand: LiveScene.Command = null;
    while (i < content.length) {
        let endIndex = content.indexOf('>', i + 1);
        let nextSpace = content.indexOf(' ', i + 1);
        if (content[i] == '<') { // 处理命令开始
            if (currentCommand) {
                throw '不允许在一个命令未结束时执行新的命令';
            }
            if (nextSpace == -1 || nextSpace > endIndex) { // 没有参数的命令
                currentCommand = {
                    type: content.substring(i + 1, endIndex) as LiveScene.CommandType,
                    param: {}
                };
                result.push(currentCommand);
                currentCommand = null;
                i = endIndex + 1;
                continue;
            }
            // 一般命令
            currentCommand = {
                type: content.substring(i + 1, nextSpace) as LiveScene.CommandType,
                param: {}
            };
            i = nextSpace + 1;
            continue;
        }
        if (currentCommand) { // 处理参数
            let commandSplitter = content.indexOf('=', i + 1);
            if (content[commandSplitter + 1] == '"') { // 有引号的参数
                let endPosition = content.indexOf('"', commandSplitter + 2);
                let param = {};
                currentCommand.param[content.substring(i, commandSplitter)] = content.substring(commandSplitter + 2, endPosition);
                i = endPosition + 1;
            } else { // 无引号的参数
                if (nextSpace > endIndex || nextSpace == -1) { // 最后一个参数
                    currentCommand.param[content.substring(i, commandSplitter)] = content.substring(commandSplitter + 1, endIndex);
                    i = endIndex;
                } else {
                    // 一般参数
                    currentCommand.param[content.substring(i, commandSplitter)] = content.substring(commandSplitter + 1, nextSpace);
                    i = nextSpace + 1;
                }
            }
            if (i == endIndex) {
                result.push(currentCommand);
                currentCommand = null;
                i++;
            } else if (content[i] == ' ') {
                i++;
            }
            continue;
        }
        // 纯文本
        let nextStart = content.indexOf('<', i + 1);
        if (nextStart == -1) nextStart = content.length;
        currentCommand = {
            type: LiveScene.CommandType.PLAINTEXT,
            param: { PLAINTEXT: content.substring(i, nextStart) }
        };
        result.push(currentCommand);
        currentCommand = null;
        i = nextStart;
    }
    Analysis.command += result.length;
    return convertSceneCode(result, project);
}

function convertSceneCode(source: LiveScene.Command[], project: GeneralScript.Project): GeneralScript.Command[] {
    let result: GeneralScript.Command[] = [];
    let i = 0;
    while (i < source.length) {
        let original = source[i];
        if (original.type == LiveScene.CommandType.PLAINTEXT || original.type == LiveScene.CommandType.B ||
            original.type == LiveScene.CommandType.I || original.type == LiveScene.CommandType.U ||
            original.type == LiveScene.CommandType.FONT) {
            let initialStyle: GeneralScript.CommandContentText = {
                text: null, size: null, color: null,
                bold: null, italic: null, underline: null,
                borderColor: null, borderWidth: null
            };
            let textParseResult = groupCommand(source, i, initialStyle);
            result = result.concat(textParseResult.result.map<GeneralScript.Command>(v => ({
                type: GeneralScript.CommandType.Text,
                content: v
            })));
            i = textParseResult.lastPointer;
            if (source[i - 1].type == LiveScene.CommandType.PLAINTEXT)
                i--;
        } else if (original.type == LiveScene.CommandType.PS) {
            result.push({
                type: GeneralScript.CommandType.WaitForClick,
                content: null
            });
        } else if (original.type == LiveScene.CommandType.PG) {
            result.push({
                type: GeneralScript.CommandType.WaitAndClear,
                content: null
            });
        } else if (original.type == LiveScene.CommandType.FLIP) {
            let content: GeneralScript.CommandContentEffect = {
                name: original.param['NAME'],
                time: +original.param['TIME'],
                type: Converter.effectType(original.param['EFFECT'] as LiveScene.EffectType),
                reverse: Converter.boolean(original.param['REVERSE']),
                default: Converter.boolean(original.param['DEFAULT']),
                parameter: [ original.param['PARAM1'], original.param['PARAM2'] ]
            }
            result.push({
                type: GeneralScript.CommandType.Effect,
                content: content
            });
        } else if (original.type == LiveScene.CommandType.SYSMENUON) {
            let content: GeneralScript.CommandContentToggle = {
                value: true
            };
            result.push({
                type: GeneralScript.CommandType.MenuToggle,
                content: content
            });
        } else if (original.type == LiveScene.CommandType.SYSMENUOFF) {
            let content: GeneralScript.CommandContentToggle = {
                value: false
            };
            result.push({
                type: GeneralScript.CommandType.MenuToggle,
                content: content
            });
        } else if (original.type == LiveScene.CommandType.SAVELOADON) {
            let content: GeneralScript.CommandContentToggle = {
                value: true
            };
            result.push({
                type: GeneralScript.CommandType.SaveLoadToggle,
                content: content
            });
        } else if (original.type == LiveScene.CommandType.SAVELOADOFF) {
            let content: GeneralScript.CommandContentToggle = {
                value: false
            };
            result.push({
                type: GeneralScript.CommandType.SaveLoadToggle,
                content: content
            });
        } else if (original.type == LiveScene.CommandType.WAIT) {
            let content: GeneralScript.CommandContentTimeTarget = {
                time: +original.param['TIME']
            };
            result.push({
                type: GeneralScript.CommandType.Wait,
                content: content
            });
        } else if (original.type == LiveScene.CommandType.WAITFOR) {
            let content: GeneralScript.CommandContentNameTarget = {
                name: original.param['NAME']
            };
            result.push({
                type: GeneralScript.CommandType.WaitUntilFinish,
                content: content
            });
        } else if (original.type == LiveScene.CommandType.TXSPF || original.type == LiveScene.CommandType.TXSPN ||
                   original.type == LiveScene.CommandType.TXSPS) {
            let speed = GeneralScript.TextSpeed.Normal;
            if (original.type == LiveScene.CommandType.TXSPF)
                speed = GeneralScript.TextSpeed.Fatest;
            if (original.type == LiveScene.CommandType.TXSPS)
                speed = GeneralScript.TextSpeed.Slow;
            let content: GeneralScript.CommandContentTextSpeed = {
                speed: speed
            };
            result.push({
                type: GeneralScript.CommandType.ChangeTextSpeed,
                content: content
            });
        } else if (original.type == LiveScene.CommandType.VAR) {
            let content: GeneralScript.CommandContentNameTarget = {
                name: original.param['NAME']
            };
            result.push({
                type: GeneralScript.CommandType.ShowVariableContent,
                content: content
            });
        } else if (original.type == LiveScene.CommandType.MESBOX) {
            let content: GeneralScript.CommandContentTimeTarget = {
                time: +original.param['TIME']
            };
            result.push({
                type: GeneralScript.CommandType.MessageBox,
                content: content
            });
        } else if (original.type == LiveScene.CommandType.CHGMESBOX) {
            let content: GeneralScript.CommandContentNameTarget = {
                name: original.param['NAME']
            };
            result.push({
                type: GeneralScript.CommandType.ChangeMessageBox,
                content: content
            });
        } else if (original.type == LiveScene.CommandType.DELMESBOX) {
            let content: GeneralScript.CommandContentTimeTarget = {
                time: +original.param['TIME']
            };
            result.push({
                type: GeneralScript.CommandType.DestroyMessageBox,
                content: content
            });
        } else if (original.type == LiveScene.CommandType.MOVIE) {
            let content: GeneralScript.CommandContentMovie = {
                source: 'MOVIE\\' + original.param['SOURCE']
            };
            result.push({
                type: GeneralScript.CommandType.Movie,
                content: content
            });
        } else if (original.type == LiveScene.CommandType.QUAKE) {
            let content: GeneralScript.CommandContentQuake = {
                target: original.param['NAME'].split(','),
                time: +original.param['TIME'],
                random: Converter.boolean(original.param['RANDOM']),
                x: +original.param['X'],
                y: +original.param['Y'],
                repeatCount: +original.param['CYCLE'],
                type: Converter.quakeType(original.param['TYPE'])
            };
            result.push({
                type: GeneralScript.CommandType.Quake,
                content: content
            });
        } else if (original.type == LiveScene.CommandType.STOPQUAKE) {
            let content: GeneralScript.CommandContentTimeTarget = {
                time: +original.param['TIME']
            };
            result.push({
                type: GeneralScript.CommandType.StopQuake,
                content: content
            });
        } else if (original.type == LiveScene.CommandType.SOUND) {
            let content: GeneralScript.CommandContentSound = {
                source: 'サウンド\\' + original.param['SOURCE'],
                track: Converter.soundtrack(original.param['TRACK']),
                mode: Converter.repeatMode(original.param['MODE']),
                volume: +original.param['VOLUME']
            };
            result.push({
                type: GeneralScript.CommandType.Sound,
                content: content
            });
        } else if (original.type == LiveScene.CommandType.STOPSND) {
            let content: GeneralScript.CommandContentStopSound = {
                time: +original.param['TIME'],
                track: Converter.soundtrack(original.param['TRACK'])
            };
            result.push({
                type: GeneralScript.CommandType.StopSound,
                content: content
            });
        } else if (original.type == LiveScene.CommandType.CHGVOL) {
            let content: GeneralScript.CommandContentChangeVolume = {
                time: +original.param['TIME'],
                track: Converter.soundtrack(original.param['TRACK']),
                volume: +original.param['VOLUME'],
                waitUntilFinish: Converter.boolean(original.param['WAIT'])
            };
            result.push({
                type: GeneralScript.CommandType.ChangeVolume,
                content: content
            });
        } else if (original.type == LiveScene.CommandType.IMAGE) {
            let path = 'グラフィック\\' + original.param['SOURCE'];
            let content: GeneralScript.CommandContentImage = {
                name: original.param['NAME'],
                source: path,
                x: Converter.align(original.param['X']),
                y: Converter.align(original.param['Y']),
                priority: LiveScene.Priority[original.param['PRIORITY']],
                effect: original.param['FLIP'],
                mode: Converter.repeatMode(original.param['MODE'])
            };
            result.push({
                type: GeneralScript.CommandType.Image,
                content: content
            });
            if (original.param['SOURCE'].endsWith('.lcm') || original.param['SOURCE'].endsWith('.lmt')) {
                if (!Utilities.isAnimationSaved(project, path)) {
                    let animation = parseAnimation(Path.resolve(PROJECT_RESOURCE_ROOT, path));
                    project.extendedResource.animationFile[path] = animation;
                }
            }
        } else if (original.type == LiveScene.CommandType.CHGIMG) {
            let path = 'グラフィック\\' + original.param['SOURCE'];
            let content: GeneralScript.CommandContentChangeImage = {
                name: original.param['NAME'],
                source: path,
                effect: original.param['FLIP'],
                mode: Converter.repeatMode(original.param['MODE'])
            };
            result.push({
                type: GeneralScript.CommandType.ChangeImage,
                content: content
            });
            if (original.param['SOURCE'].endsWith('.lcm') || original.param['SOURCE'].endsWith('.lmt')) {
                if (!Utilities.isAnimationSaved(project, path)) {
                    let animation = parseAnimation(Path.resolve(PROJECT_RESOURCE_ROOT, path));
                    project.extendedResource.animationFile[path] = animation;
                }
            }
        } else if (original.type == LiveScene.CommandType.DELIMG) {
            let content: GeneralScript.CommandContentDestroyImage = {
                target: original.param['NAME'].split(','),
                effect: original.param['FLIP']
            };
            result.push({
                type: GeneralScript.CommandType.DestroyImage,
                content: content
            });
        }
        i++;
    }
    return result;
}

function parseAnimation(source: string): GeneralScript.Animation[] {
    let pathPrefix = source.substring(0, source.lastIndexOf('\\'));
    let origin = File.readFileSync(source);
    let fileCount = origin.readInt32LE(0x26);
    let offset = 0x2f;
    let result: GeneralScript.Animation[] = [];
    for (let i = 0; i < fileCount; i++) {
        let animation: GeneralScript.Animation = {} as GeneralScript.Animation;
        animation.period = origin.readInt32LE(offset) / 60;
        offset += 8;
        animation.startTime = origin.readInt32LE(offset) / 60;
        offset += 8;
        animation.priority = origin.readInt32LE(offset);
        offset += 4;
        animation.horizontalReverse = origin.readInt8(offset) != 0;
        offset += 1;
        animation.verticalReverse = origin.readInt8(offset) != 0;
        offset += 2;
        let nameLength = origin.readInt32LE(offset);
        offset += 4;
        let nameBuffer = new Buffer(nameLength);
        for (let j = 0; j < nameLength; j++)
            nameBuffer[j] = origin[offset + j]
        animation.name = Iconv.decode(nameBuffer, 'shift-jis');
        offset += nameLength;
        animation.center = {
            x: origin.readInt32LE(offset),
            y: origin.readInt32LE(offset + 4)
        }
        offset += 8;
        animation.location = {
            start: {
                x: origin.readInt32LE(offset),
                y: origin.readInt32LE(offset + 4)
            },
            end: {
                x: origin.readInt32LE(offset + 8),
                y: origin.readInt32LE(offset + 12)
            },
            xEase: origin.readInt8(offset + 13),
            yEase: origin.readInt8(offset + 14)
        };
        offset += 18;
        animation.rotate = {
            start: origin.readDoubleLE(offset),
            end: origin.readDoubleLE(offset + 8),
            ease: GeneralScript.Ease.None
        };
        offset += 16;
        animation.zoom = {
            xStart: origin.readDoubleLE(offset),
            xEnd: origin.readDoubleLE(offset + 8),
            xEase: origin.readInt8(offset + 16),
            yStart: 0,
            yEnd: 0,
            yEase: GeneralScript.Ease.None
        };
        offset += 17;
        animation.alpha = {
            start: origin.readInt32LE(offset),
            end: origin.readInt32LE(offset + 4),
            ease: GeneralScript.Ease.None
        };
        offset += 8;
        animation.rotate.ease = origin.readInt8(offset);
        offset += 1;
        animation.clip = {
            from: {
                x: origin.readInt32LE(offset),
                y: origin.readInt32LE(offset + 4),
                width: origin.readInt32LE(offset + 8),
                height: origin.readInt32LE(offset + 12),
            },
            to: {
                x: origin.readInt32LE(offset + 16),
                y: origin.readInt32LE(offset + 20),
                width: origin.readInt32LE(offset + 24),
                height: origin.readInt32LE(offset + 28)
            },
            xEase: origin.readInt8(offset + 32),
            yEase: origin.readInt8(offset + 33),
        }
        offset += 34;
        animation.zoom.yStart = origin.readDoubleLE(offset);
        offset += 8;
        animation.zoom.yEnd = origin.readDoubleLE(offset);
        offset += 8;
        animation.zoom.yEase = origin.readInt8(offset);
        offset += 17;
        let urlLength = origin.readInt32LE(offset);
        offset += 4;
        let urlBuffer = new Buffer(urlLength);
        for (let j = 0; j < urlLength; j++)
            urlBuffer[j] = origin[offset + j]
        animation.source = Path.resolve(pathPrefix, Iconv.decode(urlBuffer, 'shift-jis'));
        offset += urlLength;
        offset += 5;
        result.push(animation);
    }
    return result;
}

function parseMenu(source: LiveProject.NodeMenu): GeneralScript.Menu {
    Analysis.file ++;
    console.log(`\t\t -> Menu ${source.Source}`);
    let path = `${PROJECT_RESOURCE_ROOT}\\${source.Source}`;
    let rawData: LiveMenu.Menu = Xml.parse(Iconv.decode(File.readFileSync(path), 'shift-jis'), Utilities.xmlParseOptions).PrevMenu;
    let pathPrefix = path.substring(0, path.lastIndexOf('\\'));
    let result: GeneralScript.Menu = {
        item: []
    };
    result.item = Utilities.arrayIfNeeded(rawData.Button.Item).map(item => {
        Analysis.menuOption ++;
        let result: GeneralScript.MenuItem = {
            position: { x: item.Left, y: item.Top },
            preview: {
                position: { x: item.PrevLeft, y: item.PrevTop },
                image: item.InPrevPath ? Path.resolve(pathPrefix, item.InPrevPath) : null
            },
            idleImage: item.Path ? Path.resolve(pathPrefix, item.Path): '',
            hoverImage: item.InImagePath ? Path.resolve(pathPrefix, item.InImagePath): '',
            name: item.Name
        };
        return result;
    });
    return result;
}

function parseCode(source: LiveProject.CalcItem): GeneralScript.Code {
    let result: GeneralScript.Code = {
        type: null,
        data: null,
        scopeIndent: source.$Indent
    };
    if (source.$Command == LiveProject.CommandType.Calc) {
        result.type = GeneralScript.CalculatorType.RawCode;
        let data: GeneralScript.CalculatorDataRawCode = {
            content: source['Calc']
        };
        result.data = data;
    } else if (source.$Command == LiveProject.CommandType.Break) {
        result.type = GeneralScript.CalculatorType.Break;
        let data: GeneralScript.CalcualtorDataConditionBase = {
            condition: source['Calc']
        };
        result.data = data;
    } else if (source.$Command == LiveProject.CommandType.Call) {
        result.type = GeneralScript.CalculatorType.Call;
        let data: GeneralScript.CalculatorDataCall = {
            target: source['Page'],
            param: (source['Params'] as string).split('&#2;'),
            resultStoredVariable: source['Result'],
            condition: source['Calc']
        };
        result.data = data;
    } else if (source.$Command == LiveProject.CommandType.Continue) {
        result.type = GeneralScript.CalculatorType.Continue;
        let data: GeneralScript.CalcualtorDataConditionBase = {
            condition: source['Calc']
        };
        result.data = data;
    } else if (source.$Command == LiveProject.CommandType.Else) {
        result.type = GeneralScript.CalculatorType.Else;
        result.data = {};
    } else if (source.$Command == LiveProject.CommandType.Elseif) {
        result.type = GeneralScript.CalculatorType.Elseif;
        let data: GeneralScript.CalcualtorDataConditionBase = {
            condition: source['Calc']
        };
        result.data = data;
    } else if (source.$Command == LiveProject.CommandType.If) {
        result.type = GeneralScript.CalculatorType.If;
        let data: GeneralScript.CalcualtorDataConditionBase = {
            condition: source['Calc']
        };
        result.data = data;
    } else if (source.$Command == LiveProject.CommandType.ImgNew) {
        result.type = GeneralScript.CalculatorType.CreateImage;
        let data: GeneralScript.CalculatorDataCreateImage = {
            name: source['Name'],
            source: source['PR_SOURCE'],
            left: source['PR_LEFT'],
            top: source['PR_TOP'],
            priority: source['PR_PRIORITY']
        };
        result.data = data;
    } else if (source.$Command == LiveProject.CommandType.ObjDel) {
        result.type = GeneralScript.CalculatorType.DeleteObject;
        let data: GeneralScript.CalculatorDataDeleteObject = {
            content: source['Name']
        };
        result.data = data;
    } else if (source.$Command == LiveProject.CommandType.Sound) {
        result.type = GeneralScript.CalculatorType.PlaySound;
        let data: GeneralScript.CalculatorDataSound = {
            name: source['Name'],
            source: source['Source'],
            repeat: Converter.boolean(source['AutoRepeat'])
        };
        result.data = data;
    } else if (source.$Command == LiveProject.CommandType.TextIns) {
        result.type = GeneralScript.CalculatorType.ShouldConvertManual;
        result.data = {
            target: source['Target'],
            content: source['Text'],
            record: Converter.boolean(source['Memory']),
            wait: Converter.boolean(source['Wait']),
            stopEvent: Converter.boolean(source['StopEvent'])
        };
    } else if (source.$Command == LiveProject.CommandType.VarDel) {
        result.type = GeneralScript.CalculatorType.ClearVariable;
        let data: GeneralScript.CalculatorDataClearVariable = {
            content: source['Name']
        };
        result.data = data;
    } else if (source.$Command == LiveProject.CommandType.VarNew) {
        result.type = GeneralScript.CalculatorType.CreateVariable;
        let data: GeneralScript.CalculatorDataCreateVariable= {
            content: Converter.calculatorVariable(source)
        };
        result.data = data;
    } else if (source.$Command == LiveProject.CommandType.MovieStop) {
        result.type = GeneralScript.CalculatorType.StopMedia;
        let data: GeneralScript.CalculatorDataStopMedia= {
            name: source['Target'],
            fadeTime: +source['Time'] / 1000
        };
        result.data = data;
    } else if (source.$Command == LiveProject.CommandType.Wait) {
        result.type = GeneralScript.CalculatorType.Pause;
        let data: GeneralScript.CalculatorDataPause= {
            time: +source['Time'] / 1000,
            condition: source['Calc']
        };
        result.data = data;
    } else if (source.$Command == LiveProject.CommandType.While) {
        result.type = GeneralScript.CalculatorType.While;
        let data: GeneralScript.CalculatorDataWhile= {
            init: source['Init'],
            condition: source['Calc'],
            loop: source['Loop']
        };
        result.data = data;
    }
    return result;
}

function groupCommand(source: LiveScene.Command[], pointer: number, initialStyle: GeneralScript.CommandContentText): { lastPointer: number, result: GeneralScript.CommandContentText[] } {
    let endPosition = pointer;
    let result: GeneralScript.CommandContentText[] = [];
    let i = pointer;
    if (source[i].type == LiveScene.CommandType.FONT) {
        endPosition = _.findIndex(source, e => e.type == LiveScene.CommandType.FONT_END, pointer);
        initialStyle.size = +source[i].param['SIZE'];
        initialStyle.color = source[i].param['COLOR'];
        initialStyle.borderWidth = +source[i].param['BORDER'];
        initialStyle.borderColor = source[i].param['BCOLOR'];
    }
    if (source[i].type == LiveScene.CommandType.B) {
        endPosition = _.findIndex(source, e => e.type == LiveScene.CommandType.B_END, pointer);
        initialStyle.bold = true;
    }
    if (source[i].type == LiveScene.CommandType.I) {
        endPosition = _.findIndex(source, e => e.type == LiveScene.CommandType.I_END, pointer);
        initialStyle.italic = true;
    }
    if (source[i].type == LiveScene.CommandType.U) {
        endPosition = _.findIndex(source, e => e.type == LiveScene.CommandType.U_END, pointer);
        initialStyle.underline = true;
    }
    if (source[i].type == LiveScene.CommandType.PLAINTEXT) {
        endPosition = i + 1;
        i--;
    }
    i++;
    while (i < endPosition) {
        if (source[i].type != LiveScene.CommandType.PLAINTEXT) {
            let parseResult = groupCommand(source, i, initialStyle);
            result = result.concat(parseResult.result);
            i = parseResult.lastPointer + 1;
            continue;
        }
        let text = _.cloneDeep(initialStyle);
        text.text = source[i].param[LiveScene.CommandType.PLAINTEXT]
        result.push(text);
        i++;
    }
    if (!source[i]) {
        // 不需要处理
    } else if (source[i].type == LiveScene.CommandType.FONT_END) {
        initialStyle.size = null;
        initialStyle.color = null;
        initialStyle.borderWidth = null;
        initialStyle.borderColor = null;
    } else if (source[i].type == LiveScene.CommandType.B_END) {
        initialStyle.bold = null;
    } else if (source[i].type == LiveScene.CommandType.I_END) {
        initialStyle.italic = null;
    } else if (source[i].type == LiveScene.CommandType.U_END) {
        initialStyle.underline = null;
    }
    return { lastPointer: i, result: result };
}
