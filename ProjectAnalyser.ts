import * as GeneralScript from './include/GeneralScript';
import * as LiteScript from './include/LiteScript';
import * as Utilities from './Utilities';
import * as Converter from './Converter';

import * as File from 'fs';
import * as _ from 'lodash';

var effectDictionary: { [key: string]: LiteScript.EffectResource } = {};
var mappedBlockId: string[] = new Array<string>();
const characterList = ["","森海友·一之濑翼·木村树·伊藤圭·小岛正","森海友·赤峰空·一之濑翼","森海友·穗海作哉","森海友·赤峰空","森海友·加藤准太"," 森海友·绫濑忍","森海友·木村树","森海友·猫山四朗","森海友·赤峰月","森海友·猫山三朗","森海友·奥村慎太郎","奥村慎太郎·一之 濑翼","奥村慎太郎·绫濑忍","奥村慎太郎·猫山三朗","一之濑翼·木村树·伊藤圭","一之濑翼·赤峰空","一之濑翼·绫濑忍","一之濑翼· 穗海作哉","一之濑翼·奥村慎太郎","一之濑翼·森海友","绫濑忍·森海友","绫濑忍·赤峰月","绫濑忍·一之濑翼","赤峰月·绫濑忍·赤峰 空","赤峰月·赤峰空","赤峰空·赤峰月","赤峰空·奥村慎太郎·赤峰月","猫山三朗·森海友","猫山三朗·穗海作哉","穗海作哉·赤峰月","榊雪绪·穗海作哉·猫山四朗","榊雪绪·猫山四朗","松田健治·穗海作哉","松田健治·加藤准太·伊藤圭","松田健治·加藤准太·森海友·木 村树","松田健治·加藤准太","小岛正·奥村慎太郎","木村树·伊藤圭","尤西·世依木守","尤西·森海友","加藤准太·森海友","加藤准太·赤峰空·森海友","绫濑忍·清武一","佐藤光·冈岛直弥","妖怪A·一之濑翼","天使·翼·恶魔","天使·恶魔","学生A·学生B","森海友","绫濑忍","加藤准太","小翼（作哉）","小翼","一之濑翼","翼（旁白）","穗海作哉","奥村慎太郎","松田健治","猫山三朗"," 三郎","猫山","木村树","村","赤峰月","赤峰空","冈岛直弥","小岛正","泉翔","伊藤圭","佐藤光","常磐进","诹访部翔银时","猫山 四朗","榊雪绪","世依木守","清武一 ","清武一","中山花音","冈岛雄介","天使","恶魔","诹访部翔平","中山紫音","逆濑荒哉","尤 西","朔","晦","疑似暗黑小熊猫A","疑似暗黑小熊猫B","广播","小林·南","南","小林","暗黑小熊猫A","暗黑小熊猫B","暗黑小熊猫","暗黑小熊猫们","导游","滑子","校长","大家","图书管理员","触手A","触手B","触手","店员","猫","杉本·陆田","陆田","杉本","店长","贝—","黑—","宫—","学弟A","学弟B","学生A","学生B","雪绪·九尾","九尾","大龄男性","教练","工作人员","剑道部部员A","剑 道部部员B","剑道部部员","救生员","忍的妈妈","由实阿姨","男学生A","男学生B","女生A","女生B","女生C","女老师","中年大叔","学生","副班主任","乘务员","参拜者","森海友的母亲","慎太郎之母","旁白","章鱼章鱼星人","慎太郎（乌贼乌贼星人）","乌贼乌贼 星人","其他乌贼乌贼星人","民众","观众","忍（主人公）","主人公","森海友（陨石）","月（父亲）","父亲","空（兄弟A）","三朗 （兄弟B）","作哉（母亲）","母亲","陨石","不良A","不良B","不良C","师父","男","吹奏乐部部员A","吹奏乐部部员B","吹奏乐部部 员C","吹奏乐部顾问","龙套妖怪们","龙套妖怪A","龙套妖怪B","龙套妖怪C","龙套妖怪D","龙套妖怪E","龙套妖怪F","龙套妖怪G","妖怪A（领导）","妖怪A","妖怪B（策士）","妖怪B","妖怪C（无口）","妖怪C","信纸","同学A♂","同学B♂","同学A♀","布偶A·B","布 偶A","布偶B","可疑的和尚A","可疑的和尚B","可疑的和尚C","可疑的和尚们","可疑的师父","可疑的一帮人","某工薪男","和尚","司 机","老师","A","B","？？？","未知来源的声音","迷之人物"];

