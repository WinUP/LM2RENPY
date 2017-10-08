import { PROJECT_RESOURCE_ROOT } from './LiveMakerParser';
import {
    Project, BlockType, BlockCalculator, CalculatorType, CalculatorImageNewData, CalculatorSoundData, BlockMenu,
    BlockNormal, CommandType, CommandContentImageAnimation, CommandContentChangeImageAnimation,
    CommandContentSound, Animation
} from './include/GeneralScript';

export var TranslationKeyword = {
    '宝物～卒業の春～': 'Treasure-Spring-of-Graduate',
    'Schoolboys Theme - 作哉小翼': 'Schoolboys Theme - Sakuya and Tsubasa-chan',
    'Schoolboys Theme - 友忍': 'Schoolboys Theme - Tomo and Shinobu',
    'Schoolboys Theme - 愛を賭けて': 'Schoolboys Theme - Bet of Love',
    'Schoolboys Theme - 赤峰雙子': 'Schoolboys Theme - Akamine brothers',
    'Schoolboys Theme - 九尾': 'Schoolboys Theme - Kyubi',
    'Schoolboys Theme - 木村伊藤': 'Schoolboys Theme - Kimura and Itou',
    'Schoolboys Theme - 三朗': 'Schoolboys Theme - Saburo',
    'Schoolboys Theme - 慎太郎': 'Schoolboys Theme - Shintaro',
    'Schoolboys Theme - 朔': 'Schoolboys Theme - Nori',
    'Schoolboys Theme - 翼': 'Schoolboys Theme - Tsubasa',
    'Schoolboys Theme - 友': 'Schoolboys Theme - Tomo',
    'Series - 赤峰雙子': 'Series - Akamine brothers',

    '’': '',
    '？？？': 'No-name',
    '宝咲': 'Takarasaki',
    '花乃湯': 'Hanano',
    '梅咲': 'Umesaki',
    'Umezaki': 'Umesaki',
    '銀剛山': 'Gingon mountain',
    '御咲站': 'Misaki station',
    '神社': 'Jinja',

    '百米田徑': 'Running',
    '借物競走': 'Race walking',
    '騎馬戰': 'Riding battle',
    '投球入籃': 'Ball shooting',
    '男低音': 'Bass',
    '男高音': 'Tenor',
    '女低音': 'Alto',
    '女高音': 'Soprano',

    'ジト目だんじり': 'Stare',
    '呆れだんじり': 'Trance',
    '落ち込みだんじり': 'Downcast',
    '普通空2だんじり': 'Normal 2',
    '普通空3だんじり': 'Normal 3',
    '普通空４だんじり': 'Normal 4',
    '普通空だんじり': 'Normal',
    '喜空2だんじり': 'Happy 2',
    '心配だんじり': 'Worry',
    '優空2だんじり': 'Kind 2',
    '横顔月だんじり': 'Serious',
    '焦月だんじり': 'Anxious',
    '普通月2だんじり': 'Normal 2',
    '普通月3だんじり': 'Normal 3',
    '普通月４だんじり': 'Normal 4',
    '普通月だんじり': 'Normal',
    '喜月だんじり': 'Happy',

    'ある雨の日': 'G40-1',
    'イラズラ': 'G170-3',
    'ケーキ': 'G210-3',
    'コーディネイト！２': 'G170-5 2',
    'コーディネイト！': 'G170-5',
    'しなばもろとも': 'G130-4',
    'それでも生まれた日にちは': 'G80-3',
    'ニャンコ捕獲大作戦！': 'G140-3',
    'みんなでサッカー２': 'G60-1 2',
    'みんなでサッカー': 'G60-1',
    'みんなでバレー': 'G210-7',
    'みんなでプール': 'G160-3',
    'ラーメン': 'G90-1',
    'レッツ筋トレ！': 'G210-2',
    'ワンコと過ごす夏休み': 'G60-3',
    '初参り': 'G190-1',
    '刺激を求めて': 'G140-4',
    '電マ妖怪': '202',
    '短髪しのぶ': '211',
    '見習い悩み続': 'G170-1',
    '見習い悩み3': 'G160-1 3',
    '見習い悩み2': 'G160-1 2',
    '見習い悩み': 'G160-1',
    '教え２': 'G170-2 2',
    '教え': 'G170-2',
    '空日記３': 'G190-3',
    '恐怖体験…？': 'G210-5',
    '鞄の中身は！？': 'G90-2',
    '慎太郎テクニックお寿司編2': 'G220-2 2',
    '慎太郎テクニックお寿司編': 'G220-2',
    '素敵なアナタ': 'G50-1',
    '体育祭イメージ図': 'Sports-celemony-plan',
    '突入御咲学園3': 'G70-1 3',
    '突入御咲学園2': 'G70-1 2',
    '突入御咲学園': 'G70-1',
    '危機一髪！？': 'G130-2',
    '我が校の誇り２': 'G150-1 2',
    '我が校の誇り': 'G150-1',
    '嫌われた！？': 'G160-2',
    '学ランパーカー': 'G170-6',
    '仲間に感謝！': 'G210-4',
    
    '朔しのぶメイド': 'Nori-Shinobu-in-cafe',
    'パンツしのぶ': 'Shinobu_underwear',
    'さくつば': 'Sakuya-Tsubasa',
    'つばさたち絵': 'Tsubasa_tachie',
    'つばさ友': 'Tsubasa-Tomo',
    'ツンデレ処方': 'Drug-for-tsundere',
    'にそう': 'Parallel-boats',
    'パンツつばさ': 'Tsubasa_underwear',
    'パンツ空': 'Sora_underwear',
    'パンツ三朗': 'Saburo_underwear',
    'パンツ慎太郎': 'Shintaro_underwear',
    'パンツ友': 'Tomo_underwear',
    'パンツ月': 'Tsuki_underwear',
    'パンツ作哉': 'Sakuya_underwear',
    'ユウヒ漫画': 'Yuuhi-quest',
    'ワンニャン': 'Story-of-wong-mew',
    '常磐九尾': 'Tokiwa-Kyubi',
    '岡島兄弟': 'Okajima-brothers',
    '晦朔': 'Kai-Nori',
    '加藤たち絵': 'Katou_tachie',
    '空たち絵': 'Sora_tachie',
    '狼屋敷': 'Welcome-to-wolfs-celemony',
    '木村たち絵': 'Kimura_tachie',
    '南小林たち絵': 'Minami-Kobayashi_tachie',
    '三朗たち絵': 'Saburo_tachie',
    '慎太郎たち絵': 'Shintaro_tachie',
    '双子たち絵': 'Akamine-brothers_tachie',
    '四朗たち絵': 'Shiro_tachie',
    '相撲ラーメン': 'Let-us-sumo-together 1',
    '小学生組': 'Tomo-Sakase-Shinobu_primary_school',
    '伊藤たち絵': 'Itou_tachie',
    '友たち絵': 'Tomo_tachie',
    '月たち絵': 'Tsuki_tachie',
    '月木村相撲': 'Let-us-sumo-together 2',
    '運動会２': 'Sports-celemony 2',
    '運動会': 'Sports-celemony 1',
    '中山清たち絵': 'Nakayama-Kiyo_tachie',
    '中山兄弟': 'Nakayama-brothers',
    '作哉たち絵': 'Sakuya_tachie',
    'しのぶ': 'Shinobu',

    'Lo-Lo-Lovers': 'Run-Run-Lovers',
    '傲嬌男孩子的激效療': 'Drastic-remedy-for-tsundere',
    '傲嬌男孩子的治療法': 'Drug-for-tsundere',
    '變革進行曲': 'Revolution-march',
    '并駛之舟': 'Parallel-boats',
    '不可思議！猫狗物語': 'Inconceivable-story-of-wong-mew',
    '大家來相撲': 'Let-us-sumo-together',
    '狐的報恩': 'Gratitude-payment-of-fox',
    '歡迎來到食人狼之館': 'Welcomt-to-wolfs-celemony',
    '集合！御咲花車祭': 'Join-misaki-danjiri',
    '集合-御咲花車祭': 'Join-misaki-danjiri',
    '久遠回憶': 'Prelife-memory',
    '我是直的-現無對象': 'I-am-none-gay-with-no-lovers',
    '我是直的，現無對象': 'I-am-none-gay-with-no-lover',
    '學園怪談': 'The-inbelieveble-of-school',
    '尋求刺激-解': 'Seeking-for-stimulation-finally',
    '異我戰紀': 'Legacy-of-asynchronized-myself',
    '翼的流轉音符': 'Tsubasas-Cantabile',
    '正義的教訓': 'Precept-of-justice',

    '狐語り2語': 'Gratitude-payment-of-fox-extended-speaking 2',
    '狐語り３語': 'Gratitude-payment-of-fox-extended-speaking 3',
    '狐語り４語': 'Gratitude-payment-of-fox-extended-speaking 4',
    '狐語り５語': 'Gratitude-payment-of-fox-extended-speaking 5',
    '狐語り1': 'Gratitude-payment-of-fox-extended 1',
    '狐語り2': 'Gratitude-payment-of-fox-extended 2',
    '狐語り３': 'Gratitude-payment-of-fox-extended 3',
    '狐語り４': 'Gratitude-payment-of-fox-extended 4',
    '狐語り５': 'Gratitude-payment-of-fox-extended 5',
    '語り': 'Gratitude-payment-of-fox-extended',

    '忍+翼+慎太郎': 'Shinobu-Tsubasa-Shintaro',
    '月+空+慎太郎': 'Tsuki-Sora-Shintaro',
    '月+空+友': 'Tsuki-Sora-Tomo',
    '忍+中山+清': 'Shinobu-Nakayama-Kiyo',
    '剛島前輩+佐藤': 'Okajima-senior-Sato',
    '常磐+九尾': 'Tokiwa-Kyubi',
    '四朗+小翼': 'Shiro-Tsubasa-chan',
    '伊藤+木村': 'Itou+Kimura',
    '友+忍': 'Tomo+Shinobu',
    '四朗+雪緒': 'Shiro-Yukio',
    '友+慎太郎': 'Tomo-Shintaro',
    '友+翼': 'Tomo-Tsubasa',
    '作哉+小翼': 'Sakuya-Tsubasa-chan',
    '友+尤西': 'Tomo-Yuuhi',
    '月+空': 'Tsuki-Sora',
    '剛島+小島': 'Okajima-Kojima',
    '加藤+松田': 'Katou-Matsuta',
    '三朗+慎太郎': 'Saburo-Shintaro',
    '中山前輩+泉': 'Nakayama-senior-Izumi',
    '忍+朔': 'Shinobu-Nori',
    '杉本+陸田': 'Sumoto-Rikuta',
    
    '作哉散歩': 'Sakuya-walk',
    '阿月測眼力': 'Tsukis-concentration-test',
    '向左向右看': 'Left-or-right-which-is-correct',
    '小林翻花牌': 'Karuta-game-from-Kobayashi',
    '小忍問題冊': 'Shinobus-question-set',
    '野球拳': 'Yakyuken',
    '三朗美髮店': 'Saburos-Salon',
    '慎太郎筆記': 'Shintaro-notebook',
    '腕相撲': 'Finesse-sumo',

    '（人類版）': '(Human)',
    '岡島前輩': 'Okajima-senior',
    '剛島前輩': 'Okajima-senior',
    '中山前輩': 'Nakayama-senior',
    '小島女装': 'Kojima-dress',
    '触手蚯蚓': 'Tentacle-earthworm',
    '觸手蚯蚓': 'Tentacle-earthworm',
    '觸手A': 'Tentacle-earthworm',
    '触手A': 'Tentacle-earthworm',
    '觸手海星': 'Tentacle-starfish',
    '触手海星': 'Tentacle-starfish',
    '觸手B': 'Tentacle-starfish',
    '触手B': 'Tentacle-starfish',
    '小熊猫': 'Lesser-panda',
    '翔銀時': 'Shougintoki',
    '慎太郎': 'Shintaro',
    '赤峰': 'Akamine',
    '双子': 'Tsuki-Sora',
    '妖怪': 'Monster',
    '常磐前輩': 'Tokiwa',
    '常磐': 'Tokiwa',
    '岡島': 'Okajima',
    '剛島': 'Okajima',
    '滑子老師': 'Nameko',
    '滑子': 'Nameko',
    '加藤': 'Katou',
    '陸田': 'Rikuta',
    '木村': 'Kimura',
    '三朗': 'Saburo',
    '杉本': 'Sumoto',
    '四朗': 'Shiro',
    '松田': 'Matsuta',
    '小島': 'Kojima',
    '小林': 'Kobayashi',
    '小翼': 'Tsubasa-chan',
    '雪緒': 'Yukio',
    '伊藤': 'Itou',
    '佐藤': 'Sato',
    '作哉': 'Sakuya',
    '悪魔': 'Devil',
    '逆瀨': 'Sakase',
    '逆瀬': 'Sakase',
    '天使': 'Angel',
    '導遊': 'Tour-guide',
    '尤西': 'Yuuhi',
    '翔平': 'Shouhei',
    '中山': 'Nakayama',
    '九尾': 'Kyubi',
    '晦': 'Kai',
    '守': 'Mamoru',
    '朔': 'Nori',
    '清': 'Kiyo',
    '貝ー': 'Be--',
    '貝': 'Be--',
    '黑ー': 'He--',
    '黑': 'He--',
    '宮ー': 'Gon--',
    '翼': 'Tsubasa',
    '友': 'Tomo',
    '月': 'Tsuki',
    '空': 'Sora',
    '南': 'Minami',
    '泉': 'Izumi',
    '忍': 'Shinobu',

    '思考': 'Thinking'
}

