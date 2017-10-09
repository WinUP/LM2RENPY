import { PROJECT_RESOURCE_ROOT } from './LiveMakerParser';
import {
    Project, BlockType, BlockCalculator, CalculatorType, CalculatorImageNewData, CalculatorSoundData, BlockMenu,
    BlockNormal, CommandType, CommandContentImageAnimation, CommandContentChangeImageAnimation,
    CommandContentSound, Animation, CalculatorCalcData, CommandContentNameTarget, CalculatorContinueData,
    CalculatorVarDelData, CalculatorWhileData, 
} from './include/GeneralScript';

export var TranslationKeyword = {
    '\\[hover]': 'hover',
    '\\[flag]': 'flag',
    '\\[point]': 'point',
    '\\[quest]': 'quest',
    '\\[waiting]': 'waiting',
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

export var TranslationVariable = {
    '&': 'and',
    '\\|': 'or',
    '\\r': '',
    '最終選択番号': '_lm_selected_index',
    '最終選択値': '_lm_selected_value',
    '選択番号': '_lm_selected_index',
    '選択値': '_lm_selected_value',

    'E_TAG_Talk岡島InitNumber': 'E_TAG_TalkOkajimaInitNumber',
    'E_Talk慎太郎NoteComplete': 'E_TalkShintaroNoteComplete',
    'E_Talk小島佐藤Event': 'E_TalkKojimaSatouEvent',
    'E_Talk觸手ACave': 'E_TalkTentacleACave',
    'E_Talk觸手BCave': 'E_TalkTentacleBCave',
    'E_Talk晦Event': 'E_TalkKaiEvent',
    'E_Talk逆瀨': 'E_TalkSakase',

    'F常磐Help': 'FTokiwaHelp',
    '名前': 'FirstName',
    '苗字': 'LastName',

    'C3Q野球拳ClearState': 'C3QYakyukenClearState',
    'Q三慎ToiletSingle': 'QSabushinToiletSingle',
    'C3Q野球拳Check1': 'C3QYakyukenCheck1',
    'C1Q新聞部Phase': 'C1QNewsclubPhase',
    'C2Q新聞部Phase': 'C2QNewsclubPhase',
    'C3Q新聞部Phase': 'C3QNewsclubPhase',
    'C3Q野球拳Phase': 'C3QYakyukenPhase',
    'Q新聞部Random': 'QNewsclubRandom',
    'C1Q三慎Phase': 'C1QSabushinPhase',
    'C1Q松田Phase': 'C1QMatsutaPhase',
    'C2Q尤西Phase': 'C2QYuuhiPhase',
    'C3Q中山Phase': 'C3QNakayamaPhase',
    'Q木村Check1': 'QKimuraCheck1',
    'Q三慎Check1': 'QSabushinCheck1',
    'C1Q翼Phase': 'C1QTsubasaPhase',
    'C0S忍State': 'C0SShinobuState',
    'Q翼Check1': 'QTsubasaCheck1',

    'C1Q木村討論': 'C1QKimuraConference',
    'C1Q新聞部': 'C1QNewsclub',
    'C1S三慎': 'C1SSabuShin',
    'C1Q三慎': 'C1QSabuShin',
    'C1Q松田': 'C1QMatsuta',
    'C0S忍': 'C0SShinobu',
    'C1Q翼': 'C1QTsubasa',

    'C2Q木村討論': 'C2QKimuraConference',
    'C2Q新聞部': 'C2QNewsclub',
    'C2Q尤西': 'C2QYuuhi',
    'C2Q作哉': 'C2QSakuya',
    'C2Q空': 'C2QSora',
    'C2S朔': 'C2SNori',

    'C3S雪緒常磐': 'C3SYukiToki',
    'C3S四朗雪緒': 'C3SShiroYuki',
    'C3Q木村討論': 'C3QKimuraConference',
    'C3Q作哉散歩': 'C3QSakuyaWalk1',
    'C3Q新聞部': 'C3QNewsclub',
    'C3Q野球拳': 'C3QYakyuken',
    'C2S尤西': 'C2SYuuhi',
    'C3S三慎': 'C3SSabuShin',
    'C3S公園': 'C3SPark',
    'C3S照片': 'C3SPhoto',
    'C3Q作哉': 'C3QSakuyaWalk2',
    'C3Q四朗': 'C3QShiro',
    'C3Q中山': 'C3QNakayama',
    'C3Q朔': 'C3QNori',

    'T木村Q木村討論After': 'TalkKimuraQKimuraConferenceAfter',
    'T伊藤木村F1After': 'TalkItouKimuraF1After',
    'T慎太郎F3After': 'TalkShintaroF3After',
    'TBookstoreF5': 'TalkBookstoreF5',
    'T月空F1After': 'TalkTsukiSoraF1After',
    'T翼Q翼After': 'TalkTsubasaQTsubasaAfter',
    'T伊藤木村F2': 'TalkItouKimuraF2',
    'T岡島小島F2': 'TalkOkajimaKojimaF2',
    'T加藤松田F2': 'TalkKatouMatsutaF2',
    'T翼F1After': 'TalkTsubasaF1After',
    'T翼F4After': 'TalkTsubasaF4After',
    'T忍F5After': 'TalkShinobuF5After',
    'T佐藤泉F2': 'TalkSatouIzumiF2',
    'T慎太郎F2': 'TalkShintaroF2',
    'T作哉F2': 'TalkSakuyaF2',
    'T月空F2': 'TalkTsukiSoraF2',
    'T三朗F2': 'TalkSaburoF2',
    'T慎太郎': 'TalkShintaro',
    'T朔F5': 'TalkNoriF5',
    'T忍F2': 'TalkShinobuF2',
    'T木村': 'TalkKimura',
    'T伊藤': 'TalkItou',
    'T加藤': 'TalkKatou',
    'T松田': 'TalkMatsuta',
    'T佐藤': 'TalkSatou',
    'T作哉': 'TalkSakuya',
    'T岡島': 'TalkOkajima',
    'T翼': 'TalkTsubasa',
    'T泉': 'TalkIzumi',
    'T空': 'TalkSora',
    'T忍': 'TalkShinobu',
    
    'TalkResidentialQ尤西': 'TalkResidentialQYuuhi',
    'Talk杉本陸田F4After': 'TalkSumoRikuF4After',
    'Talk杉本陸田F5After': 'TalkSumoRikuF5After',
    'Talk木村Q木村After': 'TalkKimuraQKimuraAfter',
    'Talk慎太郎F4After': 'TalkShintaroF4After',
    'Talk尤西守F6After': 'TalkYuuhiMamoruF6After',
    'Talk慎太郎F6After': 'TalkShintaroF6After',
    'Talk翼Q四朗After': 'TalkTsubasaQShiroAfter',
    'Talk泉加藤松田F1': 'TalkIzuKatoMatsuF1',
    'Talk木村F3After': 'TalkKimuraF3After',
    'Talk三朗F4After': 'TalkSaburoF4After',
    'Talk三朗F6After': 'TalkSaburoF6After',
    'TalkSchoolQ尤西': 'TalkSchoolQYuuhi',
    'Talk月空F1After': 'TalkTsukiSoraF1After',
    'TalkJinjaQ尤西': 'TalkJinjaQYuuhi',
    'Talk小島岡島F1': 'TalkOkajimaKojimaF1',
    'Talk小島岡島F4': 'TalkOkajimaKojimaF4',
    'Talk作哉松田F4': 'TalkSakuyaMatsutaF4',
    'Talk伊藤木村F4': 'TalkItouKimuraF4',
    'Talk杉本陸田F5': 'TalkSumoRikuF5',
    'Talk伊藤木村F1': 'TalkItouKimuraF1',
    'Talk作哉松田F6': 'TalkSakuyaMatsutaF6',
    'Talk四朗雪緒F3': 'TalkShiroYukiF3',
    'Talk伊藤木村F3': 'TalkItouKimuraF3',
    'Talk伊藤木村F6': 'TalkItouKimuraF6',
    'Talk小島岡島F3': 'TalkOkajimaKojimaF3',
    'Talk忍F2After': 'TalkShinobuF2After',
    'Talk泉F3After': 'TalkIzumiF3After',
    'Talk忍F6After': 'TalkShinobuF6After',
    'Talk翼F6After': 'TalkTsubasaF6After',
    'Talk空F6After': 'TalkSoraF6After',
    'Talk月F6After': 'TalkTsukiF6After',
    'TalkHomeQ尤西': 'TalkHomeQYuuhi',
    'Talk加藤Study': 'TalkKatouStudy',
    'TalkToiletF4': 'TalkToiletF4',
    'Talk泉中山F6': 'TalkIzumiNakayamaF6',
    'Talk小林南F3': 'TalkKobaMinaF3',
    'Talk尤西朔F5': 'TalkYuuhiNoriF5',
    'Talk加藤泉F4': 'TalkKatouIzumiF4',
    'Talk慎太郎F6': 'TalkShintaroF6',
    'Talk友忍翼F4': 'TalkTomoShinoTsubaF4',
    'Talk慎太郎F2': 'TalkShintaroF2',
    'Talk觸手AF6': 'TalkTentacleAF6',
    'Talk觸手BF6': 'TalkTentacleBF6',
    'Talk佐藤F1': 'TalkSatouF1',
    'Talk加藤F6': 'TalkKatouF6',
    'Talk三慎F6': 'TalkSabuShinF6',
    'Talk三朗F3': 'TalkSaburoF3',
    'Talk作哉F3': 'TalkSakuyaF3',
    'Talk松田F3': 'TalkMatsutaF3',
    'Talk佐藤F3': 'TalkSatouF3',
    'Talk加藤F3': 'TalkKatouF3',
    'Talk小翼F3': 'TalkTsubasachanF3',
    'Talk尤西F3': 'TalkYuuhiF3',
    'Talk忍翼F3': 'TalkShinoTsubaF3',
    'Talk友翼F1': 'TalkTomoTsubasaF1',
    'Talk松田F2': 'TalkMatsutaF2',
    'Talk加藤F2': 'TalkKatouF2',
    'Talk滑子F2': 'TalkNamekoF2',
    'Talk三朗F1': 'TalkSaburoF1',
    'Talk月空F4': 'TalkTsukiSoraF4',
    'Talk佐藤F4': 'TalkSatouF4',
    'Talk三朗F6': 'TalkSaburoF6',
    'Talk月空F6': 'TalkTsukiSoraF6',
    'Talk作哉F6': 'TalkSakuyaF6',
    'Talk泉F6': 'TalkIzumiF6',
    'Talk友F3': 'TalkTomoF3',
    'Talk泉F3': 'TalkIzumiF3',
    'Talk朔F3': 'TalkNoriF3',
    'Talk朔F1': 'TalkNoriF1',
    'Talk守F6': 'TalkMamoruF6',
    'Talk翼F6': 'TalkTsubasaF6',
    'Talk忍F6': 'TalkShinobuF6',
    'Talk友F6': 'TalkTomoF6',
    'Talk泉F2': 'TalkIzumiF2',
    'Talk月F2': 'TalkTsukiF2',
    'Talk忍F2': 'TalkShinobuF2',
    'Talk空F2': 'TalkSoraF2',
    
    'Talk杉本陸田': 'TalkSumoRiku',
    'Talk伊藤木村': 'TalkItouKimura',
    'Talk中山前輩': 'TalkNakayamasenior',
    'Talk慎太郎': 'TalkShintaro',
    'Talk月空': 'TalkTsukiSora',
    'Talk木村': 'TalkKimura',
    'Talk伊藤': 'TalkItou',
    'Talk佐藤': 'TalkSatou',
    'Talk松田': 'TalkMatsuta',
    'Talk加藤': 'TalkKatou',
    'Talk尤西': 'TalkYuuhi',
    'Talk岡島': 'TalkOkajima',
    'Talk陸田': 'TalkRikuta',
    'Talk三朗': 'TalkSaburo',
    'Talk翼': 'TalkTsubasa',
    'Talk泉': 'TalkIzumi',
    'Talk忍': 'TalkShinobu',
    'Talk月': 'TalkTsuki',
    'Talk空': 'TalkSora',
    'Talk清': 'TalkKiyo'
}

export function replaceUrl(source: string): string {
    if (!source) return source;
    let result = source;
    Object.keys(TranslationKeyword).forEach(v => {
        result = result.replace(new RegExp(`${v}`, 'g'), TranslationKeyword[v]);
    });
    result = convertUrl(result);
    return result;
}

export function replaceName(name: string): string {
    if (!name) return name;
    let result = name;
    Object.keys(TranslationVariable).forEach(v => {
        result = result.replace(new RegExp(`${v}`, 'g'), TranslationVariable[v]);
    });
    return result;
}

export function convertUrl(source: string): string {
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
    project.cg = project.cg.map(cg => {
        console.log(`\t映射图像 ${cg}`);
        cg = replaceUrl(cg)
        console.log(`\t\t -> ${cg}`);
        return cg;
    });
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
                        console.log(`\t\t -> codeData.source`)
                    } else if (code.type == CalculatorType.Sound) {
                        let codeData: CalculatorSoundData = (code.data as CalculatorSoundData);
                        console.log(`\t映射音频指令 ${codeData.source}`);
                        codeData.source = replaceUrl(codeData.source);
                        console.log(`\t\t -> codeData.source`)
                    }
                });
            } else if (block.type == BlockType.Menu) {
                let data: BlockMenu = block.data;
                data.item.forEach(item => {
                    if (item.imagePath) {
                        console.log(`\t映射选单按钮 ${item.imagePath}`);
                        item.imagePath = replaceUrl(item.imagePath);
                        console.log(`\t\t -> ${item.imagePath}`);
                    }
                    if (item.hoverPath) {
                        console.log(`\t映射选单激活 ${item.hoverPath}`);
                        item.hoverPath = replaceUrl(item.hoverPath);
                        console.log(`\t\t -> ${item.hoverPath}`);
                    }
                    if (item.previewPath) {
                        console.log(`\t映射选单预览 ${item.previewPath}`);
                        item.previewPath = replaceUrl(item.previewPath);
                        console.log(`\t\t -> ${item.previewPath}`);
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
                            console.log(`\t\t -> ${commandContent.source}`);
                        } else {
                            mapAnimation(commandContent);
                        }
                    } else if (command.type == CommandType.ChangeImage) {
                        let commandContent: CommandContentChangeImageAnimation = (command.content as CommandContentChangeImageAnimation);
                        if (!commandContent.animation) {
                            console.log(`\t映射图像 ${commandContent.source}`);
                            commandContent.source = replaceUrl(commandContent.source);
                            console.log(`\t\t -> ${commandContent.source}`);
                        } else {
                            mapAnimation(commandContent);
                        }
                    } else if (command.type == CommandType.Sound) {
                        let commandContent: CommandContentSound = (command.content as CommandContentSound);
                        console.log(`\t映射音频 ${commandContent.source}`);
                        commandContent.source = replaceUrl(commandContent.source);
                        console.log(`\t\t -> ${commandContent.source}`);
                    }
                });
            }
        });
    });
    console.log('映射完成');
    return project;
}

