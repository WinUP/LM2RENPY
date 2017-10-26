import * as UUID from 'uuid';
import * as File from 'fs';

import * as LiveProject from './include/LiveMakerProject';
import * as LiteScript from './include/LiteScript';
import * as GS from './include/GeneralScript';

export const xmlParseOptions = {
    ignoreNonTextNodeAttr: false,
    ignoreTextNodeAttr: false,
    textAttrConversion: true,
    attrPrefix: '$',
    textNodeName: '_content'
};

export const galleryList = {
    "images/CG/Opening celemony/Opening celemony 3.png": "8311E1236AED463A9358E6303D1D2F5C",
    "images/CG/Opening celemony/Opening celemony 4.png": "84E3A40E55C74C5C9B705CF5E3FE58A1",
    "images/CG/Opening celemony/Opening celemony 5.png": "87A38905C919455BB6D35DB596394AC9",
    "images/CG/Opening celemony/Opening celemony 6.png": "691F32B0298245DE8278009B3F9589BE",
    "images/CG/Tomo+Shinobu.png": "03C9EB10B8D14965A3E4A9225ACC9C39",
    "images/CG/Let-us-sumo-together/Let-us-sumo-together 1.png": "D8229CDD6C214636928DC6C6FCFCA4FB",
    "images/CG/Let-us-sumo-together/Let-us-sumo-together 3.png": "9ACE399648824FD884F39266417CDDBD",
    "images/CG/Let-us-sumo-together/Let-us-sumo-together 5.png": "1C9982B11CB6440DBBEE2B161A425C30",
    "images/CG/Let-us-sumo-together/Let-us-sumo-together 6.png": "5BAF87FE15234238AB0865FE6CEABB74",
    "images/CG/Let-us-sumo-together/Let-us-sumo-together 11.png": "18A77FEE59614E49AA0660833A369388",
    "images/CG/Let-us-sumo-together/Let-us-sumo-together 8.png": "83F732F048574A3294F4B648F4D0DFC8",
    "images/CG/Let-us-sumo-together/Let-us-sumo-together 9.png": "EAE467ED476446099F36A59024BEB550",
    "images/CG/Tsubasas-Cantabile/Tsubasas-Cantabile 1.png": "1DF1A98336DB4A81BE40028C743F7DF8",
    "images/CG/Tsubasas-Cantabile/Tsubasas-Cantabile 2.png": "DF4B118410C548ADBD1EA7899F30BCCF",
    "images/CG/Tsubasas-Cantabile/Tsubasas-Cantabile 3.png": "2F3A55DB5E7D426AA2695C5D1B97A040",
    "images/CG/Tsubasas-Cantabile/Tsubasas-Cantabile 4.png": "361696A1939D46CEBF91C8115642936C",
    "images/CG/Tsubasas-Cantabile/Tsubasas-Cantabile 5.png": "BB15BC7CC853407495EB41EE25D1EFAD",
    "images/CG/Tsubasas-Cantabile/Tsubasas-Cantabile 6.png": "A1E7CA7F049F49908469DC30E836FCEF",
    "images/CG/Tsubasas-Cantabile/Tsubasas-Cantabile 7.png": "2B9BE937603E4E96969F3C4CE130A6F5",
    "images/CG/Tsubasas-Cantabile/Tsubasas-Cantabile 8.png": "689A15BAED4D45EAA7879993C605248F",
    "images/CG/Seeking-for-stimulation-finally/Seeking-for-stimulation-finally 1.png": "18084E9C14F5421BBBB3CA4F07A82DC8",
    "images/CG/Seeking-for-stimulation-finally/Seeking-for-stimulation-finally 2.png": "CCAF353B743A4E13A7A43D3F8AF8D694",
    "images/CG/Seeking-for-stimulation-finally/Seeking-for-stimulation-finally 4.png": "287157BDD64B4E528AFF869F71BDA5A9",
    "images/CG/Seeking-for-stimulation-finally/Seeking-for-stimulation-finally 6.png": "68F095DA988D4FBD93381898FF8260F4",
    "images/CG/Seeking-for-stimulation-finally/Seeking-for-stimulation-finally 7.png": "85CAF3695FEF4F89962FCAB11752108F",
    "images/CG/Inconceivable-story-of-wong-mew/Inconceivable-story-of-wong-mew 1.png": "7B83AD9CA240425EA3A9E06C0D24BF7B",
    "images/CG/Inconceivable-story-of-wong-mew/Inconceivable-story-of-wong-mew 10.png": "B4FB83ADF72E4DEDA77384FEB0F94E44",
    "images/CG/Inconceivable-story-of-wong-mew/Inconceivable-story-of-wong-mew 2.png": "9363768CD32C4FE78E30EB697E142B70",
    "images/CG/Inconceivable-story-of-wong-mew/Inconceivable-story-of-wong-mew 3.png": "D704FBCAA179433EB76BAC3007A3C241",
    "images/CG/Inconceivable-story-of-wong-mew/Inconceivable-story-of-wong-mew 4.png": "5E80ED9C3E1F4920A274B420F13A4D82",
    "images/CG/Inconceivable-story-of-wong-mew/Inconceivable-story-of-wong-mew 5-3.png": "C7F946EF0FB14A6A9ED6F7A9D18C5E2B",
    "images/CG/Inconceivable-story-of-wong-mew/Inconceivable-story-of-wong-mew 6.png": "A222B7CC30A245E0AB1F1A5B1FC13CC5",
    "images/CG/Inconceivable-story-of-wong-mew/Inconceivable-story-of-wong-mew 7.png": "BB4914B9F99F4B449F1BD45034C67186",
    "images/CG/Inconceivable-story-of-wong-mew/Inconceivable-story-of-wong-mew 8.png": "A438304BAD244787B1FCBDEB053ED1B2",
    "images/CG/Inconceivable-story-of-wong-mew/Inconceivable-story-of-wong-mew 9.png": "ADFD6891D3AF42CA8301DDC64AE2F5D7",
    "images/CG/Inconceivable-story-of-wong-mew/Inconceivable-story-of-wong-mew 9-1.png": "0F106B8E35274818A2D1764D5EC4CEFF",
    "images/CG/Prelife-memory/Prelife-memory 1.png": "CEDACC94A9174ACEBB28422618EB83AD",
    "images/CG/Prelife-memory/Prelife-memory 2.png": "709A0F8E88FC4927B3F2872F13C17FA7",
    "images/CG/Prelife-memory/Prelife-memory 3.png": "D9D9BBF18FFA4E278F5E7FF9A7D00AF2",
    "images/CG/Prelife-memory/Prelife-memory 4.png": "7C1396F883A044398410DB50945F5D1D",
    "images/CG/Prelife-memory/Prelife-memory 5.png": "AC590944081A4E0C9EC81899E9209C85",
    "images/CG/Prelife-memory/Prelife-memory 6.png": "F7C5F4C539224DA08E60CF859D14D0B7",
    "images/CG/Prelife-memory/Prelife-memory 7.png": "E05FE25C588740B4A48960064ACFC99B",
    "images/CG/Parallel-boats/Parallel-boats 1.png": "C5CDC0061BA04DD3AD28D4ABCC1A8876",
    "images/CG/Parallel-boats/Parallel-boats 2.png": "0FD0B77AE6184E9E8876D49DA2E6D501",
    "images/CG/Parallel-boats/Parallel-boats 3.png": "38144AA40B6D4C3B8F05376BD7FBBF73",
    "images/CG/Parallel-boats/Parallel-boats 3-1.png": "1AF095ACDA634CDB97AA0E1F9C729EAB",
    "images/CG/Parallel-boats/Parallel-boats 4.png": "A591B65F951C4384B441DD43899ACCFB",
    "images/CG/Parallel-boats/Parallel-boats 5.png": "84F29D2D29E0455A8600FFB3594BAF7F",
    "images/CG/Parallel-boats/Parallel-boats 5-1.png": "0E19376156254FCF92845E2C1706AA05",
    "images/CG/Parallel-boats/Parallel-boats 6.png": "9593E8C30A6D41789E064CE4E2E05E2E",
    "images/CG/Parallel-boats/Parallel-boats 7.png": "DE58EA8B26934BF59A0AABA095CABDBB",
    "images/CG/Parallel-boats/Parallel-boats 7-1.png": "E132C3CC6E324B62A79DA01BE75B90C8",
    "images/CG/Drug-for-tsundere/Drug-for-tsundere 1.png": "6A16110F14C64AA89B2FAD22D32413C7",
    "images/CG/Drug-for-tsundere/Drug-for-tsundere 2.png": "821554C146A04ADF85F552B16E7C73A1",
    "images/CG/Drug-for-tsundere/Drug-for-tsundere 2-1.png": "03FE1F27E00741CCAF415509C1FF7783",
    "images/CG/Drug-for-tsundere/Drug-for-tsundere 3.png": "ECECD9655F024DD9ABD97ABDC960DC82",
    "images/CG/Drug-for-tsundere/Drug-for-tsundere 4.png": "4D6DF38872224876B0346DDC8236880E",
    "images/CG/Drug-for-tsundere/Drug-for-tsundere 5.png": "B6A08DC7BC7B43CA9586AF3377BA9930",
    "images/CG/Drug-for-tsundere/Drug-for-tsundere 6.png": "3D4DEC86BCC44FEC9C0353067818153E",
    "images/CG/Drug-for-tsundere/Drug-for-tsundere 7.png": "10467CBD22854ED498CC690F9E3ABF68",
    "images/CG/Drug-for-tsundere/Drug-for-tsundere 8.png": "772ED68CBCDA4539B968C3D37984A791",
    "images/CG/Drug-for-tsundere/Drug-for-tsundere 9-1.png": "849CEB1C756A40EC9091CD060431DA06",
    "images/CG/Run-Run-Lovers/Run-Run-Lovers 1.png": "7D1E6CD76A3F4377B4251D3865FE5B7C",
    "images/CG/Run-Run-Lovers/Run-Run-Lovers 2.png": "9CFDDCA65C8A45049A67D61DA2BEBB7B",
    "images/CG/Run-Run-Lovers/Run-Run-Lovers 3.png": "335BF89B88F641B8B8DB66BE58875FEA",
    "images/CG/Run-Run-Lovers/Run-Run-Lovers 4.png": "A3F0B5B71ACF44378505551EAB95D2D5",
    "images/CG/Run-Run-Lovers/Run-Run-Lovers 5.png": "61A27D51005E46C3BB478FEE8106B863",
    "images/CG/Run-Run-Lovers/Run-Run-Lovers 6.png": "1C2DDB742E8E4804A215E5C68FF7CBFE",
    "images/CG/Run-Run-Lovers/Run-Run-Lovers 7.png": "CAB89628D892438290F5EEAEE6FDA3AE",
    "images/CG/Run-Run-Lovers/Run-Run-Lovers 8.png": "E4328112D39C4B68A1C267CCCE49C938",
    "images/CG/I-am-none-gay-with-no-lovers/I-am-none-gay-with-no-lovers 2.png": "C514C7B43BB94588B7E6F6DE0405902C",
    "images/CG/I-am-none-gay-with-no-lovers/I-am-none-gay-with-no-lovers 3.png": "17EE1054E0774C6E887A51B6D6F9809F",
    "images/CG/I-am-none-gay-with-no-lovers/I-am-none-gay-with-no-lovers 4.png": "B23B20310413456B97F5A62F21EB8231",
    "images/CG/I-am-none-gay-with-no-lovers/I-am-none-gay-with-no-lovers 4-1.png": "1DB63445D5FA4A8F90EE59842CB17587",
    "images/CG/I-am-none-gay-with-no-lovers/I-am-none-gay-with-no-lovers 5.png": "63D04BFE31F74541BAC4E3BE874F04D4",
    "images/CG/I-am-none-gay-with-no-lovers/I-am-none-gay-with-no-lovers 6-1.png": "01A535C9B5DB4CB99B85DD6BAC669F41",
    "images/CG/I-am-none-gay-with-no-lovers/I-am-none-gay-with-no-lovers 6-2.png": "4BE6749A7DEF47B28C893ED7AEE021E1",
    "images/CG/I-am-none-gay-with-no-lovers/I-am-none-gay-with-no-lovers 7.png": "63048BA95B7241CCA1206E32EEB5617C",
    "images/CG/I-am-none-gay-with-no-lovers/I-am-none-gay-with-no-lovers 8.png": "E8909DD316534842888A95088CBFE945",
    "images/CG/I-am-none-gay-with-no-lovers/I-am-none-gay-with-no-lovers 9-2.png": "B5626DFE23C0455A8A9CD7A2A8AA44A0",
    "images/CG/Gratitude-payment-of-fox/Gratitude-payment-of-fox 1.png": "5CF2995690BF4C87A419E7A4AD05A94D",
    "images/CG/Gratitude-payment-of-fox/Gratitude-payment-of-fox 2-1.png": "3BA596B22A77484494505809CFB86D73",
    "images/CG/Gratitude-payment-of-fox/Gratitude-payment-of-fox 3.png": "2B2468BBF68040D7AA817B022CDE842D",
    "images/CG/Gratitude-payment-of-fox/Gratitude-payment-of-fox 4.png": "986D6DD667574B1D83ECEA3AF755AFA3",
    "images/CG/Gratitude-payment-of-fox/Gratitude-payment-of-fox 5.png": "52CC474C78C944CABB132D3C2D0EA6A8",
    "images/CG/Gratitude-payment-of-fox/Gratitude-payment-of-fox 6.png": "C533C9DBA54D4CAFAD4F08DA43EB9A55",
    "images/CG/Gratitude-payment-of-fox/Gratitude-payment-of-fox 7.png": "9C54D280900F4385BDFF754A33B420AF",
    "images/CG/Welcomt-to-wolfs-celemony/Welcomt-to-wolfs-celemony 1.png": "3B43238981B5446E810F4A35352A9D94",
    "images/CG/Welcomt-to-wolfs-celemony/Welcomt-to-wolfs-celemony 2.png": "E99D8EE889324E538179D61E6C5B1FC7",
    "images/CG/Welcomt-to-wolfs-celemony/Welcomt-to-wolfs-celemony 3.png": "D5131E3A10814E4FB5007D75587FC94C",
    "images/CG/Welcomt-to-wolfs-celemony/Welcomt-to-wolfs-celemony 5.png": "AB1B0D4593B3493595C05D2634542B0F",
    "images/CG/Welcomt-to-wolfs-celemony/Welcomt-to-wolfs-celemony 6.png": "99E537CF1D264E8A9DC364659ADA92B3",
    "images/CG/Welcomt-to-wolfs-celemony/Welcomt-to-wolfs-celemony 7.png": "6416585972644DE1BFEFE64812811D22",
    "images/CG/Welcomt-to-wolfs-celemony/Welcomt-to-wolfs-celemony 8.png": "95153E5DF032453584ADEE5B712511FC",
    "images/CG/Welcomt-to-wolfs-celemony/Welcomt-to-wolfs-celemony 9.png": "7069267F64E54B868A5050EEF9D93A3B",
    "images/CG/Legacy-of-asynchronized-myself/Legacy-of-asynchronized-myself 1-1.png": "F8ABD783506148DE8982E63A2D047172",
    "images/CG/Legacy-of-asynchronized-myself/Legacy-of-asynchronized-myself 2.png": "C8A84981806B4A4DB2B6D92C97AE2032",
    "images/CG/Legacy-of-asynchronized-myself/Legacy-of-asynchronized-myself 3.png": "AD7961BC76E643599E9C50754D2B16E3",
    "images/CG/Legacy-of-asynchronized-myself/Legacy-of-asynchronized-myself 4.png": "B254F70E32264E79AF406C3492347538",
    "images/CG/Legacy-of-asynchronized-myself/Legacy-of-asynchronized-myself 4-1.png": "8C10B311F1B241F380A70CA461F73E5E",
    "images/CG/Legacy-of-asynchronized-myself/Legacy-of-asynchronized-myself 5.png": "6074209F6E654F3580E90BD8FE1A21C8",
    "images/CG/Legacy-of-asynchronized-myself/Legacy-of-asynchronized-myself 5-1.png": "2D24925D8776427E806125699BD065DE",
    "images/CG/Legacy-of-asynchronized-myself/Legacy-of-asynchronized-myself 6.png": "0BF98EB1ECCB4B0E884CBC033AC9F50E",
    "images/CG/Precept-of-justice/Precept-of-justice 1-1.png": "E34446EB077F4A6EA9497B9B9B0733FE",
    "images/CG/Precept-of-justice/Precept-of-justice 1-5.png": "08883BD8FCE34314B854783E9E919F7A",
    "images/CG/Precept-of-justice/Precept-of-justice 2-1.png": "26575D16067F4A9DA889C346CBB487A8",
    "images/CG/Precept-of-justice/Precept-of-justice 3.png": "54C31AC2FA71447087DF924311BF70EC",
    "images/CG/Precept-of-justice/Precept-of-justice 4.png": "6BDC463AF3034115B872FE8114549896",
    "images/CG/Precept-of-justice/Precept-of-justice 4-1.png": "9C8D732DF7E24E7F953E682C4348EA0A",
    "images/CG/Precept-of-justice/Precept-of-justice 4-2.png": "A53B45F08CC449B5B3975CB5C5C64EF0",
    "images/CG/Precept-of-justice/Precept-of-justice 5.png": "63D435C006354C2BA34CDE707A2F5EB7",
    "images/CG/Precept-of-justice/Precept-of-justice 5-1.png": "8F1E01956CF44C7A87C37EDFB685642E",
    "images/CG/Join-misaki-danjiri/Join-misaki-danjiri 1.png": "7E57D7A3B6704964B8907157D0B72E75",
    "images/CG/Join-misaki-danjiri/Join-misaki-danjiri 2-1.png": "97433B7ED6534086BEE73738CC688FD8",
    "images/CG/Join-misaki-danjiri/Join-misaki-danjiri 3.png": "A43CCBE3B95A40109DF2A73F21CB816A",
    "images/CG/Join-misaki-danjiri/Join-misaki-danjiri 4.png": "8C98F73227E949DAA5A09717C8CF0B1E",
    "images/CG/Drastic-remedy-for-tsundere/Drastic-remedy-for-tsundere 1.png": "78B0CFBCE4A74EB9819E36549647B400",
    "images/CG/Drastic-remedy-for-tsundere/Drastic-remedy-for-tsundere 2.png": "CD0D0A6DE097468A89BF35159754AED4",
    "images/CG/Drastic-remedy-for-tsundere/Drastic-remedy-for-tsundere 3.png": "8DBB09A70C0A416DAE3322BBA30B3080",
    "images/CG/Drastic-remedy-for-tsundere/Drastic-remedy-for-tsundere 4.png": "F01836A52D714D4AB57BB88A94C85343",
    "images/CG/Drastic-remedy-for-tsundere/Drastic-remedy-for-tsundere 5.png": "1280E1FE84AF4802A866EF6180931523",
    "images/CG/Drastic-remedy-for-tsundere/Drastic-remedy-for-tsundere 7.png": "6D983F1C2CBA4EB8AE6EE83BDA57FCC1",
    "images/CG/The-inbelieveble-of-school/The-inbelieveble-of-school 1.png": "1AB3B872D6C54A87BBE10747A2C3FDAD",
    "images/CG/The-inbelieveble-of-school/The-inbelieveble-of-school 1-1.png": "21F6C31513A34EA8A8B2E622273CDD7F",
    "images/CG/The-inbelieveble-of-school/The-inbelieveble-of-school 2.png": "B5CABC467ECD46948E0B1292E589A60D",
    "images/CG/The-inbelieveble-of-school/The-inbelieveble-of-school 2-1.png": "344471F6EC6A4D92B3E3A4F9A0C4F5E8",
    "images/CG/The-inbelieveble-of-school/The-inbelieveble-of-school 3.png": "4253E3A8DC4C43E586A3DDBA53A4A6AF",
    "images/CG/The-inbelieveble-of-school/The-inbelieveble-of-school 4-1.png": "9C292825A57E4A5E85C7B9686E18FC48",
    "images/CG/The-inbelieveble-of-school/The-inbelieveble-of-school 5.png": "E3E0C745F8D941F395EB7D2B8486A4E6",
    "images/CG/The-inbelieveble-of-school/The-inbelieveble-of-school 5-1.png": "E1907497859B4E81BC4C4AEAC7E61C43",
    "images/CG/The-inbelieveble-of-school/The-inbelieveble-of-school 5-2.png": "7469B14A83B44907A5986CD48A25A5EC",
    "images/CG/The-inbelieveble-of-school/The-inbelieveble-of-school 6.png": "45E6DC2D2D414F33A0305654A6FC0BE9",
    "images/CG/Revolution-march/Revolution-march 1.png": "48B08BE8EC9F4E278E32DF739320F0D9",
    "images/CG/Revolution-march/Revolution-march 10.png": "61D8FFFC34E4460B9E6EAB78BB0388BC",
    "images/CG/Revolution-march/Revolution-march 2.png": "111AB42F949B4430BA74B6ADE590935E",
    "images/CG/Revolution-march/Revolution-march 3.png": "4C2D5276FCBB40F0B0DEB04A3E2EC3B5",
    "images/CG/Revolution-march/Revolution-march 4.png": "4D24DED204CD42949FB326EEF358987F",
    "images/CG/Revolution-march/Revolution-march 5.png": "03063425963043719D0E021E3257FDBB",
    "images/CG/Revolution-march/Revolution-march 6.png": "44D20D14619C4C49BA2A44119906A340",
    "images/CG/Revolution-march/Revolution-march 7.png": "4D66E39D4F0541B297D6075145C4D09A",
    "images/CG/Revolution-march/Revolution-march 8.png": "67BB6AD80CAE4374A5BE1811B7D7D1D5",
    "images/CG/Revolution-march/Revolution-march 9.png": "9B3BE1450BA84524B154AAD914462F24",
    "images/CG/Revolution-march/Revolution-march Concert 4.png": "29E9A807D6B148168EEACEB2EA7D0A5E",
    "images/CG/Revolution-march/Revolution-march Concert 5.png": "41428618BA4343D9B122066AD821CA68",
    "images/CG/Revolution-march/Revolution-march OkajimaEND 1.png": "8FD417243BAF49B6840F3190C65AA4E5",
    "images/CG/Revolution-march/Revolution-march OkajimaEND 2.png": "4C236CF15FAB471C978461AE1AFB0117",
    "images/CG/Revolution-march/Revolution-march OkajimaEND 3.png": "C57B8F2A70644733BB36E8DA3C8F5B9A",
    "images/CG/Revolution-march/Revolution-march TomoEND 1.png": "82C2A7F9AB474FB6AA0C71F77E91070C",
    "images/CG/Revolution-march/Revolution-march TomoEND 2.png": "793A50EA5F1D4DD095383254ED6D5645",
    "images/Games/Yakyuken/CG/Shintaro/Yakyuken Shintaro 1.png": "C93E3A8AE8DA46FA8F4E3883F10E4A0A",
    "images/Games/Yakyuken/CG/Shintaro/Yakyuken Shintaro 2.png": "C8CDD0393EE8457FAB6E6746ACFC16B4",
    "images/Games/Yakyuken/CG/Shiro/Yakyuken Shiro 1.png": "C66C10E625D1487C81DE82A7A6963CE1",
    "images/Games/Yakyuken/CG/Shiro/Yakyuken Shiro 2.png": "05A1F8B8E2FC4BF48EEB4DCDD2746CEC",
    "images/Games/Yakyuken/CG/Shiro/Yakyuken Shiro 3.png": "C1CF19D2F51147BEA158A4A080C53E8E",
    "images/Games/Yakyuken/CG/Shiro/Yakyuken Shiro 4.png": "82FBA261F8B743E2B7905761A51E8130",
    "images/Games/Yakyuken/CG/Itou/Yakyuken Itou 1.png": "8FE737664EDE4EC7B0E8209B406F0C83",
    "images/Games/Yakyuken/CG/Itou/Yakyuken Itou 2.png": "8914D7D41D88433BA466B30E72553022",
    "images/Games/Yakyuken/CG/Itou/Yakyuken Itou 3.png": "F07581615155432B859CC7C4EA5BB50A",
    "images/Games/Yakyuken/CG/Itou/Yakyuken Itou 4.png": "77ADCB3F3FFE4790ACF1CFA1B370D10E",
    "images/Games/Yakyuken/CG/Tsuki/Yakyuken Tsuki 1.png": "E9A663366FCD424F80AA4C9F0F50B783",
    "images/Games/Yakyuken/CG/Tsuki/Yakyuken Tsuki 2.png": "F232B64B26E9462499506723A75A2478",
    "images/Games/Yakyuken/CG/Tsuki/Yakyuken Tsuki 3.png": "F0B942BCF3F345D994A483AC7B298635",
    "images/Games/Yakyuken/CG/Tsuki/Yakyuken Tsuki 4.png": "7807C68AFE0D45CA9679A08B5635D87F",
    "images/Games/Yakyuken/CG/Shinobu/Yakyuken Shinobu 1.png": "9F56029B7C3B4A9A846CEBD0C4ABA9F6",
    "images/Games/Yakyuken/CG/Shinobu/Yakyuken Shinobu 2.png": "66A4E0F049264A14B7EC2B8586906585",
    "images/Games/Yakyuken/CG/Shinobu/Yakyuken Shinobu 3.png": "4FFF4D5081EF48C48C56351B30912D0D",
    "images/Games/Yakyuken/CG/Shinobu/Yakyuken Shinobu 4.png": "45595CAD90274C6792ED17A5D287AC73",
    "images/Games/Yakyuken/CG/Katou/Yakyuken Katou 1.png": "2ADB5978CA224AD0BEA156342BF3B5F0",
    "images/Games/Yakyuken/CG/Katou/Yakyuken Katou 2.png": "723D3AF7D5734BC090560585CEA18788",
    "images/Games/Yakyuken/CG/Katou/Yakyuken Katou 3.png": "AB78B916A99943F290C5E252F0284D9D",
    "images/Games/Yakyuken/CG/Katou/Yakyuken Katou 4.png": "557C98C111E1428CA41D02A69E29F441",
    "images/Games/Yakyuken/CG/Izumi/Yakyuken Izumi 1.png": "3EF7CB15BDBB46C7AF82217340EF373E",
    "images/Games/Yakyuken/CG/Izumi/Yakyuken Izumi 2.png": "A5A554C6B21A43F2A81B32E021B450ED",
    "images/Games/Yakyuken/CG/Izumi/Yakyuken Izumi 3.png": "8CCEE6A27E144B12B85D173D15807073",
    "images/Games/Yakyuken/CG/Izumi/Yakyuken Izumi 4.png": "E67627BC64024DDDB7016189C04834C4",
    "images/Games/Yakyuken/CG/Matsuta/Yakyuken Matsuta 1.png": "84D27BCD9A7D4F1FB7C4FE3B768FE94A",
    "images/Games/Yakyuken/CG/Matsuta/Yakyuken Matsuta 2.png": "DE11F75619AE4D088BE99CB4C2F9194D",
    "images/Games/Yakyuken/CG/Matsuta/Yakyuken Matsuta 3.png": "1588B519213A4B2192BA12D75A93925E",
    "images/Games/Yakyuken/CG/Matsuta/Yakyuken Matsuta 4.png": "A4A48A6A524F416482A347C3E239F9E5",
    "images/CG/Pluck hair/Pluck hair 2.png": "DE8A835C2AC6467EB4456D8DEFA396B3",
    "images/CG/Pluck hair/Pluck hair 3.png": "B370E5346ABB47548DAE9D421086387D",
    "images/CG/Newsclub/Newsclub 1.png": "267F041B536640EA86097324E1BF5809",
    "images/CG/Newsclub/Newsclub 2.png": "9799A75AC32E46DBB98AC1FC4E281CC9",
    "images/CG/Newsclub/Newsclub 3.png": "692431208FC84C2BBC4BFB384C5535E2",
    "images/CG/Finesse-sumo.png": "1A1E430526B94BB68A38F9C6A6CE9B8C",
    "images/CG/Sports celemony.png": "B4E4E5696DB74835907C35BB91F9BD19",
    "images/CG/Sports celemony win.png": "85BB53EF8F764B8998C0F67FF475E7E5",
    "images/CG/Music festival.png": "9188A4E4C6424BCEA833D3C87DC25D19",
    "images/CG/Music festival win.png": "7AFFBEE2AA274C4C836D31E63DA4932A",
    "images/CG/Cake 2.png": "8D8A506E039845CD89579B536CAB6E35",
    "images/CG/Shiro+Tsubasa-chan.png": "6C20080978734302A13DBD9F5C977D8A",
    "images/CG/Kojima-dress1.png": "9E2ECBA71A44401F9A87C7DF41500965",
    "images/CG/Kojima-dress2.png": "ACC7BF001A154359B4A9C008A8F9B628",
    "images/CG/Bar.png": "11538F8AB5634131B83013199E04FF74",
    "images/CG/The truth of Shintarou 1.png": "8A9A9C995593446F8C7F1623E032EB67",
    "images/CG/The truth of Shintarou 2.png": "D9FF8323B07F4CB09838C9DC0E934C20",
    "images/CG/Yuuhi quest 1.png": "96F52A116B95488881F36C7B55C08BD0",
    "images/CG/Yuuhi quest 2.png": "B6DB788D29BB4DFCBACCD696EA1D68EC",
    "images/CG/Yuuhi 1.png": "3D10951C06114AB5A589638B31BA9888",
    "images/CG/Photo 2.png": "3B270FDC9BBD4F209FD7C52684B74402",
    "images/CG/Photo 3.png": "C95DA2C7DAF24261815104970FA26629",
    "images/CG/Tokiwa+Kyubi.png": "9AB5FF9008204534A8731A5EAC18119E",
    "images/CG/Itou+Kimura.png": "BB04FC5B2E1E42B7B836B5E2E24DAB6A",
    "images/CG/Cave caught.png": "D8781686D9AC4CE7B6A0E90C3986C44F"
};

