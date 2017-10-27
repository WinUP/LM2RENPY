import * as GeneralScript from './include/GeneralScript';
import * as LiveProject from './include/LiveMakerProject';
import * as LiteScript from './include/LiteScript';
import * as LiveScene from './include/LiveMakerSceneCode';
import * as Utilities from './Utilities';
import * as LiveMenu from './include/LiveMakerMenu';

export function sceneVariable(source: LiveProject.Variable): GeneralScript.Variable {
    let result: GeneralScript.Variable = {
        name: source.Name,
        value: null,
        scope: null,
        type: null
    };
    switch (source.VarScope) {
        case LiveProject.VariableScope.Normal:
            result.scope = GeneralScript.VariableScope.Normal
            break;
        case LiveProject.VariableScope.Static:
            result.scope = GeneralScript.VariableScope.Static
            break;
        default:
            result.scope = GeneralScript.VariableScope.Normal
            break;
    }
    switch (source.VarType) {
        case LiveProject.VariableType.Boolean:
            result.type = GeneralScript.VariableType.Boolean;
            result.value = boolean(source.InitValue);
            break;
        case LiveProject.VariableType.Float:
            result.type = GeneralScript.VariableType.Float;
            result.value = +source.InitValue;
            break;
        case LiveProject.VariableType.Number:
            result.type = GeneralScript.VariableType.Integer;
            result.value = +source.InitValue;
            break;
        case LiveProject.VariableType.String:
            result.type = GeneralScript.VariableType.String;
            result.value = source.InitValue;
            break;
        default:
            result.type = GeneralScript.VariableType.Integer;
            result.value = source.InitValue;
            break;
    }
    return result;
}

export function calculatorVariable(source: LiveProject.CalcItem): GeneralScript.Variable {
    let result: GeneralScript.Variable = {
        name: source['Name'],
        value: null,
        scope: null,
        type: null
    };
    switch (source['Scope']) {
        case LiveProject.CalculatorVariableScope.Normal:
            result.scope = GeneralScript.VariableScope.Normal
            break;
        case LiveProject.CalculatorVariableScope.Static:
            result.scope = GeneralScript.VariableScope.Static
            break;
        default:
            result.scope = GeneralScript.VariableScope.Normal
            break;
    }
    switch (source['Type']) {
        case LiveProject.VariableType.Boolean:
            result.type = GeneralScript.VariableType.Boolean;
            result.value = boolean(source['InitVal']);
            break;
        case LiveProject.VariableType.Float:
            result.type = GeneralScript.VariableType.Float;
            result.value = +source['InitVal'];
            break;
        case LiveProject.VariableType.Number:
            result.type = GeneralScript.VariableType.Integer;
            result.value = +source['InitVal'];
            break;
        case LiveProject.VariableType.String:
            result.type = GeneralScript.VariableType.String;
            result.value = source['InitVal'];
            break;
        default:
            result.type = GeneralScript.VariableType.Integer;
            result.value = source['InitVal'];
            break;
    }
    return result;
}

export function boolean(source: string | number | boolean): boolean {
    if (typeof source == 'boolean')
        return source;
    else if (typeof source == 'number')
        return source > 0;
    else if (typeof source == 'string')
        return source == 'TRUE' || source == 'true' || source == 'True' || source == '1' || source == 'ON' || source == 'on' || source == 'On';
    else
        throw '布尔转换仅适用于字符串、数字和布尔值，不能适用于：' + source;
}

export function blockType(nodeType: LiveProject.NodeType): GeneralScript.BlockType {
    switch (nodeType) {
        case LiveProject.NodeType.Calc:
            return GeneralScript.BlockType.Calculator;
        case LiveProject.NodeType.Choice:
            return GeneralScript.BlockType.Choice;
        case LiveProject.NodeType.Exit:
            return GeneralScript.BlockType.Exit;
        case LiveProject.NodeType.Input:
            return GeneralScript.BlockType.Input;
        case LiveProject.NodeType.Jump:
            return GeneralScript.BlockType.Jump;
        case LiveProject.NodeType.Menu:
            return GeneralScript.BlockType.Menu;
        case LiveProject.NodeType.Navigate:
            return GeneralScript.BlockType.Call;
        case LiveProject.NodeType.Normal:
            return GeneralScript.BlockType.Normal;
        case LiveProject.NodeType.SceneEnd:
            return GeneralScript.BlockType.SceneEnd;
        case LiveProject.NodeType.SceneStart:
            return GeneralScript.BlockType.SceneStart;
        default:
            throw '找不到与之对应的节点类型：' + nodeType;
    }
}

