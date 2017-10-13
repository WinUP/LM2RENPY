import * as Path from 'path';
import * as File from 'fs';
import * as _ from 'lodash';

import * as Utilities from './Utilities';
import * as GS from './include/GeneralScript';
import * as Renpy from './include/Renpy';
import * as Mapper from './RenpyMapper';

let cgList = {
    "images/CG/Opening celemony/Opening celemony 3.png": "lm_gallery_8311E1236AED463A9358E6303D1D2F5C",
    "images/CG/Opening celemony/Opening celemony 4.png": "lm_gallery_84E3A40E55C74C5C9B705CF5E3FE58A1",
    "images/CG/Opening celemony/Opening celemony 5.png": "lm_gallery_87A38905C919455BB6D35DB596394AC9",
    "images/CG/Opening celemony/Opening celemony 6.png": "lm_gallery_691F32B0298245DE8278009B3F9589BE",
    "images/CG/Tomo+Shinobu.png": "lm_gallery_03C9EB10B8D14965A3E4A9225ACC9C39",
    "images/CG/Let-us-sumo-together/Let-us-sumo-together 1.png": "lm_gallery_D8229CDD6C214636928DC6C6FCFCA4FB",
    "images/CG/Let-us-sumo-together/Let-us-sumo-together 3.png": "lm_gallery_9ACE399648824FD884F39266417CDDBD",
    "images/CG/Let-us-sumo-together/Let-us-sumo-together 5.png": "lm_gallery_1C9982B11CB6440DBBEE2B161A425C30",
    "images/CG/Let-us-sumo-together/Let-us-sumo-together 6.png": "lm_gallery_5BAF87FE15234238AB0865FE6CEABB74",
    "images/CG/Let-us-sumo-together/Let-us-sumo-together 11.png": "lm_gallery_18A77FEE59614E49AA0660833A369388",
    "images/CG/Let-us-sumo-together/Let-us-sumo-together 8.png": "lm_gallery_83F732F048574A3294F4B648F4D0DFC8",
    "images/CG/Let-us-sumo-together/Let-us-sumo-together 9.png": "lm_gallery_EAE467ED476446099F36A59024BEB550",
    "images/CG/Tsubasas-Cantabile/Tsubasas-Cantabile 1.png": "lm_gallery_1DF1A98336DB4A81BE40028C743F7DF8",
    "images/CG/Tsubasas-Cantabile/Tsubasas-Cantabile 2.png": "lm_gallery_DF4B118410C548ADBD1EA7899F30BCCF",
    "images/CG/Tsubasas-Cantabile/Tsubasas-Cantabile 3.png": "lm_gallery_2F3A55DB5E7D426AA2695C5D1B97A040",
    "images/CG/Tsubasas-Cantabile/Tsubasas-Cantabile 4.png": "lm_gallery_361696A1939D46CEBF91C8115642936C",
    "images/CG/Tsubasas-Cantabile/Tsubasas-Cantabile 5.png": "lm_gallery_BB15BC7CC853407495EB41EE25D1EFAD",
    "images/CG/Tsubasas-Cantabile/Tsubasas-Cantabile 6.png": "lm_gallery_A1E7CA7F049F49908469DC30E836FCEF",
    "images/CG/Tsubasas-Cantabile/Tsubasas-Cantabile 7.png": "lm_gallery_2B9BE937603E4E96969F3C4CE130A6F5",
    "images/CG/Tsubasas-Cantabile/Tsubasas-Cantabile 8.png": "lm_gallery_689A15BAED4D45EAA7879993C605248F",
    "images/CG/Seeking-for-stimulation-finally/Seeking-for-stimulation-finally 1.png": "lm_gallery_18084E9C14F5421BBBB3CA4F07A82DC8",
    "images/CG/Seeking-for-stimulation-finally/Seeking-for-stimulation-finally 2.png": "lm_gallery_CCAF353B743A4E13A7A43D3F8AF8D694",
    "images/CG/Seeking-for-stimulation-finally/Seeking-for-stimulation-finally 4.png": "lm_gallery_287157BDD64B4E528AFF869F71BDA5A9",
    "images/CG/Seeking-for-stimulation-finally/Seeking-for-stimulation-finally 6.png": "lm_gallery_68F095DA988D4FBD93381898FF8260F4",
    "images/CG/Seeking-for-stimulation-finally/Seeking-for-stimulation-finally 7.png": "lm_gallery_85CAF3695FEF4F89962FCAB11752108F",
    "images/CG/Inconceivable-story-of-wong-mew/Inconceivable-story-of-wong-mew 1.png": "lm_gallery_7B83AD9CA240425EA3A9E06C0D24BF7B",
    "images/CG/Inconceivable-story-of-wong-mew/Inconceivable-story-of-wong-mew 10.png": "lm_gallery_B4FB83ADF72E4DEDA77384FEB0F94E44",
    "images/CG/Inconceivable-story-of-wong-mew/Inconceivable-story-of-wong-mew 2.png": "lm_gallery_9363768CD32C4FE78E30EB697E142B70",
    "images/CG/Inconceivable-story-of-wong-mew/Inconceivable-story-of-wong-mew 3.png": "lm_gallery_D704FBCAA179433EB76BAC3007A3C241",
    "images/CG/Inconceivable-story-of-wong-mew/Inconceivable-story-of-wong-mew 4.png": "lm_gallery_5E80ED9C3E1F4920A274B420F13A4D82",
    "images/CG/Inconceivable-story-of-wong-mew/Inconceivable-story-of-wong-mew 5-3.png": "lm_gallery_C7F946EF0FB14A6A9ED6F7A9D18C5E2B",
    "images/CG/Inconceivable-story-of-wong-mew/Inconceivable-story-of-wong-mew 6.png": "lm_gallery_A222B7CC30A245E0AB1F1A5B1FC13CC5",
    "images/CG/Inconceivable-story-of-wong-mew/Inconceivable-story-of-wong-mew 7.png": "lm_gallery_BB4914B9F99F4B449F1BD45034C67186",
    "images/CG/Inconceivable-story-of-wong-mew/Inconceivable-story-of-wong-mew 8.png": "lm_gallery_A438304BAD244787B1FCBDEB053ED1B2",
    "images/CG/Inconceivable-story-of-wong-mew/Inconceivable-story-of-wong-mew 9.png": "lm_gallery_ADFD6891D3AF42CA8301DDC64AE2F5D7",
    "images/CG/Inconceivable-story-of-wong-mew/Inconceivable-story-of-wong-mew 9-1.png": "lm_gallery_0F106B8E35274818A2D1764D5EC4CEFF",
    "images/CG/Prelife-memory/Prelife-memory 1.png": "lm_gallery_CEDACC94A9174ACEBB28422618EB83AD",
    "images/CG/Prelife-memory/Prelife-memory 2.png": "lm_gallery_709A0F8E88FC4927B3F2872F13C17FA7",
    "images/CG/Prelife-memory/Prelife-memory 3.png": "lm_gallery_D9D9BBF18FFA4E278F5E7FF9A7D00AF2",
    "images/CG/Prelife-memory/Prelife-memory 4.png": "lm_gallery_7C1396F883A044398410DB50945F5D1D",
    "images/CG/Prelife-memory/Prelife-memory 5.png": "lm_gallery_AC590944081A4E0C9EC81899E9209C85",
    "images/CG/Prelife-memory/Prelife-memory 6.png": "lm_gallery_F7C5F4C539224DA08E60CF859D14D0B7",
    "images/CG/Prelife-memory/Prelife-memory 7.png": "lm_gallery_E05FE25C588740B4A48960064ACFC99B",
    "images/CG/Parallel-boats/Parallel-boats 1.png": "lm_gallery_C5CDC0061BA04DD3AD28D4ABCC1A8876",
    "images/CG/Parallel-boats/Parallel-boats 2.png": "lm_gallery_0FD0B77AE6184E9E8876D49DA2E6D501",
    "images/CG/Parallel-boats/Parallel-boats 3.png": "lm_gallery_38144AA40B6D4C3B8F05376BD7FBBF73",
    "images/CG/Parallel-boats/Parallel-boats 3-1.png": "lm_gallery_1AF095ACDA634CDB97AA0E1F9C729EAB",
    "images/CG/Parallel-boats/Parallel-boats 4.png": "lm_gallery_A591B65F951C4384B441DD43899ACCFB",
    "images/CG/Parallel-boats/Parallel-boats 5.png": "lm_gallery_84F29D2D29E0455A8600FFB3594BAF7F",
    "images/CG/Parallel-boats/Parallel-boats 5-1.png": "lm_gallery_0E19376156254FCF92845E2C1706AA05",
    "images/CG/Parallel-boats/Parallel-boats 6.png": "lm_gallery_9593E8C30A6D41789E064CE4E2E05E2E",
    "images/CG/Parallel-boats/Parallel-boats 7.png": "lm_gallery_DE58EA8B26934BF59A0AABA095CABDBB",
    "images/CG/Parallel-boats/Parallel-boats 7-1.png": "lm_gallery_E132C3CC6E324B62A79DA01BE75B90C8",
    "images/CG/Drug-for-tsundere/Drug-for-tsundere 1.png": "lm_gallery_6A16110F14C64AA89B2FAD22D32413C7",
    "images/CG/Drug-for-tsundere/Drug-for-tsundere 2.png": "lm_gallery_821554C146A04ADF85F552B16E7C73A1",
    "images/CG/Drug-for-tsundere/Drug-for-tsundere 2-1.png": "lm_gallery_03FE1F27E00741CCAF415509C1FF7783",
    "images/CG/Drug-for-tsundere/Drug-for-tsundere 3.png": "lm_gallery_ECECD9655F024DD9ABD97ABDC960DC82",
    "images/CG/Drug-for-tsundere/Drug-for-tsundere 4.png": "lm_gallery_4D6DF38872224876B0346DDC8236880E",
    "images/CG/Drug-for-tsundere/Drug-for-tsundere 5.png": "lm_gallery_B6A08DC7BC7B43CA9586AF3377BA9930",
    "images/CG/Drug-for-tsundere/Drug-for-tsundere 6.png": "lm_gallery_3D4DEC86BCC44FEC9C0353067818153E",
    "images/CG/Drug-for-tsundere/Drug-for-tsundere 7.png": "lm_gallery_10467CBD22854ED498CC690F9E3ABF68",
    "images/CG/Drug-for-tsundere/Drug-for-tsundere 8.png": "lm_gallery_772ED68CBCDA4539B968C3D37984A791",
    "images/CG/Drug-for-tsundere/Drug-for-tsundere 9-1.png": "lm_gallery_849CEB1C756A40EC9091CD060431DA06",
    "images/CG/Run-Run-Lovers/Run-Run-Lovers 1.png": "lm_gallery_7D1E6CD76A3F4377B4251D3865FE5B7C",
    "images/CG/Run-Run-Lovers/Run-Run-Lovers 2.png": "lm_gallery_9CFDDCA65C8A45049A67D61DA2BEBB7B",
    "images/CG/Run-Run-Lovers/Run-Run-Lovers 3.png": "lm_gallery_335BF89B88F641B8B8DB66BE58875FEA",
    "images/CG/Run-Run-Lovers/Run-Run-Lovers 4.png": "lm_gallery_A3F0B5B71ACF44378505551EAB95D2D5",
    "images/CG/Run-Run-Lovers/Run-Run-Lovers 5.png": "lm_gallery_61A27D51005E46C3BB478FEE8106B863",
    "images/CG/Run-Run-Lovers/Run-Run-Lovers 6.png": "lm_gallery_1C2DDB742E8E4804A215E5C68FF7CBFE",
    "images/CG/Run-Run-Lovers/Run-Run-Lovers 7.png": "lm_gallery_CAB89628D892438290F5EEAEE6FDA3AE",
    "images/CG/Run-Run-Lovers/Run-Run-Lovers 8.png": "lm_gallery_E4328112D39C4B68A1C267CCCE49C938",
    "images/CG/I-am-none-gay-with-no-lovers/I-am-none-gay-with-no-lovers 2.png": "lm_gallery_C514C7B43BB94588B7E6F6DE0405902C",
    "images/CG/I-am-none-gay-with-no-lovers/I-am-none-gay-with-no-lovers 3.png": "lm_gallery_17EE1054E0774C6E887A51B6D6F9809F",
    "images/CG/I-am-none-gay-with-no-lovers/I-am-none-gay-with-no-lovers 4.png": "lm_gallery_B23B20310413456B97F5A62F21EB8231",
    "images/CG/I-am-none-gay-with-no-lovers/I-am-none-gay-with-no-lovers 4-1.png": "lm_gallery_1DB63445D5FA4A8F90EE59842CB17587",
    "images/CG/I-am-none-gay-with-no-lovers/I-am-none-gay-with-no-lovers 5.png": "lm_gallery_63D04BFE31F74541BAC4E3BE874F04D4",
    "images/CG/I-am-none-gay-with-no-lovers/I-am-none-gay-with-no-lovers 6-1.png": "lm_gallery_01A535C9B5DB4CB99B85DD6BAC669F41",
    "images/CG/I-am-none-gay-with-no-lovers/I-am-none-gay-with-no-lovers 6-2.png": "lm_gallery_4BE6749A7DEF47B28C893ED7AEE021E1",
    "images/CG/I-am-none-gay-with-no-lovers/I-am-none-gay-with-no-lovers 7.png": "lm_gallery_63048BA95B7241CCA1206E32EEB5617C",
    "images/CG/I-am-none-gay-with-no-lovers/I-am-none-gay-with-no-lovers 8.png": "lm_gallery_E8909DD316534842888A95088CBFE945",
    "images/CG/I-am-none-gay-with-no-lovers/I-am-none-gay-with-no-lovers 9-2.png": "lm_gallery_B5626DFE23C0455A8A9CD7A2A8AA44A0",
    "images/CG/Gratitude-payment-of-fox/Gratitude-payment-of-fox 1.png": "lm_gallery_5CF2995690BF4C87A419E7A4AD05A94D",
    "images/CG/Gratitude-payment-of-fox/Gratitude-payment-of-fox 2-1.png": "lm_gallery_3BA596B22A77484494505809CFB86D73",
    "images/CG/Gratitude-payment-of-fox/Gratitude-payment-of-fox 3.png": "lm_gallery_2B2468BBF68040D7AA817B022CDE842D",
    "images/CG/Gratitude-payment-of-fox/Gratitude-payment-of-fox 4.png": "lm_gallery_986D6DD667574B1D83ECEA3AF755AFA3",
    "images/CG/Gratitude-payment-of-fox/Gratitude-payment-of-fox 5.png": "lm_gallery_52CC474C78C944CABB132D3C2D0EA6A8",
    "images/CG/Gratitude-payment-of-fox/Gratitude-payment-of-fox 6.png": "lm_gallery_C533C9DBA54D4CAFAD4F08DA43EB9A55",
    "images/CG/Gratitude-payment-of-fox/Gratitude-payment-of-fox 7.png": "lm_gallery_9C54D280900F4385BDFF754A33B420AF",
    "images/CG/Welcomt-to-wolfs-celemony/Welcomt-to-wolfs-celemony 1.png": "lm_gallery_3B43238981B5446E810F4A35352A9D94",
    "images/CG/Welcomt-to-wolfs-celemony/Welcomt-to-wolfs-celemony 2.png": "lm_gallery_E99D8EE889324E538179D61E6C5B1FC7",
    "images/CG/Welcomt-to-wolfs-celemony/Welcomt-to-wolfs-celemony 3.png": "lm_gallery_D5131E3A10814E4FB5007D75587FC94C",
    "images/CG/Welcomt-to-wolfs-celemony/Welcomt-to-wolfs-celemony 5.png": "lm_gallery_AB1B0D4593B3493595C05D2634542B0F",
    "images/CG/Welcomt-to-wolfs-celemony/Welcomt-to-wolfs-celemony 6.png": "lm_gallery_99E537CF1D264E8A9DC364659ADA92B3",
    "images/CG/Welcomt-to-wolfs-celemony/Welcomt-to-wolfs-celemony 7.png": "lm_gallery_6416585972644DE1BFEFE64812811D22",
    "images/CG/Welcomt-to-wolfs-celemony/Welcomt-to-wolfs-celemony 8.png": "lm_gallery_95153E5DF032453584ADEE5B712511FC",
    "images/CG/Welcomt-to-wolfs-celemony/Welcomt-to-wolfs-celemony 9.png": "lm_gallery_7069267F64E54B868A5050EEF9D93A3B",
    "images/CG/Legacy-of-asynchronized-myself/Legacy-of-asynchronized-myself 1-1.png": "lm_gallery_F8ABD783506148DE8982E63A2D047172",
    "images/CG/Legacy-of-asynchronized-myself/Legacy-of-asynchronized-myself 2.png": "lm_gallery_C8A84981806B4A4DB2B6D92C97AE2032",
    "images/CG/Legacy-of-asynchronized-myself/Legacy-of-asynchronized-myself 3.png": "lm_gallery_AD7961BC76E643599E9C50754D2B16E3",
    "images/CG/Legacy-of-asynchronized-myself/Legacy-of-asynchronized-myself 4.png": "lm_gallery_B254F70E32264E79AF406C3492347538",
    "images/CG/Legacy-of-asynchronized-myself/Legacy-of-asynchronized-myself 4-1.png": "lm_gallery_8C10B311F1B241F380A70CA461F73E5E",
    "images/CG/Legacy-of-asynchronized-myself/Legacy-of-asynchronized-myself 5.png": "lm_gallery_6074209F6E654F3580E90BD8FE1A21C8",
    "images/CG/Legacy-of-asynchronized-myself/Legacy-of-asynchronized-myself 5-1.png": "lm_gallery_2D24925D8776427E806125699BD065DE",
    "images/CG/Legacy-of-asynchronized-myself/Legacy-of-asynchronized-myself 6.png": "lm_gallery_0BF98EB1ECCB4B0E884CBC033AC9F50E",
    "images/CG/Precept-of-justice/Precept-of-justice 1-1.png": "lm_gallery_E34446EB077F4A6EA9497B9B9B0733FE",
    "images/CG/Precept-of-justice/Precept-of-justice 1-5.png": "lm_gallery_08883BD8FCE34314B854783E9E919F7A",
    "images/CG/Precept-of-justice/Precept-of-justice 2-1.png": "lm_gallery_26575D16067F4A9DA889C346CBB487A8",
    "images/CG/Precept-of-justice/Precept-of-justice 3.png": "lm_gallery_54C31AC2FA71447087DF924311BF70EC",
    "images/CG/Precept-of-justice/Precept-of-justice 4.png": "lm_gallery_6BDC463AF3034115B872FE8114549896",
    "images/CG/Precept-of-justice/Precept-of-justice 4-1.png": "lm_gallery_9C8D732DF7E24E7F953E682C4348EA0A",
    "images/CG/Precept-of-justice/Precept-of-justice 4-2.png": "lm_gallery_A53B45F08CC449B5B3975CB5C5C64EF0",
    "images/CG/Precept-of-justice/Precept-of-justice 5.png": "lm_gallery_63D435C006354C2BA34CDE707A2F5EB7",
    "images/CG/Precept-of-justice/Precept-of-justice 5-1.png": "lm_gallery_8F1E01956CF44C7A87C37EDFB685642E",
    "images/CG/Join-misaki-danjiri/Join-misaki-danjiri 1.png": "lm_gallery_7E57D7A3B6704964B8907157D0B72E75",
    "images/CG/Join-misaki-danjiri/Join-misaki-danjiri 2-1.png": "lm_gallery_97433B7ED6534086BEE73738CC688FD8",
    "images/CG/Join-misaki-danjiri/Join-misaki-danjiri 3.png": "lm_gallery_A43CCBE3B95A40109DF2A73F21CB816A",
    "images/CG/Join-misaki-danjiri/Join-misaki-danjiri 4.png": "lm_gallery_8C98F73227E949DAA5A09717C8CF0B1E",
    "images/CG/Drastic-remedy-for-tsundere/Drastic-remedy-for-tsundere 1.png": "lm_gallery_78B0CFBCE4A74EB9819E36549647B400",
    "images/CG/Drastic-remedy-for-tsundere/Drastic-remedy-for-tsundere 2.png": "lm_gallery_CD0D0A6DE097468A89BF35159754AED4",
    "images/CG/Drastic-remedy-for-tsundere/Drastic-remedy-for-tsundere 3.png": "lm_gallery_8DBB09A70C0A416DAE3322BBA30B3080",
    "images/CG/Drastic-remedy-for-tsundere/Drastic-remedy-for-tsundere 4.png": "lm_gallery_F01836A52D714D4AB57BB88A94C85343",
    "images/CG/Drastic-remedy-for-tsundere/Drastic-remedy-for-tsundere 5.png": "lm_gallery_1280E1FE84AF4802A866EF6180931523",
    "images/CG/Drastic-remedy-for-tsundere/Drastic-remedy-for-tsundere 7.png": "lm_gallery_6D983F1C2CBA4EB8AE6EE83BDA57FCC1",
    "images/CG/The-inbelieveble-of-school/The-inbelieveble-of-school 1.png": "lm_gallery_1AB3B872D6C54A87BBE10747A2C3FDAD",
    "images/CG/The-inbelieveble-of-school/The-inbelieveble-of-school 1-1.png": "lm_gallery_21F6C31513A34EA8A8B2E622273CDD7F",
    "images/CG/The-inbelieveble-of-school/The-inbelieveble-of-school 2.png": "lm_gallery_B5CABC467ECD46948E0B1292E589A60D",
    "images/CG/The-inbelieveble-of-school/The-inbelieveble-of-school 2-1.png": "lm_gallery_344471F6EC6A4D92B3E3A4F9A0C4F5E8",
    "images/CG/The-inbelieveble-of-school/The-inbelieveble-of-school 3.png": "lm_gallery_4253E3A8DC4C43E586A3DDBA53A4A6AF",
    "images/CG/The-inbelieveble-of-school/The-inbelieveble-of-school 4-1.png": "lm_gallery_9C292825A57E4A5E85C7B9686E18FC48",
    "images/CG/The-inbelieveble-of-school/The-inbelieveble-of-school 5.png": "lm_gallery_E3E0C745F8D941F395EB7D2B8486A4E6",
    "images/CG/The-inbelieveble-of-school/The-inbelieveble-of-school 5-1.png": "lm_gallery_E1907497859B4E81BC4C4AEAC7E61C43",
    "images/CG/The-inbelieveble-of-school/The-inbelieveble-of-school 5-2.png": "lm_gallery_7469B14A83B44907A5986CD48A25A5EC",
    "images/CG/The-inbelieveble-of-school/The-inbelieveble-of-school 6.png": "lm_gallery_45E6DC2D2D414F33A0305654A6FC0BE9",
    "images/CG/Revolution-march/Revolution-march 1.png": "lm_gallery_48B08BE8EC9F4E278E32DF739320F0D9",
    "images/CG/Revolution-march/Revolution-march 10.png": "lm_gallery_61D8FFFC34E4460B9E6EAB78BB0388BC",
    "images/CG/Revolution-march/Revolution-march 2.png": "lm_gallery_111AB42F949B4430BA74B6ADE590935E",
    "images/CG/Revolution-march/Revolution-march 3.png": "lm_gallery_4C2D5276FCBB40F0B0DEB04A3E2EC3B5",
    "images/CG/Revolution-march/Revolution-march 4.png": "lm_gallery_4D24DED204CD42949FB326EEF358987F",
    "images/CG/Revolution-march/Revolution-march 5.png": "lm_gallery_03063425963043719D0E021E3257FDBB",
    "images/CG/Revolution-march/Revolution-march 6.png": "lm_gallery_44D20D14619C4C49BA2A44119906A340",
    "images/CG/Revolution-march/Revolution-march 7.png": "lm_gallery_4D66E39D4F0541B297D6075145C4D09A",
    "images/CG/Revolution-march/Revolution-march 8.png": "lm_gallery_67BB6AD80CAE4374A5BE1811B7D7D1D5",
    "images/CG/Revolution-march/Revolution-march 9.png": "lm_gallery_9B3BE1450BA84524B154AAD914462F24",
    "images/CG/Revolution-march/Revolution-march Concert 4.png": "lm_gallery_29E9A807D6B148168EEACEB2EA7D0A5E",
    "images/CG/Revolution-march/Revolution-march Concert 5.png": "lm_gallery_41428618BA4343D9B122066AD821CA68",
    "images/CG/Revolution-march/Revolution-march OkajimaEND 1.png": "lm_gallery_8FD417243BAF49B6840F3190C65AA4E5",
    "images/CG/Revolution-march/Revolution-march OkajimaEND 2.png": "lm_gallery_4C236CF15FAB471C978461AE1AFB0117",
    "images/CG/Revolution-march/Revolution-march OkajimaEND 3.png": "lm_gallery_C57B8F2A70644733BB36E8DA3C8F5B9A",
    "images/CG/Revolution-march/Revolution-march TomoEND 1.png": "lm_gallery_82C2A7F9AB474FB6AA0C71F77E91070C",
    "images/CG/Revolution-march/Revolution-march TomoEND 2.png": "lm_gallery_793A50EA5F1D4DD095383254ED6D5645",
    "images/Games/Yakyuken/CG/Shintaro/Yakyuken Shintaro 1.png": "lm_gallery_C93E3A8AE8DA46FA8F4E3883F10E4A0A",
    "images/Games/Yakyuken/CG/Shintaro/Yakyuken Shintaro 2.png": "lm_gallery_C8CDD0393EE8457FAB6E6746ACFC16B4",
    "images/Games/Yakyuken/CG/Shiro/Yakyuken Shiro 1.png": "lm_gallery_C66C10E625D1487C81DE82A7A6963CE1",
    "images/Games/Yakyuken/CG/Shiro/Yakyuken Shiro 2.png": "lm_gallery_05A1F8B8E2FC4BF48EEB4DCDD2746CEC",
    "images/Games/Yakyuken/CG/Shiro/Yakyuken Shiro 3.png": "lm_gallery_C1CF19D2F51147BEA158A4A080C53E8E",
    "images/Games/Yakyuken/CG/Shiro/Yakyuken Shiro 4.png": "lm_gallery_82FBA261F8B743E2B7905761A51E8130",
    "images/Games/Yakyuken/CG/Itou/Yakyuken Itou 1.png": "lm_gallery_8FE737664EDE4EC7B0E8209B406F0C83",
    "images/Games/Yakyuken/CG/Itou/Yakyuken Itou 2.png": "lm_gallery_8914D7D41D88433BA466B30E72553022",
    "images/Games/Yakyuken/CG/Itou/Yakyuken Itou 3.png": "lm_gallery_F07581615155432B859CC7C4EA5BB50A",
    "images/Games/Yakyuken/CG/Itou/Yakyuken Itou 4.png": "lm_gallery_77ADCB3F3FFE4790ACF1CFA1B370D10E",
    "images/Games/Yakyuken/CG/Tsuki/Yakyuken Tsuki 1.png": "lm_gallery_E9A663366FCD424F80AA4C9F0F50B783",
    "images/Games/Yakyuken/CG/Tsuki/Yakyuken Tsuki 2.png": "lm_gallery_F232B64B26E9462499506723A75A2478",
    "images/Games/Yakyuken/CG/Tsuki/Yakyuken Tsuki 3.png": "lm_gallery_F0B942BCF3F345D994A483AC7B298635",
    "images/Games/Yakyuken/CG/Tsuki/Yakyuken Tsuki 4.png": "lm_gallery_7807C68AFE0D45CA9679A08B5635D87F",
    "images/Games/Yakyuken/CG/Shinobu/Yakyuken Shinobu 1.png": "lm_gallery_9F56029B7C3B4A9A846CEBD0C4ABA9F6",
    "images/Games/Yakyuken/CG/Shinobu/Yakyuken Shinobu 2.png": "lm_gallery_66A4E0F049264A14B7EC2B8586906585",
    "images/Games/Yakyuken/CG/Shinobu/Yakyuken Shinobu 3.png": "lm_gallery_4FFF4D5081EF48C48C56351B30912D0D",
    "images/Games/Yakyuken/CG/Shinobu/Yakyuken Shinobu 4.png": "lm_gallery_45595CAD90274C6792ED17A5D287AC73",
    "images/Games/Yakyuken/CG/Katou/Yakyuken Katou 1.png": "lm_gallery_2ADB5978CA224AD0BEA156342BF3B5F0",
    "images/Games/Yakyuken/CG/Katou/Yakyuken Katou 2.png": "lm_gallery_723D3AF7D5734BC090560585CEA18788",
    "images/Games/Yakyuken/CG/Katou/Yakyuken Katou 3.png": "lm_gallery_AB78B916A99943F290C5E252F0284D9D",
    "images/Games/Yakyuken/CG/Katou/Yakyuken Katou 4.png": "lm_gallery_557C98C111E1428CA41D02A69E29F441",
    "images/Games/Yakyuken/CG/Izumi/Yakyuken Izumi 1.png": "lm_gallery_3EF7CB15BDBB46C7AF82217340EF373E",
    "images/Games/Yakyuken/CG/Izumi/Yakyuken Izumi 2.png": "lm_gallery_A5A554C6B21A43F2A81B32E021B450ED",
    "images/Games/Yakyuken/CG/Izumi/Yakyuken Izumi 3.png": "lm_gallery_8CCEE6A27E144B12B85D173D15807073",
    "images/Games/Yakyuken/CG/Izumi/Yakyuken Izumi 4.png": "lm_gallery_E67627BC64024DDDB7016189C04834C4",
    "images/Games/Yakyuken/CG/Matsuta/Yakyuken Matsuta 1.png": "lm_gallery_84D27BCD9A7D4F1FB7C4FE3B768FE94A",
    "images/Games/Yakyuken/CG/Matsuta/Yakyuken Matsuta 2.png": "lm_gallery_DE11F75619AE4D088BE99CB4C2F9194D",
    "images/Games/Yakyuken/CG/Matsuta/Yakyuken Matsuta 3.png": "lm_gallery_1588B519213A4B2192BA12D75A93925E",
    "images/Games/Yakyuken/CG/Matsuta/Yakyuken Matsuta 4.png": "lm_gallery_A4A48A6A524F416482A347C3E239F9E5",
    "images/CG/Pluck hair/Pluck hair 2.png": "lm_gallery_DE8A835C2AC6467EB4456D8DEFA396B3",
    "images/CG/Pluck hair/Pluck hair 3.png": "lm_gallery_B370E5346ABB47548DAE9D421086387D",
    "images/CG/Newsclub/Newsclub 1.png": "lm_gallery_267F041B536640EA86097324E1BF5809",
    "images/CG/Newsclub/Newsclub 2.png": "lm_gallery_9799A75AC32E46DBB98AC1FC4E281CC9",
    "images/CG/Newsclub/Newsclub 3.png": "lm_gallery_692431208FC84C2BBC4BFB384C5535E2",
    "images/CG/Finesse-sumo.png": "lm_gallery_1A1E430526B94BB68A38F9C6A6CE9B8C",
    "images/CG/Sports celemony.png": "lm_gallery_B4E4E5696DB74835907C35BB91F9BD19",
    "images/CG/Sports celemony win.png": "lm_gallery_85BB53EF8F764B8998C0F67FF475E7E5",
    "images/CG/Music festival.png": "lm_gallery_9188A4E4C6424BCEA833D3C87DC25D19",
    "images/CG/Music festival win.png": "lm_gallery_7AFFBEE2AA274C4C836D31E63DA4932A",
    "images/CG/Cake 2.png": "lm_gallery_8D8A506E039845CD89579B536CAB6E35",
    "images/CG/Shiro+Tsubasa-chan.png": "lm_gallery_6C20080978734302A13DBD9F5C977D8A",
    "images/CG/Kojima-dress1.png": "lm_gallery_9E2ECBA71A44401F9A87C7DF41500965",
    "images/CG/Kojima-dress2.png": "lm_gallery_ACC7BF001A154359B4A9C008A8F9B628",
    "images/CG/Bar.png": "lm_gallery_11538F8AB5634131B83013199E04FF74",
    "images/CG/The truth of Shintarou 1.png": "lm_gallery_8A9A9C995593446F8C7F1623E032EB67",
    "images/CG/The truth of Shintarou 2.png": "lm_gallery_D9FF8323B07F4CB09838C9DC0E934C20",
    "images/CG/Yuuhi quest 1.png": "lm_gallery_96F52A116B95488881F36C7B55C08BD0",
    "images/CG/Yuuhi quest 2.png": "lm_gallery_B6DB788D29BB4DFCBACCD696EA1D68EC",
    "images/CG/Yuuhi 1.png": "lm_gallery_3D10951C06114AB5A589638B31BA9888",
    "images/CG/Photo 2.png": "lm_gallery_3B270FDC9BBD4F209FD7C52684B74402",
    "images/CG/Photo 3.png": "lm_gallery_C95DA2C7DAF24261815104970FA26629",
    "images/CG/Tokiwa+Kyubi.png": "lm_gallery_9AB5FF9008204534A8731A5EAC18119E",
    "images/CG/Itou+Kimura.png": "lm_gallery_BB04FC5B2E1E42B7B836B5E2E24DAB6A",
    "images/CG/Cave caught.png": "lm_gallery_D8781686D9AC4CE7B6A0E90C3986C44F"
};