export function findItemInChildren<T>(node: '' | LiveProject.PropertyWithItem<T>): T[] {
    if (typeof node == 'string')
        return [];
    return arrayIfNeeded(node.Item);
}

export function arrayIfNeeded<T>(value: T | T[]): T[] {
    if (Object.prototype.toString.call(value) === '[object Array]')
        return value as T[];
    else
        return [value] as T[];
}

export function hexName(num: number, length: number = 8){
    let numstr = num.toString(16).toUpperCase();
    let currentLength = numstr.length;
    if (numstr.length>=length) return numstr;
    for (let i = 0; i < length - currentLength; i++)
        numstr = '0' + numstr;  
    return numstr; 
}

export function isValueAvailable(value: any): boolean {
    return value !== null && value !== undefined;
}

export function normalizeVariableValue(variable: LiteScript.Variable): void {
    if (variable.type == LiteScript.VariableType.String && variable.value[0] != '"')
        variable.value = `"${variable.value}"`;
    if (variable.type == LiteScript.VariableType.Boolean)
        variable.value = variable.value ? 'True' : 'False';
}

export function newUUID(): string {
    return UUID.v4().toUpperCase().replace(/-/g, '');
}

export function isMenuSaved(project: GS.Project, source: string): boolean {
    return project.extendedResource.menuFile[source] != null;
}

