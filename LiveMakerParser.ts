import {
    Scene, Variable, VariableScope, VariableType, Block, BlockType, BlockCalculator, Code, CalculatorType,
    CalculatorCalcData, CalculatorBreakData, CalculatorCallData, CalculatorContinueData, CalculatorElseData,
    CalculatorElseifData, CalculatorIfData, CalculatorImageNewData, CalculatorObjDelData, CalculatorSoundData,
    CalculatorTextInsData, CalculatorVarDelData, CalculatorVarNewData, CalculatorWaitData, CalculatorWhileData,
    BlockChoice, Align, Choice, BlockInput, Input, BlockJump, BlockNavigator, BlockNormal
} from './include/GeneralScript';
import {
    LiveMakerProject, LiveMakerProjectSceneVar, LiveMakerProjectVarItemScope, LiveMakerProjectVarItemType,
    BooleanInString, LiveMakerProjectNodeType, LiveMakerProjectNodeCalc, LiveMakerProjectCalcItem,
    LiveMakerProjectVarCommandType, LiveMakerProjectCalcVarItemScope, LiveMakerProjectNodeChoice,
    LiveMakerProjectNodeInput, LiveMakerProjectNodeJump, LiveMakerProjectNodeMenu, LiveMakerProjectNodeNavigate,
    LiveMakerProjectNodeScene
} from './include/LiveMakerProject';
import {
    LiveMakerSceneCommand, LiveMakerSceneCommandParam, LiveMakerSceneCommandType
} from './include/LiveMakerSceneCode';
import * as _ from 'lodash';
import * as fs from 'fs';
import * as iconv from 'iconv-lite';

export const PLATIN_TEXT_CODE_TYPE = 'PLAINTEXT';

let availableCommandList: string[] = new Array<string>();

export function parseProject(source: LiveMakerProject): Scene[] {
    let result: Scene[] = [];
    source.Folder.Item.forEach(liveScene => {
        let scene: Scene = {
            id: +liveScene.ID,
            name: liveScene.Caption,
            variable: (typeof liveScene.Var == 'string') ? [] : _.flatten([liveScene.Var.Item]).map(v => Converter.lvarToVariable(v)),
            bootstrap: null,
            block: []
        };
        liveScene.Node.Item.forEach(node => {
            let block: Block<any> = {
                id: +node.ID,
                name: node.Caption,
                type: Converter.nodetypeToBlocktype(node.Type),
                next: null,
                data: null
            };
            if (block.type == BlockType.Calculator) {
                let realNode: LiveMakerProjectNodeCalc = node as LiveMakerProjectNodeCalc;
                block.data = {
                    variable: typeof realNode.Var == 'string' ? [] : _.flatten([realNode.Var.Item]).map(v => Converter.lvarToVariable(v)),
                    code: typeof realNode.Calc == 'string' ? [] : _.flatten([realNode.Calc.Item]).map(v => Converter.lcalcToCaltulatorCode(v))
                } as BlockCalculator;
            }
            if (block.type == BlockType.Choice) {
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
                    positionX: realNode.PosX,
                    positionY: realNode.PoxY,
                    align: Converter.lalignToAlign(realNode.HAlign)
                } as BlockChoice;
            }
            if (block.type == BlockType.Input) {
                let realNode: LiveMakerProjectNodeInput = node as LiveMakerProjectNodeInput;
                block.data = {
                    title: realNode.Prompt,
                    positionX: realNode.PosX,
                    positionY: realNode.PosY,
                    enableCancel: Converter.booleanStringToBoolean(realNode.CancelEnabled),
                    content: _.flatten([realNode.Text.Item]).map(v => ({
                        maxLength: +v.MaxLen,
                        minLength: +v.MinLen,
                        targetVariable: v.Param,
                        title: v.Caption
                    }) as Input)
                } as BlockInput;
            }
            if (block.type == BlockType.Jump) {
                let realNode: LiveMakerProjectNodeJump = node as LiveMakerProjectNodeJump;
                block.data = {
                    target: +realNode.Target
                } as BlockJump;
            }
            if (block.type == BlockType.Navigator) {
                let realNode: LiveMakerProjectNodeNavigate = node as LiveMakerProjectNodeNavigate;
                block.data = {
                    target: +realNode.Target,
                    targetPage: (realNode.TargetPage && realNode.TargetPage != '') ? realNode.TargetPage : null
                } as BlockNavigator;
            }
            if (block.type == BlockType.Normal) {
                let realNode: LiveMakerProjectNodeScene = node as LiveMakerProjectNodeScene;
                block.data = {
                    trackHistory: !Converter.booleanStringToBoolean(realNode.NotStory),
                    skipLastEmptyLine: Converter.booleanStringToBoolean(realNode.NotCaret),
                    content: null
                } as BlockNormal;
                let path = `data/${fixNumber((+realNode.ID).toString(16).toUpperCase(), 8)}.lns`;
                let content: string = '';
                if (fs.existsSync(path))
                    content = iconv.decode(fs.readFileSync(path), 'shift-jis');
                block.data.content = parseSceneCode(content);
            }
            if (block.type == BlockType.Exit || block.type == BlockType.SceneEnd || block.type == BlockType.SceneStart) {
                block.data = { };
            }
            scene.block.push(block);
            if (block.type == BlockType.SceneStart)
                scene.bootstrap = block.id;
        });
        result.push(scene);
    });

    return result;
}

export function parseSceneCode(content: string): LiveMakerSceneCommand[] {
    content = content.replace(/[\r\n]/g, '');
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
            type: <LiveMakerSceneCommandType> PLATIN_TEXT_CODE_TYPE,
            param: { PLATIN_TEXT_CODE_TYPE: content.substring(i, nextStart) }
        };
        result.push(currentCommand);
        currentCommand = null;
        i = nextStart;
    }

    return result;
}

const Converter = {
    booleanStringToBoolean: function (source: BooleanInString): boolean {
        return source == BooleanInString.True;
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
            data: null
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