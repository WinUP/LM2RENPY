export interface LiveMakerSceneCommand {
    type: LiveMakerSceneCommandType;
    param: LiveMakerSceneCommandParam;
}

export enum LiveMakerSceneCommandType {
    PLAINTEXT = "PLAINTEXT",
    SCENARIO = "SCENARIO",
    FLIP = "FLIP",
    SYSMENUOFF = "SYSMENUOFF",
    SAVELOADOFF = "SAVELOADOFF",
    WAIT = "WAIT",
    IMAGE = "IMAGE",
    DELIMG = "DELIMG",
    SOUND = "SOUND",
    PS = "PS",
    CHGIMG = "CHGIMG",
    STOPSND = "STOPSND",
    CHGMESBOX = "CHGMESBOX",
    MESBOX = "MESBOX",
    FONT = "FONT", //联合标签
    PG = "PG",
    DELMESBOX = "DELMESBOX",
    BR = "BR",
    CHGVOL = "CHGVOL",
    SYSMENUON = "SYSMENUON",
    SAVELOADON = "SAVELOADON",
    MOVIE = "MOVIE",
    WAITFOR = "WAITFOR",
    B = "B", //联合标签
    TXSPS = "TXSPS",
    TXSPN = "TXSPN",
    TXSPF = "TXSPF",
    U = "U", //联合标签
    I = "I", //联合标签
    QUAKE = "QUAKE",
    STOPQUAKE = "STOPQUAKE",
    VAR = "VAR"
}

export interface LiveMakerSceneCommandParam {
    [name: string]: string;
}