let characters = {
    "森海友·一之濑翼·木村树·伊藤圭·小岛正": "character_FB375250827B468FA619E1D3332B4A49", 
    "森海友·赤峰空·一之濑翼": "character_EB879D7D60FC4A6F81E9929068C219C9", 
    "森海友·穗海作哉": "character_1BE103360555438B982B3FE16BEEA9B7", 
    "森海友·赤峰空": "character_FC590372ABEA4B2DB613EB37C7431D8F", 
    "森海友·加藤准太": "character_F4EBC870950B4ECB9D3172337247DDB6", 
    "森海友·绫濑忍": "character_F1C067067E994ED3BCDD495F5672C057", 
    "森海友·木村树": "character_89BE185C40B74C9493F351B088D0B14A", 
    "森海友·猫山四朗": "character_D80E77F720B2427988CBE8B3C9D410B6", 
    "森海友·赤峰月": "character_5778A3FC85BD414A91022DAFC9C7F95D", 
    "森海友·猫山三朗": "character_8F9081163913432EB0C4E92F3BEF33B2", 
    "森海友·奥村慎太郎": "character_48C87300BA9F472EA8F61CA13F1DFFD5", 
    "奥村慎太郎·一之濑翼": "character_FF2E3DBE295344879BB383D26ED7A102", 
    "奥村慎太郎·绫濑忍": "character_60FBFC97833040B3BF48BD546EA2D21A", 
    "奥村慎太郎·猫山三朗": "character_886E291C8DC04AB1B525662B832D7060", 
    "一之濑翼·木村树·伊藤圭": "character_4903091269AF456488423DC58FCC835B", 
    "一之濑翼·赤峰空": "character_C962C7D868EF49FA875EEB266F26A5C4", 
    "一之濑翼·绫濑忍": "character_0F381D4042604DB2A1BAAC0800F3E470", 
    "一之濑翼·穗海作哉": "character_46F0679EE95E48568201725B3132034D", 
    "一之濑翼·奥村慎太郎": "character_C1ACC3B6DA2E4D77A7242D91DCA27283", 
    "一之濑翼·森海友": "character_ED1BD69F10ED4298A05B14B1668B0EB7", 
    "绫濑忍·森海友": "character_F130CE49811847FA8AFF600298EF0B0B", 
    "绫濑忍·赤峰月": "character_F4678D5706C742BA96F1E20AB7DE7533", 
    "绫濑忍·一之濑翼": "character_234CBC1ABA48426594E384533790446E", 
    "赤峰月·绫濑忍·赤峰空": "character_2223ED4668654AA2AE861510D4535B3E", 
    "赤峰月·赤峰空": "character_A32914C83F8745A099DE22449E5941AE", 
    "赤峰空·赤峰月": "character_EEA1CA52E6404C2AA0CB73E1B0E12103", 
    "赤峰空·奥村慎太郎·赤峰月": "character_92001BEAF7024CEDBA04DFABA92C4492", 
    "猫山三朗·森海友": "character_ADB13DD2A2244080B91BCE3D35AFCD13", 
    "猫山三朗·穗海作哉": "character_EC1184FBDE194BBD9DECE46FE8E2DD71", 
    "穗海作哉·赤峰月": "character_159CBE577F7E422985E9E983AEE25B7C", 
    "榊雪绪·穗海作哉·猫山四朗": "character_B7ECE5AD288B459883B82D1F06F4B087", 
    "榊雪绪·猫山四朗": "character_F76C2A1825E64065AD041D465B08DCAA", 
    "松田健治·穗海作哉": "character_03CB133AA1834AAFA7075AEB16FE5212", 
    "松田健治·加藤准太·伊藤圭": "character_BF07BEFF8E95442F89E191BE67F83702", 
    "松田健治·加藤准太·森海友·木村树": "character_4F59DB59883E478FA3D0839D9427066E", 
    "松田健治·加藤准太": "character_88002A97E8CB44D78B605C4B095D964E", 
    "小岛正·奥村慎太郎": "character_C145223964D04EC5A145BB47CBECBF61", 
    "木村树·伊藤圭": "character_77528548B464465E82FB9B8146BC7C9D", 
    "尤西·世依木守": "character_3965BDE17893498093B24178661EA9A8", 
    "尤西·森海友": "character_372FB31E05204C1897E8367C4AA29C7E", 
    "加藤准太·森海友": "character_963F470D629843FF97977BEB54E32799", 
    "加藤准太·赤峰空·森海友": "character_A35B2993D3714C0DA76951758176AD79", 
    "绫濑忍·清武一": "character_E65485223B5C41B3829F0303B0A83C39", 
    "佐藤光·冈岛直弥": "character_48BFDB4EEBC4487DB68BAE409304EF1C", 
    "妖怪A·一之濑翼": "character_89E57E5C1A124C7F979D78FE89D71C44", 
    "天使·翼·恶魔": "character_9F360193837844688F01577B885DDEEF",
    "天使·恶魔": "character_53BE345923AC4483B6B24F68F87E09C3",
    "学生A·学生B": "character_E30D1225839D41EAA6DF1FE801A58C19",
    "森海友 ": "character_C05C3819A53D452F992F33E8EEB8F2FC", 
    "森海友": "character_C05C3819A53D452F992F33E8EEB8F2FC", 
    "绫濑忍": "character_5687B1A59A1C4F729E4D5A9208C4BA98", 
    "加藤准太": "character_A25F4320D02B4AA486CAFA0DD5FFA738", 
    "小翼（作哉）": "character_266FFBE393DD49E5A47860AF08E61DAD",
    "小翼": "character_D2532D1C4C594F1F90C6D0C11BE6159A",
    "一之濑翼": "character_B2D74048419448B09660A611D97F1E82", 
    "翼（旁白）": "character_E7A9BBC6EC14464FAA3AC8EA045127F8", 
    "穗海作哉": "character_5C230B5A31C643C78DEF022AFCF45094", 
    "奥村慎太郎": "character_4E46697CDCE94E71B71AF11BC1CE1E8E", 
    "松田健治": "character_3F6A1F9EFB8648378161A0775D42FDBC",
    "猫山三朗": "character_2E9EBF36D67342639F170C5692FC1CFF", 
    "三郎": "character_2E9EBF36D67342639F170C5692FC1CFF",
    "猫山": "character_74EE3AB975E54217AAE0812DB4B71EC6",
    "木村树": "character_EB934999CE01407BBA53A8CD45209D81",
    "村": "character_EB934999CE01407BBA53A8CD45209D81",
    "赤峰月": "character_92EFF5BA3CF44591A203BF3C3BC72C44", 
    "赤峰空": "character_CF55DE7A717B48FDB9F1EE71F7F261EE", 
    "冈岛直弥": "character_EAB1790B08114347A54241CDAD9F2DE5", 
    "小岛正": "character_6E794509EFD54827B5ECFCC27CCF6981", 
    "泉翔": "character_561D5DAEA5D24670BFF9FD8EDC987463", 
    "伊藤圭": "character_DDD1E80A3D514825A12D845EE4A104D5", 
    "佐藤光": "character_D4B1716CD3374216A2B87C22DC454CF6", 
    "常磐进": "character_9606E3445977422F9EDB99F2C26648E6",
    "诹访部翔银时": "character_C1A999F730EF4F8DAB6472B20BB6C3DD", 
    "猫山四朗": "character_2C99E63253B4442B9DCAEB50674CE201", 
    "榊雪绪": "character_05BCD086EDA545A889E1C8E6D9B427A4", 
    "世依木守": "character_240869D5F47A4787943171108EFBC8FC", 
    "清武一 ": "character_32175124DB6C4404860AD228A210FB62", 
    "清武一": "character_32175124DB6C4404860AD228A210FB62", 
    "中山花音": "character_9289AB9259B545ED927B22FEEA558CE5", 
    "冈岛雄介": "character_770767BB2E8C4540B0474E9903B83960", 
    "天使": "character_B71C9519FCE043AC9EB70587F3CDECD8", 
    "恶魔": "character_E236702BA9904A51ACA932D98E4C4CE1", 
    "诹访部翔平": "character_5998DE10C4184DF8B0D74F340969E5F3", 
    "中山紫音": "character_1E72E7013DF4471AA7E5CA6179453166",
    "逆濑荒哉": "character_C54DEF8C0ABD48EA96F92BBFB89257A8",
    "尤西": "character_27181D770C2D407993CFB29D9DEF41C4",
    "朔": "character_9AC5AF54BC524A8D86C15B15FBF0A69C",
    "晦": "character_03CF7D22C07B4DFE8B0FBA1C1D77E8FC",
    "疑似暗黑小熊猫A": "character_FCBCEA10416443A08EEB907C44FF5EE1",
    "疑似暗黑小熊猫B": "character_1E12E884157A4B72BB4239DD47034B84",
    "广播": "character_837679EFF51044BA90E070631A37C141",
    "小林·南": "character_BDBFAEE5F67D4C7485B2BC4A9337A187",
    "南": "character_3567DCA7B276411E84B6C9561EDE3305",
    "小林": "character_A98246B5CCD54766A46A0686FC36BF17",
    "暗黑小熊猫A": "character_B70D2CE981474FB695790445D86D90EAF",
    "暗黑小熊猫B": "character_949C5D39C7A5448D9C630FBFB57F58E5",
    "暗黑小熊猫": "character_4048B4B4DE934B109BDEF8A9D4EEE84F",
    "暗黑小熊猫们": "character_BA067474209A4C829056D606995A3087",
    "导游": "character_7501522528C9477FB334261ADD54C99E",
    "滑子": "character_AC29B1CD9C5B454D97074A3E0262CABC",
    "校长": "character_4A8130BD43F94836B3A98FBFDC496573",
    "大家": "character_30AF57F8EB584DF19BA60A0928B5AB6C",
    "图书管理员": "character_5030D686289B42A8AA0E50904D1636AC",
    "触手A": "character_AB3C8526383D4E09A72240A64B729D3A",
    "触手B": "character_354AB3FF956E474CABBBA84B15E08D21",
    "触手": "character_6B0EFDD22D904AEC9AE99F5CE547C288",
    "店员": "character_560653756C534F998C28D120149E2689",
    "猫": "character_AC1BCCFD722D437B8EE49F133D06C652",
    "杉本·陆田": "character_9591108661F74785A2704EA658C54576",
    "陆田": "character_565C1A162D8A42F9802540F6AEC679CE",
    "杉本": "character_949827E343804CDCB743A1F508595A1D",
    "店长": "character_24B4171C8DF14FDB80B705CD761785BB",
    "贝—": "character_1FE20B5C80FD4E0AAA60EED9F2C10D3B",
    "黑—": "character_042BA8C05D3B4A688877510F4A35DD27",
    "宫—": "character_73033DA49B4F4B9FA3E795C054DF41D1",
    "学弟A": "character_11E175FDFDEB41F4A471666EC0C36CEB",
    "学弟B": "character_C9AFD6A620184400A73DFC7C24A24416",
    "学生A": "character_81EF506961F5437C9A84AE0155EE4EB7",
    "学生B": "character_3199F036B48E46DAA612A85337EAA434",
    "雪绪·九尾": "character_F69CAB1595A14CFFB81FC8A5FFEA9B28",
    "九尾": "character_54AE4B9FDBD8411EB4726AB42420A057",
    "大龄男性": "character_4890B87B817B465F9D361751FBE0DB82",
    "教练": "character_EF74EC0B59A74E189853866DE5F72DED",
    "工作人员": "character_A83E987211F14BC8B43115779DAE4AC6",
    "剑道部部员A": "character_63AE54D17F5441909896053D07A9AADB",
    "剑道部部员B": "character_CA5D3959E07B4F20AED7D4229138D28C",
    "剑道部部员": "character_70594E7F1AAF45529C461665503A81DE",
    "救生员": "character_D926B2C9139C43789010E2BE66CDD9F8",
    "忍的妈妈": "character_E93C09D76478411193AA519C94A86534",
    "由实阿姨": "character_322CD008CBD24329A57AB154C21457EE",
    "男学生A": "character_8487CD7150404BC38D9C0D017F2A27B4",
    "男学生B": "character_18EBB62885FA47A49F4B136F7473553D",
    "女生A": "character_6B01F89E720F4A7E973CADF836B63863",
    "女生B": "character_61BDDF4E612148E09CBA86D443DD2631",
    "女生C": "character_BCD7E4990E0347FD91E66BCAC31BE6D2",
    "女老师": "character_2BE299C29D4F426282B8007E6DD0D577",
    "中年大叔": "character_01A865C41A664A03AF94C623BAD2C668",
    "学生": "character_12CF2580DFD74B92B8BFDED1A438FD10",
    "副班主任": "character_B9A84C5EEAC74BEABC2CE4498949789F",
    "乘务员": "character_47DA72DB39694F95BD7026F5B90C988B",
    "参拜者": "character_41A0AB0650814250999932597629B397",
    "森海友的母亲": "character_9F2520F8C2B0450B9E40EB5E214EFAAE",
    "慎太郎之母": "character_40C8EE6F1DE3434F8170E1B6AF414FAE",
    "旁白": "character_D031E7240DBB4FB8B4DC0EB6058B673A",
    "章鱼章鱼星人": "character_00488CC680AE4A5A8664586546224D26",
    "慎太郎（乌贼乌贼星人）": "character_85FDFD09618448329396A83DBA9AD46A",
    "乌贼乌贼星人": "character_D3C6AB81F4534522B3811DAD9CE49BFE",
    "其他乌贼乌贼星人": "character_76510132A5EA4110A52B01235D5CB567",
    "民众": "character_A6DD6590E364433B9D23FE6E9702A2B3",
    "观众": "character_D4219484B1564069AFC186D10A1F1A0C",
    "忍（主人公）": "character_28756F4F098C43C8868A7C5E6F5C79E4",
    "主人公": "character_D070C01F8B224F20AB85A72AF5EA4159",
    "森海友（陨石）": "character_755076138FD147AF8FAD4D77CA9FB2DB",
    "月（父亲）": "character_9D7BBC5F5ACD4AB594453ECADBE19A1C",
    "父亲": "character_C41C7AF512384D35888BF931074BC9D5",
    "空（兄弟A）": "character_F256AA133E3245DF98CD8304D397E232",
    "三朗（兄弟B）": "character_FB25C5F407C2468AAB7936176DC67217",
    "作哉（母亲）": "character_63ECDAC432954D25A1133541C392843D",
    "母亲": "character_16A43B3542B048E7B11A7561BCEE8D2C",
    "陨石": "character_1A0A4A2DDF7A4258B1E7F3A3E947E5DF",
    "不良A": "character_58C453010A95441F89428B3B0FC6769F",
    "不良B": "character_239B8B8550F4463CA6F8EB95AD7D2B40",
    "不良C": "character_0545781607F94AB19318F9DEFE6F23FEF",
    "师父": "character_3EC0EF09173548729337A6B44E572090",
    "男": "character_CD9CDF8CAA474951B41D290F039F7B1E",
    "吹奏乐部部员A": "character_4954256745384090AA74AF328C2DCA1C",
    "吹奏乐部部员B": "character_D90D5D59A4B54CDBB882334D25807CF4",
    "吹奏乐部部员C": "character_64055A9FD78C48F2BD1A5EF700620544",
    "吹奏乐部顾问": "character_4A413F9DB9AC436C8F019E514FEE1C6B",
    "龙套妖怪们": "character_0F54C1AC95134B9C83A3A2465951674A",
    "龙套妖怪A": "character_0F54C1AC95134B9C83A3A2465951674A",
    "龙套妖怪B": "character_0DAB3F029B3949F498C06CE019736917",
    "龙套妖怪C": "character_B3E8E2FCA0084D258DDF8C24E5A5EB52",
    "龙套妖怪D": "character_986D13B0F9E5428A885F41BDEE8AA7FC",
    "龙套妖怪E": "character_9936EE8CCCE34512B99A64948CD37DC5",
    "龙套妖怪F": "character_A059D37227E74406968A11154DA49703",
    "龙套妖怪G": "character_4729132873C94E42B69ABF478369B2B7",
    "妖怪A（领导）": "character_EA7EFC0EF6584E04B2C5AAF52A80E55A",
    "妖怪A": "character_087659EA75B5488EA4A23F0515076CEA",
    "妖怪B（策士）": "character_01C776EB22014581A9532E14B40AE795",
    "妖怪B": "character_5E15EBFCC0C544B9B3F88F83A5AB6E37",
    "妖怪C（无口）": "character_8EC4329DEB4D4BA586D34D1528A631B5",
    "妖怪C": "character_277A5B99320F4960B0BA2ED5517EDC74",
    "信纸": "character_33377E9B585948848173A0020689D0B3",
    "同学A♂": "character_BEB410896CB74798B8380EE00ED7CEC5",
    "同学B♂": "character_2318ABB2FEDC474A9A2CDED3F009DC57",
    "同学A♀": "character_279366B9E730452A872AD0A2FB5920E9",
    "布偶A·B": "character_1F1153FD452B4BD7B92BBCE60B817742",
    "布偶A": "character_CEF3C77218424F24A2DB147988D32DD4",
    "布偶B": "character_B77E1270E2BB4C51B0644A8B5FFA6B4D",
    "可疑的和尚A": "character_9E800114A84B4C5D997E92D8DFAC55DA",
    "可疑的和尚B": "character_BD992A058C1644BFAC28EBB292010999",
    "可疑的和尚C": "character_6504704D9B8C455C82F5846A9E509885",
    "可疑的和尚们": "character_DAC094FE63BC495D8871263D82389325",
    "可疑的师父": "character_7F862BEF689344B28A76499839FDDF12",
    "可疑的一帮人": "character_A7D263F259364869B03B8CAB33D49DD9",
    "某工薪男": "character_F2F882E131644022B5F67DD52954BC17",
    "和尚": "character_74B89E4FD80547519C96806BBD510C3B",
    "司机": "character_10B4DCEAD0FA4D539F45B95FD25B6C7F",
    "老师": "character_D6B011BEFE6F4890835691CD82AC2E53",
    "A": "character_8A61F14A548B4F8E8AD255F394B88D9B",
    "B": "character_CCD3CFBD37194A34B36410CA3C368200",
    "？？？": "character_9811F37F81E540F2903E0EB0C6941072",
    "未知来源的声音": "character_E3FBA5150C9C4CB68250475C1FF1B665",
    "迷之人物": "character_C864489FEF7E4629A77AF1B78E071474"
};

