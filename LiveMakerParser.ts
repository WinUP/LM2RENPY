import {
    Scene, Variable, VariableScope, VariableType, Block, BlockType, BlockCalculator, Code, CalculatorType,
    CalculatorCalcData, CalculatorBreakData, CalculatorCallData, CalculatorContinueData, CalculatorElseData,
    CalculatorElseifData, CalculatorIfData, CalculatorImageNewData, CalculatorObjDelData, CalculatorSoundData,
    CalculatorTextInsData, CalculatorVarDelData, CalculatorVarNewData, CalculatorWaitData, CalculatorWhileData,
    BlockChoice, Align, Choice, BlockInput, Input, BlockJump, BlockNavigator, BlockNormal, Command, CommandType,
    CommandContentText, EffectType, CommandContentEffect, CommandContentToggle, CommandContentWait, TextSpeed,
    CommandContentTextSpeed, CommandContentNameTarget, CommandContentTimeTarget, CommandContentMovie, RepeatMode,
    CommandContentQuake, QuakeType, Soundtrack, CommandContentSound, CommandContentStopSound, CommandContentChangeVolume,
    CommandContentImage, CommandContentChangeImage, CommandContentDestroyImage, Project, MessageboxFont, Messagebox,
    ConditionContent, Condition, BlockMenu, BlockMenuCondition, BlockMenuItem, Animation, Point, Rectangle,
    CommandContentImageAnimation, Ease, CommandContentChangeImageAnimation
} from './include/GeneralScript';
import {
    LiveMakerProject, LiveMakerProjectSceneVar, LiveMakerProjectVarItemScope, LiveMakerProjectVarItemType,
    BooleanInString, LiveMakerProjectNodeType, LiveMakerProjectNodeCalc, LiveMakerProjectCalcItem,
    LiveMakerProjectVarCommandType, LiveMakerProjectCalcVarItemScope, LiveMakerProjectNodeChoice,
    LiveMakerProjectNodeInput, LiveMakerProjectNodeJump, LiveMakerProjectNodeMenu, LiveMakerProjectNodeNavigate,
    LiveMakerProjectNodeScene
} from './include/LiveMakerProject';
import {
    LiveMakerSceneCommand, LiveMakerSceneCommandParam, LiveMakerSceneCommandType, LiveMakerSceneEffectType,
    LiveMakerPriority
} from './include/LiveMakerSceneCode';
import { LiveMakerMenu, LiveMakerMenuItem } from './include/LiveMakerMenu';

import * as _ from 'lodash';
import * as fs from 'fs';
import * as iconv from 'iconv-lite';
import * as xml from 'fast-xml-parser';
import * as fs_path from 'path';

export const PLAIN_TEXT_CODE_TYPE = LiveMakerSceneCommandType.PLAINTEXT;
export const PROJECT_RESOURCE_ROOT = 'C:\\Users\\lghol\\OneDrive\\Backup\\SCB Project\\runimage\\';

let totalNodeCount = 0;
let totalSceneCount = 0;
let totalFileCount = 0;
let totalJumpCount = 0;
let totalCommandCount = 0;
let totalMenuCount = 0;

