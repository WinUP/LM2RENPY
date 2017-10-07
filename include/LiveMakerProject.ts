export interface LiveMakerProject {
    Version: string;
    FolderTree: {
        Opened: string,
        Items: LiveMakerProjectFolderTreeItem[]
    };
    Folder: {
        Item: LiveMakerProjectScene[]
    };
    NewItemId: string;
    Priority: {
        Item: LiveMakerProjectPriorityItem[]
    };
    Title: string;
    ScreenCX: string;
    ScreenCY: string;
    BGColor: string;
    MessageBox: {
        Item: LiveMakerProjectMessageBoxItem[]
    };
    Var: {
        Item: LiveMakerProjectVarItem[]
    };
    CGMode: {
        List: {
            Item: string[]
        };
        X: string;
        Y: string;
        Width: string;
        Height: string;
        Column: string;
        Row: string;
        BG: string;
        Menu: string;
        NumberCG: FilePositionPair;
        PercentCG: FilePositionPair;
    };
}

export interface LiveMakerProjectFolderTreeItem {
    ID: string;
    Name: String;
    Opened: BooleanInString;
}

export interface LiveMakerProjectScene {
    ID: string;
    Caption: string;
    Node: {
        Item: LiveMakerProjectNodeBase[]
    };
    Var: {
        Item: LiveMakerProjectSceneVar[]
    };
}

export interface LiveMakerProjectSceneVar {
    Name: string;
    VarType: LiveMakerProjectVarItemType;
    InitValue: string;
    VarScope: LiveMakerProjectVarItemScope;
}

export interface LiveMakerProjectNodeBase {
    ID: string;
    Type: LiveMakerProjectNodeType;
    Caption: string;
    Jump: {
        Item: CondIDPair[]
    };
}

export enum LiveMakerProjectNodeType {
    SceneStart = "2",
    Scene = "0",
    Calc = "6",
    Choice = "11",
    Menu = "12",
    Input = "13",
    Navigate = "4",
    Exit = "9",
    SceneEnd = "3",
    Jump = "5"
}

export interface LiveMakerProjectNodeSceneStart extends LiveMakerProjectNodeBase { }

export interface LiveMakerProjectNodeScene extends LiveMakerProjectNodeBase {
    NotStory: BooleanInString;
    NotCaret: BooleanInString;
}

export interface LiveMakerProjectNodeCalc extends LiveMakerProjectNodeBase {
    Calc: {
        Item: LiveMakerProjectCalcItem[]
    };
    Var: "" | {
        Item: LiveMakerProjectSceneVar[]
    };
}

export interface LiveMakerProjectNodeMenu extends LiveMakerProjectNodeBase {
    Source: string;
    BGImage: string;
    FadeinTime: string;
    FadeoutTime: string;
    CancelEnabled: BooleanInString;
    SoundHover: string;
    SoundSelect: string;
    TimeLimit: string;
    Cond: {
        Item: CondNamePair[];
    };
    VisibleCond: {
        Item: CondNamePair[];
    };
    SelectedCond: {
        Item: CondNamePair[];
    };
}

export interface LiveMakerProjectNodeChoice extends LiveMakerProjectNodeBase {
    Menu: {
        Item: LiveMakerProjectNodeChoiceMenuItem[]
    };
    CancelEnabled: BooleanInString;
    SoundHover: string;
    SoundSelect: string;
    TimeLimit: string;
    PosX: string;
    PosY: string;
    HAlign: "0" | "1" | "2";
    CutEnabled: BooleanInString;
}

export interface LiveMakerProjectNodeInput extends LiveMakerProjectNodeBase {
    Prompt: string;
    CancelEnabled: BooleanInString;
    PosX: string;
    PosY: string;
    Text: {
        Item: LiveMakerProjectNodeInputTextItem[]
    }
}

export interface LiveMakerProjectNodeNavigate extends LiveMakerProjectNodeBase {
    Target: string;
    TargetPage: string;
    Param: "" | {
        Item: any;
    };
}

export interface LiveMakerProjectNodeExit extends LiveMakerProjectNodeBase { }

export interface LiveMakerProjectNodeSceneEnd extends LiveMakerProjectNodeBase { }

export interface LiveMakerProjectNodeJump extends LiveMakerProjectNodeBase {
    Target: string;
    TargetPage: string;
}

export interface CondIDPair {
    ID: string;
    Cond: string;
}

export interface CondNamePair {
    Name: string;
    Cond: string;
}

export interface LiveMakerProjectNodeChoiceMenuItem {
    Caption: string;
    Cond: string;
    IsCalc: BooleanInString;
}

export interface LiveMakerProjectNodeInputTextItem {
    Caption: string;
    MinLen: string;
    MaxLen: string;
    Param: string;
}

export interface LiveMakerProjectCalcItem {
    $: {
        Command: string,
        Indent: BooleanInString,
        Mute: BooleanInString,
        NotUpdate: BooleanInString,
        Color: string
    };
    [key: string]: any;
}

export interface LiveMakerProjectPriorityItem {
    Name: string;
    Value: string;
}

export interface LiveMakerProjectMessageBoxItem {
    Name: string;
    Font: LiveMakerProjectMessageBoxItemFont;
    BGColor: string;
    BGFile: string;
    PosX: string;
    PosY: string;
    Width: string;
    Height: string;
    BGMarginL: string;
    BGMarginT: string;
    BGMarginR: string;
    BGMarginB: string;
    BGAlpha: string;
    CsrClick: string;
    CsrPosX: string;
    CsrPosY: string;
    SEClick: string;
}

export interface LiveMakerProjectMessageBoxItemFont {
    Antialias: BooleanInString;
    Size: string;
    Space: string;
    Color: string;
    LinkColor: string;
    HoverColor: string;
    Shade: string;
    ShadeColor: string;
    Border: string;
    BorderColor: string;
    Name: string;
    FontChangeabled: BooleanInString;
}

export interface LiveMakerProjectVarItem {
    Name: string;
    VarType: LiveMakerProjectVarItemType;
    InitValue: string;
    VarScope: LiveMakerProjectVarItemScope;
}

export enum LiveMakerProjectVarItemType {
    Number = "1",
    Float = "2",
    Boolean = "3",
    String = "4"
}

export enum LiveMakerProjectVarItemScope {
    Normal = "0",
    Unknown = "1",
    Static = "2"
}

export enum LiveMakerProjectCalcVarItemScope {
    Normal = "0",
    AutoRemove = "1",
    Local = "2",
    Static = "3"
}

export enum LiveMakerProjectVarCommandType {
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
    TextIns = "TextIns"
}

export enum BooleanInString {
    True = "1",
    False = "0"
}

export interface FilePositionPair {
    File: string;
    X: string;
    Y: string;
}