/**
 * 表示一个Ren'Py脚本文件
 */
class RenpyFile {
    /**
     * 全局存储路径
     */
    public static basePath: string = null;
    private _line: string[] = new Array<string>();
    private _indent: number = 0;
    private whileLabel: string[] = new Array<string>();
    private soundChannel: string[] = new Array<string>();

    /**
     * 生成一个Ren'Py脚本文件
     * @param name 文件名称（相对于全局目录的名称或路径，不含扩展名）
     */
    public constructor(private name: string) { }

    /**
     * 设置缩进值，或在不提供值的情况下将当前所进累加1
     */
    public indent(target: number = -1): void {
        if (target > -1)
            this._indent = target;
        else
            this._indent++;
    }

    /**
     * 移除一次缩进
     */
    public unindent(): void {
        if (this._indent == 0) throw '缩进不能为负值';
        this._indent--;
    }

    /**
     * 添加一行新代码
     * @param content 代码内容
     */
    public line(content?: string): void {
        if (!Utilities.isValueAvailable(content)) {
            this._line.push('');
            return;
        }
        let spaceCount = this._indent * 4;
        let result: string = '';
        for(let i = 0;i < spaceCount; i++)
            result += ' ';
        this._line.push(result + content);
    }

    /**
     * 添加一行python代码
     * @param code 代码内容
     */
    public python(code: string): void {
        this.line(`$ ${code}`);
    }

