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
    project = parseProject(result.Project);
    fs.writeFileSync('result.txt', JSON.stringify(project, null, 2));
});

//const SERVER_PORT = 65534;
//
//let application: express.Application = express();
//let apiRouter: express.Router;
//application.listen(SERVER_PORT, function() {
//    console.log(`Server start at port ${SERVER_PORT}`);
//});
//
//application.get('/scenes', (request, response) => {
//    if (!scene) {
//        response.send('[]');
//        return;
//    }
//    response.send(scene);
//});