export function mapVariable(project: Project): Project {
    console.log('开始映射变量名称……');
    project.variable.forEach(variable => {
        variable.name = replaceName(variable.name);
    });
    project.scene.forEach(scene => {
        scene.variable.forEach(variable => {
            variable.name = replaceName(variable.name);
        });
        scene.block.forEach(block => {
            if (block.type == BlockType.Normal) {
                let data: BlockNormal = block.data;
                data.content.forEach(content => {
                    if (content.type == CommandType.ShowVariableContent) {
                        let body: CommandContentNameTarget = content.content as CommandContentNameTarget;
                        body.name = replaceName(body.name);
                    }
                });
            } else if (block.type == BlockType.Calculator) {
                let data: BlockCalculator = block.data;
                data.variable.forEach(variable => {
                    variable.name = replaceName(variable.name);
                });
                data.code.forEach(code => {
                    if (code.type == CalculatorType.Calc) {
                        let data: CalculatorCalcData = code.data as CalculatorCalcData;
                        data.line = replaceName(data.line);
                    } else if (code.type == CalculatorType.Continue || code.type == CalculatorType.Elseif || code.type == CalculatorType.If || code.type == CalculatorType.Break) {
                        let data: CalculatorContinueData = code.data as CalculatorContinueData;
                        data.condition = replaceName(data.condition);
                    } else if (code.type == CalculatorType.VarNew || code.type == CalculatorType.VarDel) {
                        let data: CalculatorVarDelData = code.data as CalculatorVarDelData;
                        data.name = replaceName(data.name);
                    } else if (code.type == CalculatorType.While) {
                        let data: CalculatorWhileData = code.data as CalculatorWhileData;
                        data.init = replaceName(data.init);
                        data.condition = replaceName(data.condition);
                        data.loop = replaceName(data.loop);
                    }
                });
            } else if (block.type == BlockType.Menu) {
                let data: BlockMenu = block.data;
                data.visibleCondition.forEach(condition => {
                    condition.condition.forEach(v => {
                        v.content = replaceName(v.content);
                    });
                });
            }
            block.next.forEach(next => {
                next.condition.forEach(condition => {
                    condition.content = replaceName(condition.content);
                });
            });
        });
    });
    return project;
};
function mapAnimation(content: CommandContentImageAnimation | CommandContentChangeImageAnimation): void {
    content.animation.forEach(anim => {
        console.log(`\t映射图像 ${anim.source}`);
        anim.source = replaceUrl(anim.source);
        console.log(`\t\t->${anim.source}`);
    });
}
