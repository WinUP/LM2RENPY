export interface Command {
    type: CommandType;
    param: CommandParam;
}

export enum CommandType {
    PLAINTEXT = "PLAINTEXT",
    SCENARIO = "SCENARIO", // 没有用
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
    FONT = "FONT", // 字体
    FONT_END = "/FONT",
    PG = "PG", // 换页
    DELMESBOX = "DELMESBOX",
    BR = "BR",// 换行
    CHGVOL = "CHGVOL",
    SYSMENUON = "SYSMENUON",
    SAVELOADON = "SAVELOADON",
    MOVIE = "MOVIE",
    WAITFOR = "WAITFOR",
    B = "B", // 粗体
    B_END = "/B",
    TXSPS = "TXSPS",
    TXSPN = "TXSPN",
    TXSPF = "TXSPF",
    U = "U", // 下划线
    U_END = "/U",
    I = "I", // 斜体
    I_END = "/I",
    QUAKE = "QUAKE",
    STOPQUAKE = "STOPQUAKE",
    VAR = "VAR"
}

export interface CommandParam {
    [name: string]: string;
}

export enum EffectType {
    NONE = "NONE",
    FADE = "FADE",
    BLINDH = "BLINDH",
    BLINDV = "BLINDV",
    CURTAINH = "CURTAINH",
    CURTAINV = "CURTAINV",
    SCROLLH = "SCROLLH",
    SCROLLV = "SCROLLV",
    GRID = "GRID",
    GRIDH = "GRIDH",
    GRIDV = "GRIDV",
    DITHER = "DITHER",
    WHITE = "WHITE",
    BLACK = "BLACK",
    FLASH = "FLASH",
    MOSAIC = "MOSAIC",
    SCRATCHH = "SCRATCHH",
    SCRATCHV = "SCRATCHV",
    SPOT = "SPOT",
    MASK = "MASK",
    MASKW = "MASKW",
    MASKB = "MASKB",
    SMALL = "SMALL",
    BIG = "BIG",
    RIPPLE = "RIPPLE",
    BLURW = "BLURW",
    BLURB = "BLURB",
    TWISTH = "TWISTH",
    TWISTV = "TWISTV",
    CRACK = "CRACK",
    ZOOMIN  = "ZOOMIN",
    CLOCKHAND  = "CLOCKHAND",
    RUBBERH  = "RUBBERH",
    RUBBERV  = "RUBBERV",
    FAN  = "FAN",
    WFAN  = "WFAN",
    CIRCLE  = "CIRCLE",
    BLOCKCOIL  = "BLOCKCOIL",
    BLOCKRANDOM  = "BLOCKRANDOM"
}

export var Priority: { [key: string]: number } = {
    '背景奥': 0,
    '背景手前': 100,
    'キャラクタ奥': 200,
    'キャラクタ中間': 300,
    'キャラクタ手前': 400,
    'キャラクタ最前': 500
};