export function condition(source: string): GeneralScript.Condition[] {
    let rawData = source.split('&#13;&#10;').map(v => ({
        children: +(v.substring(0, v.indexOf(' '))),
        code: v.substring(v.indexOf(' ') + 1)
    }));
    let result: GeneralScript.Condition[] = [];
    let remainedChildren: number[] = [];
    for (let i = 0; i < rawData.length; i++) {
        while (remainedChildren.length >= 0 && remainedChildren[remainedChildren.length - 1] == 0)
            remainedChildren.pop();
        if (remainedChildren.length > 0 && remainedChildren[remainedChildren.length - 1] > 0)
            remainedChildren[remainedChildren.length - 1] --;
        result.push({ content: rawData[i].code, scopeIndent: remainedChildren.length });
        if (rawData[i].children > 0)
            remainedChildren.push(rawData[i].children);
    }
    return result;
}

export function align(source: number | string): GeneralScript.Align | number {
    if (typeof source == 'number') {
        if (source == 0) return GeneralScript.Align.Left;
        else if (source == 1) return GeneralScript.Align.Center;
        else return +source;
    } else if (typeof source == 'string') {
        if (source == 'L') return GeneralScript.Align.Left;
        else if (source == 'C') return GeneralScript.Align.Center;
        else if (source == 'R') return GeneralScript.Align.Right;
        else if (source == 'T') return GeneralScript.Align.Top;
        else if (source == 'B') return GeneralScript.Align.Bottom;
        else return +source;
    } else {
        throw '停靠模式转换仅适用于数字和字符串，不能适用于：' + source;
    }
}

export function effectType (source: LiveScene.EffectType): GeneralScript.EffectType {
    switch (source) {
        case LiveScene.EffectType.BIG:
            return GeneralScript.EffectType.ZoomBig;
        case LiveScene.EffectType.BLACK:
            return GeneralScript.EffectType.Black;
        case LiveScene.EffectType.BLINDH:
            return GeneralScript.EffectType.BlindHorizontal;
        case LiveScene.EffectType.BLINDV:
            return GeneralScript.EffectType.BlindVertical;
        case LiveScene.EffectType.BLOCKCOIL:
            return GeneralScript.EffectType.BlockCoil;
        case LiveScene.EffectType.BLOCKRANDOM:
            return GeneralScript.EffectType.BlockRandom;
        case LiveScene.EffectType.BLURB:
            return GeneralScript.EffectType.BlurBlack;
        case LiveScene.EffectType.BLURW:
            return GeneralScript.EffectType.BlurWhite;
        case LiveScene.EffectType.CIRCLE:
            return GeneralScript.EffectType.Circle;
        case LiveScene.EffectType.CLOCKHAND:
            return GeneralScript.EffectType.Clockhand;
        case LiveScene.EffectType.CRACK:
            return GeneralScript.EffectType.Crack;
        case LiveScene.EffectType.CURTAINH:
            return GeneralScript.EffectType.CurtainHorizontal;
        case LiveScene.EffectType.CURTAINV:
            return GeneralScript.EffectType.CurtainVertical;
        case LiveScene.EffectType.DITHER:
            return GeneralScript.EffectType.Dither;
        case LiveScene.EffectType.FADE:
            return GeneralScript.EffectType.Fade;
        case LiveScene.EffectType.FAN:
            return GeneralScript.EffectType.FanCenter;
        case LiveScene.EffectType.FLASH:
            return GeneralScript.EffectType.Flash;
        case LiveScene.EffectType.GRID:
            return GeneralScript.EffectType.Grid;
        case LiveScene.EffectType.GRIDH:
            return GeneralScript.EffectType.GridHorizontal;
        case LiveScene.EffectType.GRIDV:
            return GeneralScript.EffectType.GridVertical;
        case LiveScene.EffectType.MASK:
            return GeneralScript.EffectType.Mask;
        case LiveScene.EffectType.MASKB:
            return GeneralScript.EffectType.MaskBlack;
        case LiveScene.EffectType.MASKW:
            return GeneralScript.EffectType.MaskWhite;
        case LiveScene.EffectType.MOSAIC:
            return GeneralScript.EffectType.Mosaic;
        case LiveScene.EffectType.NONE:
            return GeneralScript.EffectType.None;
        case LiveScene.EffectType.RIPPLE:
            return GeneralScript.EffectType.Ripple;
        case LiveScene.EffectType.RUBBERH:
            return GeneralScript.EffectType.RubberHorizontal;
        case LiveScene.EffectType.RUBBERV:
            return GeneralScript.EffectType.RubberVertical;
        case LiveScene.EffectType.SCRATCHH:
            return GeneralScript.EffectType.ScratchHorizontal;
        case LiveScene.EffectType.SCRATCHV:
            return GeneralScript.EffectType.ScratchVertical;
        case LiveScene.EffectType.SCROLLH:
            return GeneralScript.EffectType.ScrollHorizontal;
        case LiveScene.EffectType.SCROLLV:
            return GeneralScript.EffectType.ScrollVertical;
        case LiveScene.EffectType.SMALL:
            return GeneralScript.EffectType.ZoomSmall;
        case LiveScene.EffectType.SPOT:
            return GeneralScript.EffectType.Spot;
        case LiveScene.EffectType.TWISTH:
            return GeneralScript.EffectType.TwistHorizontal;
        case LiveScene.EffectType.TWISTV:
            return GeneralScript.EffectType.TwistVertical;
        case LiveScene.EffectType.WFAN:
            return GeneralScript.EffectType.FanBorder;
        case LiveScene.EffectType.WHITE:
            return GeneralScript.EffectType.White;
        case LiveScene.EffectType.ZOOMIN:
            return GeneralScript.EffectType.ZoomIn;
        default:
            throw '找不到任何匹配的效果类型：' + source;
    }
}