    /**
     * 在无缩进的情况下添加一个初始化标记
     * @param priority 该标记的优先级
     */
    public init(priority?: number): void {
        if (Utilities.isValueAvailable(priority))
            this._line.push(`init ${priority}:`);
        else
            this._line.push('init:');
    }

    /**
     * 在无缩进的情况下添加一个Python初始化标记
     * @param priority 该标记的优先级
     */
    public pythonInit(priority?: number): void {
        if (Utilities.isValueAvailable(priority))
        this._line.push(`init ${priority} python:`);
        else
            this._line.push('init python:');
    }

    /**
     * 添加一个标签
     * @param name 标签名称
     * @param useIndent 是否使用缩进（默认为否）
     */
    public label(name: string, useIndent: boolean = false): void {
        if (useIndent)
            this.line(`label lmn_${name}:`);
        else
            this._line.push(`label lmn_${name}:`);
    } 

    /**
     * 插入一个python代码块
     */
    public pythonBlock(): void {
        this.line('python:');
    }

    /**
     * 添加一行注释
     * @param comment 注释内容
     */
    public comment(comment?: string): void {
        if (Utilities.isValueAvailable(comment))
            this.line(`# ${comment}`);
        else
            this.line('#');
    }

    /**
     * 添加一个条件选择语句
     * @param condition 条件
     */
    public if(condition: string): void {
        this.line(`if ${condition}:`);
    }