function replaceUrl(source: string): string {
    if (!source) return source;
    let result = source;
    Object.keys(TranslationKeyword).forEach(v => {
        result = result.replace(new RegExp(`${v}`, 'g'), TranslationKeyword[v]);
    });
    result = convertUrl(result);
    return result;
}

function convertUrl(source: string): string {
    if (!source) return source;
    let result = source;
    result = result.replace(new RegExp(PROJECT_RESOURCE_ROOT.replace(/\\/g, '\\\\'), 'g'), '');
    result = result.replace(new RegExp(PROJECT_RESOURCE_ROOT.replace(/\\/g, '\\\\'), 'g'), '');
    result = result.replace(/グラフィック/g, 'images');
    result = result.replace(/サウンド/g, 'sound');
    result = result.replace(/\\/g, '/');
    result = result.replace(/\.gal/g, '.png');
    return result;
}

export function mapUrl(project: Project): Project {
    console.log('开始映射Ren\'Py工程路径……')
    console.log('处理CG列表……');
    project.cg = project.cg.map(cg => replaceUrl(cg));
    console.log('处理场景……');
    project.scene.forEach(scene => {
        scene.block.forEach(block => {
            if (block.type == BlockType.Calculator) {
                let data: BlockCalculator = block.data;
                data.code.forEach(code => {
                    if (code.type == CalculatorType.ImageNew) {
                        let codeData: CalculatorImageNewData = (code.data as CalculatorImageNewData);
                        console.log(`\t映射图像指令 ${codeData.source}`);
                        codeData.source = replaceUrl(codeData.source);
                        console.log(`\t\t-> codeData.source`)
                    } else if (code.type == CalculatorType.Sound) {
                        let codeData: CalculatorSoundData = (code.data as CalculatorSoundData);
                        console.log(`\t映射音频指令 ${codeData.source}`);
                        codeData.source = replaceUrl(codeData.source);
                        console.log(`\t\t-> codeData.source`)
                    }
                });
            } else if (block.type == BlockType.Menu) {
                let data: BlockMenu = block.data;
                data.item.forEach(item => {
                    if (item.imagePath) {
                        console.log(`\t映射选单按钮 ${item.imagePath}`);
                        item.imagePath = replaceUrl(item.imagePath);
                        console.log(`\t\t->${item.imagePath}`);
                    }
                    if (item.hoverPath) {
                        console.log(`\t映射选单激活 ${item.hoverPath}`);
                        item.hoverPath = replaceUrl(item.hoverPath);
                        console.log(`\t\t->${item.hoverPath}`);
                    }
                    if (item.previewPath) {
                        console.log(`\t映射选单预览 ${item.previewPath}`);
                        item.previewPath = replaceUrl(item.previewPath);
                        console.log(`\t\t->${item.previewPath}`);
                    }
                });
            } else if (block.type == BlockType.Normal) {
                let data: BlockNormal = block.data;
                data.content.forEach(command => {
                    if (command.type == CommandType.Image) {
                        let commandContent: CommandContentImageAnimation = (command.content as CommandContentImageAnimation);
                        if (!commandContent.animation) {
                            console.log(`\t映射图像 ${commandContent.source}`);
                            commandContent.source = replaceUrl(commandContent.source);
                            console.log(`\t\t->${commandContent.source}`);
                        } else {
                            mapAnimation(commandContent);
                        }
                    } else if (command.type == CommandType.ChangeImage) {
                        let commandContent: CommandContentChangeImageAnimation = (command.content as CommandContentChangeImageAnimation);
                        if (!commandContent.animation) {
                            console.log(`\t映射图像 ${commandContent.source}`);
                            commandContent.source = replaceUrl(commandContent.source);
                            console.log(`\t\t->${commandContent.source}`);
                        } else {
                            mapAnimation(commandContent);
                        }
                    } else if (command.type == CommandType.Sound) {
                        let commandContent: CommandContentSound = (command.content as CommandContentSound);
                        console.log(`\t映射音频 ${commandContent.source}`);
                        commandContent.source = replaceUrl(commandContent.source);
                        console.log(`\t\t->${commandContent.source}`);
                    }
                });
            }
        });
    });
    console.log('映射完成');
    return project;
}

function mapAnimation(content: CommandContentImageAnimation | CommandContentChangeImageAnimation): void {
    content.animation.forEach(anim => {
        console.log(`\t映射图像 ${anim.source}`);
        anim.source = replaceUrl(anim.source);
        console.log(`\t\t->${anim.source}`);
    });
}