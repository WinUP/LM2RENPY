export interface Project {
    Version: number;
    FolderTree: FolderTree;
    Folder: PropertyWithItem<Scene>;
    NewItemId: string;
    Priority: PropertyWithItem<PriorityItem>;
    Title: string;
    ScreenCX: number;
    ScreenCY: number;
    BGColor: number;
    MessageBox: PropertyWithItem<MessageBoxItem>;
    Var: PropertyWithItem<Variable>;
    CGMode: Gallery;
}

export interface PropertyWithItem<T> {
    Item: T | T[];
}

export interface Gallery {
    List: PropertyWithItem<string>;
    X: number;
    Y: number;
    Width: number;
    Height: number;
    Column: number;
    Row: number;
    BG: string;
    Menu: string;
    NumberCG: FileWithPosition;
    PercentCG: FileWithPosition;
}

export interface FolderTree extends PropertyWithItem<FolderTreeItem> {
    Opened: number;
}

export interface FolderTreeItem {
    ID: number;
    Name: String;
    Opened: 1 | 0;
}

export interface Scene {
    ID: number;
    Caption: string;
    Node: PropertyWithItem<NodeBase>;
    Var: '' | PropertyWithItem<Variable>;
}

export interface NodeBase {
    ID: number;
    Type: NodeType;
    Caption: string;
    Jump: '' | PropertyWithItem<JumpCondition>;
}

export enum NodeType {
    Normal = 0,
    SceneStart = 2,
    SceneEnd = 3,
    Navigate = 4,
    Jump = 5,
    Calc = 6,
    Exit = 9,
    Choice = 11,
    Menu = 12,
    Input = 13
}

export interface NodeSceneStart extends NodeBase { }

export interface NodeNormal extends NodeBase {
    NotStory: 1 | 0;
    NotCaret: 1 | 0;
}

export interface NodeCalc extends NodeBase {
    Calc: '' | PropertyWithItem<CalcItem>;
    Var: '' | PropertyWithItem<Variable>;
}

export interface NodeMenu extends NodeBase {
    Source: string;
    BGImage: string;
    FadeinTime: number;
    FadeoutTime: number;
    CancelEnabled: 1 | 0;
    SoundHover: string;
    SoundSelect: string;
    TimeLimit: number;
    Cond: '' | PropertyWithItem<MenuCondition>;
    VisibleCond: '' | PropertyWithItem<MenuCondition>;
    SelectedCond: '' | PropertyWithItem<MenuCondition>;
}

export interface NodeChoice extends NodeBase {
    Menu: PropertyWithItem<ChoiceMenuItem>;
    CancelEnabled: 1 | 0;
    SoundHover: string;
    SoundSelect: string;
    TimeLimit: number | string;
    PosX: Align | number;
    PosY: Align | number;
    HAlign: TextAlign;
    CutEnabled: 0 | 1;
}

export interface NodeInput extends NodeBase {
    Prompt: string;
    CancelEnabled: 1 | 0;
    PosX: Align | number;
    PosY: Align | number;
    Text: PropertyWithItem<InputTextItem>;
}

export interface NodeNavigate extends NodeBase {
    Target: number;
    TargetPage: string;
    Param: '' | PropertyWithItem<string>;
}

export interface NodeExit extends NodeBase { }

export interface NodeSceneEnd extends NodeBase { }

export interface NodeJump extends NodeBase {
    Target: number;
    TargetPage: string;
}

export interface JumpCondition {
    ID: number;
    Cond: string;
}

export interface MenuCondition {
    Name: string;
    Cond: string;
}

export interface ChoiceMenuItem {
    Caption: string;
    Cond: string;
    IsCalc: 1 | 0;
}

export interface InputTextItem {
    Caption: string;
    MinLen: number;
    MaxLen: number;
    Param: string;
}

export interface CalcItem {
    $Command: CommandType;
    $Indent: number;
    $Mute: 1 | 0;
    $NotUpdate: 1 | 0;
    $Color: number;
    [key: string]: any;
}

export interface PriorityItem {
    Name: string;
    Value: number;
}

export interface MessageBoxItem {
    Name: string;
    Font: MessageBoxFont;
    BGColor: number;
    BGFile: string;
    PosX: number;
    PosY: number;
    Width: number;
    Height: number;
    BGMarginL: number;
    BGMarginT: number;
    BGMarginR: number;
    BGMarginB: number;
    BGAlpha: number;
    CsrClick: string;
    CsrPosX: number;
    CsrPosY: number;
    SEClick: string;
}

export interface MessageBoxFont {
    Antialias: 1 | 0;
    Size: number;
    Space: number;
    Color: number;
    LinkColor: number;
    HoverColor: number;
    Shade: 1 | 0;
    ShadeColor: number;
    Border: number;
    BorderColor: number;
    Name: string;
    FontChangeabled: 1 | 0;
}

export interface Variable {
    Name: string;
    VarType: VariableType;
    InitValue: string;
    VarScope: VariableScope;
}

export enum VariableType {
    Number = 1,
    Float = 2,
    Boolean = 3,
    String = 4
}

export enum VariableScope {
    Normal = 0,
    Other = 1,
    Static = 2
}

export enum CalculatorVariableScope {
    Normal = 0,
    AutoRemove = 1,
    Local = 2,
    Static = 3
}

export enum CommandType {
    Calc = "Calc",
    VarNew = "VarNew",
    VarDel = "VarDel",
    If = "If",
    Elseif = "Elseif",
    Else = "Else",
    While = "While",
    Break = "Break",
    Continue = "Continue",
    Call = "Call",
    Wait = "Wait",
    ObjDel = "ObjDel",
    ImgNew = "ImgNew",
    Sound = "Sound",
    MovieStop = "MovieStop",
    TextIns = "TextIns",
    Comment = "Comment"
}

export enum Align {
    Left = 'L',
    Right = 'R',
    Center = 'C',
    Top = 'T',
    Bottom = 'B'
}

export enum TextAlign {
    Left = 0,
    Center = 1,
    Right = 2
}

export interface FileWithPosition {
    File: string;
    X: number;
    Y: number;
}
