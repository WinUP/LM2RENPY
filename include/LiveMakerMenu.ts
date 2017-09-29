export interface LiveMakerMenu {
    BGFile: string;
    Button: {
        Item: LiveMakerMenuItem[]
    };
}

export interface LiveMakerMenuItem {
    Left: string;
    Top: string;
    PrevLeft: string;
    PrevTop: string;
    Path: string;
    CapMask: string;
    CapMaskLevel: string;
    Name: string;
    Group: string;
    InImagePath: string;
    InPrevPath: string;
    DownOnPrevRepeat: string;
    DownOffPrevRepeat: string;
}