export function analyseProject(source: GeneralScript.Project): LiteScript.Project {
    let project = new LiteScript.Project();
    console.log('Analysing pre-defined resources...');
    // Global variable
    source.variable.forEach(variable => {
        let target = project.addVariable(variable.name, variable.type, variable.scope);
        target.value = variable.value;
    });
    // Gallery
    source.gallery.forEach(gallery => {
        let id: string = Utilities.galleryList[gallery];
        if (!id)
            throw `Cannot find pre-defined id for gallery image ${gallery}`;
        project.addGallery(gallery, id);
    });
    // Character
    characterList.forEach(character => {
        project.addResource<string>(LiteScript.ResourceType.Character, null, character);
    });
    // Menu file
    Object.keys(source.extendedResource.menuFile).forEach(menuPath => {
        let menuFile = source.extendedResource.menuFile[menuPath];
        let menuObject: LiteScript.Menu = { item: [] };
        menuFile.item.forEach(item => {
            let idleImage = Utilities.findImageWithAutoCreate(item.idleImage, project);
            let hoverImage = null;
            if (item.hoverImage && item.hoverImage != '')
                hoverImage = Utilities.findImageWithAutoCreate(item.hoverImage, project);
            let previewImage: LiteScript.ImageResource = null;
            if (item.preview && item.preview.image)
                previewImage = Utilities.findImageWithAutoCreate(item.preview.image, project);
            let result: LiteScript.MenuItem = {
                name: item.name,
                position: new LiteScript.Point(item.position.x, item.position.y),
                idleImage: idleImage
            };
            if (hoverImage)
                result.hoverImage = hoverImage;
            if (item.preview)
                result.preview = {
                    position: new LiteScript.Point(item.preview.position.x, item.preview.position.y),
                    image: previewImage
                };
            menuObject.item.push(result);
        });
        project.addResource<LiteScript.Menu>(LiteScript.ResourceType.Menu, menuPath, menuObject);
    });
    // Animation file
    Object.keys(source.extendedResource.animationFile).forEach(animationPath => {
        let animationFile = source.extendedResource.animationFile[animationPath];
        let animationList: LiteScript.Animation[] = new Array<LiteScript.Animation>();
        animationFile.forEach(animation => {
            let source = Utilities.findImageWithAutoCreate(animation.source, project);
            let result: LiteScript.Animation = {
                name: animation.name,
                source: source,
                startTime: animation.startTime,
                period: animation.period,
                priority: animation.priority,
                horizontalReverse: animation.horizontalReverse,
                verticalReverse: animation.verticalReverse,
                center: new LiteScript.Point(animation.center.x, animation.center.y)
            };
            if (animation.location) result.location = animation.location;
            if (animation.rotate) result.rotate = animation.rotate;
            if (animation.zoom) result.zoom = animation.zoom;
            if (animation.alpha) result.alpha = animation.alpha;
            if (animation.clip) result.clip = animation.clip;
            animationList.push(result);
        });
        project.addResource<LiteScript.Animation[]>(LiteScript.ResourceType.Animation, animationPath, animationList);
    });
    // Block map
    console.log('Creating block map...');
    source.scene.forEach(scene => {
        mappedBlockId = [];
        createBlockRelation(scene, project);
    });
    // File relation
    console.log('Create file relation...');
    source.scene.forEach(scene => {
        mappedBlockId = [];
        createFileRelation(scene, project.findFile(Utilities.hexName(scene.id)).entrance);
    });
    // Block content
    console.log('Analysing block content...');
    source.scene.forEach(scene => {
        mappedBlockId = [];
        fillBlock(scene, project.findFile(Utilities.hexName(scene.id)).entrance);
    });
    return project;
}

function createBlockRelation(source: GeneralScript.Scene, project: LiteScript.Project): void {
    console.log(`\t[Scene] ${Utilities.hexName(source.id)}`);
    let file = project.addFile(Utilities.hexName(source.id));
    file.name = source.name;
    // Variable
    source.variable.forEach(variable => {
        let newVariable = file.addVariable(variable.name, variable.type, variable.scope);
        newVariable.value = variable.value;
    });
    // Entrance
    let entranceBlockSource = source.block.find(block => block.id == source.entrance);
    if (!entranceBlockSource)
        throw `Cannot create file with id ${file.id}: No entrace block for this file`;
    let entranceBlock = file.newBlock(Utilities.hexName(entranceBlockSource.id), LiteScript.BlockType.SceneStart);
    file.entrance = entranceBlock;
    console.log(`\t\tFind entrance at ${entranceBlock.id}`);
    createFileMap(source, entranceBlockSource, entranceBlock);
}

