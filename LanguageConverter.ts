import * as GS from './include/GeneralScript';
import * as OpenCC from 'node-opencc';

export var CompatibleWords = {
    'ー': '—',
    '额': '呃',
    '恩': '嗯',
    '畏': '喂',
    '唹': '哟',
    '舐': '舔',
    '亨': '哼',
    '祢': '你',
    '弁': '办',
    '歩': '步',
    '毎': '每',
    '撃': '击',
    '醤': '酱',
    '好了拉': '好了啦',
    '不是那么回事拉': '不是那么回事啦',
    '而已拉': '而已啦',
    '真是的拉': '真是的啦',
    '阿拉': '啊啦',
    '什么拉': '什么啦',
    '等等拉': '等等啦',
    '好拉': '好啦',
    '做不到拉': '做不到啦',
    '拉拉拉': '啦啦啦',
    '烧肉': '烤肉',
    '烧得': '烤得',
    '烧箱': '烤箱',
    '黒厉史': '黑历史',
    '经厉': '经历',
    '晩': '晚',
    '幇': '帮',
    '裈': '裤',
    '朶': '朵',
    '偸': '偷',
    '渉': '涉',
    '呑': '吞',
    '瀬': '濑',
    '黒': '黑',
    '戸': '户',
    '搅个大新闻': '搞个大新闻',
    '搅好关系': '搞好关系',
    '歳': '岁',
    '縁': '缘',
    '値': '值',
    '说说话巴': '说说话吧',
    '阿': '啊',
    '啊、啊雪': '阿、阿雪',
    '啊雪': '阿雪',
    '啊月': '阿月'
};

export function replaceCompatibleWord(name: string): string {
    if (!name) return name;
    let result = name;
    Object.keys(CompatibleWords).forEach(v => {
        result = result.replace(new RegExp(`${v}`, 'g'), CompatibleWords[v]);
    });
    return result;
}

export function toSimplifiedChinese(project: GS.Project): GS.Project {
    project.scene.forEach(scene => {
        scene.block.forEach(block => {
            if (block.type == GS.BlockType.Choice) {
                let data: GS.BlockChoice = block.data;
                data.choice.forEach(choice => {
                    choice.title = OpenCC.traditionalToSimplified(choice.title);
                    choice.title = replaceCompatibleWord(choice.title);
                });
            } else if (block.type == GS.BlockType.Input) {
                let data: GS.BlockInput = block.data;
                data.title = OpenCC.traditionalToSimplified(data.title);
                data.content.forEach(content => {
                    content.title = OpenCC.traditionalToSimplified(content.title);
                    content.title = replaceCompatibleWord(content.title);
                });
            } else if (block.type == GS.BlockType.Normal) {
                let data: GS.BlockNormal = block.data;
                data.content.forEach(content => {
                    if (content.type == GS.CommandType.Text) {
                        let commandData: GS.CommandContentText = content.content as GS.CommandContentText;
                        commandData.text = OpenCC.traditionalToSimplified(commandData.text);
                        commandData.text = replaceCompatibleWord(commandData.text);
                    }
                });
            }
        });
    });
    return project;
}