export function parseProject(source: LiveMakerProject): Project {
    let sceneResult: Scene[] = [];
    let project: Project = {
        title: source.Title,
        width: +source.ScreenCX,
        height: +source.ScreenCY,
        background: source.BGColor,
        scene: [],
        variable: _.flatten([source.Var.Item]).map(v => Converter.lvarToVariable(v)),
        messagebox: [],
        cg: source.CGMode.List.Item
    };
    let messageboxResult: Messagebox[] = [];
    source.MessageBox.Item.forEach(liveMessagebox => {
        let messagebox: Messagebox = {
            name: liveMessagebox.Name,
            font: {
                antialias: Converter.booleanStringToBoolean(liveMessagebox.Font.Antialias),
                size: +liveMessagebox.Font.Size,
                lineMargin: +liveMessagebox.Font.Space,
                color: liveMessagebox.Font.Color,
                colorLink: liveMessagebox.Font.LinkColor,
                colorHover: liveMessagebox.Font.HoverColor,
                shadow: +liveMessagebox.Font.Shade,
                shadowColor: liveMessagebox.Font.ShadeColor,
                border: +liveMessagebox.Font.Border,
                borderColor: liveMessagebox.Font.BorderColor,
                fontFamily: liveMessagebox.Font.Name,
                fontChangeabled: Converter.booleanStringToBoolean(liveMessagebox.Font.FontChangeabled)
            },
            backgroundColor: liveMessagebox.BGColor,
            backgroundImage: liveMessagebox.BGFile,
            centerX: +liveMessagebox.PosX,
            centerY: +liveMessagebox.PosY,
            width: +liveMessagebox.Width,
            height: +liveMessagebox.Height,
            marginTop: +liveMessagebox.BGMarginT,
            marginBottom: +liveMessagebox.BGMarginB,
            marginRight: +liveMessagebox.BGMarginR,
            marginLeft: +liveMessagebox.BGMarginL,
            alpha: +liveMessagebox.BGAlpha,
            cursorImage: liveMessagebox.CsrClick,
            cursorX: +liveMessagebox.CsrPosX,
            cursorY: +liveMessagebox.CsrPosY,
            nextPageImage: liveMessagebox.SEClick
        };
        messageboxResult.push(messagebox);
    });
    project.messagebox = messageboxResult;
    source.Folder.Item.forEach(liveScene => {
        totalSceneCount++;
        let scene: Scene = {
            id: +liveScene.ID,
            name: liveScene.Caption,
            variable: (typeof liveScene.Var == 'string') ? [] : _.flatten([liveScene.Var.Item]).map(v => Converter.lvarToVariable(v)),
            bootstrap: null,
            block: []
        };
        console.log(`\n场景 ${fixNumber((+liveScene.ID).toString(16).toUpperCase(), 8)}（${liveScene.Caption}）`);
        liveScene.Node.Item.forEach(node => {
            totalNodeCount++;
            let block: Block<any> = {
                id: +node.ID,
                name: node.Caption,
                type: Converter.nodetypeToBlocktype(node.Type),
                next: [],
                data: null
            };
            console.log(`\t[节点] ${fixNumber((+node.ID).toString(16).toUpperCase(), 8)}（${node.Caption}）`);
            if (block.type == BlockType.Calculator) {
                let realNode: LiveMakerProjectNodeCalc = node as LiveMakerProjectNodeCalc;
                block.data = {
                    variable: typeof realNode.Var == 'string' ? [] : _.flatten([realNode.Var.Item]).map(v => Converter.lvarToVariable(v)),
                    code: typeof realNode.Calc == 'string' ? [] : _.flatten([realNode.Calc.Item]).map(v => Converter.lcalcToCaltulatorCode(v))
                } as BlockCalculator;
            } else if (block.type == BlockType.Menu) {
                let realNode: LiveMakerProjectNodeMenu = node as LiveMakerProjectNodeMenu;
                block.data = {
                    item: [],
                    fadeIn: +realNode.FadeinTime,
                    fadeOut: +realNode.FadeoutTime,
                    canCancel: Converter.booleanStringToBoolean(realNode.CancelEnabled),
                    hoverSound: realNode.SoundHover,
                    clickSound: realNode.SoundSelect,
                    timeLimitation: +realNode.TimeLimit,
                    condition: [],
                    visibleCondition: [],
                    enableCondition: []
                } as BlockMenu;
                let condition: BlockMenuCondition[] = [];
                (realNode.Cond.Item ? _.flatten([realNode.Cond.Item]) : []).forEach(cond => {
                    condition.push({
                        choice: cond.Name,
                        condition: Converter.stringToConditionContent(cond.Cond)
                    });
                });
                block.data.condition = condition;
                condition = [];
                (realNode.VisibleCond.Item ? _.flatten([realNode.VisibleCond.Item]) : []).forEach(cond => {
                    condition.push({
                        choice: cond.Name,
                        condition: Converter.stringToConditionContent(cond.Cond)
                    });
                });
                block.data.visibleCondition = condition;
                condition = [];
                (realNode.SelectedCond.Item ? _.flatten([realNode.SelectedCond.Item]) : []).forEach(cond => {
                    condition.push({
                        choice: cond.Name,
                        condition: Converter.stringToConditionContent(cond.Cond)
                    });
                });
                block.data.enableCondition = condition;
                let path = `${PROJECT_RESOURCE_ROOT}\\${realNode.Source}`;
                console.log(`\t\t -> 选单文件 ${realNode.Source}`);
                let rawData: LiveMakerMenu = xml.parse(iconv.decode(fs.readFileSync(path), 'shift-jis'), { arrayMode: false }).PrevMenu;
                block.data.item = parseMenu(_.flatten([rawData.Button.Item]), path);
            } else if (block.type == BlockType.Choice) {
                let realNode: LiveMakerProjectNodeChoice = node as LiveMakerProjectNodeChoice;
                block.data = {
                    choice: _.flatten([realNode.Menu.Item]).map(v => ({
                        title: v.Caption,
                        condition: v.Cond,
                        executable: Converter.booleanStringToBoolean(v.IsCalc)
                    }) as Choice),
                    cancelable: Converter.booleanStringToBoolean(realNode.CancelEnabled),
                    hoverSound: realNode.SoundHover,
                    selectSound: realNode.SoundSelect,
                    time: realNode.TimeLimit,
                    positionX: Converter.stringAlignToAlign(realNode.PosX),
                    positionY: Converter.stringAlignToAlign(realNode.PosY),
                    align: Converter.lalignToAlign(realNode.HAlign)
                } as BlockChoice;
            } else if (block.type == BlockType.Input) {
                let realNode: LiveMakerProjectNodeInput = node as LiveMakerProjectNodeInput;
                block.data = {
                    title: realNode.Prompt,
                    positionX: Converter.stringAlignToAlign(realNode.PosX),
                    positionY: Converter.stringAlignToAlign(realNode.PosY),
                    enableCancel: Converter.booleanStringToBoolean(realNode.CancelEnabled),
                    content: _.flatten([realNode.Text.Item]).map(v => ({
                        maxLength: +v.MaxLen,
                        minLength: +v.MinLen,
                        targetVariable: v.Param,
                        title: v.Caption
                    }) as Input)
                } as BlockInput;
            } else if (block.type == BlockType.Jump) {
                let realNode: LiveMakerProjectNodeJump = node as LiveMakerProjectNodeJump;
                block.data = {
                    target: +realNode.Target
                } as BlockJump;
            } else if (block.type == BlockType.Navigator) {
                let realNode: LiveMakerProjectNodeNavigate = node as LiveMakerProjectNodeNavigate;
                block.data = {
                    target: +realNode.Target,
                    targetPage: (realNode.TargetPage && realNode.TargetPage != '') ? realNode.TargetPage : null
                } as BlockNavigator;
            } else if (block.type == BlockType.Normal) {
                let realNode: LiveMakerProjectNodeScene = node as LiveMakerProjectNodeScene;
                block.data = {
                    trackHistory: !Converter.booleanStringToBoolean(realNode.NotStory),
                    skipLastEmptyLine: Converter.booleanStringToBoolean(realNode.NotCaret),
                    content: null
                } as BlockNormal;
                let path = `data/${fixNumber((+realNode.ID).toString(16).toUpperCase(), 8)}.lns`;
                console.log(`\t\t -> 内容文件 ${path}`);
                let content: string = '';
                if (fs.existsSync(path))
                    content = iconv.decode(fs.readFileSync(path), 'shift-jis');
                block.data.content = parseSceneCode(content);
            } else if (block.type == BlockType.Exit || block.type == BlockType.SceneEnd || block.type == BlockType.SceneStart) {
                block.data = null;
            }
            let jumpItem: Condition[] = [];
            (node.Jump.Item ? _.flatten([node.Jump.Item]) : []).forEach(jump => {
                totalJumpCount++;
                jumpItem.push({
                    targetId: +jump.ID,
                    condition: Converter.stringToConditionContent(jump.Cond)
                });
            });
            block.next = jumpItem;
            scene.block.push(block);
            if (block.type == BlockType.SceneStart)
                scene.bootstrap = block.id;
        });
        sceneResult.push(scene);
    });
    project.scene = sceneResult;
    console.log(`\n工程统计：共${totalSceneCount}个场景，${totalNodeCount}个节点，${totalFileCount}个文件，${totalJumpCount}次节点跳转, ${totalCommandCount}个场景指令`)
    return project;
}