    /**
     * 添加一个Python条件选择语句
     * @param condition 条件
     */
    public pythonIf(condition: string): void {
        this.python(`if ${condition}:`);
    }

    /**
     * 添加一个额外条件选择语句
     * @param condition 条件
     */
    public elif(condition: string): void {
        this.line(`elif ${condition}:`);
    }

    /**
     * 添加一个Python额外条件选择语句
     * @param condition 条件
     */
    public pythonElif(condition: string): void {
        this.python(`elif ${condition}:`);
    }

    /**
     * 添加一个其他条件选择语句
     * @param condition 条件
     */
    public else(): void {
        this.line('else:');
    }

    /**
     * 添加一个Python其他条件选择语句
     * @param condition 条件
     */
    public pythonElse(): void {
        this.python('else:');
    }

    /**
     * 添加一个循环语句
     * @param condition 条件
     */
    public while(condition: string): void {
        let id: string = Utilities.newUUID();
        this.python(`_lmf_while_condition_${id} = True`);
        this.line(`label lmf_while_label_${id}:`);
        this.line(`while ${condition} and _lmf_while_condition_${id} == True:`);
        this.whileLabel.push(id);
    }

    /**
     * 添加一个Python循环语句
     * @param condition 条件
     */
    public pythonWhile(condition: string): void {
        this.python(`while ${condition}:`);
    }

    /**
     * 插入一个循环终止标记
     */
    public break(): void {
        if (this.whileLabel.length == 0) throw '无法终止循环，因为当前不在循环中';
        let id: string = this.whileLabel[this.whileLabel.length - 1];
        this.python(`_lmf_while_condition_${id} = False`);
        this.line(`jump lmf_while_label_${id}`);
    }

    /**
     * 插入一个Python循环终止标记
     */
    public pythonBreak(): void {
        this.python('break');
    }

    /**
     * 结束一个循环
     */
    public endWhile(): void {
        if (this.whileLabel.length == 0) throw '无法结束循环，因为当前不在循环中';
        this.whileLabel.pop();
    }

    /**
     * 插入一个循环中断标记
     */
    public continue(): void {
        if (this.whileLabel.length == 0) throw '无法跳出循环，因为当前不在循环中';
        this.line(`jump lmf_while_label_${this.whileLabel[this.whileLabel.length - 1]}`);
    }

    /**
     * 插入一个Python循环中断标记
     */
    public pythonContinue(): void {
        this.python('continue');
    }

    /**
     * 在Python代码块中定义一个变量
     * @param variable 目标变量
     */
    public defineInPythonBlock(variable: GS.Variable<any>): void {
        variable = Utilities.normalizeVariableValue(variable);
        if (variable.scope == GS.VariableScope.Static) {
            this.if(`persistent.${variable.name} == None`);
            this.indent();
            this.line(`persistent.${variable.name} = ${variable.value}`);
            this.unindent();
        } else
            this.line(`${variable.name} = ${variable.value}`);
    }

    /**
     * 定义一个变量
     * @param variable 目标变量
     */
    public defineVariable(variable: GS.Variable<any>): void {
        variable = Utilities.normalizeVariableValue(variable);
        if (variable.scope == GS.VariableScope.Static) {
            this.if(`persistent.${variable.name} == None`);
            this.indent();
            this.python(`persistent.${variable.name} = ${variable.value}`);
            this.unindent();
        } else
            this.python(`${variable.name} = ${variable.value}`);
    }

    /**
     * 定义一个常量
     * @param name 常量名称
     * @param value 常量值
     */
    public define(name: string, value: string): void {
        this.line(`define ${name} = ${value}`);
    }

    /**
     * 在Python代码块中将一个变量的值设置为None
     * @param variable 目标变量
     */
    public undefineInPythonBlock(variable: GS.Variable<any>): void {
        variable = Utilities.normalizeVariableValue(variable);
        if (variable.scope == GS.VariableScope.Static)
            this.line(`persistent.${variable.name} = None`);
        else
            this.line(`${variable.name} = None`);
    }

    /**
     * 将一个变量的值设置为None
     * @param variable 目标变量
     */
    public undefine(variable: GS.Variable<any>): void {
        variable = Utilities.normalizeVariableValue(variable);
        if (variable.scope == GS.VariableScope.Static)
            this.python(`persistent.${variable.name} = None`);
        else
            this.python(`${variable.name} = None`);
    }

    /**
     * 添加一个跳转标记
     * @param target 目标标签的名称
     */
    public jump(target: string): void {
        this.line(`jump lmn_${target}`);
    }

    /**
     * 转入指定场景
     * @param target 场景名称
     */
    public call(target: string): void {
        this.line(`call ${target}`);
    }

    /**
     * 转入系统场景
     * @param name 场景类型
     */
    public systemScreen(name: GS.SystemPage): void {
        if (name == GS.SystemPage.Event)
            this.call('theater');
        else if (name == GS.SystemPage.Gallery)
            this.call('gallery');
        else if (name == GS.SystemPage.GameMenu)
            this.call('game_menu');
        else if (name == GS.SystemPage.Load)
            this.call('load');
        else if (name == GS.SystemPage.MainMenu)
            this.call('main_menu');
        else if (name == GS.SystemPage.Save)
            this.call('save');
        else if (name == GS.SystemPage.Soundtrack)
            this.call('soundtrack');
        else
            throw '找不到指定的系统场景：' + name;
    }

    /**
     * 添加一个LiveMaker图像菜单调用
     * @param items 菜单项
     * @param condition 显示条件
     * @param fadeIn 淡入时间
     * @param fadeOut 淡出时间
     * @param clickSound 点击时的音效
     * @param hoverSound 鼠标滑过时的音效
     * @param timeLimit 时间限制
     */
    public liveMenu(items: GS.BlockMenuItem[], condition: GS.BlockMenuCondition[], fadeIn?: number, fadeOut?: number, clickSound?: string, hoverSound?: string, timeLimit?: number): void {
        let usedCondition: GS.BlockMenuCondition[] = new Array<GS.BlockMenuCondition>();
        let result: string = '[';
        result += items.map((item, index) => {
            let result: string[] = new Array<string>();
            result.push(`"pos": (${item.left}, ${item.top})`);
            result.push(`"image": "${item.imagePath}"`);
            result.push(`"hover": "${item.hoverPath ? item.hoverPath : item.imagePath}"`);
            result.push(`"name": "${item.name}"`);
            if (item.previewPath)
                result.push(`"preview": (${item.previewLeft}, ${item.previewTop}, "${item.previewPath}")`);
            let cond = condition.find(v => v.choice == item.name && !usedCondition.includes(v));
            if (cond) {
                usedCondition.push(cond);
                result.push('"condition": [' + cond.condition.map(v => `{ "scope": ${v.scopeIndent}, "content": "${v.content}" }`).join(',') + ']');
            }
            return `{${result.join(',')}}`;
        }).join(', ');
        result += ']';
        this.python(`_lm_menu_item = ${result}`);
        let soundInfo: string[] = new Array<string>();
        if (hoverSound)
            soundInfo.push(`"hover": "${hoverSound}"`);
        if (clickSound)
        soundInfo.push(`"click": "${clickSound}"`);
        if (clickSound || hoverSound)
            this.python(`_lm_menu_sound = {${soundInfo.join(', ')}}`);
        else
            this.python('_lm_menu_sound = {}');
        if (fadeIn)
            this.python(`renpy.transition(Dissolve(${fadeIn}))`);
        this.line(`call screen lm_menu(_lm_menu_item, _lm_menu_sound, ${timeLimit ? timeLimit : 0})`);
        // fadeOut目前对带参数screen不起作用
        //if (fadeOut)
        //    this.line(`with Dissolve(${fadeOut})`);
        this.python('_lm_selected_value = _return["name"]');
        this.python('_lm_selected_index = _return["index"]');
    }

