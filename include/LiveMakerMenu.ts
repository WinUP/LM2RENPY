export interface Menu {
    BGFile: string;
    Button: {
        Item: MenuItem[]
    };
}

export interface MenuItem {
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