function createFileMap(scene: GeneralScript.Scene, source: GeneralScript.Block, block: LiteScript.Block): void {
    if (mappedBlockId.includes(block.id)) return;
    mappedBlockId.push(block.id);
    // End at SceneEnd
    if (block.type == LiteScript.BlockType.SceneEnd)
        return;
    // Generate block map
    source.next.forEach(next => {
        let nextBlockName = Utilities.hexName(next.target);
        let nextBlock = block.file.entrance.findById(nextBlockName);
        let nextBlockSource = scene.block.find(block => block.id == next.target);
        if (!nextBlock) {
            let nextBlockType = Converter.liteBlockType(nextBlockSource.type);
            if (!nextBlockType) return;
            nextBlock = block.file.newBlock(nextBlockName, nextBlockType);
            console.log(`\t\tCreate block ${nextBlockName}`);
        }
        block.addNext(nextBlock, next.condition);
        console.log(`\t\tBuild relation ${block.id} -> ${nextBlockName}`);
        createFileMap(scene, nextBlockSource, nextBlock);
    });
}

function createFileRelation(scene: GeneralScript.Scene, block:LiteScript.Block): void {
    if (mappedBlockId.includes(block.id)) return;
    mappedBlockId.push(block.id);
    let source = scene.block.find(v => v.id == parseInt(block.id, 16));
    if (block.type == LiteScript.BlockType.Call) {
        let content = block.content<LiteScript.BlockDataCall>();
        let sourceContent = source.data as GeneralScript.BlockDataCall;
        if (sourceContent.target < 0)
            content.page = sourceContent.page;
        else {
            let target = Utilities.findFileWithId(sourceContent.target, block.file.project);
            content.target = target.entrance;
            target.entrance.previousBlocks.push(block);
        }
    } else if (block.type == LiteScript.BlockType.Jump) {
        let content = block.content<LiteScript.BlockDataJump>();
        let sourceContent = source.data as GeneralScript.BlockDataJump;
        let target = Utilities.findFileWithId(sourceContent.target, block.file.project);
        content.target = target.entrance;
        target.entrance.previousBlocks.push(block);
    }
    block.nextBlocks.forEach(next => {
        createFileRelation(scene, next.target);
    });
}

