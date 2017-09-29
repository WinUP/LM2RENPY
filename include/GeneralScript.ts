import { LiveMakerSceneCommand } from './LiveMakerSceneCode';

export interface Project {
    title: string;
    width: number;
    height: number;
    scene: Scene[];
    background: string;
    variable: Variable<any>[];
    messagebox: Messagebox[];
    cg: string[];
}

export interface Messagebox {
    name: string;
    font: MessageboxFont;
    backgroundColor: string;
    backgroundImage: string;
    centerX: number;
    centerY: number;
    width: number;
    height: number;
    marginTop: number;
    marginBottom: number;
    marginRight: number;
    marginLeft: number;
    alpha: number;
    cursorImage: string;
    cursorX: number;
    cursorY: number;
    nextPageImage: string;
}

export interface MessageboxFont {
    antialias: boolean;
    size: number;
    lineMargin: number;
    color: string;
    colorLink: string;
    colorHover: string;
    shadow: number;
    shadowColor: string;
    border: number;
    borderColor: string;
    fontFamily: string;
    fontChangeabled: boolean;
}

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
    targetId: number;
    condition: ConditionContent[];
}

export interface ConditionContent {
    content: string;
    scopeIndent: number;
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

export interface BlockNormal {
    trackHistory: boolean;
    skipLastEmptyLine: boolean;
    content: Command[];
}

export interface BlockInput {
    title: string;
    positionX: Align | number;
    positionY: Align | number;
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
    positionX: Align | number;
    positionY: Align | number;
    align: Align;
    enableCut: boolean;
}

export interface Code {
    type: CalculatorType;
    data: CalculatorData;
    scopeIndent: number;
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
    Left = -2,
    Center = -1,
    Right = -3,
    Top = -4,
    Bottom = -5
}

export interface Input {
    maxLength: number;
    minLength: number;
    title: string;
    targetVariable: string;
}

export interface Command {
    type: CommandType;
    content: CommandContentBase;
}

export interface CommandContentBase { }

export interface CommandContentText extends CommandContentBase {
    text: string;
    size?: number;
    color?: string;
    borderWidth?: number;
    borderColor?: string;
    shadowOffset?: number;
    shadowColor?: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
}

export interface CommandContentEffect extends CommandContentNameTarget {
    type: EffectType;
    reverse: boolean;
    source?: string;
    default: boolean;
    parameter: string[];
}

export interface CommandContentToggle extends CommandContentBase {
    value: boolean;
}

export interface CommandContentWait extends CommandContentBase {
    time: number;
    targetName?: string;
    clickSkip: boolean;
    allowQuickSkip: boolean;
}

export interface CommandContentTextSpeed extends CommandContentBase {
    speed: TextSpeed;
}

export interface CommandContentNameTarget extends CommandContentBase {
    name: string;
}

export interface CommandContentTimeTarget extends CommandContentBase {
    time: number;
}

export interface CommandContentMovie extends CommandContentBase {
    source: string;
    zoomPencentage: number;
    x: Align | number;
    y: Align | number;
    mode: RepeatMode;
}

export interface CommandContentQuake extends CommandContentBase {
    target: string[];
    type: QuakeType;
    random: boolean;
    x: number;
    y: number;
    time: number;
    repeatCount: number;
}

export interface CommandContentSound extends CommandContentBase {
    source: string;
    track: Soundtrack;
    mode: RepeatMode;
    volume: number;
}

export interface CommandContentStopSound extends CommandContentTimeTarget {
    track: Soundtrack;
}

export interface CommandContentChangeVolume extends CommandContentTimeTarget {
    track: Soundtrack;
    volume: number;
    waitUntilFinish: boolean;
}

export interface CommandContentImage extends CommandContentChangeImage {
    x: Align | number;
    y: Align | number;
    priority: number;
}

export interface CommandContentChangeImage extends CommandContentNameTarget {
    source: string;
    useFlip: string;
    mode: RepeatMode;
}

export interface CommandContentDestroyImage extends CommandContentBase {
    target: string[],
    useFlip: string;
}

export enum QuakeType {
    Random,
    Wave,
    Jump
}

export enum RepeatMode {
    Normal,
    Repeat,
    WaitUntilFinish,
    DestroyAfterFinish
}

export enum Soundtrack {
    BGM,
    BGM2,
    Voice,
    Voice2,
    Effect,
    Effect2
}

export enum CommandType {
    Text,
    Effect,
    MenuToggle,
    SaveLoadToggle,
    Image,
    ChangeImage,
    DestroyImage,
    Sound,
    ChangeVolume,
    StopSound,
    MessageBox,
    ChangeMessageBox,
    DestroyMessageBox,
    Movie,
    Quake,
    StopQuake,
    ShowVariableContent,
    Wait,
    WaitForClick,
    WaitUntilFinish,
    WaitAndClear,
    ChangeTextSpeed
}

export enum TextSpeed {
    Normal = -1,
    Fatest = -2,
    Slow = -3
}

export enum EffectType {
    None,
    Fade,
    BlindHorizontal,
    BlindVertical,
    CurtainHorizontal,
    CurtainVertical,
    ScrollHorizontal,
    ScrollVertical,
    Grid,
    GridHorizontal,
    GridVertical,
    Dither,
    White,
    Black,
    Flash,
    Mosaic,
    ScratchHorizontal,
    ScratchVertical,
    Spot,
    Mask,
    MaskWhite,
    MaskBlack,
    ZoomSmall,
    ZoomBig,
    ZoomIn,
    Ripple,
    BlurWhite,
    BlurBlack,
    TwistHorizontal,
    TwistVertical,
    Crack,
    Clockhand,
    RubberHorizontal,
    RubberVertical,
    FanCenter,
    FanBorder,
    Circle,
    BlockCoil,
    BlockRandom
}
