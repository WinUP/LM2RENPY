export interface Project {
    title: string;
    screenSize: Vector;
    backgroundColor: number;
    scene: Scene[];
    variable: Variable[];
    dialogueBox: DialogueBox[];
    gallery: string[];
    extendedResource: {
        menuFile: { [path: string]: Menu },
        animationFile: { [path: string]: Animation[] }
    };
}

export interface DialogueBox {
    name: string;
    font: Font;
    backgroundColor?: number;
    backgroundImage?: string;
    area: Rectangle;
    alpha: number;
    margin: {
        top: number,
        left: number,
        right: number,
        bottom: number
    };
    cursor: {
        image: string,
        position: Point,
        clickToContinueImage: string
    }
}

export interface Font {
    size: number;
    color: number;
    borderSize: number;
    borderColor: number;
    fontFamily: string;
}

export interface Scene {
    id: number;
    name: string;
    entrance: number;
    variable: Variable[];
    block: Block[];
}

export interface Variable {
    name: string;
    type: VariableType;
    value: number | boolean | string;
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
    Static
}

export interface Block {
    id: number;
    type: BlockType;
    name: string;
    next: TargetWithCondition[];
    data: BlockDataBase;
}

export enum BlockType {
    SceneStart,
    SceneEnd,
    Normal,
    Calculator,
    Choice,
    Menu,
    Input,
    Call,
    Jump,
    Exit
}

export interface TargetWithCondition {
    target: number;
    condition: Condition[];
}

export interface Condition {
    content: string;
    scopeIndent: number;
}

export interface BlockDataBase { }

export interface BlockDataWithName extends BlockDataBase {
    name: string;
}

export interface BlockDataMenu extends BlockDataWithName {
    fadeIn: number;
    fadeOut: number;
    canCancel: boolean;
    hoverSound: string;
    clickSound: string;
    timeLimitation: number;
    condition: MenuCondition[];
}

export interface Menu {
    item: MenuItem[];
}

export interface MenuItem {
    name: string;
    position: Point;
    preview?: {
        position: Point,
        image: string
    };
    idleImage: string;
    hoverImage: string;
}

export interface MenuCondition {
    choice: string;
    condition: Condition[];
}

export interface BlockDataInput extends BlockDataBase {
    title: string;
    content: Input[];
}

export interface Input {
    maxLength: number;
    minLength: number;
    title: string;
    storedVariableName: string;
}

export interface BlockDataJump extends BlockDataBase {
    target: number;
}

export interface BlockDataNavigator extends BlockDataJump {
    page?: SystemPage;
}

export enum SystemPage {
    Load,
    Save,
    Gallery,
    Event,
    Soundtrack,
    MainMenu,
    GameMenu
}

export interface BlockDataCalculator extends BlockDataBase {
    variable: Variable[];
    code: Code[];
}

export interface Code {
    type: CalculatorType;
    data: CalculatorDataBase;
    scopeIndent: number;
}

export enum CalculatorType {
    RawCode,
    CreateVariable,
    ClearVariable,
    If,
    Elseif,
    Else,
    While,
    Break,
    Continue,
    Call,
    Pause,
    DeleteObject,
    CreateImage,
    PlaySound,
    StopMedia,
    ShouldConvertManual
}

export interface CalculatorDataBase { }

export interface CalculatorDataContentBase<T> extends CalculatorDataBase {
    content: T;
}

export interface CalcualtorDataConditionBase extends CalculatorDataBase {
    condition: string;
}

export interface CalculatorDataRawCode extends CalculatorDataContentBase<string> { }

export interface CalculatorDataCreateVariable extends CalculatorDataContentBase<Variable> { }

export interface CalculatorDataClearVariable extends CalculatorDataContentBase<string> { }

export interface CalculatorDataWhile extends CalcualtorDataConditionBase {
    init: string;
    loop: string;
}

export interface CalculatorDataCall extends CalcualtorDataConditionBase {
    target: string;
    param: string[];
    resultStoredVariable: string;
}

export interface CalculatorDataPause extends CalcualtorDataConditionBase {
    time: number;
}

export interface CalculatorDataDeleteObject extends CalculatorDataContentBase<string> { }

export interface CalculatorDataCreateImage extends CalculatorDataBase {
    name: string;
    source: string;
    priority: number | string; // 可能存在表达式
    left: number | string; // 可能存在表达式
    top: number | string; // 可能存在表达式
}

export interface CalculatorDataSound extends CalculatorDataBase {
    name: string;
    source: string;
    repeat: boolean;
}

export interface CalculatorDataStopMedia extends CalculatorDataBase {
    name: string;
    fadeTime: number | string; // 可能存在表达式
}

export interface CalculatorDataShouldConvertManual extends CalculatorDataContentBase<any> { }

export interface BlockDataChoice {
    choice: Choice[];
    hoverSound: string;
    selectSound: string;
    time: number | string; // 可能存在表达式
    align: Align;
}

export interface Choice {
    title: string;
    condition: string;
}

export enum Align {
    Left = -2,
    Center = -1,
    Right = -3,
    Top = -4,
    Bottom = -5
}

export interface BlockDataNormal extends BlockDataBase {
    content: Command[];
}

export interface Command {
    type: CommandType;
    content: CommandContentBase;
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

export interface CommandContentBase { }

export interface CommandContentText extends CommandContentBase {
    text: string;
    size?: number;
    color?: string;
    borderWidth?: number;
    borderColor?: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
}

export interface CommandContentEffect extends CommandContentNameTarget {
    type: EffectType;
    time: number;
    reverse: boolean;
    default: boolean;
    parameter: any[];
}

export interface CommandContentToggle extends CommandContentBase {
    value: boolean;
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
    effect: string;
    mode: RepeatMode;
}

export interface CommandContentDestroyImage extends CommandContentBase {
    target: string[],
    effect: string;
}

export interface Animation {
    name: string;
    source: string;
    startTime: number;
    period: number;
    priority: number;
    horizontalReverse: boolean;
    verticalReverse: boolean;
    center: Point;
    location?: {
        start: Point,
        end: Point,
        xEase: Ease,
        yEase: Ease
    },
    rotate?: {
        start: number,
        end: number,
        ease: Ease
    },
    zoom?: {
        xStart: number,
        xEnd: number,
        yStart: number,
        yEnd: number,
        xEase: Ease,
        yEase: Ease
    },
    alpha?: {
        start: number,
        end: number,
        ease: Ease
    },
    clip?: {
        from: Rectangle,
        to: Rectangle,
        xEase: Ease,
        yEase: Ease
    }
}

export enum Ease {
    None,
    In,
    Out
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

export interface Point {
    x: number;
    y: number;
}

export interface Vector {
    width: number;
    height: number;
}

export interface Rectangle extends Point, Vector { }