    /**
     * 添加一个LiveMaker输入调用
     * @param items 需要用户输入的项目
     * @param caption 标题
     */
    public lmInput(items: GS.Input[], caption: string): void {
        let itemPrompt = items.map(v => `"${v.title}"`).join(', ');
        let itemTarget = items.map(v => v.targetVariable).join(', ');
        this.python(`_lm_input_result = lm_input("${caption}", [${itemPrompt}], [${itemTarget}])`);
        for (let i = 0; i < items.length; i++)
            this.python(`${items[i].targetVariable} = _lm_input_result[${i}]`);
    }

    /**
     * 插入一个LiveMaker选择调用
     * @param items 选项
     * @param hoverSound 鼠标滑过时的音效
     * @param clickSound 点击时的音效
     * @param timeLimit 时间限制
     */
    public lmChoice(items: GS.Choice[], hoverSound?: string, clickSound?: string, timeLimit?: number): void {
        let itemTitle = items.map(v => `"${v.title}"`).join(', ');
        this.python(`_lm_choice_item = [${itemTitle}]`);
        let soundInfo: string[] = new Array<string>();
        if (hoverSound)
            soundInfo.push(`"hover": "${hoverSound}"`);
        if (clickSound)
        soundInfo.push(`"click": "${clickSound}"`);
        if (clickSound || hoverSound)
            this.python(`_lm_choice_sound = {${soundInfo.join(', ')}}`);
        else
            this.python('_lm_choice_sound = {}');
        this.line(`call screen lm_choice(_lm_choice_item, _lm_choice_sound, ${timeLimit ? timeLimit : 0})`);
        this.python('_lm_selected_value = _return');
    }

    /**
     * 插入一个图像动画
     * @param item 动画对象
     */
    public animation(item: GS.Animation): string {
        let name = this.defineImage(item.name, item.source, true, item.horizontalReverse, item.verticalReverse);
        this.show(name, true);
        this.indent();
        this.line(`xanchor ${item.center.x}`);
        this.line(`yanchor ${item.center.y}`);
        this.line(`xpos ${item.location.start.x}`);
        this.line(`ypos ${item.location.start.y}`);
        if (item.rotate.start != 0)
            this.line(`rotate ${item.rotate.start}`);
        if (item.zoom.xStart != 1)
            this.line(`xzoom ${item.zoom.xStart}`);
        if (item.zoom.yStart != 1)
            this.line(`yzoom ${item.zoom.yStart}`);
        if (item.startTime > 0) {
            this.line('alpha 0');
            this.pause(item.startTime);
        }
        this.line(`alpha ${1.0 - item.alpha.start / 255}`);
        if (item.location.start.x != item.location.end.x) {;
            this.line('parallel:');
            this.indent();
            this.line(`${this.findAnimationEase(item.location.xEase)} ${item.period} xpos ${item.location.end.x}`);
            this.unindent();
        }
        if (item.location.start.y != item.location.end.y) {
            this.line('parallel:');
            this.indent();
            this.line(`${this.findAnimationEase(item.location.yEase)} ${item.period} ypos ${item.location.end.y}`);
            this.unindent();
        }
        if (item.rotate.start != item.rotate.end) {
            this.line('parallel:');
            this.indent();
            this.line(`${this.findAnimationEase(item.rotate.ease)} ${item.period} rotate ${item.rotate.end}`);
            this.unindent();
        }
        if (item.zoom.xStart != item.zoom.xEnd) {
            this.line('parallel:');
            this.indent();
            this.line(`${this.findAnimationEase(item.zoom.xEase)} ${item.period} xzoom ${item.zoom.xEnd}`);
            this.unindent();
        }
        if (item.zoom.yStart != item.zoom.yEnd) {
            this.line('parallel:');
            this.indent();
            this.line(`${this.findAnimationEase(item.zoom.yEase)} ${item.period} yzoom ${item.zoom.yEnd}`);
            this.unindent();
        }
        if (item.alpha.start != item.alpha.end) {
            this.line('parallel:');
            this.indent();
            this.line(`${this.findAnimationEase(item.alpha.ease)} ${item.period} alpha ${1.0 - item.alpha.end / 255}`);
            this.unindent();
        }
        if (item.clip.from.x != item.clip.to.x || item.clip.from.y != item.clip.to.y || item.clip.from.width != item.clip.to.width || item.clip.from.height !+ item.clip.to.height) {
            this.line(`crop (${item.clip.from.x}, ${item.clip.from.y}, ${item.clip.from.width}, ${item.clip.from.height})`);
            this.line('parallel:');
            this.indent();
            this.line(`${this.findAnimationEase(item.clip.xEase || item.clip.yEase)} ${item.period} crop (${item.clip.to.x}, ${item.clip.to.y}, ${item.clip.to.width}, ${item.clip.to.height})`);
            this.unindent();
        }
        this.pause(item.period);
        this.line('alpha 0');
        this.unindent();
        return name;
    }

    /**
     * 显示一张图片
     * @param name 图片名称
     * @param source 文件路径
     * @param zorder 优先度
     * @param horizontalFlip 是否进行水平翻转
     * @param verticalFlip 是否进行垂直翻转
     * @param withBlock 是否为此图片建立一个代码块并自动缩进一次
     */
    public defineImage(name: string, source: string, autoUniqueName: boolean = true, horizontalFlip: boolean = false, verticalFlip: boolean = false): string {
        if (autoUniqueName)
            name = `lmp_${name}_${Utilities.newUUID()}`;
        let param: string[] = new Array<string>();
        if (horizontalFlip)
            param.push(`horizontal=True`);
        if (verticalFlip)
            param.push(`vertical=True`);
        if (horizontalFlip || verticalFlip)
            this.line(`image ${name} = im.Flip("${source}", ${param.join(', ')})`);
        else
            this.line(`image ${name} = "${source}"`);
        return name;
    }

    /**
     * 显示一张图片
     * @param name 图片名称
     * @param useExpression 是否将名称作为表达式解析
     * @param rename 图片别名
     * @param transformName 要使用的变换矩阵
     * @param zorder 图片优先级
     */
    public show(name: string, withBlock: boolean = false, useExpression: boolean = false, rename: string = null, transformName: string = null, zorder: number = null): void {
        let command: string = 'show';
        if (useExpression)
            command += ' expression';
        command += ` ${name}`;
        if (rename && rename != '')
            command += ` as ${rename}`;
        if (transformName && transformName != '')
            command += ` at ${transformName}`;
        if (zorder)
            command += ` zorder ${zorder}`;
        if (withBlock)
            command += ':';
        this.line(command);
    }

    /**
     * 通过Python显示图片（支持表达式解析和非英文字符）
     * @param name 图片名称
     * @param source 图片路径
     * @param transformName 要使用的变换矩阵们
     * @param zorder 图片优先级
     */
    public pythonShow(name: string, source: string, transformName: string[] = null, zorder: number = null): void {
        let param: string[] = new Array<string>();
        param.push(`${source}`);
        param.push(`what=renpy.easy.displayable(${source})`);
        param.push(`tag=${name}`);
        if (transformName && transformName.length > 0)
            param.push(`at_list=[${transformName.join(',')}]`);
        if (zorder)
            param.push(`zorder=${zorder}`);
        this.python(`renpy.show(${param.join(', ')})`);
    }

    /**
     * 插入一个With指令
     * @param transition 要使用的动画
     */
    public with(transition: string): void {
        this.line(`with ${transition}`);
    }

    /**
     * 插入一个Python with statement
     * @param transition 要使用的动画
     */
    public pythonWith(transition: string): void {
        this.python(`renpy.with_statement(${transition})`);
    }

    /**
     * 隐藏一个对象
     * @param name 对象名称
     */
    public hide(name: string): void {
        this.line(`hide ${name}`);
    }

    /**
     * 隐藏一个对象（支持表达式解析和非英文字符）
     * @param name 对象名称
     */
    public pythonHide(name: string): void {
        this.python(`renpy.hide(${name})`);
    }

    /**
     * 插入一个暂停标记
     * @param time 暂停时间
     */
    public pause(time: number = 0): void {
        if (time == 0)
            this.line('pause');
        else
            this.line(`pause ${time}`);
    }

    /**
     * 播放一段音频
     * @param source 音频文件路径
     * @param channel 要使用的音轨
     */
    public sound(source: string, channel: Renpy.SoundChannel): void {
        this.line(`play ${channel} "${source}"`);
    }

    /**
     * 设置对话框显隐性
     * @param show 是否显示对话框
     */
    public window(show: boolean): void {
        this.line(`window ${show ? 'show' : 'hide' }`);
    }

    /**
     * 通过Python播放一段音频（支持表达式解析和非英文字符）
     * @param name 音轨名称
     * @param source 文件路径
     * @param repeat 是否循环播放
     */
    public pythonSound(name: string, source: string, repeat: boolean = false): void {
        if (this.soundChannel.includes(name))
            this.python(`renpy.music.stop(${name}, 0.2)`);
        else {
            this.python(`renpy.music.register_channel(${name}, ${repeat ? 'music' : 'sfx'}, ${repeat ? 'True' : 'False'})`);
            this.soundChannel.push(name);
        }
        this.python(`renpy.music.play(${source}, ${name})`);
    }

    /**
     * 停止一段音频
     * @param channel 要停止的音轨
     * @param fadeOut 淡出停止时间
     */
    public stopSound(channel: Renpy.SoundChannel, fadeOut: number = 0): void {
        this.line(`stop ${channel}${fadeOut > 0 ? ' fadeout ' + fadeOut : ''}`);
    }

    /**
     * 通过Python停止一段音频（支持表达式解析和非英文字符）
     * @param channel 要停止的音轨
     * @param fadeOut 淡出停止时间
     */
    public pythonStopSound(name: string, fadeOut: number = 0): void {
        this.python(`renpy.music.stop(${name}, ${fadeOut})`);
    }
    
    /**
     * 插入一个返回标记
     */
    public return(): void {
        this.line('return');
    }

    /**
     * 插入一个Python返回标记
     */
    public pythonReturn(): void {
        this.python('return');
    }

    /**
     * 扩展前一个对话
     * @param text 对话内容
     */
    public extend(text: string): void {
        this.line(`extend ${text}`);
    }

    /**
     * 插入一个对话
     * @param character 对话所属角色
     * @param content 对话内容
     */
    public text(character: string, content:string): void {
        this.line(`${character} ${content}`);
    }



    /**
     * 保存当前文件
     */
    public save(): void {
        File.writeFileSync(Path.resolve(RenpyFile.basePath, this.name + '.rpy'), this._line.join('\n') + '\n');
    }

    private findAnimationEase(item: GS.Ease): string {
        if (item == GS.Ease.In)
            return 'easein';
        if (item == GS.Ease.Out)
            return 'easeout';
        else
            return 'linear';
    }
}

export function generateRenpyCode(project: GS.Project, position: string): void {
    RenpyFile.basePath = position;
    saveGlobalVariables(project);
    project.scene.forEach(scene => {
        saveScene(scene, project);
    });
}

function saveGlobalVariables(project: GS.Project): void {
    let varInitFile = new RenpyFile('variables');
    varInitFile.pythonInit(-200);
    varInitFile.indent();
    project.variable.forEach(variable => {
        varInitFile.defineInPythonBlock(variable);
    });
    varInitFile.unindent();
    varInitFile.line();
    varInitFile.init(-200);
    varInitFile.indent();
    Object.keys(characters).forEach(character => {
        varInitFile.define(characters[character], `Character("${character}", who_color="#0099FF")`);
    });
    varInitFile.define('character_normal', `Character("", who_color="#0099FF")`);
    varInitFile.save();
}