export function isAnimationSaved(project: GS.Project, source: string): boolean {
    return project.extendedResource.animationFile[source] != null;
}

export function findImageWithAutoCreate(path: string, project: LiteScript.Project): LiteScript.ImageResource {
    let result = project.findResourceByPath<LiteScript.ImageResource>(path);
    if (!result)
        result = project.findImage(project.addResource<void>(LiteScript.ResourceType.Image, path));
    return result;
}

export function findSoundWithAutoCreate(path: string, project: LiteScript.Project): LiteScript.SoundResource {
    let result = project.findResourceByPath<LiteScript.SoundResource>(path);
    if (!result)
        result = project.findSound(project.addResource<void>(LiteScript.ResourceType.Sound, path));
    return result;
}

export function findMovieWithAutoCreate(path: string, project: LiteScript.Project): LiteScript.SoundResource {
    let result = project.findResourceByPath<LiteScript.MovieResource>(path);
    if (!result)
        result = project.findMovie(project.addResource<void>(LiteScript.ResourceType.Movie, path));
    return result;
}

export function findEffectWithAutoCreate(type: LiteScript.EffectType, time: number, reverser: boolean, parameter: number[], project: LiteScript.Project): LiteScript.EffectResource {
    let result = project.resources.find(resource => {
        if (resource.type != LiteScript.ResourceType.Effect) return undefined;
        let resourceDetail = (resource as LiteScript.EffectResource).extraData;
        let result = resourceDetail.type == type && resourceDetail.time == time && resourceDetail.reverse == reverser;
        if (!result) return undefined;
        for (let i = 0; i < resourceDetail.parameter.length; i++)
            if (resourceDetail.parameter[i] != parameter[i])
                return undefined;
        return true;
    });
    if (!result)
        result = project.findEffect(project.addResource<LiteScript.Effect>(LiteScript.ResourceType.Effect, null, {
            type: type,
            time: time,
            reverse: reverser,
            parameter: parameter
        }));
    return result;
}