function fillBlock(scene: GeneralScript.Scene, block:LiteScript.Block): void {
    if (mappedBlockId.includes(block.id)) return;
    mappedBlockId.push(block.id);
    let source = scene.block.find(v => v.id == parseInt(block.id, 16));
    block.name = source.name;
    if (block.type == LiteScript.BlockType.Calculator) {
        let content = block.content<LiteScript.BlockDataCalculator>();
        let sourceContent = source.data as GeneralScript.BlockDataCalculator;
        sourceContent.variable.forEach(variable => {
            let target = content.addVariable(variable.name, variable.type, variable.scope);
            target.value = variable.value;
        });
        let extraVariables: LiteScript.Variable[] = new Array<LiteScript.Variable>();
        sourceContent.code.forEach(code => {
            fillCalculator(code, content, extraVariables);
        });
    } else if (block.type == LiteScript.BlockType.Choice) {
        let content = block.content<LiteScript.BlockDataChoice>();
        let sourceContent = source.data as GeneralScript.BlockDataChoice;
        if (typeof sourceContent.time == 'string') {
            let animation = block.file.project.findResourceByPath<LiteScript.AnimationResource>(sourceContent.time);
            if (!animation)
                throw `Cannot add time limitation to choice in block with id ${block.id}: Waiting animation file is not existed.`;
            content.time = animation;
        } else
            content.time = sourceContent.time;
        if (sourceContent.hoverSound)
            content.hoverSound = Utilities.findSoundWithAutoCreate(sourceContent.hoverSound, block.file.project);
        if (sourceContent.selectSound)
            content.selectSound = Utilities.findSoundWithAutoCreate(sourceContent.selectSound, block.file.project);
        sourceContent.choice.forEach(choice => {
            let item = content.newItem();
            item.title = choice.title;
            item.condition = choice.condition;
        });
    } else if (block.type == LiteScript.BlockType.Input) {
        let content = block.content<LiteScript.BlockDataInput>();
        let sourceContent = source.data as GeneralScript.BlockDataInput;
        content.title = sourceContent.title;
        sourceContent.content.forEach(item => {
            let input = content.newItem();
            input.hint = item.title;
            let variable = block.file.findVariable(item.storedVariableName);
            if (!variable)
                throw `Cannot add input in block with id ${block.id}: No stored variable for this input`;
            input.storedVariable = variable;
        });
    } else if (block.type == LiteScript.BlockType.Menu) {
        let content = block.content<LiteScript.BlockDataMenu>();
        let sourceContent = source.data as GeneralScript.BlockDataMenu;
        content.fadeIn = sourceContent.fadeIn;
        content.fadeOut = sourceContent.fadeOut;
        if (sourceContent.timeLimitation)
            content.timeLimitation = sourceContent.timeLimitation;
        if (sourceContent.hoverSound)
            content.hoverSound = Utilities.findSoundWithAutoCreate(sourceContent.hoverSound, block.file.project);
        if (sourceContent.clickSound)
            content.clickSound = Utilities.findSoundWithAutoCreate(sourceContent.clickSound, block.file.project);
        let menuFile = block.file.project.findResourceByPath<LiteScript.MenuResource>(sourceContent.name);
        if (!menuFile)
            throw `Cannot create menu in block with id ${block.id}: No menu definition file can be found for this menu`;
        content.target = menuFile;
    } else if (block.type == LiteScript.BlockType.Normal) {
        let content = block.content<LiteScript.BlockDataNormal>();
        let sourceContent = source.data as GeneralScript.BlockDataNormal;
        let characters = characterList.map(v => ({ name: v, id: Utilities.newUUID() }));
        fillNormal(sourceContent.content, content, characters);
    }
    block.nextBlocks.forEach(next => {
        fillBlock(scene, next.target);
    });
}

