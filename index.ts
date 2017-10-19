import * as Iconv from 'iconv-lite';
import * as Xml from 'fast-xml-parser';
import * as File from 'fs';
import * as Path from 'path';

import * as LanguageConverter from './LanguageConverter';
import * as LiveMakerParser from './LiveMakerParser';
//import * as RenpyGenerator from './RenpyGenerator';
import * as GeneralScript from './include/GeneralScript';
import * as LiveProject from './include/LiveMakerProject';
import * as RenpyMapper from './RenpyMapper';
import * as Utilities from './Utilities';

const TARGET_CODE_ROOT = 'C:\\Users\\lghol\\OneDrive\\Projects\\Renpy\\SCHOOLBOYS-AYUMI\\game\\livemaker';

let originalSource = Iconv.decode(File.readFileSync('data/novel.prj'), 'shift-jis');
let originalProject: LiveProject.Project = Xml.parse(originalSource, Utilities.xmlParseOptions).Project;
let project: GeneralScript.Project = null;

let regenerate: boolean = !File.existsSync('lr_project_structure_local.txt');

if (regenerate) {
    console.log('LiverMaker Project Converter ©2017 GILESFVK ËKITES');
    console.log('GNU LESSER GENERAL PUBLIC LICENSE Version 3');
    console.log(`Resource directory: ${LiveMakerParser.PROJECT_RESOURCE_ROOT}`);
    project = LiveMakerParser.parseProject(originalProject);
    File.writeFileSync('lr_general_script.txt', JSON.stringify(project, null, 2));
    console.log(`General script file had saved to lr_general_script.txt [${File.statSync('lr_general_script.txt').size} bytes]`);
    console.log('');
    project = RenpyMapper.mapUrl(project);
    project = RenpyMapper.mapVariable(project);
    File.writeFileSync('lr_project_structure.txt', JSON.stringify(project, null, 2));
    console.log(`Ren'Py project structure had saved to lr_project_structure.txt [${File.statSync('lr_project_structure.txt').size} bytes]`);
    console.log('Convert from traditional chinese to simplified chinese...');
    project = LanguageConverter.toSimplifiedChinese(project);
    project = RenpyMapper.mapName(project);
    File.writeFileSync('lr_project_structure_local.txt', JSON.stringify(project, null, 2));
    console.log(`Project structure had saved to lr_project_structure_local.txt [${File.statSync('lr_project_structure_local.txt').size} bytes]`);
} else {
    console.log('Use cache file lr_project_structure_local.txt');
    project = JSON.parse(File.readFileSync('lr_project_structure_local.txt').toString());
}
console.log('Analysing project...');


//console.log('Generate Ren\'Py code...');
//console.log(`Target folder: ${TARGET_CODE_ROOT}`);
//RenpyGenerator.generateRenpyCode(project, TARGET_CODE_ROOT);

// This part is in purpose to replace all real resource file's name with the help of replaceUrl
// function replaceName(root: string): void {
//     let children = fs.readdirSync(root);
//     for (let i = 0; i < children.length; i++) {
//         let source = path.join(root, children[i]);
//         children[i] = replaceUrl(children[i]);
//         let newPath = path.join(root, children[i]);
//         if (source != newPath)
//             fs.renameSync(source, newPath);
//         if (fs.lstatSync(newPath).isDirectory()) {
//             replaceName(newPath);
//         }
//     }
// }
// replaceName('C:\\Users\\lghol\\OneDrive\\Projects\\Renpy\\SCHOOLBOYS-AYUMI\\game\\images');
// replaceName('C:\\Users\\lghol\\OneDrive\\Projects\\Renpy\\SCHOOLBOYS-AYUMI\\game\\sound');

/** 以下代码是手动转换部分数据时使用的自动生成代码，现已无用 */
/**
 * CG列表生成
 */
//project = JSON.parse(fs.readFileSync('result.txt').toString());
//let result = '';
//project.cg.forEach(cg => {
//    result += `image lm_gallery_${UUID.v4().toUpperCase().replace(/-/g, '')} = "images/${cg.substring(cg.indexOf('\\') + 1).replace(/\\/g, '/').replace(/\.gal/g, '.png')}"\n`;
//});
//fs.writeFileSync('cg.txt', result);

/**
 * 图像文件复制与转换
 */
//let root = 'C:\\Users\\lghol\\OneDrive\\Backup\\SCB Project\\runimage\\グラフィック';

//let tempDir = 'C:\\Users\\lghol\\Downloads\\temp';

//let targetDir = 'C:\\Users\\lghol\\OneDrive\\Projects\\Renpy\\Deus Legem\\game\\images'

//let fileList: string[] = [];

//function copyFileSync(srcFile, destFile) {
//    let BUF_LENGTH = 64*1024
//    let buff = new Buffer(BUF_LENGTH)
//    let fdr = fs.openSync(srcFile, 'r')
//    let fdw = fs.openSync(destFile, 'w+')
//    let bytesRead = 1
//    let pos = 0
//    while (bytesRead > 0) {
//        bytesRead = fs.readSync(fdr, buff, 0, BUF_LENGTH, pos)
//        fs.writeSync(fdw,buff,0,bytesRead)
//        pos += bytesRead
//    }
//    fs.closeSync(fdr)
//    fs.closeSync(fdw)
//}

//function parseDirctory(root: string): void {
//    fs.readdirSync(root).forEach(name => {
//        name = path.join(root, name);
//        if (fs.lstatSync(name).isDirectory())
//            parseDirctory(name);
//        else if (name.endsWith('.gal')) {
//            fileList.push(name);
//            copyFileSync(name, path.join(tempDir, `${fileList.length - 1}.gal`));
//        }
//    });
//}

//parseDirctory(root);

//fs.writeFileSync('gal_list.txt', fileList.join('\n'));

//fileList = fs.readFileSync('gal_list.txt').toString().split('\n');
//
//fileList.forEach((file, index) => {
//    file = file.substring(root.length + 1).replace(/\.gal/g, '.png');
//    console.log(`Copy: ${path.join(tempDir, `${index}.png`)} -> ${path.join(targetDir, file)}`);
//    fs_extra.copy(path.join(tempDir, `${index}.png`), path.join(targetDir, file));
//});