export function isStaticFile(path: string): boolean {
    return path.startsWith('"') && path.endsWith('"') && path.substring(1, path.length - 1).indexOf('"') < 0;
}

export function trimQuotes(source: string): string {
    if (source.startsWith('"') || source.startsWith('\''))
        source = source.substring(1);
    if (source.endsWith('"') || source.endsWith('\''))
        source = source.substring(0, source.length - 1);
    return source;
}

export function findFileWithId(id: number, project: LiteScript.Project): LiteScript.File {
    let target = project.findFile(hexName(id));
    if (!target)
        throw `Cannot find file with id ${hexName(id)}: Target file is not existed`;
    return target;
}

export function findCharacterByName(name: string, project: LiteScript.Project): LiteScript.CharacterResource {
    let result = project.resources.find(resource => resource.type == LiteScript.ResourceType.Character && (resource as LiteScript.CharacterResource).extraData == name);
    return result;
}

export function stringifyCondition(condition: LiteScript.Condition[]): string {
    let source = condition.filter(v => v.content && v.content != '');
    return '[' + source.map(v => `{ "scope": ${v.scopeIndent}, "content": "${v.content.replace(/"/g, '\\"')}" }`).join(',') + ']';
}

export function calculateAnimationTime(animation: LiteScript.Animation[]): number {
    let stopTime: number = 0;
    animation.forEach(item => {
        let time = item.startTime + item.period;
        if (time > stopTime) stopTime = time;
    });
    return stopTime;
}

export function readDictionary<T>(name: string, parser: (source: string[]) => T): T[] {
    let content = File.readFileSync(name).toString().split('\n');
    return content.map(v => parser(v.split(' => ')));
}

export function removeSelectorCondition(condition: LiteScript.Condition[]): LiteScript.Condition[] {
    return condition.filter(v => !v.content.includes('_lm_selected_value'));
}
