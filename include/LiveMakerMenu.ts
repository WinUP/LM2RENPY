export interface LiveMakerMenu {
    BGFile: string;
    Button: {
        Item: LiveMakerMenuItem[]
    };
}

export interface LiveMakerMenuItem {
    Left: number;
    Top: number;
    PrevLeft: number;
    PrevTop: number;
    Path: string;
    CapMask: number;
    CapMaskLevel: number;
    Name: string;
    Group: number;
    InImagePath: string;
    InPrevPath: string;
    DownOnPrevRepeat: number;
    DownOffPrevRepeat: number;
}