function saveScene(scene: GS.Scene, project: GS.Project): void {
    let sceneCode = Utilities.toLiveMakerHexName(scene.id);
    let codeFile = new RenpyFile(`lms_${sceneCode}`);
    codeFile.comment(`LM2RENPY Converter ©2017 同人社团GILESFVK ËKITES`);
    codeFile.comment();
    codeFile.comment(`Original LiveMaker scene: ${sceneCode} (${scene.name})`);
    scene.block.forEach(block => {
        saveBlock(block, project, scene, codeFile);
    });
    codeFile.save();
}

function saveBlock(block: GS.Block<any>, project: GS.Project, scene: GS.Scene, file: RenpyFile): void {
    let nodeCode = Utilities.toLiveMakerHexName(block.id);
    file.line();
    file.label(nodeCode);
    file.indent(1);
    file.comment(`Original LiveMaker node: ${nodeCode} (${block.name})`);
    if (block.type == GS.BlockType.SceneStart && scene.variable.length > 0) {
        file.pythonBlock();
        file.indent();
        scene.variable.forEach(variable => {
            file.defineInPythonBlock(variable);
        });
        file.unindent();
    } else if (block.type == GS.BlockType.SceneEnd && scene.variable.length > 0) {
        file.pythonBlock();
        file.indent();
        scene.variable.forEach(variable => {
            file.undefineInPythonBlock(variable);
        });
        file.unindent();
    } else if (block.type == GS.BlockType.Jump) {
        let data: GS.BlockJump = block.data;
        for (let i = 0; i < project.scene.length; i++) {
            if (project.scene[i].id != data.target) continue;
            let name = Utilities.toLiveMakerHexName(project.scene[i].bootstrap);
            file.jump(name);
            break;
        }
    } else if (block.type == GS.BlockType.Navigator) {
        let data: GS.BlockNavigator = block.data;
        if (!data.targetPage) {
            for (let i = 0; i < project.scene.length; i++) {
                if (project.scene[i].id != data.target) continue;
                let name = Utilities.toLiveMakerHexName(project.scene[i].bootstrap);
                file.jump(name);
                break;
            }
        } else {
            file.systemScreen(data.targetPage);
        }
    } else if (block.type == GS.BlockType.Menu) {
        let data: GS.BlockMenu = block.data;
        file.liveMenu(data.item,
                      data.condition,
                      data.fadeIn > 0 ? data.fadeIn / 1000 : null,
                      data.fadeOut > 0 ? data.fadeOut / 1000 : null,
                      data.clickSound,
                      data.hoverSound,
                      data.timeLimitation > 0 ? data.timeLimitation / 1000 : null);
    } else if (block.type == GS.BlockType.Input) {
        let data: GS.BlockInput = block.data;
        file.lmInput(data.content, data.title);
    } else if (block.type == GS.BlockType.Choice) {
        let data: GS.BlockChoice = block.data;
        if (data.time instanceof Object) {
            let animations: GS.Animation[] = data.time as GS.Animation[];
            let endtime: number = 0;
            let nameList: string[] = new Array<string>();
            animations.forEach(animation => {
                if (animation.startTime + animation.period > endtime)
                    endtime = animation.startTime + animation.period;
                nameList.push(file.animation(animation));
            });
            file.lmChoice(data.choice, data.hoverSound, data.selectSound, endtime);
            nameList.forEach(name => {
                file.hide(name);
            });
        } else {
            file.lmChoice(data.choice, data.hoverSound, data.selectSound, data.time);
        }
    } else if (block.type == GS.BlockType.Calculator) {
        let data: GS.BlockCalculator = block.data;
        data.variable.forEach(variable => {
            file.defineVariable(variable);
        });
        saveCode(data.code, file, nodeCode);
        data.variable.forEach(variable => {
            file.undefine(variable);
        });
    } else if (block.type == GS.BlockType.Normal) {
        let data: GS.BlockNormal = block.data;
        saveNormal(data.content, file);
    }
    file.indent(1);
    file.return();
    file.indent(0);
}

function saveCode(codes: GS.Code[], file: RenpyFile, nodeCode: string): void {
    let i = 0;
    let currentWhile: GS.CalculatorWhileData = null;
    let whileIndent: number = -1;
    while (i < codes.length) {
        let code = codes[i];
        file.indent(code.scopeIndent + 1);
        if (code.type == GS.CalculatorType.While) {
            let content: GS.CalculatorWhileData = code.data as GS.CalculatorWhileData;
            if (content.init)
                file.python(content.init);
            file.while(content.condition);
            file.indent();
            currentWhile = content;
            whileIndent = code.scopeIndent;
        } else if (code.type == GS.CalculatorType.Continue) {
            let content: GS.CalculatorContinueData = code.data as GS.CalculatorContinueData;
            if (content.condition == 'True')
                file.continue();
            else {
                file.if(content.condition);
                file.indent();
                file.python(currentWhile.loop);
                file.continue();
                file.unindent();
            }
        } else if (code.type == GS.CalculatorType.Break) {
            let content: GS.CalculatorBreakData = code.data as GS.CalculatorBreakData;
            if (content.condition == 'True')
                file.break();
            else {
                file.if(content.condition);
                file.indent();
                file.break();
                file.unindent();
            }
        } else {
            if (whileIndent > -1 && code.scopeIndent <= whileIndent) {
                file.indent(whileIndent + 2);
                if (currentWhile.loop)
                    file.python(currentWhile.loop);
                file.indent(code.scopeIndent + 1);
                currentWhile = null;
                whileIndent = -1;
                file.endWhile();
            }
            if (code.type == GS.CalculatorType.Call) { // 不处理CALL
                let content: GS.CalculatorCallData = code.data as GS.CalculatorCallData; 
                file.comment(`WARNING: IGNORE CALL ${content.page} WITH PARAM ${content.param.join(', ')}`);
                file.python('True == True');
            } else if (code.type == GS.CalculatorType.TextIns) { // 不处理TEXTINS
                let content: GS.CalculatorTextInsData = code.data as GS.CalculatorTextInsData; 
                file.comment(`WARNING: IGNORE TEXTINS ${content.content} ON ${content.target}`);
                file.python('True == True');
            } else if (code.type == GS.CalculatorType.Wait) {
                let content: GS.CalculatorWaitData = code.data as GS.CalculatorWaitData;
                if (content.condition != null) // 不处理WAIT的条件
                    file.comment(`WARNING: IGNORE CONDITION OF WAIT ${content.condition}`);
                if (content.time > 0)
                    file.pause(content.time);
                else
                    file.python('True == True');
            } else if (code.type == GS.CalculatorType.VarNew) {
                let content: GS.CalculatorVarNewData = code.data as GS.CalculatorVarNewData;
                file.defineVariable(content);
            } else if (code.type == GS.CalculatorType.VarDel) {
                let content: GS.CalculatorVarDelData = code.data as GS.CalculatorVarDelData;
                file.python(`${content.name} = None`);
            } else if (code.type == GS.CalculatorType.Sound) {
                let content: GS.CalculatorSoundData = code.data as GS.CalculatorSoundData;
                file.pythonSound(content.name, content.source, content.repeat);
            } else if (code.type == GS.CalculatorType.ObjDel) {
                let content: GS.CalculatorObjDelData = code.data as GS.CalculatorObjDelData;
                file.pythonHide(content.name);
            } else if (code.type == GS.CalculatorType.StopMedia) {
                let content: GS.CalculatorStopMediaData = code.data as GS.CalculatorStopMediaData;
                file.pythonStopSound(content.name, content.time);
                if (content.wait)
                    file.pause(content.time);
            } else if (code.type == GS.CalculatorType.If) {
                let content: GS.CalculatorIfData = code.data as GS.CalculatorIfData;
                file.if(content.condition);
            } else if (code.type == GS.CalculatorType.Elseif) {
                let content: GS.CalculatorElseifData = code.data as GS.CalculatorElseifData;
                file.elif(content.condition);
            } else if (code.type == GS.CalculatorType.Else) {
                file.else();
            } else if (code.type == GS.CalculatorType.ImageNew) {
                let content: GS.CalculatorImageNewData = code.data as GS.CalculatorImageNewData;
                file.pythonShow(content.name, content.source, null, content.priority);
            } else if (code.type == GS.CalculatorType.Calc) {
                let content: GS.CalculatorCalcData = code.data as GS.CalculatorCalcData;
                if (content.line.startsWith('SetArray')) {
                    let reg = new RegExp('(\\w+)[,\\)]', "g");
                    let matched: string[];
                    let params: string[] = new Array<string>();
                    while (matched = reg.exec(content.line))
                        params.push(matched[1].trim());
                    let result = params[0];
                    params.splice(0, 1);
                    let arrayContent: string = '0';
                    for (let i = params.length - 1; i > -1; i--) {
                        arrayContent = `[${arrayContent}] * ${params[i]}`;
                    }
                    file.python(`${result} = ${arrayContent}`);
                } else {
                    if (content.line.startsWith('AddArray'))
                        file.comment(`WARNING: IGNORE ADDARRAY`);
                    if (content.line.startsWith('AddDelimiter'))
                        file.comment(`WARNING: IGNORE ADDDELIMITER`);
                    if (content.line.startsWith('TrimArray'))
                        file.comment(`WARNING: IGNORE TRIMARRAY`);
                    if (content.line.startsWith('StringToArray'))
                        file.comment(`WARNING: IGNORE STRINGTOARRAY`);
                    if (content.line.startsWith('UniqueArray'))
                        file.comment(`WARNING: IGNORE UNIQUEARRAY`);
                    file.python(content.line);
                }
            }
        }
        i++;
    }
}

