import { LiveMakerSceneCommand } from './LiveMakerSceneCode';

export interface Scene {
    id: number;
    name: string;
    bootstrap: number;
    variable: Variable<any>[];
    block: Block<any>[];
}

export interface Block<T> {
    id: number;
    type: BlockType;
    name: string;
    next: Condition[];
    data: T;
}

export interface Condition {
    target: Block<any>;
    content: string;
}

export enum BlockType {
    SceneStart,
    SceneEnd,
    Normal,
    Calculator,
    Choice,
    Menu,
    Input,
    Navigator,
    Jump,
    Exit
}

export interface BlockSceneStart { }

export interface BlockSceneEnd { }

export interface BlockNormal {
    trackHistory: boolean;
    skipLastEmptyLine: boolean;
    content: LiveMakerSceneCommand[];
}

export interface BlockInput {
    title: string;
    positionX: string;
    positionY: string;
    enableCancel: boolean;
    content: Input[];
}

export interface BlockJump {
    target: number;
}

export interface BlockNavigator {
    target: number;
    targetPage: string;
}

export interface BlockCalculator {
    variable: Variable<any>[];
    code: Code[];
}

export interface BlockChoice {
    choice: Choice[];
    cancelable: boolean;
    hoverSound: string;
    selectSound: string;
    time: string;
    positionX: string;
    positionY: string;
    align: Align;
    enableCut: boolean;
}

export interface Code {
    type: CalculatorType;
    data: CalculatorData;
}

export interface Variable<T> {
    name: string;
    type: VariableType;
    value: T;
    scope: VariableScope;
}

export enum VariableType {
    Integer,
    Float,
    Boolean,
    String
}

export enum VariableScope {
    Normal,
    Static,
    AutoRemove,
    Local
}

export enum CalculatorType {
    Calc,
    VarNew,
    VarDel,
    If,
    Elseif,
    Else,
    While,
    Break,
    Continue,
    Call,
    Wait,
    ObjDel,
    ImageNew,
    Sound,
    TextIns
}

export interface CalculatorData { }

export interface CalculatorCalcData extends CalculatorData {
    line: string;
}

export interface CalculatorVarNewData extends CalculatorData {
    name: string;
    value: any;
    scope: VariableScope;
    type: VariableType;
}

export interface CalculatorVarDelData extends CalculatorData {
    name: string;
}

export interface CalculatorIfData extends CalculatorData {
    condition: string;
}

export interface CalculatorElseifData extends CalculatorData {
    condition: string;
}

export interface CalculatorElseData extends CalculatorData { }

export interface CalculatorWhileData extends CalculatorData {
    init: string;
    condition: string;
    loop: string;
}

export interface CalculatorBreakData extends CalculatorData {
    condition: string;
}

export interface CalculatorContinueData extends CalculatorData {
    condition: string;
}

export interface CalculatorCallData extends CalculatorData {
    page: string;
    result: string;
    param: string[];
    condition: string;
}

export interface CalculatorWaitData extends CalculatorData {
    condition: string;
    time: number;
    stopEvent: boolean;
}

export interface CalculatorObjDelData extends CalculatorData {
    name: string;
}

export interface CalculatorImageNewData extends CalculatorData {
    name: string;
    source: string;
    left: number;
    top: number;
    priority: number;
}

export interface CalculatorSoundData extends CalculatorData {
    name: string;
    source: string;
    repeat: boolean;
}

export interface CalculatorTextInsData extends CalculatorData {
    target: string;
    content: string;
    record: boolean;
    wait: boolean;
    stopEvent: boolean;
}

export interface Choice {
    title: string;
    condition: string;
    executable: boolean;
}

export enum Align {
    Left,
    Center,
    Right
}

export interface Input {
    maxLength: number;
    minLength: number;
    title: string;
    targetVariable: string;
}
