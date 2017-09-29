import * as fs from 'fs';
import * as iconv from 'iconv-lite';
import * as xml2js from 'xml2js';
//import * as express from "express";

import { LiveMakerProject } from './include/LiveMakerProject';
import { Project } from './include/GeneralScript';
import { parseProject } from './LiveMakerParser';

let str = iconv.decode(fs.readFileSync('data/novel.prj'), 'shift-jis');
let project: Project = null;

xml2js.parseString(str, { explicitArray : false, ignoreAttrs : false }, (err, result) => {
    console.log('LiverMaker工程转换器 ©2017 同人社团GILESFVK ËKITES');
    console.log('GNU LESSER GENERAL PUBLIC LICENSE Version 3');
    project = parseProject(result.Project);
    fs.writeFileSync('result.txt', JSON.stringify(project, null, 2));
    console.log(`通用脚本文件已保存至result.txt（${fs.statSync('result.txt').size}字节）`)
});
