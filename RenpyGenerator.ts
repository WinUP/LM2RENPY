import * as Path from 'path';
import * as File from 'fs';

import * as Utilities from './Utilities';
import * as GS from './include/GeneralScript';

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

    /**
     * 生成一个Ren'Py脚本文件
     * @param name 文件名称（相对于全局目录的名称或路径，不含扩展名）
     */
    public constructor(private name: string) { }

    /**
     * 进行一次缩进
     */
    public indent(): void {
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
     * 在无缩进的情况下添加一个初始化标记，并将缩进重置为1
     * @param priority 该标记的优先级
     */
    public init(priority?: number): void {
        if (Utilities.isValueAvailable(priority))
            this._line.push(`init ${priority}:`);
        else
            this._line.push('init:');
        this._indent = 1;
    }

    /**
     * 在无缩进的情况下添加一个Python初始化标记，并将缩进重置为1
     * @param priority 该标记的优先级
     */
    public pythonInit(priority?: number): void {
        if (Utilities.isValueAvailable(priority))
        this._line.push(`init ${priority} python:`);
        else
            this._line.push('init python:');
        this._indent = 1;
    }

    /**
     * 在无缩进的情况下添加一个标签，并将缩进重置为1
     * @param name 标签名称
     */
    public label(name: string): void {
        this._line.push(`label lmn_${name}:`);
        this._indent = 1;
    }

    /**
     * 插入一句python代码
     * @param code 代码内容
     */
    public python(code: string): void {
        this.line(`$ ${code}`);
    }

    /**
     * 插入一个python定义块，并自动缩进一次
     */
    public pythonBlock(): void {
        this.line('python:');
        this.indent();
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
     * 添加一个条件选择语句，并自动缩进一次
     * @param condition 条件
     */
    public if(condition: string): void {
        this.line(`if ${condition}:`);
        this.indent();
    }

    /**
     * 定义一个变量
     * @param variable 
     */
    public define(variable: GS.Variable<any>, singlePythonLine: boolean = false): void {
        variable = Utilities.normalizeVariableValue(variable);
        if (variable.scope == GS.VariableScope.Static) {
            this.if(`persistent.${variable.name} == None`);
            this.line(`${singlePythonLine ? '$ ' : ''}persistent.${variable.name} = ${variable.value}`);
            this.unindent();
        } else
            this.line(`${singlePythonLine ? '$ ' : ''}${variable.name} = ${variable.value}`);
    }

    public undefine(variable: GS.Variable<any>, singlePythonLine: boolean = false): void {
        variable = Utilities.normalizeVariableValue(variable);
        if (variable.scope == GS.VariableScope.Static)
            this.line(`${singlePythonLine ? '$ ' : ''}persistent.${variable.name} = None`);
        else
            this.line(`${singlePythonLine ? '$ ' : ''}${variable.name} = None`);
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
        let name = this.image(item.name, item.source, item.priority, item.horizontalReverse, item.verticalReverse, true);
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

    public image(name: string, source: string, zorder: number = 0, horizontalFlip: boolean = false, verticalFlip: boolean = false, withBlock: boolean = false): string {
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
        if (withBlock) {
            this.line(`show ${name} zorder ${zorder}:`);
            this.indent();
        } else
            this.line(`show ${name} zorder ${zorder}`);
        return name;
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
     * 隐藏一个对象
     * @param name 对象名称
     */
    public hide(name: string): void {
        this.line(`hide ${name}`);
    }

    /**
     * 插入一个返回标记
     */
    public return(): void {
        this.line('return');
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
    project.variable.forEach(variable => {
        varInitFile.define(variable);
    });
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
    file.comment(`Original LiveMaker node: ${nodeCode} (${block.name})`);
    if (block.type == GS.BlockType.SceneStart && scene.variable.length > 0) {
        file.pythonBlock();
        scene.variable.forEach(variable => {
            file.define(variable);
        });
        file.unindent();
    } else if (block.type == GS.BlockType.SceneEnd && scene.variable.length > 0) {
        file.pythonBlock();
        scene.variable.forEach(variable => {
            file.undefine(variable);
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
        
    }
    file.return();
    file.unindent();
}