export function parseSceneCode(content: string): Command[] {
    totalFileCount++;
    content = content.replace(/[\r\n]/g, '').replace(/<BR>/g, '\n');
    let result: LiveMakerSceneCommand[] = new Array<LiveMakerSceneCommand>();
    let i = 0;
    let currentCommand: LiveMakerSceneCommand = null;
    while (i < content.length) {
        let endIndex = content.indexOf('>', i + 1);
        let nextSpace = content.indexOf(' ', i + 1);
        if (content[i] == '<') { // 处理命令开始
            if (currentCommand) {
                throw '不允许在一个命令未结束时执行新的命令';
            }
            if (nextSpace == -1 || nextSpace > endIndex) { // 没有参数的命令
                currentCommand = {
                    type: <LiveMakerSceneCommandType> content.substring(i + 1, endIndex),
                    param: {}
                };
                result.push(currentCommand);
                currentCommand = null;
                i = endIndex + 1;
                continue;
            }
            // 一般命令
            currentCommand = {
                type: <LiveMakerSceneCommandType> content.substring(i + 1, nextSpace),
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
            type: <LiveMakerSceneCommandType> PLAIN_TEXT_CODE_TYPE,
            param: { PLAINTEXT: content.substring(i, nextStart) }
        };
        result.push(currentCommand);
        currentCommand = null;
        i = nextStart;
    }
    totalCommandCount += result.length;
    return convertSceneCode(result);
}

export function convertSceneCode(source: LiveMakerSceneCommand[]): Command[] {
    let result: Command[] = new Array<Command>();
    let i = 0;
    while (i < source.length) {
        let original = source[i];
        if (original.type == LiveMakerSceneCommandType.PLAINTEXT || original.type == LiveMakerSceneCommandType.B ||
            original.type == LiveMakerSceneCommandType.I || original.type == LiveMakerSceneCommandType.U ||
            original.type == LiveMakerSceneCommandType.FONT) {
            let initialStyle: CommandContentText = {
                text: null,
                size: null,
                bold: null,
                italic: null,
                underline: null,
                color: null,
                borderColor: null,
                borderWidth: null,
                shadowColor: null,
                shadowOffset: null
            };
            let textParseResult = Converter.textSceneCommandToTextCommand(source, i, initialStyle);
            result = result.concat(textParseResult.result.map<Command>(v => ({
                type: CommandType.Text,
                content: v
            })));
            i = textParseResult.lastPointer;
            if (source[i - 1].type == LiveMakerSceneCommandType.PLAINTEXT)
                i--;
        } else if (original.type == LiveMakerSceneCommandType.PS) {
            result.push({
                type: CommandType.WaitForClick,
                content: null
            });
        } else if (original.type == LiveMakerSceneCommandType.PG) {
            result.push({
                type: CommandType.WaitAndClear,
                content: null
            });
        } else if (original.type == LiveMakerSceneCommandType.FLIP) {
            let content: CommandContentEffect = {
                name: original.param['NAME'],
                type: Converter.flipTypeToEffectType(<LiveMakerSceneEffectType> original.param['EFFECT']),
                reverse: Converter.onOffToBoolean(original.param['REVERSE']),
                default: Converter.onOffToBoolean(original.param['DEFAULT']),
                source: original.param['SOURCE'],
                parameter: [ original.param['PARAM1'], original.param['PARAM2'] ]
            }
            result.push({
                type: CommandType.Effect,
                content: content
            });
        } else if (original.type == LiveMakerSceneCommandType.SYSMENUON) {
            let content: CommandContentToggle = {
                value: true
            };
            result.push({
                type: CommandType.MenuToggle,
                content: content
            });
        } else if (original.type == LiveMakerSceneCommandType.SYSMENUOFF) {
            let content: CommandContentToggle = {
                value: false
            };
            result.push({
                type: CommandType.MenuToggle,
                content: content
            });
        } else if (original.type == LiveMakerSceneCommandType.SAVELOADON) {
            let content: CommandContentToggle = {
                value: true
            };
            result.push({
                type: CommandType.SaveLoadToggle,
                content: content
            });
        } else if (original.type == LiveMakerSceneCommandType.SAVELOADOFF) {
            let content: CommandContentToggle = {
                value: false
            };
            result.push({
                type: CommandType.SaveLoadToggle,
                content: content
            });
        } else if (original.type == LiveMakerSceneCommandType.WAIT) {
            let content: CommandContentWait = {
                time: +original.param['TIME'],
                clickSkip: Converter.onOffToBoolean(original.param['CLICKABORT']),
                allowQuickSkip: Converter.onOffToBoolean(original.param['SKIPENABLED'])
            };
            result.push({
                type: CommandType.Wait,
                content: content
            });
        } else if (original.type == LiveMakerSceneCommandType.WAITFOR) {
            let content: CommandContentWait = {
                time: +original.param['TIME'],
                targetName: original.param['NAME'],
                clickSkip: Converter.onOffToBoolean(original.param['CLICKABORT']),
                allowQuickSkip: false
            };
            result.push({
                type: CommandType.WaitUntilFinish,
                content: content
            });
        } else if (original.type == LiveMakerSceneCommandType.TXSPF || original.type == LiveMakerSceneCommandType.TXSPN ||
                   original.type == LiveMakerSceneCommandType.TXSPS) {
            let speed = TextSpeed.Normal;
            if (original.type == LiveMakerSceneCommandType.TXSPF)
                speed = TextSpeed.Fatest;
            if (original.type == LiveMakerSceneCommandType.TXSPS)
                speed = TextSpeed.Slow;
            let content: CommandContentTextSpeed = {
                speed: speed
            };
            result.push({
                type: CommandType.ChangeTextSpeed,
                content: content
            });
        } else if (original.type == LiveMakerSceneCommandType.VAR) {
            let content: CommandContentNameTarget = {
                name: original.param['NAME']
            };
            result.push({
                type: CommandType.ShowVariableContent,
                content: content
            });
        } else if (original.type == LiveMakerSceneCommandType.MESBOX) {
            let content: CommandContentTimeTarget = {
                time: +original.param['TIME']
            };
            result.push({
                type: CommandType.MessageBox,
                content: content
            });
        } else if (original.type == LiveMakerSceneCommandType.CHGMESBOX) {
            let content: CommandContentNameTarget = {
                name: original.param['NAME']
            };
            result.push({
                type: CommandType.ChangeMessageBox,
                content: content
            });
        } else if (original.type == LiveMakerSceneCommandType.DELMESBOX) {
            let content: CommandContentTimeTarget = {
                time: +original.param['TIME']
            };
            result.push({
                type: CommandType.DestroyMessageBox,
                content: content
            });
        } else if (original.type == LiveMakerSceneCommandType.MOVIE) {
            let content: CommandContentMovie = {
                source: 'MOVIE\\' + original.param['SOURCE'],
                zoomPencentage: +original.param['ZOOM'],
                x: Converter.stringAlignToAlign(original.param['X']),
                y: Converter.stringAlignToAlign(original.param['Y']),
                mode: Converter.stringModeToRepeatMode(original.param['MODE'])
            };
            result.push({
                type: CommandType.Movie,
                content: content
            });
        } else if (original.type == LiveMakerSceneCommandType.QUAKE) {
            let content: CommandContentQuake = {
                target: original.param['NAME'].split(','),
                time: +original.param['TIME'],
                random: Converter.onOffToBoolean(original.param['RANDOM']),
                x: +original.param['X'],
                y: +original.param['Y'],
                repeatCount: +original.param['CYCLE'],
                type: Converter.typeToQuakeType(original.param['TYPE'])
            };
            result.push({
                type: CommandType.Quake,
                content: content
            });
        } else if (original.type == LiveMakerSceneCommandType.STOPQUAKE) {
            let content: CommandContentTimeTarget = {
                time: +original.param['TIME']
            };
            result.push({
                type: CommandType.StopQuake,
                content: content
            });
        } else if (original.type == LiveMakerSceneCommandType.SOUND) {
            let content: CommandContentSound = {
                source: 'サウンド\\' + original.param['SOURCE'],
                track: Converter.stringToTrack(original.param['TRACK']),
                mode: Converter.stringModeToRepeatMode(original.param['MODE']),
                volume: +original.param['VOLUME']
            };
            result.push({
                type: CommandType.Sound,
                content: content
            });
        } else if (original.type == LiveMakerSceneCommandType.STOPSND) {
            let content: CommandContentStopSound = {
                time: +original.param['TIME'],
                track: Converter.stringToTrack(original.param['TRACK'])
            };
            result.push({
                type: CommandType.StopSound,
                content: content
            });
        } else if (original.type == LiveMakerSceneCommandType.CHGVOL) {
            let content: CommandContentChangeVolume = {
                time: +original.param['TIME'],
                track: Converter.stringToTrack(original.param['TRACK']),
                volume: +original.param['VOLUME'],
                waitUntilFinish: Converter.onOffToBoolean(original.param['WAIT'])
            };
            result.push({
                type: CommandType.ChangeVolume,
                content: content
            });
        } else if (original.type == LiveMakerSceneCommandType.IMAGE) {
            if (original.param['SOURCE'].endsWith('.gal')) {
                let content: CommandContentImage = {
                    name: original.param['NAME'],
                    source: 'グラフィック\\' + original.param['SOURCE'],
                    x: Converter.stringAlignToAlign(original.param['X']),
                    y: Converter.stringAlignToAlign(original.param['Y']),
                    priority: LiveMakerPriority[original.param['PRIORITY']],
                    useFlip: original.param['FLIP'],
                    mode: Converter.stringModeToRepeatMode(original.param['MODE'])
                };
                result.push({
                    type: CommandType.Image,
                    content: content
                });
            } else if (original.param['SOURCE'].endsWith('.lcm') || original.param['SOURCE'].endsWith('.lmt')) {
                let path = fs_path.resolve(PROJECT_RESOURCE_ROOT, 'グラフィック', original.param['SOURCE']);
                console.log(`\t\t -> 动画文件 ${path}`);
                let animation = parseAnimation(path);
                let content: CommandContentImageAnimation = {
                    name: original.param['NAME'],
                    source: 'グラフィック\\' + original.param['SOURCE'],
                    x: Converter.stringAlignToAlign(original.param['X']),
                    y: Converter.stringAlignToAlign(original.param['Y']),
                    priority: LiveMakerPriority[original.param['PRIORITY']],
                    useFlip: original.param['FLIP'],
                    mode: Converter.stringModeToRepeatMode(original.param['MODE']),
                    animation: animation
                };
                result.push({
                    type: CommandType.Image,
                    content: content
                });
            } else {
                throw '找不到文件格式处理器：' + original.param['SOURCE']
            }
        } else if (original.type == LiveMakerSceneCommandType.CHGIMG) {
            if (original.param['SOURCE'].endsWith('.gal')) {
                let content: CommandContentChangeImage = {
                    name: original.param['NAME'],
                    source: 'グラフィック\\' + original.param['SOURCE'],
                    useFlip: original.param['FLIP'],
                    mode: Converter.stringModeToRepeatMode(original.param['MODE'])
                };
                result.push({
                    type: CommandType.ChangeImage,
                    content: content
                });
            } else if (original.param['SOURCE'].endsWith('.lcm') || original.param['SOURCE'].endsWith('.lmt')) {
                let path = fs_path.resolve(PROJECT_RESOURCE_ROOT, 'グラフィック', original.param['SOURCE']);
                console.log(`\t\t -> 动画文件 ${path}`);
                let animation = parseAnimation(path);
                let content: CommandContentChangeImageAnimation = {
                    name: original.param['NAME'],
                    source: 'グラフィック\\' + original.param['SOURCE'],
                    useFlip: original.param['FLIP'],
                    mode: Converter.stringModeToRepeatMode(original.param['MODE']),
                    animation: animation
                };
                result.push({
                    type: CommandType.ChangeImage,
                    content: content
                });
            } else {
                throw '找不到文件格式处理器：' + original.param['SOURCE']
            }
        } else if (original.type == LiveMakerSceneCommandType.DELIMG) {
            let content: CommandContentDestroyImage = {
                target: original.param['NAME'].split(','),
                useFlip: original.param['FLIP']
            };
            result.push({
                type: CommandType.DestroyImage,
                content: content
            });
        }
        i++;
    }
    return result;
}

export function parseAnimation(source: string): Animation[] {
    let pathPrefix = source.substring(0, source.lastIndexOf('\\'));
    let origin = fs.readFileSync(source);
    let fileCount = origin.readInt32LE(0x26);
    let offset = 0x2f;
    let result: Animation[] = new Array<Animation>();
    for (let i = 0; i < fileCount; i++) {
        let animation: Animation = {} as Animation;
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
        animation.name = iconv.decode(nameBuffer, 'shift-jis');
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
            ease: Ease.None
        };
        offset += 16;
        animation.zoom = {
            xStart: origin.readDoubleLE(offset),
            xEnd: origin.readDoubleLE(offset + 8),
            xEase: origin.readInt8(offset + 16),
            yStart: 0,
            yEnd: 0,
            yEase: Ease.None
        };
        offset += 17;
        animation.alpha = {
            start: origin.readInt32LE(offset),
            end: origin.readInt32LE(offset + 4),
            ease: Ease.None
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
        animation.source = iconv.decode(urlBuffer, 'shift-jis');
        offset += urlLength;
        offset += 5;
        result.push(animation);
    }
    return result;
}

export function parseMenu(source: LiveMakerMenuItem[], path: string): BlockMenuItem[] {
    totalMenuCount++;
    let pathPrefix = path.substring(0, path.lastIndexOf('\\'));
    return source.map(item => ({
        left: item.Left,
        top: item.Top,
        previewLeft: item.PrevLeft,
        previewTop: item.PrevTop,
        imagePath: item.Path ? fs_path.resolve(pathPrefix, item.Path): '',
        hoverPath: item.InImagePath ? fs_path.resolve(pathPrefix, item.InImagePath): '',
        previewPath: item.InPrevPath ? fs_path.resolve(pathPrefix, item.InPrevPath) : null,
        name: item.Name
    }));
}

const Converter = {
    booleanStringToBoolean: function (source: BooleanInString): boolean {
        return source == BooleanInString.True;
    },
    onOffToBoolean: function (source: string): boolean {
        return source == 'ON';
    },
    lvarToVariable: function (source: LiveMakerProjectSceneVar): Variable<any> {
        let result: Variable<any> = {
            name: source.Name,
            value: null,
            scope: null,
            type: null
        };
        switch (source.VarScope) {
            case LiveMakerProjectVarItemScope.Normal:
                result.scope = VariableScope.Normal
                break;
            case LiveMakerProjectVarItemScope.Static:
                result.scope = VariableScope.Static
                break;
            default:
                result.scope = VariableScope.Normal
                break;
        }
        switch (source.VarType) {
            case LiveMakerProjectVarItemType.Boolean:
                result.type = VariableType.Boolean
                result.value = Converter.booleanStringToBoolean(source.InitValue as BooleanInString);
                break;
            case LiveMakerProjectVarItemType.Float:
                result.type = VariableType.Float
                result.value = +source.InitValue;
                break;
            case LiveMakerProjectVarItemType.Number:
                result.type = VariableType.Integer
                result.value = +source.InitValue;
                break;
            case LiveMakerProjectVarItemType.String:
                result.type = VariableType.String
                result.value = source.InitValue;
                break;
            default:
                result.type = VariableType.Integer
                result.value = source.InitValue;
                break;
        }
        return result;
    },
    sceneVarToVariable: function (source: LiveMakerProjectCalcItem): Variable<any> {
        let result: Variable<any> = {
            name: source.Name,
            value: null,
            scope: null,
            type: null
        };
        switch (source.Scope) {
            case LiveMakerProjectCalcVarItemScope.Normal:
                result.scope = VariableScope.Normal
                break;
            case LiveMakerProjectCalcVarItemScope.Static:
                result.scope = VariableScope.Static
                break;
            case LiveMakerProjectCalcVarItemScope.AutoRemove:
                result.scope = VariableScope.AutoRemove
                break;
            case LiveMakerProjectCalcVarItemScope.Local:
                result.scope = VariableScope.Local
                break;
            default:
                result.scope = VariableScope.Normal
                break;
        }
        switch (source.Type) {
            case LiveMakerProjectVarItemType.Boolean:
                result.type = VariableType.Boolean
                result.value = Converter.booleanStringToBoolean(source.InitVal as BooleanInString);
                break;
            case LiveMakerProjectVarItemType.Float:
                result.type = VariableType.Float
                result.value = +source.InitVal;
                break;
            case LiveMakerProjectVarItemType.Number:
                result.type = VariableType.Integer
                result.value = +source.InitVal;
                break;
            case LiveMakerProjectVarItemType.String:
                result.type = VariableType.String
                result.value = source.InitVal;
                break;
            default:
                result.type = VariableType.Integer
                result.value = source.InitVal;
                break;
        }
        return result;
    },
    nodetypeToBlocktype: function (source: LiveMakerProjectNodeType): BlockType {
        switch (source) {
            case LiveMakerProjectNodeType.Calc:
                return BlockType.Calculator;
            case LiveMakerProjectNodeType.Choice:
                return BlockType.Choice;
            case LiveMakerProjectNodeType.Exit:
                return BlockType.Exit;
            case LiveMakerProjectNodeType.Input:
                return BlockType.Input;
            case LiveMakerProjectNodeType.Jump:
                return BlockType.Jump;
            case LiveMakerProjectNodeType.Menu:
                return BlockType.Menu;
            case LiveMakerProjectNodeType.Navigate:
                return BlockType.Navigator;
            case LiveMakerProjectNodeType.Scene:
                return BlockType.Normal;
            case LiveMakerProjectNodeType.SceneEnd:
                return BlockType.SceneEnd;
            case LiveMakerProjectNodeType.SceneStart:
                return BlockType.SceneStart;
        }
    },
    lcalcToCaltulatorCode: function (source: LiveMakerProjectCalcItem): Code {
        let result: Code = {
            type: null,
            data: null,
            scopeIndent: +source.$.Indent
        };
        if (source.$.Command == LiveMakerProjectVarCommandType.Calc) {
            result.type = CalculatorType.Calc;
            result.data = {
                line: source['Calc']
            } as CalculatorCalcData;
        }
        if (source.$.Command == LiveMakerProjectVarCommandType.Break) {
            result.type = CalculatorType.Break;
            result.data = {
                condition: source['Calc']
            } as CalculatorBreakData;
        }
        if (source.$.Command == LiveMakerProjectVarCommandType.Call) {
            result.type = CalculatorType.Call;
            result.data = {
                page: source['Page'],
                result: source['Result'],
                condition: source['Calc'],
                param: (source['Params'] as string).split('\u0002')
            } as CalculatorCallData;
        }
        if (source.$.Command == LiveMakerProjectVarCommandType.Continue) {
            result.type = CalculatorType.Continue;
            result.data = {
                condition: source['Calc']
            } as CalculatorContinueData;
        }
        if (source.$.Command == LiveMakerProjectVarCommandType.Else) {
            result.type = CalculatorType.Else;
            result.data = { } as CalculatorElseData;
        }
        if (source.$.Command == LiveMakerProjectVarCommandType.Elseif) {
            result.type = CalculatorType.Elseif;
            result.data = {
                condition: source['Calc']
            } as CalculatorElseifData;
        }
        if (source.$.Command == LiveMakerProjectVarCommandType.If) {
            result.type = CalculatorType.If;
            result.data = {
                condition: source['Calc']
            } as CalculatorIfData;
        }
        if (source.$.Command == LiveMakerProjectVarCommandType.ImgNew) {
            result.type = CalculatorType.ImageNew;
            result.data = {
                name: source['Name'],
                source: source['PR_SOURCE'],
                left: source['PR_LEFT'],
                top: source['PR_TOP'],
                priority: +source['PR_PRIORITY']
            } as CalculatorImageNewData;
        }
        if (source.$.Command == LiveMakerProjectVarCommandType.ObjDel) {
            result.type = CalculatorType.ObjDel;
            result.data = {
                name: source['Name']
            } as CalculatorObjDelData;
        }
        if (source.$.Command == LiveMakerProjectVarCommandType.Sound) {
            result.type = CalculatorType.Sound;
            result.data = {
                name: source['Name'],
                source: source['Source'],
                repeat: Converter.booleanStringToBoolean(source['AutoRepeat'])
            } as CalculatorSoundData;
        }
        if (source.$.Command == LiveMakerProjectVarCommandType.TextIns) {
            result.type = CalculatorType.TextIns;
            result.data = {
                target: source['Target'],
                content: source['Text'],
                record: Converter.booleanStringToBoolean(source['Memory']),
                wait: Converter.booleanStringToBoolean(source['Wait']),
                stopEvent: Converter.booleanStringToBoolean(source['StopEvent'])
            } as CalculatorTextInsData;
        }
        if (source.$.Command == LiveMakerProjectVarCommandType.VarDel) {
            result.type = CalculatorType.VarDel;
            result.data = {
                name: source['Name']
            } as CalculatorVarDelData;
        }
        if (source.$.Command == LiveMakerProjectVarCommandType.VarNew) {
            result.type = CalculatorType.VarNew;
            result.data = Converter.sceneVarToVariable(source) as CalculatorVarNewData
        }
        if (source.$.Command == LiveMakerProjectVarCommandType.Wait) {
            result.type = CalculatorType.VarNew;
            result.data = {
                condition: source['Calc'],
                time: +source['Time'],
                stopEvent: Converter.booleanStringToBoolean(source['StopEvent'])
            } as CalculatorWaitData;
        }
        if (source.$.Command == LiveMakerProjectVarCommandType.While) {
            result.type = CalculatorType.VarNew;
            result.data = {
                init: source['Init'],
                condition: source['Calc'],
                loop: console['Loop']
            } as CalculatorWhileData;
        }
        return result;
    },
    lalignToAlign: function (source: '0' | '1' | '2'): Align {
        if (source == '0') return Align.Left;
        if (source == '1') return Align.Center;
        return Align.Right;
    },
    trimQuotes: function (source: string): string {
        if (source.length > 0 && source[0] == '"' && source[source.length - 1] == '"')
            return source.substring(1, source.length - 1);
        else
            return source;
    },
    textSceneCommandToTextCommand: function (source: LiveMakerSceneCommand[], pointer: number, initialStyle: CommandContentText): { lastPointer: number, result: CommandContentText[] } {
        let endPosition = pointer;
        let result: CommandContentText[] = new Array<CommandContentText>();
        let i = pointer;
        if (source[i].type == LiveMakerSceneCommandType.FONT) {
            endPosition = _.findIndex(source, e => e.type == LiveMakerSceneCommandType.FONT_END, pointer);
            initialStyle.size = +source[i].param['SIZE'];
            initialStyle.color = source[i].param['COLOR'];
            initialStyle.borderWidth = +source[i].param['BORDER'];
            initialStyle.borderColor = source[i].param['BCOLOR'];
            initialStyle.shadowOffset = +source[i].param['SHADOW'];
            initialStyle.shadowColor = source[i].param['SCOLOR'];
        }
        if (source[i].type == LiveMakerSceneCommandType.B) {
            endPosition = _.findIndex(source, e => e.type == LiveMakerSceneCommandType.B_END, pointer);
            initialStyle.bold = true;
        }
        if (source[i].type == LiveMakerSceneCommandType.I) {
            endPosition = _.findIndex(source, e => e.type == LiveMakerSceneCommandType.I_END, pointer);
            initialStyle.italic = true;
        }
        if (source[i].type == LiveMakerSceneCommandType.U) {
            endPosition = _.findIndex(source, e => e.type == LiveMakerSceneCommandType.U_END, pointer);
            initialStyle.underline = true;
        }
        if (source[i].type == LiveMakerSceneCommandType.PLAINTEXT) {
            endPosition = i + 1;
            i--;
        }
        i++;
        while (i < endPosition) {
            if (source[i].type != LiveMakerSceneCommandType.PLAINTEXT) {
                let parseResult = Converter.textSceneCommandToTextCommand(source, i, initialStyle);
                result = result.concat(parseResult.result);
                i = parseResult.lastPointer + 1;
                continue;
            }
            let text = _.cloneDeep(initialStyle);
            text.text = source[i].param[LiveMakerSceneCommandType.PLAINTEXT]
            result.push(text);
            i++;
        }
        if (!source[i]) {
            // 不需要处理
        } else if (source[i].type == LiveMakerSceneCommandType.FONT_END) {
            initialStyle.size = null;
            initialStyle.color = null;
            initialStyle.borderWidth = null;
            initialStyle.borderColor = null;
            initialStyle.shadowOffset = null;
            initialStyle.shadowColor = null;
        } else if (source[i].type == LiveMakerSceneCommandType.B_END) {
            initialStyle.bold = null;
        } else if (source[i].type == LiveMakerSceneCommandType.I_END) {
            initialStyle.italic = null;
        } else if (source[i].type == LiveMakerSceneCommandType.U_END) {
            initialStyle.underline = null;
        }
        return {
            lastPointer: i,
            result: result
        };
    },
    flipTypeToEffectType: function (source: LiveMakerSceneEffectType): EffectType {
        switch (source) {
            case LiveMakerSceneEffectType.BIG:
                return EffectType.ZoomBig;
            case LiveMakerSceneEffectType.BLACK:
                return EffectType.Black;
            case LiveMakerSceneEffectType.BLINDH:
                return EffectType.BlindHorizontal;
            case LiveMakerSceneEffectType.BLINDV:
                return EffectType.BlindVertical;
            case LiveMakerSceneEffectType.BLOCKCOIL:
                return EffectType.BlockCoil;
            case LiveMakerSceneEffectType.BLOCKRANDOM:
                return EffectType.BlockRandom;
            case LiveMakerSceneEffectType.BLURB:
                return EffectType.BlurBlack;
            case LiveMakerSceneEffectType.BLURW:
                return EffectType.BlurWhite;
            case LiveMakerSceneEffectType.CIRCLE:
                return EffectType.Circle;
            case LiveMakerSceneEffectType.CLOCKHAND:
                return EffectType.Clockhand;
            case LiveMakerSceneEffectType.CRACK:
                return EffectType.Crack;
            case LiveMakerSceneEffectType.CURTAINH:
                return EffectType.CurtainHorizontal;
            case LiveMakerSceneEffectType.CURTAINV:
                return EffectType.CurtainVertical;
            case LiveMakerSceneEffectType.DITHER:
                return EffectType.Dither;
            case LiveMakerSceneEffectType.FADE:
                return EffectType.Fade;
            case LiveMakerSceneEffectType.FAN:
                return EffectType.FanCenter;
            case LiveMakerSceneEffectType.FLASH:
                return EffectType.Flash;
            case LiveMakerSceneEffectType.GRID:
                return EffectType.Grid;
            case LiveMakerSceneEffectType.GRIDH:
                return EffectType.GridHorizontal;
            case LiveMakerSceneEffectType.GRIDV:
                return EffectType.GridVertical;
            case LiveMakerSceneEffectType.MASK:
                return EffectType.Mask;
            case LiveMakerSceneEffectType.MASKB:
                return EffectType.MaskBlack;
            case LiveMakerSceneEffectType.MASKW:
                return EffectType.MaskWhite;
            case LiveMakerSceneEffectType.MOSAIC:
                return EffectType.Mosaic;
            case LiveMakerSceneEffectType.NONE:
                return EffectType.None;
            case LiveMakerSceneEffectType.RIPPLE:
                return EffectType.Ripple;
            case LiveMakerSceneEffectType.RUBBERH:
                return EffectType.RubberHorizontal;
            case LiveMakerSceneEffectType.RUBBERV:
                return EffectType.RubberVertical;
            case LiveMakerSceneEffectType.SCRATCHH:
                return EffectType.ScratchHorizontal;
            case LiveMakerSceneEffectType.SCRATCHV:
                return EffectType.ScratchVertical;
            case LiveMakerSceneEffectType.SCROLLH:
                return EffectType.ScrollHorizontal;
            case LiveMakerSceneEffectType.SCROLLV:
                return EffectType.ScrollVertical;
            case LiveMakerSceneEffectType.SMALL:
                return EffectType.ZoomSmall;
            case LiveMakerSceneEffectType.SPOT:
                return EffectType.Spot;
            case LiveMakerSceneEffectType.TWISTH:
                return EffectType.TwistHorizontal;
            case LiveMakerSceneEffectType.TWISTV:
                return EffectType.TwistVertical;
            case LiveMakerSceneEffectType.WFAN:
                return EffectType.FanBorder;
            case LiveMakerSceneEffectType.WHITE:
                return EffectType.White;
            case LiveMakerSceneEffectType.ZOOMIN:
                return EffectType.ZoomIn;
            default:
                throw '找不到任何匹配的效果类型：' + source;
        }
    },
    stringAlignToAlign: function (source: string): Align | number {
        switch (source) {
            case 'L':
                return Align.Left;
            case 'C':
                return Align.Center;
            case 'R':
                return Align.Right;
            case 'T':
                return Align.Top;
            case 'B':
                return Align.Bottom;
            default:
                return +source;
        }
    },
    stringModeToRepeatMode: function (source: string): RepeatMode {
        switch (source) {
            case 'N':
                return RepeatMode.Normal;
            case 'R':
                return RepeatMode.Repeat;
            case 'W':
                return RepeatMode.WaitUntilFinish;
            case 'F':
                return RepeatMode.DestroyAfterFinish;
            default:
                throw '找不到对应的循环模式：' + source;
        }
    },
    typeToQuakeType: function (source: string): QuakeType {
        switch (source) {
            case 'Q':
                return QuakeType.Random;
            case 'W':
                return QuakeType.Wave;
            case 'B':
                return QuakeType.Jump;
            default:
                throw '找不到对应的摇动类型：' + source;
        }
    },
    stringToTrack: function (source: string): Soundtrack {
        switch (source) {
            case 'B':
                return Soundtrack.BGM;
            case 'B2':
                return Soundtrack.BGM2;
            case 'V':
                return Soundtrack.Voice;
            case 'V2':
                return Soundtrack.Voice2;
            case 'S':
                return Soundtrack.Effect;
            case 'S2':
                return Soundtrack.Effect2;
            default:
                throw '找不到对应的音轨：' + source;
        }
    },
    stringToConditionContent: function (source: string): ConditionContent[] {
        let rawData = source.replace(/\t/g, '').split('\n').map(v => [+v[0], v.substring(1)]);
        let maxScope = rawData.map(v => +v[0]).reduce((r, v) => v > r ? v : r, 0);
        rawData.forEach(v => v[0] = maxScope - (+v[0]));
        return rawData.map(v => ({ content: v[1] + '', scopeIndent: +v[0] ? +v[0] : 0 }));
    }
};

function fixNumber(num,length){
    let numstr = num.toString();
    let l = numstr.length;
    if (numstr.length>=length) return numstr;
    for(let i = 0 ; i < length - l ; i++)
        numstr = "0" + numstr;  
    return numstr; 
}