function fillCalculator(codeSource: GeneralScript.Code, calculator: LiteScript.BlockDataCalculator, extraVariables: LiteScript.Variable[]): void {
    if (codeSource.type == GeneralScript.CalculatorType.RawCode) {
        let code = calculator.addCode(LiteScript.CalculatorType.RawCode);
        code.content<LiteScript.CalculatorDataRawCode>().content = (codeSource.data as GeneralScript.CalculatorDataRawCode).content;
        code.scopeIndent = codeSource.scopeIndent;
    } else if (codeSource.type == GeneralScript.CalculatorType.CreateVariable) {
        let code = calculator.addCode(LiteScript.CalculatorType.CreateVariable);
        let variable = (codeSource.data as GeneralScript.CalculatorDataCreateVariable).content;
        let target = new LiteScript.Variable(variable.name, variable.type, variable.scope);
        code.content<LiteScript.CalculatorDataVariable>().content = target;
        extraVariables.push(target);
        code.scopeIndent = codeSource.scopeIndent;
    } else if (codeSource.type == GeneralScript.CalculatorType.ClearVariable) {
        let code = calculator.addCode(LiteScript.CalculatorType.ClearVariable);
        let variableName = (codeSource.data as GeneralScript.CalculatorDataClearVariable).content;
        let variable = extraVariables.find(v => v.name == variableName);
        if (!variable) variable = calculator.findVariable(variableName);
        if (!variable) {
            console.warn(`WARNING: Try clear variable which is defined in another file, analyser will skip integrity check for this variable.`);
            console.warn(`\tName: ${variableName}`);
            console.warn(`\tCleat at: ${calculator.block.id} (${calculator.block.name}) in file ${calculator.block.file.id} (${calculator.block.file.name})`);
            console.warn('');
        }
        code.content<LiteScript.CalculatorDataVariable>().content = variable;
        let extraVarIndex = extraVariables.findIndex(v => v.name == variable.name);
        if (extraVarIndex > -1)
            extraVariables.splice(extraVarIndex, 1);
        code.scopeIndent = codeSource.scopeIndent;
    } else if (codeSource.type == GeneralScript.CalculatorType.If) {
        let code = calculator.addCode(LiteScript.CalculatorType.If);
        code.content<LiteScript.CalcualtorDataConditionBase>().condition = (codeSource.data as GeneralScript.CalcualtorDataConditionBase).condition;
        code.scopeIndent = codeSource.scopeIndent;
    } else if (codeSource.type == GeneralScript.CalculatorType.Elseif) {
        let code = calculator.addCode(LiteScript.CalculatorType.Elseif);
        code.content<LiteScript.CalcualtorDataConditionBase>().condition = (codeSource.data as GeneralScript.CalcualtorDataConditionBase).condition;
        code.scopeIndent = codeSource.scopeIndent;
    } else if (codeSource.type == GeneralScript.CalculatorType.Else) {
        let code = calculator.addCode(LiteScript.CalculatorType.Else);
        code.scopeIndent = codeSource.scopeIndent;
    } else if (codeSource.type == GeneralScript.CalculatorType.While) {
        let code = calculator.addCode(LiteScript.CalculatorType.While);
        let content = code.content<LiteScript.CalculatorDataWhile>();
        let contentSource = (codeSource.data as GeneralScript.CalculatorDataWhile);
        content.condition = contentSource.condition;
        content.init = contentSource.init;
        content.loop = contentSource.loop;
        code.scopeIndent = codeSource.scopeIndent;
    } else if (codeSource.type == GeneralScript.CalculatorType.Break) {
        let code = calculator.addCode(LiteScript.CalculatorType.Break);
        code.content<LiteScript.CalcualtorDataConditionBase>().condition = (codeSource.data as GeneralScript.CalcualtorDataConditionBase).condition;
        code.scopeIndent = codeSource.scopeIndent;
    } else if (codeSource.type == GeneralScript.CalculatorType.Continue) {
        let code = calculator.addCode(LiteScript.CalculatorType.Continue);
        code.content<LiteScript.CalcualtorDataConditionBase>().condition = (codeSource.data as GeneralScript.CalcualtorDataConditionBase).condition;
        code.scopeIndent = codeSource.scopeIndent;
    } else if (codeSource.type == GeneralScript.CalculatorType.Call) {
        let code = calculator.addCode(LiteScript.CalculatorType.Call);
        let content = code.content<LiteScript.CalculatorDataCall>();
        let contentSource = (codeSource.data as GeneralScript.CalculatorDataCall);
        content.condition = contentSource.condition;
        content.param = contentSource.param;
        content.target = contentSource.target;
        let variable = null;
        if (contentSource.resultStoredVariable && contentSource.resultStoredVariable != '') {
            variable = extraVariables.find(v => v.name == contentSource.resultStoredVariable)
            if (!variable) variable = calculator.findVariable(contentSource.resultStoredVariable);
            if (!variable) throw `Cannot generate call: Variable ${contentSource.resultStoredVariable} is not existed`;
        }
        content.resultStoredVariable = variable;
        code.scopeIndent = codeSource.scopeIndent;
    } else if (codeSource.type == GeneralScript.CalculatorType.Pause) {
        let code = calculator.addCode(LiteScript.CalculatorType.Pause);
        let content = code.content<LiteScript.CalculatorDataPause>();
        let contentSource = (codeSource.data as GeneralScript.CalculatorDataPause);
        content.condition = contentSource.condition;
        content.time = contentSource.time;
        code.scopeIndent = codeSource.scopeIndent;
    } else if (codeSource.type == GeneralScript.CalculatorType.DeleteObject) {
        let code = calculator.addCode(LiteScript.CalculatorType.DeleteObject);
        code.content<LiteScript.CalculatorDataDeleteObject>().content = (codeSource.data as GeneralScript.CalculatorDataDeleteObject).content;
        code.scopeIndent = codeSource.scopeIndent;
    } else if (codeSource.type == GeneralScript.CalculatorType.CreateImage) {
        let code = calculator.addCode(LiteScript.CalculatorType.CreateImage);
        let content = code.content<LiteScript.CalculatorDataCreateImage>();
        let contentSource = (codeSource.data as GeneralScript.CalculatorDataCreateImage);
        content.left = contentSource.left;
        content.top = contentSource.top;
        content.name = contentSource.name;
        content.priority = contentSource.priority;
        if (Utilities.isStaticFile(contentSource.source)) {
            let target = Utilities.findImageWithAutoCreate(Utilities.trimQuotes(contentSource.source), calculator.block.file.project);
            content.source = target;
        } else
            content.source = contentSource.source;
        code.scopeIndent = codeSource.scopeIndent;
    } else if (codeSource.type == GeneralScript.CalculatorType.PlaySound) {
        let code = calculator.addCode(LiteScript.CalculatorType.PlaySound);
        let content = code.content<LiteScript.CalculatorDataSound>();
        let contentSource = (codeSource.data as GeneralScript.CalculatorDataSound);
        content.name = contentSource.name;
        content.repeat = contentSource.repeat;
        if (Utilities.isStaticFile(contentSource.source)) {
            let target = Utilities.findSoundWithAutoCreate(Utilities.trimQuotes(contentSource.source), calculator.block.file.project);
            content.source = target;
        } else
            content.source = contentSource.source;
        code.scopeIndent = codeSource.scopeIndent;
    } else if (codeSource.type == GeneralScript.CalculatorType.StopMedia) {
        let code = calculator.addCode(LiteScript.CalculatorType.StopMedia);
        let content = code.content<LiteScript.CalculatorDataStopMedia>();
        let contentSource = (codeSource.data as GeneralScript.CalculatorDataStopMedia);
        content.fadeTime = contentSource.fadeTime;
        content.name = contentSource.name;
        code.scopeIndent = codeSource.scopeIndent;
    } else if (codeSource.type == GeneralScript.CalculatorType.Comment) {
        let code = calculator.addCode(LiteScript.CalculatorType.Comment);
        code.content<LiteScript.CalculatorDataRawCode>().content = (codeSource.data as GeneralScript.CalculatorDataRawCode).content;
    } else {
        let code = calculator.addCode(LiteScript.CalculatorType.ShouldConvertManual);
        code.content<LiteScript.CalculatorDataShouldConvertManual>().content = (codeSource.data as GeneralScript.CalculatorDataShouldConvertManual).content;
        code.scopeIndent = codeSource.scopeIndent;
    }
}