export function quakeType(source: string): GeneralScript.QuakeType {
    switch (source) {
        case 'Q':
            return GeneralScript.QuakeType.Random;
        case 'W':
            return GeneralScript.QuakeType.Wave;
        case 'B':
            return GeneralScript.QuakeType.Jump;
        default:
            throw '找不到对应的摇动类型：' + source;
    }
}

export function repeatMode(source: string): GeneralScript.RepeatMode {
    switch (source) {
        case 'N':
            return GeneralScript.RepeatMode.Normal;
        case 'R':
            return GeneralScript.RepeatMode.Repeat;
        case 'W':
            return GeneralScript.RepeatMode.WaitUntilFinish;
        case 'F':
            return GeneralScript.RepeatMode.DestroyAfterFinish;
        default:
            throw '找不到对应的循环模式：' + source;
    }
}

export function soundtrack(source: string): GeneralScript.Soundtrack {
    switch (source) {
        case 'B':
            return GeneralScript.Soundtrack.BGM;
        case 'B2':
            return GeneralScript.Soundtrack.BGM2;
        case 'V':
            return GeneralScript.Soundtrack.Voice;
        case 'V2':
            return GeneralScript.Soundtrack.Voice2;
        case 'S':
            return GeneralScript.Soundtrack.Effect;
        case 'S2':
            return GeneralScript.Soundtrack.Effect2;
        default:
            throw '找不到对应的音轨：' + source;
    }
}

export function liteBlockType(source: GeneralScript.BlockType): LiteScript.BlockType {
    switch (source) {
        case GeneralScript.BlockType.Calculator:
            return LiteScript.BlockType.Calculator;
        case GeneralScript.BlockType.Call:
            return LiteScript.BlockType.Call;
        case GeneralScript.BlockType.Choice:
            return LiteScript.BlockType.Choice;
        case GeneralScript.BlockType.Exit:
            return null;
        case GeneralScript.BlockType.Input:
            return LiteScript.BlockType.Input;
        case GeneralScript.BlockType.Jump:
            return LiteScript.BlockType.Jump;
        case GeneralScript.BlockType.Menu:
            return LiteScript.BlockType.Menu;
        case GeneralScript.BlockType.Normal:
            return LiteScript.BlockType.Normal;
        case GeneralScript.BlockType.SceneEnd:
            return LiteScript.BlockType.SceneEnd;
        case GeneralScript.BlockType.SceneStart:
            return LiteScript.BlockType.SceneStart;
        default:
            throw `Cannot convert GeneralScript BlockType ${source} to LiteScript BlockType: No suitable target`;
    }
}