function saveNormal(commands: GS.Command[], file: RenpyFile): void {
    let i = 0;
    let inDiaogue: boolean = false;
    let effects = findAllEffect(commands);
    while (i < commands.length) {
        let command = commands[i];
        if (command.type == GS.CommandType.Text) {
            let dialogue: string = '';
            let character: string = '';
            while (i < commands.length && (command.type == GS.CommandType.Text ||
                                           command.type == GS.CommandType.Wait ||
                                           command.type == GS.CommandType.WaitForClick ||
                                           command.type == GS.CommandType.ChangeTextSpeed ||
                                           command.type == GS.CommandType.ShowVariableContent )) {
                if (command.type == GS.CommandType.Text) {
                    if (inDiaogue) {
                        dialogue += styleText(command.content as GS.CommandContentText);
                    } else {
                        let text = findCharacter(styleText(command.content as GS.CommandContentText));
                        file.comment(`CHARACTER ${text.realName}`);
                        character = text.character;
                        dialogue = text.content;
                        inDiaogue = true;
                    }
                } else if (command.type == GS.CommandType.Wait) {
                    dialogue += `{w=${(command.content as GS.CommandContentWait).time / 1000}}`;
                } else if (command.type == GS.CommandType.ShowVariableContent) {
                    dialogue += `[${(command.content as GS.CommandContentNameTarget).name}]`;
                } else {
                    dialogue += '{w}';
                }
                i ++;
                command = commands[i];
            }
            if (command && command.type != GS.CommandType.WaitAndClear)
            dialogue += '{nw}';
            dialogue = removeUselessCharacter(dialogue);
            if (character != '')
                file.text(character, `"${dialogue}"`);
            else
                file.extend(`"${dialogue}"`);
            file.line();
            i --;
        } else if (command.type == GS.CommandType.WaitAndClear) {
            inDiaogue = false;
            //file.pause();
            file.line();
        } else if (command.type == GS.CommandType.MessageBox) {
            file.window(true);
            file.with(`Dissolve(${(command.content as GS.CommandContentTimeTarget).time / 1000})`)
            file.line();
        } else if (command.type == GS.CommandType.DestroyMessageBox) {
            file.window(false);
            file.with(`Dissolve(${(command.content as GS.CommandContentTimeTarget).time / 1000})`)
            file.line();
        } else if (command.type == GS.CommandType.ChangeMessageBox) {
            file.python(`set_window("${(command.content as GS.CommandContentNameTarget).name}")`);
        } else if (command.type == GS.CommandType.Sound) {
            let commandContent = command.content as GS.CommandContentSound;
            file.sound(commandContent.source, findSoundtrack(commandContent.track));
            file.line();
        } else if (command.type == GS.CommandType.StopSound) {
            let commandContent = command.content as GS.CommandContentStopSound;
            file.stopSound(findSoundtrack(commandContent.track), commandContent.time / 1000);
            file.line();
        } else if (command.type == GS.CommandType.Wait) {
            file.pause((command.content as GS.CommandContentWait).time / 1000);
            file.line();
        } else if (command.type == GS.CommandType.DestroyImage) {
            let commandContent = command.content as GS.CommandContentDestroyImage;
            commandContent.target.forEach(target => {
                file.pythonHide(`"${target}"`);
            });
            if (commandContent.useFlip && commandContent.useFlip != "") {
                file.pythonWith(getEffect(effects, commandContent.useFlip));
            }
            file.line();
        } else if (command.type == GS.CommandType.ChangeImage) {
            let commandContent = command.content as GS.CommandContentChangeImageAnimation;
            if (commandContent.animation && commandContent.animation.length > 0) {
                commandContent.animation.forEach(animation => {
                    file.animation(animation);
                });
                file.line();
                i++;
                continue;
            }
            file.pythonShow(`"${commandContent.name}"`, `"${commandContent.source}"`);
            if (commandContent.useFlip && commandContent.useFlip != "") {
                file.pythonWith(getEffect(effects, commandContent.useFlip));
            }
            file.line();
        } else if (command.type == GS.CommandType.Image) {
            let commandContent = command.content as GS.CommandContentImageAnimation;
            if (commandContent.animation && commandContent.animation.length > 0) {
                commandContent.animation.forEach(animation => {
                    file.animation(animation);
                });
                file.line();
                i++;
                continue;
            }
            let transform: string = '';
            if (commandContent.x == GS.Align.Left && commandContent.y == GS.Align.Top)
                transform = 'left_top';
            else if (commandContent.x == GS.Align.Left && commandContent.y == GS.Align.Bottom)
                transform = 'left_bottom';
            else if (commandContent.x == GS.Align.Left && commandContent.y == GS.Align.Center)
                transform = 'left_center';
            else if (commandContent.x == GS.Align.Right && commandContent.y == GS.Align.Top)
                transform = 'right_top';
            else if (commandContent.x == GS.Align.Right && commandContent.y == GS.Align.Center)
                transform = 'right_center';
            else if (commandContent.x == GS.Align.Right && commandContent.y == GS.Align.Bottom)
                transform = 'right_bottom';
            else if (commandContent.x == GS.Align.Center && commandContent.y == GS.Align.Top)
                transform = 'center_top';
            else if (commandContent.x == GS.Align.Center && commandContent.y == GS.Align.Center)
                transform = 'center_center';
            else if (commandContent.x == GS.Align.Center && commandContent.y == GS.Align.Bottom)
                transform = 'center_bottom';
            else
                transform = `Transform(xpos=${commandContent.x}, ypos=${commandContent.y})`
            file.pythonShow(`"${commandContent.name}"`, `"${commandContent.source}"`, [transform], commandContent.priority);
            if (commandContent.useFlip && commandContent.useFlip != "") {
                file.pythonWith(getEffect(effects, commandContent.useFlip));
            }
            file.line();
        }
        i++;
    }
}

function findAllEffect(commands: GS.Command[]): GS.CommandContentEffect[] {
    return commands.filter(v => v.type == GS.CommandType.Effect).map(v => v.content as GS.CommandContentEffect);
}

function styleText(text: GS.CommandContentText): string {
    let result = text.text;
    if (text.bold)
        result = `{b}${result}{/b}`;
    if (text.color && text.color != '')
        result = `{color=${text.color}}${result}{/color}`;
    if (text.italic)
        result = `{i}${result}{/i}`;
    if (text.size && text.size > 0)
        result = `{size=${text.size}}${result}{/size}`;
    if (text.underline)
        result = `{u}${result}{/u}`;
    result = result.replace(/\n/g, '\\n');
    result = result.replace(/　/g, '');
    return result;
}

function removeUselessCharacter(text: string): string {
    text = text.replace(/\\n/g, '');
    text = text.replace(/「/g, '');
    text = text.replace(/」/g, '');
    if (text.endsWith('{w}'))
        text = text.substring(0, text.lastIndexOf('{w}'));
    if (text.endsWith('{w}{nw}'))
        text = text.substring(0, text.lastIndexOf('{w}{nw}'));
    return text;
}

function findCharacter(text: string): { character: string, realName: string, content: string } {
    let keys = Object.keys(characters);
    for (let i = 0; i < keys.length; i++) {
        if (text.startsWith(keys[i]) && text[keys[i].length] == '\\') {
            return {
                character: characters[keys[i]],
                realName: keys[i],
                content: text.substring(keys[i].length + 2)
            };
        }
    }
    return {
        character: 'character_normal',
        realName: 'normal',
        content: text
    };
}

function findSoundtrack(track: GS.Soundtrack): Renpy.SoundChannel {
    switch(track) {
        case GS.Soundtrack.BGM:
            return Renpy.SoundChannel.Bgm;
        case GS.Soundtrack.BGM2:
            return Renpy.SoundChannel.Bgm2;
        case GS.Soundtrack.Effect:
            return Renpy.SoundChannel.Effect;
        case GS.Soundtrack.Effect2:
            return Renpy.SoundChannel.Effect2;
        case GS.Soundtrack.Voice:
            return Renpy.SoundChannel.Voice;
        case GS.Soundtrack.Voice2:
            return Renpy.SoundChannel.Voice2;
        default:
            throw '找不到对应的音轨：' + track;
    }
}

function getEffect(list: GS.CommandContentEffect[], name: string): string {
    let target = list.find(v => v.name == name);
    if (!target) throw '找不到对应的过渡效果：' + name;
    switch (target.type) {
        case GS.EffectType.None:
            return 'None';
        case GS.EffectType.Fade:
            return `Dissolve(${target.time / 1000})`
        case GS.EffectType.BlindHorizontal:
            return `ImageDissolve("lib/lmeffect/blind_h.png", ${target.time / 1000}, reverse=${target.reverse ? 'True' : 'False'})`;
        case GS.EffectType.BlindVertical:
            return `ImageDissolve("lib/lmeffect/blind_v.png", ${target.time / 1000}, reverse=${target.reverse ? 'True' : 'False'})`;
        case GS.EffectType.CurtainHorizontal:
            return `ImageDissolve("lib/lmeffect/curtain_h.png", ${target.time / 1000}, reverse=${target.reverse ? 'True' : 'False'})`;
        case GS.EffectType.CurtainVertical:
            return `ImageDissolve("lib/lmeffect/curtain_v.png", ${target.time / 1000}, reverse=${target.reverse ? 'True' : 'False'})`;
        case GS.EffectType.ScrollHorizontal:
            return `PushMove(${target.time / 1000}, "push${target.reverse ? 'right' : 'left'}")`;
        case GS.EffectType.ScrollVertical:
            return `PushMove(${target.time / 1000}, "push${target.reverse ? 'up' : 'down'}")`;
        case GS.EffectType.Grid:
            return `ImageDissolve("lib/lmeffect/grid.png", ${target.time / 1000}, reverse=${target.reverse ? 'True' : 'False'})`;
        case GS.EffectType.GridHorizontal:
            return `ImageDissolve("lib/lmeffect/grid_h.png", ${target.time / 1000}, reverse=${target.reverse ? 'True' : 'False'})`;
        case GS.EffectType.GridVertical:
            return `ImageDissolve("lib/lmeffect/grid_v.png", ${target.time / 1000}, reverse=${target.reverse ? 'True' : 'False'})`;
        case GS.EffectType.Dither:
            return `ImageDissolve("lib/lmeffect/dither.png", ${target.time / 1000}, reverse=${target.reverse ? 'True' : 'False'})`;
        case GS.EffectType.White:
            return `Fade(${target.time / 1000}, 0.0, ${target.time / 1000}, color="#FFFFFF")`;
        case GS.EffectType.Black:
            return `Fade(${target.time / 1000}, 0.0, ${target.time / 1000}, color="#000000")`;
        case GS.EffectType.Flash:
            return `Fade(${target.time / 4000}, 0.0, ${target.time / 4000 * 3}, color="#FFFFFF")`;
        case GS.EffectType.Mosaic:
            return `Pixellate(${target.time, 10})`;
        case GS.EffectType.ScratchHorizontal: // 无法实现，使用Mosaic替代
            return `Pixellate(${target.time, 10})`;
        case GS.EffectType.ScratchVertical: // 无法实现，使用Mosaic替代
            return `Pixellate(${target.time, 10})`;
        case GS.EffectType.Spot: // 无法实现，采用中心淡入淡出替代
            return `ImageDissolve("lib/lmeffect/center.png", ${target.time / 1000}, reverse=${target.reverse ? 'True' : 'False'})`;
        case GS.EffectType.Mask: // AYUMI里此效果等价于Fade
            return `Dissolve(${target.time / 1000})`;
        case GS.EffectType.MaskWhite: // AYUMI里此效果等价于Fade
            return `Dissolve(${target.time / 1000})`;
        case GS.EffectType.MaskBlack: // AYUMI里此效果等价于Fade
            return `Dissolve(${target.time / 1000})`;
        case GS.EffectType.ZoomSmall:
            return `OldMoveTransition(${target.time / 1000}, enter_factory=ZoomInOut(0.01, 1.0))`;
        case GS.EffectType.ZoomBig:
            return `OldMoveTransition(${target.time / 1000}, enter_factory=ZoomInOut(1.0, 0.01))`;
        case GS.EffectType.ZoomIn:
            return `OldMoveTransition(${target.time / 1000}, enter_factory=ZoomInOut(0.01, 1.0), leave_factory=ZoomInOut(1.0, 0.01))`;
        case GS.EffectType.Ripple: // 无法实现，采用中心淡入淡出替代
            return `ImageDissolve("lib/lmeffect/center.png", ${target.time / 1000}, reverse=${target.reverse ? 'True' : 'False'})`;
        case GS.EffectType.BlurWhite: // 模糊效果性能消耗过大，舍弃之
            return `Fade(${target.time / 1000}, 0.0, ${target.time / 1000}, color="#FFFFFF")`;
        case GS.EffectType.BlurBlack: // 模糊效果性能消耗过大，舍弃之
            return `Fade(${target.time / 1000}, 0.0, ${target.time / 1000}, color="#000000")`;
        case GS.EffectType.TwistHorizontal: // 无法实现，采用CropMove替代
            return `CropMove(${target.time / 1000}, "slide${target.reverse ? 'right' : 'left'}")`;
        case GS.EffectType.TwistVertical: // 无法实现，采用CropMove替代
            return `CropMove(${target.time / 1000}, "slide${target.reverse ? 'up' : 'bottom'}")`;
        case GS.EffectType.Crack: // 无法实现，采用震动+淡出替代
            return `ComposeTransition(Shake((0.5, 1.0, 0.5, 1.0), ${target.time / 1000}, dist=5), after=dissolve)`
        case GS.EffectType.Clockhand:
            return `ImageDissolve("lib/lmeffect/circle.png", ${target.time / 1000}, reverse=${target.reverse ? 'True' : 'False'})`;
        case GS.EffectType.RubberHorizontal: // 无法实现，使用Mosaic替代
            return `Pixellate(${target.time, 10})`;
        case GS.EffectType.RubberVertical: // 无法实现，使用Mosaic替代
            return `Pixellate(${target.time, 10})`;
        case GS.EffectType.FanCenter:
            return `ImageDissolve("lib/lmeffect/fan.png", ${target.time / 1000}, reverse=${target.reverse ? 'True' : 'False'})`;
        case GS.EffectType.FanBorder:
            return `ImageDissolve("lib/lmeffect/fan_h.png", ${target.time / 1000}, reverse=${target.reverse ? 'True' : 'False'})`;
        case GS.EffectType.Circle:
            return `ImageDissolve("lib/lmeffect/center.png", ${target.time / 1000}, reverse=${target.reverse ? 'True' : 'False'})`;
        case GS.EffectType.BlockCoil:
            return `ImageDissolve("lib/lmeffect/block.png", ${target.time / 1000}, reverse=${target.reverse ? 'True' : 'False'})`;
        case GS.EffectType.BlockRandom:
            return `ImageDissolve("lib/lmeffect/block_random.png", ${target.time / 1000}, reverse=${target.reverse ? 'True' : 'False'})`;
    }
}