function fillNormal(nodeSource: GeneralScript.Command[], blockContent: LiteScript.BlockDataNormal, characters: {name:string,id:string}[]): void {
    let i = 0;
    let inDiaogue: boolean = false;
    let effects = findAllEffectWithAutoCreate(nodeSource, blockContent);
    let activeCharacter: LiteScript.CharacterResource = null;
    while (i < nodeSource.length) {
        let commandSource = nodeSource[i];
        if (commandSource.type == GeneralScript.CommandType.WaitAndClear) {
            activeCharacter = null;
            blockContent.newItem(LiteScript.CommandType.WaitAndClear);
        } else if (commandSource.type == GeneralScript.CommandType.WaitForClick) {
            blockContent.newItem(LiteScript.CommandType.WaitForClick);
        } else if (commandSource.type == GeneralScript.CommandType.Wait) {
            blockContent.newItem(LiteScript.CommandType.Wait).content<LiteScript.CommandContentTimeTarget>().time = (commandSource.content as GeneralScript.CommandContentTimeTarget).time;
        } else if (commandSource.type == GeneralScript.CommandType.WaitUntilFinish) {
            console.warn(`WARNING: WaitUntilFinish is not supported by LiteScript, will be ignored.`);
            console.warn(`\tAt: ${blockContent.block.id} (${blockContent.block.name}) in file ${blockContent.block.file.id} (${blockContent.block.file.name})`);
            console.warn();
        } else if (commandSource.type == GeneralScript.CommandType.ChangeMessageBox) {
            blockContent.newItem(LiteScript.CommandType.ShowMessageBox).content<LiteScript.CommandContentNameTarget>().name = (commandSource.content as GeneralScript.CommandContentNameTarget).name;
        } else if (commandSource.type == GeneralScript.CommandType.MessageBox) {
            blockContent.newItem(LiteScript.CommandType.ShowMessageBox).content<LiteScript.CommandContentTimeTarget>().time = (commandSource.content as GeneralScript.CommandContentTimeTarget).time;
        } else if (commandSource.type == GeneralScript.CommandType.DestroyMessageBox) {
            blockContent.newItem(LiteScript.CommandType.HideMessageBox).content<LiteScript.CommandContentTimeTarget>().time = (commandSource.content as GeneralScript.CommandContentTimeTarget).time;
        } else if (commandSource.type == GeneralScript.CommandType.Quake || commandSource.type == GeneralScript.CommandType.StopQuake) {
            console.warn(`WARNING: Quake is not supported by LiteScript, will be ignored.`);
            console.warn(`\tAt: ${blockContent.block.id} (${blockContent.block.name}) in file ${blockContent.block.file.id} (${blockContent.block.file.name})`);
            console.warn();
        } else if (commandSource.type == GeneralScript.CommandType.ChangeTextSpeed) {
            let contentSource = commandSource.content as GeneralScript.CommandContentTextSpeed;
            blockContent.newItem(LiteScript.CommandType.HideMessageBox).content<LiteScript.CommandContentTextSpeed>().speed = (commandSource.content as GeneralScript.CommandContentTextSpeed).speed;
        } else if (commandSource.type == GeneralScript.CommandType.Movie) {
            let contentSource = commandSource.content as GeneralScript.CommandContentMovie;
            let target = Utilities.findMovieWithAutoCreate(contentSource.source, blockContent.block.file.project);
            blockContent.newItem(LiteScript.CommandType.Movie).content<LiteScript.CommandContentMovie>().source = target;
        } else if (commandSource.type == GeneralScript.CommandType.SaveLoadToggle) {
            blockContent.newItem(LiteScript.CommandType.SaveLoadToggle).content<LiteScript.CommandContentToggle>().value = (commandSource.content as GeneralScript.CommandContentToggle).value;
        } else if (commandSource.type == GeneralScript.CommandType.MenuToggle) {
            blockContent.newItem(LiteScript.CommandType.MenuToggle).content<LiteScript.CommandContentToggle>().value = (commandSource.content as GeneralScript.CommandContentToggle).value;
        } else if (commandSource.type == GeneralScript.CommandType.Sound) {
            let contentSource = commandSource.content as GeneralScript.CommandContentSound;
            let target = Utilities.findSoundWithAutoCreate(contentSource.source, blockContent.block.file.project);
            let content = blockContent.newItem(LiteScript.CommandType.Sound).content<LiteScript.CommandContentSound>();
            content.track = contentSource.track;
            content.volume = contentSource.volume;
            content.mode = contentSource.mode;
            content.source = target;
        } else if (commandSource.type == GeneralScript.CommandType.ChangeVolume) {
            let contentSource = commandSource.content as GeneralScript.CommandContentChangeVolume;
            let content = blockContent.newItem(LiteScript.CommandType.ChangeVolume).content<LiteScript.CommandContentChangeVolume>();
            content.time = contentSource.time;
            content.track = contentSource.track;
            content.volume = contentSource.volume;
            content.waitUntilFinish = contentSource.waitUntilFinish;
        } else if (commandSource.type == GeneralScript.CommandType.StopSound) {
            let contentSource = commandSource.content as GeneralScript.CommandContentStopSound;
            let content = blockContent.newItem(LiteScript.CommandType.StopSound).content<LiteScript.CommandContentStopSound>();
            content.time = contentSource.time;
            content.track = contentSource.track;
        } else if (commandSource.type == GeneralScript.CommandType.Image) {
            let contentSource = commandSource.content as GeneralScript.CommandContentImage;
            let content = blockContent.newItem(LiteScript.CommandType.Image).content<LiteScript.CommandContentImage>();
            let target: LiteScript.ImageResource | LiteScript.AnimationResource;
            if (contentSource.source.endsWith('.png'))
                target = Utilities.findImageWithAutoCreate(contentSource.source, blockContent.block.file.project);
            else
                target = blockContent.block.file.project.findResourceByPath<LiteScript.AnimationResource>(contentSource.source);
            if (!target)
                throw `Cannot add image to block with id ${blockContent.block.id}: Failed to find image located in  ${contentSource.source}`;
            content.source = target;
            content.priority = contentSource.priority;
            content.mode = contentSource.mode;
            content.name = contentSource.name;
            content.effect = effects.find(v => v.name == contentSource.effect).content;
            if (!content.effect)
                throw `Cannot add image to block with id ${blockContent.block.id}: Failed to find effect with name ${contentSource.effect}`;
            let position: LiteScript.Point = null;
            if (contentSource.x < 0 || contentSource.y < 0) {
                position = new LiteScript.Point(0.0, 0.0, true);
                if (contentSource.x == GeneralScript.Align.Left)
                    position.x = 0.0;
                else if (contentSource.x == GeneralScript.Align.Center)
                    position.x = 0.5;
                else if (contentSource.x == GeneralScript.Align.Right)
                    position.x = 1.0;
                if (contentSource.y == GeneralScript.Align.Top)
                    position.y = 0.0;
                else if (contentSource.y == GeneralScript.Align.Center)
                    position.y = 0.5;
                else if (contentSource.y == GeneralScript.Align.Bottom)
                    position.y = 1.0
            } else
                position = new LiteScript.Point(contentSource.x, contentSource.y);
            content.position = position;
        } else if (commandSource.type == GeneralScript.CommandType.ChangeImage) {
            let contentSource = commandSource.content as GeneralScript.CommandContentChangeImage;
            let content = blockContent.newItem(LiteScript.CommandType.ChangeImage).content<LiteScript.CommandContentChangeImage>();
            let target: LiteScript.ImageResource | LiteScript.AnimationResource;
            if (contentSource.source.endsWith('.png'))
                target = Utilities.findImageWithAutoCreate(contentSource.source, blockContent.block.file.project);
            else
                target = blockContent.block.file.project.findResourceByPath<LiteScript.AnimationResource>(contentSource.source);
            if (!target)
                throw `Cannot add image to block with id ${blockContent.block.id}: Failed to find image located in  ${contentSource.source}`;
            content.source = target;
            content.mode = contentSource.mode;
            content.name = contentSource.name;
            content.effect = effects.find(v => v.name == contentSource.effect).content;
            if (!content.effect)
                throw `Cannot change image in block with id ${blockContent.block.id}: Failed to find effect with name ${contentSource.effect}`;
        } else if (commandSource.type == GeneralScript.CommandType.DestroyImage) {
            let contentSource = commandSource.content as GeneralScript.CommandContentDestroyImage;
            let content = blockContent.newItem(LiteScript.CommandType.DestroyImage).content<LiteScript.CommandContentDestroyImage>();
            content.target = contentSource.target;
            content.effect = effects.find(v => v.name == contentSource.effect).content;
            if (!content.effect)
                throw `Cannot hide image in block with id ${blockContent.block.id}: Failed to find effect with name ${contentSource.effect}`;
        } else if (commandSource.type == GeneralScript.CommandType.Text) {
            let contentSource = commandSource.content as GeneralScript.CommandContentText;
            let content = blockContent.newItem(LiteScript.CommandType.Dialogue).content<LiteScript.CommandContentDialogue>();
            if (activeCharacter)
                content.character = activeCharacter;
            else {
                let lines = contentSource.text.split('\n');
                if (lines.length > 1) {
                    activeCharacter = Utilities.findCharacterByName(lines[0].trim(), blockContent.block.file.project);
                    lines.splice(0, 1);
                    contentSource.text = lines.join('\n');
                }
                if (!activeCharacter)
                    activeCharacter = Utilities.findCharacterByName('', blockContent.block.file.project);
            }
            content.character = activeCharacter;
            while (i < nodeSource.length && (commandSource.type == GeneralScript.CommandType.Text || commandSource.type == GeneralScript.CommandType.ShowVariableContent )) {
                let text = content.newText();
                if (contentSource.bold) text.bold = contentSource.bold;
                if (contentSource.borderColor) text.borderColor = contentSource.borderColor;
                if (contentSource.borderWidth) text.borderWidth = contentSource.borderWidth;
                if (contentSource.color) text.color = contentSource.color;
                if (contentSource.italic) text.italic = contentSource.italic;
                if (contentSource.size) text.size = contentSource.size;
                if (contentSource.underline) text.underline = contentSource.underline;
                if (commandSource.type == GeneralScript.CommandType.Text) {
                    text.text = contentSource.text;
                } else {
                    let name = (commandSource.content as GeneralScript.CommandContentNameTarget).name;
                    text.text = blockContent.block.file.findVariable(name)
                    if (!text)
                        throw `Cannot add text to block with id ${blockContent.block.id}: No variable with name ${name} can be found to be shown.`;
                }
                i ++;
                commandSource = nodeSource[i];
            }
            i --;
        } else if (commandSource.type == GeneralScript.CommandType.Effect) {

        } else
            throw `Cannot add content to block with id ${blockContent.block.id}: Unknow content type ${commandSource.type}.`;
        i ++;
    }
}

function findAllEffectWithAutoCreate(nodeSource: GeneralScript.Command[], blockContent: LiteScript.BlockDataNormal): { name: string, content: LiteScript.EffectResource }[] {
    return nodeSource.filter(v => v.type == GeneralScript.CommandType.Effect)
    .map(v => {
        let content = v.content as GeneralScript.CommandContentEffect;
        let result =  Utilities.findEffectWithAutoCreate(
            content.type,
            content.time,
            content.reverse,
            content.parameter.map(t => parseInt(t)),
            blockContent.block.file.project
        );
        return {
            name: content.name,
            content: result
        };
    });
}
