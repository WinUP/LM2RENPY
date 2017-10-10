import * as iconv from 'iconv-lite';
import * as xml2js from 'xml2js';
import * as fs from 'fs';
import * as path from 'path';

import { TranslationKeyword, mapUrl, mapVariable } from './RenpyMapper';
import { parseProject, PROJECT_RESOURCE_ROOT } from './LiveMakerParser';
import { Project, BlockType, BlockCalculator } from './include/GeneralScript';
import { toSimplifiedChinese } from './LanguageConverter';
import { generateRenpyCode } from './RenpyGenerator';
import { LiveMakerProject } from './include/LiveMakerProject';

//function replaceName(root: string): void {
//    let children = fs.readdirSync(root);
//    for (let i = 0; i < children.length; i++) {
//        let source = path.join(root, children[i]);
//        children[i] = replaceUrl(children[i]);
//        let newPath = path.join(root, children[i]);
//        if (source != newPath)
//            fs.renameSync(source, newPath);
//        if (fs.lstatSync(newPath).isDirectory()) {
//            replaceName(newPath);
//        }
//    }
//}
//replaceName('C:\\Users\\lghol\\OneDrive\\Projects\\Renpy\\SCHOOLBOYS-AYUMI\\game\\images');
//replaceName('C:\\Users\\lghol\\OneDrive\\Projects\\Renpy\\SCHOOLBOYS-AYUMI\\game\\sound');

const TARGET_CODE_ROOT = 'C:\\Users\\lghol\\OneDrive\\Projects\\Renpy\\SCHOOLBOYS-AYUMI\\game\\livemaker';

let str = iconv.decode(fs.readFileSync('data/novel.prj'), 'shift-jis');
let project: Project = null;

xml2js.parseString(str, { explicitArray : false, ignoreAttrs : false }, (err, result) => {
    //console.log('LiverMaker工程转换器 ©2017 同人社团GILESFVK ËKITES');
    //console.log('GNU LESSER GENERAL PUBLIC LICENSE Version 3');
    //console.log(`资源文件引用目录：${PROJECT_RESOURCE_ROOT}`);
    //project = parseProject(result.Project);
    //fs.writeFileSync('general_script.txt', JSON.stringify(project, null, 2));
    //console.log(`通用脚本文件已保存至general_script.txt（${fs.statSync('general_script.txt').size}字节）`);
    //console.log('');
    //project = mapUrl(project);
    //project = mapVariable(project);
    //fs.writeFileSync('project_structure.txt', JSON.stringify(project, null, 2));
    //console.log(`Ren'Py工程映射文件已保存至project_structure.txt（${fs.statSync('project_structure.txt').size}字节）`);
    //console.log('转换为简体中文……');
    //project = toSimplifiedChinese(project);
    //fs.writeFileSync('project_structure_cn.txt', JSON.stringify(project, null, 2));
    //console.log(`简体中文工程文件已保存至project_structure_cn.txt（${fs.statSync('project_structure_cn.txt').size}字节）`);
    console.log('使用缓存文件');
    project = JSON.parse(fs.readFileSync('project_structure_cn.txt').toString());
    console.log('生成Ren\'Py代码……');
    console.log(`目标文件夹：${TARGET_CODE_ROOT}`);
    generateRenpyCode(project, TARGET_CODE_ROOT);
});

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