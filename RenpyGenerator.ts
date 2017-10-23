import * as Path from 'path';
import * as File from 'fs';
import * as _ from 'lodash';

import * as LiteScript from './include/LiteScript';
import * as Utilities from './Utilities';
import * as Mapper from './RenpyMapper';
import * as Renpy from './include/Renpy';

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
    private _name: string;
    private pythonBlockIndent: number = null;
    private whileLabel: string[] = new Array<string>();
    private soundChannel: string[] = new Array<string>();

    public static prefix = {
        imageResource: 'rs_image',
        character: 'rs_character',
        effect: 'rs_effect',
        block: 'block'
    };

    /**
     * 生成一个Ren'Py脚本文件
     * @param name 文件名称（相对于全局目录的名称或路径，不含扩展名）
     */
    public constructor(name: string) {
        this._name = name;
    }

    /**
     * 获取文件的名称
     */
    public get name(): string {
        return this._name
    }

    /**
     * 设置缩进值，或在不提供值（以及值为负）的情况下将当前缩进累加1
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
        if (this._indent == 0)
            throw `Cannot reduce indent: Indent cannot be minus number`;
        this._indent --;
        if (this._indent <= this.pythonBlockIndent)
            this.pythonBlockIndent = null;
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
        if (this.pythonBlockIndent != null)
            this.line(code);
        else
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
        this.pythonBlockIndent = this._indent;
    }

    /**
     * 添加一个标签
     * @param name 标签名称
     * @param useIndent 是否使用缩进（默认为否）
     */
    public label(name: string, useIndent: boolean = false): void {
        if (useIndent)
            this.line(`label ${name}:`);
        else
            this._line.push(`label ${name}:`);
    } 

    /**
     * 插入一个python代码块
     */
    public pythonBlock(): void {
        this.line('python:');
        this.pythonBlockIndent = this._indent;
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
        this.python(`sys_while_condition_${id} = True`);
        this.line(`label sys_while_label_${id}:`);
        this.line(`while ${condition} and sys_while_condition_${id} == True:`);
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
        if (this.whileLabel.length == 0)
            throw 'Cannot break while loop: No active while loop';
        let id = this.whileLabel[this.whileLabel.length - 1];
        this.python(`sys_while_condition_${id} = False`);
        this.line(`jump sys_while_label_${id}`);
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
    public endWhile(unindentBeforeEnd: boolean = false): void {
        if (this.whileLabel.length == 0)
            throw 'Cannot end while loop: No active while loop';
        let id = this.whileLabel.pop();
        if (unindentBeforeEnd) this.unindent();
        this.python(`del sys_while_condition_${id}`);
    }

    /**
     * 插入一个循环中断标记
     */
    public continue(): void {
        if (this.whileLabel.length == 0)
            throw 'Cannot continue while loop: No active while loop';
        this.line(`jump sys_while_label_${this.whileLabel[this.whileLabel.length - 1]}`);
    }

    /**
     * 插入一个Python循环中断标记
     */
    public pythonContinue(): void {
        this.python('continue');
    }

    /**
     * 定义一个变量
     * @param variable 目标变量
     */
    public defineVariable(variable: LiteScript.Variable): void {
        Utilities.normalizeVariableValue(variable);
        if (variable.scope == LiteScript.VariableScope.Static) {
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
    public defineConsant(name: string, value: string): void {
        this.line(`define ${name} = ${value}`);
    }


    /**
     * 将一个变量的值设置为None
     * @param variable 目标变量
     */
    public undefineVariable(variable: LiteScript.Variable): void {
        Utilities.normalizeVariableValue(variable);
        if (variable.scope == LiteScript.VariableScope.Static)
            this.python(`persistent.${variable.name} = None`);
        else
            this.python(`del ${variable.name}`);
    }

    /**
     * 添加一个跳转标记
     * @param target 目标标签的名称
     */
    public jump(target: string): void {
        this.line(`jump ${target}`);
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
    public systemScreen(name: LiteScript.SystemPage): void {
        if (name == LiteScript.SystemPage.Event)
            this.call('theater');
        else if (name == LiteScript.SystemPage.Gallery)
            this.call('gallery');
        else if (name == LiteScript.SystemPage.GameMenu)
            this.call('game_menu');
        else if (name == LiteScript.SystemPage.Load)
            this.call('load');
        else if (name == LiteScript.SystemPage.MainMenu)
            this.call('main_menu');
        else if (name == LiteScript.SystemPage.Save)
            this.call('save');
        else if (name == LiteScript.SystemPage.Soundtrack)
            this.call('soundtrack');
        else
            throw `Cannot call system screen: ${name} is not a system screen`;
    }

    /**
     * 添加一个LiveMaker图像菜单调用
     * @param data 菜单数据
     */
    public callMenu(data: LiteScript.BlockDataMenu): void {
        let usedCondition: LiteScript.MenuCondition[] = new Array<LiteScript.MenuCondition>();
        let result: string = '[';
        result += data.target.extraData.item.map((item, index) => {
            let result: string[] = new Array<string>();
            result.push(`"pos": (${item.position.x}, ${item.position.y})`);
            result.push(`"image": "${item.idleImage.path}"`);
            result.push(`"hover": "${item.hoverImage ? item.hoverImage.path : ''}"`);
            result.push(`"name": "${item.name}"`);
            if (item.preview.image)
                result.push(`"preview": (${item.preview.position.x}, ${item.preview.position.y}, "${item.preview.image.path}")`);
            let cond = data.condition.find(v => v.choice == item.name && !usedCondition.includes(v));
            if (cond) {
                usedCondition.push(cond);
                result.push('"condition": ' + this.stringifyCondition(cond.condition));
            }
            return `{${result.join(',')}}`;
        }).join(', ');
        result += ']';
        this.python(`sys_lm_menu_item = ${result}`);
        let soundInfo: string[] = new Array<string>();
        if (data.hoverSound)
            soundInfo.push(`"hover": "${data.hoverSound.path}"`);
        if (data.clickSound)
            soundInfo.push(`"click": "${data.clickSound.path}"`);
        this.python(`sys_lm_menu_sound = {${soundInfo.join(', ')}}`);
        if (data.fadeIn)
            this.python(`renpy.transition(Dissolve(${data.fadeIn}))`);
        this.line(`call screen lm_menu(sys_lm_menu_item, sys_lm_menu_sound, ${data.timeLimitation ? data.timeLimitation : 0})`);
        // fadeOut still has no effect for Ren'Py
        // if (fadeOut)
        //     this.line(`with Dissolve(${fadeOut})`);
        this.python('_lm_selected_value = _return["name"]');
        this.python('_lm_selected_index = _return["index"]');
        this.python('del sys_lm_menu_item');
        this.python('del sys_lm_menu_sound');
    }

    /**
     * 添加一个LiveMaker输入调用
     * @param items 需要用户输入的项目
     * @param caption 标题
     */
    public lmInput(items: LiteScript.Input[], caption: string): void {
        let itemPrompt = items.map(v => `"${v.hint}"`).join(', ');
        let itemTarget = items.map(v => this.normalizeVariableName(v.storedVariable)).join(', ');
        this.python(`_lm_input_result = lm_input("${caption}", [${itemPrompt}], [${itemTarget}])`);
        for (let i = 0; i < items.length; i++)
            this.python(`${this.normalizeVariableName(items[i].storedVariable)} = _lm_input_result[${i}]`);
        this.python('del _lm_input_result');
    }

    /**
     * 插入一个LiveMaker选择调用
     * @param data 选项数据
     */
    public lmChoice(data: LiteScript.BlockDataChoice): void {
        let itemTitle = data.items.map(v => `"${v.title}"`).join(', ');
        this.python(`sys_lm_choice_item = [${itemTitle}]`);
        let soundInfo: string[] = new Array<string>();
        if (data.hoverSound)
            soundInfo.push(`"hover": "${data.hoverSound.path}"`);
        if (data.selectSound)
            soundInfo.push(`"click": "${data.selectSound.path}"`);
        this.python(`sys_lm_choice_sound = {${soundInfo.join(', ')}}`);
        this.line(`call screen lm_choice(sys_lm_choice_item, sys_lm_choice_sound, ${data.time ? data.time : 0})`);
        this.python('_lm_selected_value = _return');
        this.python('del sys_lm_choice_item');
        this.python('del sys_lm_choice_sound');
    }

    /**
     * 插入一个图像动画
     * @param item 动画对象
     */
    public defineAnimation(item: LiteScript.AnimationResource): void {
        this.line(`image ${RenpyFile.prefix.imageResource}_${item.id}:`);
        this.indent();
        item.extraData.forEach(source => {
            this.line('contains:')
            this.indent();
            this.line(`"${RenpyFile.prefix.imageResource}_${source.source.id}"`);
            this.line(`xanchor ${source.center.x}`);
            this.line(`yanchor ${source.center.y}`);
            this.line(`xpos ${source.location.start.x}`);
            this.line(`ypos ${source.location.start.y}`);
            if (source.rotate.start != 0)
                this.line(`rotate ${source.rotate.start}`);
            if (source.zoom.xStart != 1)
                this.line(`xzoom ${source.zoom.xStart}`);
            if (source.zoom.yStart != 1)
                this.line(`yzoom ${source.zoom.yStart}`);
            if (source.startTime > 0) {
                this.line('alpha 0');
                this.pause(source.startTime);
            }
            this.line(`alpha ${1.0 - source.alpha.start / 255}`);
            if (source.location.start.x != source.location.end.x) {;
                this.line('parallel:');
                this.indent();
                this.line(`${this.findAnimationEase(source.location.xEase)} ${source.period} xpos ${source.location.end.x}`);
                this.unindent();
            }
            if (source.location.start.y != source.location.end.y) {
                this.line('parallel:');
                this.indent();
                this.line(`${this.findAnimationEase(source.location.yEase)} ${source.period} ypos ${source.location.end.y}`);
                this.unindent();
            }
            if (source.rotate.start != source.rotate.end) {
                this.line('parallel:');
                this.indent();
                this.line(`${this.findAnimationEase(source.rotate.ease)} ${source.period} rotate ${source.rotate.end}`);
                this.unindent();
            }
            if (source.zoom.xStart != source.zoom.xEnd) {
                this.line('parallel:');
                this.indent();
                this.line(`${this.findAnimationEase(source.zoom.xEase)} ${source.period} xzoom ${source.zoom.xEnd}`);
                this.unindent();
            }
            if (source.zoom.yStart != source.zoom.yEnd) {
                this.line('parallel:');
                this.indent();
                this.line(`${this.findAnimationEase(source.zoom.yEase)} ${source.period} yzoom ${source.zoom.yEnd}`);
                this.unindent();
            }
            if (source.alpha.start != source.alpha.end) {
                this.line('parallel:');
                this.indent();
                this.line(`${this.findAnimationEase(source.alpha.ease)} ${source.period} alpha ${1.0 - source.alpha.end / 255}`);
                this.unindent();
            }
            if (source.clip.from.x != source.clip.to.x || source.clip.from.y != source.clip.to.y || source.clip.from.width != source.clip.to.width || source.clip.from.height != source.clip.to.height) {
                this.line(`crop (${source.clip.from.x}, ${source.clip.from.y}, ${source.clip.from.width}, ${source.clip.from.height})`);
                this.line('parallel:');
                this.indent();
                this.line(`${this.findAnimationEase(source.clip.xEase || source.clip.yEase)} ${source.period} crop (${source.clip.to.x}, ${source.clip.to.y}, ${source.clip.to.width}, ${source.clip.to.height})`);
                this.unindent();
            }
            this.pause(source.period);
            this.line('alpha 0');
            this.unindent();
        });
        this.unindent();
    }

    /**
     * 显示一张图片
     * @param data 图片数据
     * @param horizontalFlip 是否进行水平翻转
     * @param verticalFlip 是否进行垂直翻转
     */
    public defineImage(data: LiteScript.ImageResource, horizontalFlip: boolean = false, verticalFlip: boolean = false): void {
        let param: string[] = new Array<string>();
        if (horizontalFlip)
            param.push(`horizontal=True`);
        if (verticalFlip)
            param.push(`vertical=True`);
        if (horizontalFlip || verticalFlip)
            this.line(`image ${RenpyFile.prefix.imageResource}_${data.id} = im.Flip("${data.path}", ${param.join(', ')})`);
        else
            this.line(`image ${RenpyFile.prefix.imageResource}_${data.id} = "${data.path}"`);
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
    public text(character: LiteScript.CharacterResource, content:string): void {
        this.line(`${RenpyFile.prefix.character}_${character.id} ${content}`);
    }

    /**
     * 保存当前文件
     */
    public save(): void {
        File.writeFileSync(Path.resolve(RenpyFile.basePath, this.name + '.rpy'), this._line.join('\n') + '\n');
    }

    private findAnimationEase(item: LiteScript.Ease): string {
        if (item == LiteScript.Ease.In)
            return 'easein';
        if (item == LiteScript.Ease.Out)
            return 'easeout';
        else
            return 'linear';
    }

    private stringifyCondition(condition: LiteScript.Condition[]): string {
        return '[' + condition.map(v => `{ "scope": ${v.scopeIndent}, "content": "${v.content}" }`).join(',') + ']';
    }

    private normalizeVariableName(variable: LiteScript.Variable): string {
        return `${variable.scope == LiteScript.VariableScope.Static ? 'persistent.' : ''}${variable.name}`;
    }
}

export function generateRenpyCode(project: LiteScript.Project, position: string): void {
    RenpyFile.basePath = position;
    saveGlobalVariables(project);
    saveGlobalResources(project);
    let imageNameList: Renpy.NameWithId[] = new Array<Renpy.NameWithId>();
    project.files.forEach(file => {
        saveFile(file, imageNameList);
    });
}

function saveGlobalVariables(project: LiteScript.Project): void {
    let varInitFile = new RenpyFile('variables');
    varInitFile.pythonInit(-200);
    varInitFile.indent();
    project.variables.forEach(variable => {
        varInitFile.defineVariable(variable);
    });
    varInitFile.unindent();
    varInitFile.save();
}

function saveGlobalResources(project: LiteScript.Project): void {
    let resourceFile = new RenpyFile('resources');
    resourceFile.init(-1);
    resourceFile.indent();
    project.galleries.forEach(resource => {
        resourceFile.defineImage(resource);
    });
    project.resources.forEach(resource => {
        if (resource.type == LiteScript.ResourceType.Animation)
            resourceFile.defineAnimation(resource);
        else if (resource.type == LiteScript.ResourceType.Character)
            resourceFile.defineConsant(`${RenpyFile.prefix.character}_${resource.id}`, `Character("${(resource as LiteScript.CharacterResource).extraData}", who_color="#0099FF")`);
        else if (resource.type == LiteScript.ResourceType.Effect)
            resourceFile.defineConsant(`${RenpyFile.prefix.effect}_${resource.id}`, getEffectString(resource));
        else if (resource.type == LiteScript.ResourceType.Image)
            resourceFile.defineImage(resource);
    });
    resourceFile.unindent();
    resourceFile.save();
}

function saveFile(source: LiteScript.File, imageNameList: Renpy.NameWithId[]): void {
    let localFile = new RenpyFile(`file_${source.id}`);
    localFile.comment(`LM2RENPY Converter ©2017 GILESFVK ËKITES (同人サークル　ギレスフク　エキテス)`);
    localFile.comment();
    localFile.comment(`Original LiveMaker scene: ${source.id} (${source.name})`);
    localFile.line();
    let mappedBlockId: string[] = new Array<string>();
    loadBlock(source.entrance, imageNameList, mappedBlockId, localFile);
    localFile.save();
}

function loadBlock(block: LiteScript.Block, imageNameList: Renpy.NameWithId[], mappedBlockId: string[], localFile: RenpyFile): void {
    if (mappedBlockId.includes(block.id)) return;
    mappedBlockId.push(block.id);
    localFile.label(`${RenpyFile.prefix.block}_${block.id}`);
    localFile.indent(1);
    localFile.comment(`Node: ${block.id} (${block.name})`);
    
}
// 
// function saveBlock(block: GeneralScript.Block, project: GeneralScript.Project, scene: GeneralScript.Scene, file: RenpyFile): void {
//     let nodeCode = Utilities.hexName(block.id);
//     file.line();
//     file.label(nodeCode);
//     file.indent(1);
//     file.comment(`Original LiveMaker node: ${nodeCode} (${block.name})`);
//     if (block.type == GeneralScript.BlockType.SceneStart && scene.variable.length > 0) {
//         file.pythonBlock();
//         file.indent();
//         scene.variable.forEach(variable => {
//             file.definePythonVariable(variable);
//         });
//         file.unindent();
//     } else if (block.type == GeneralScript.BlockType.SceneEnd && scene.variable.length > 0) {
//         file.pythonBlock();
//         file.indent();
//         scene.variable.forEach(variable => {
//             file.undefineInPythonBlock(variable);
//         });
//         file.unindent();
//     } else if (block.type == GeneralScript.BlockType.Jump) {
//         let data = block.data as GeneralScript.BlockDataJump;
//         for (let i = 0; i < project.scene.length; i++) {
//             if (project.scene[i].id != data.target) continue;
//             let name = Utilities.hexName(project.scene[i].entrance);
//             file.jump(name);
//             break;
//         }
//     } else if (block.type == GeneralScript.BlockType.Call) {
//         let data = block.data as GeneralScript.BlockDataNavigator;
//         if (!data.page) {
//             for (let i = 0; i < project.scene.length; i++) {
//                 if (project.scene[i].id != data.target) continue;
//                 let name = Utilities.hexName(project.scene[i].entrance);
//                 file.jump(name);
//                 break;
//             }
//         } else {
//             file.systemScreen(data.page);
//         }
//     } else if (block.type == GeneralScript.BlockType.Menu) {
//         let data = block.data as GeneralScript.BlockDataMenu;
//         file.callMenu(data.item,
//                       data.condition,
//                       data.fadeIn > 0 ? data.fadeIn / 1000 : null,
//                       data.fadeOut > 0 ? data.fadeOut / 1000 : null,
//                       data.clickSound,
//                       data.hoverSound,
//                       data.timeLimitation > 0 ? data.timeLimitation / 1000 : null);
//     } else if (block.type == GeneralScript.BlockType.Input) {
//         let data: GeneralScript.BlockDataInput = block.data;
//         file.lmInput(data.content, data.title);
//     } else if (block.type == GeneralScript.BlockType.Choice) {
//         let data: GeneralScript.BlockDataChoice = block.data;
//         if (data.time instanceof Object) {
//             let animations: GeneralScript.Animation[] = data.time as GeneralScript.Animation[];
//             let endtime: number = 0;
//             let nameList: string[] = new Array<string>();
//             animations.forEach(animation => {
//                 if (animation.startTime + animation.period > endtime)
//                     endtime = animation.startTime + animation.period;
//                 nameList.push(file.defineAnimation(animation));
//             });
//             file.lmChoice(data.choice, data.hoverSound, data.selectSound, endtime);
//             nameList.forEach(name => {
//                 file.hide(name);
//             });
//         } else {
//             file.lmChoice(data.choice, data.hoverSound, data.selectSound, data.time);
//         }
//     } else if (block.type == GeneralScript.BlockType.Calculator) {
//         let data: GeneralScript.BlockDataCalculator = block.data;
//         data.variable.forEach(variable => {
//             file.defineVariable(variable);
//         });
//         saveCode(data.code, file, nodeCode);
//         data.variable.forEach(variable => {
//             file.undefineVariable(variable);
//         });
//     } else if (block.type == GeneralScript.BlockType.Normal) {
//         let data: GeneralScript.BlockDataNormal = block.data;
//         saveNormal(data.content, file);
//     }
//     file.indent(1);
//     file.return();
//     file.indent(0);
// }
// 
// function saveCode(codes: GeneralScript.Code[], file: RenpyFile, nodeCode: string): void {
//     let i = 0;
//     let currentWhile: GeneralScript.CalculatorDataWhile = null;
//     let whileIndent: number = -1;
//     while (i < codes.length) {
//         let code = codes[i];
//         file.indent(code.scopeIndent + 1);
//         if (code.type == GeneralScript.CalculatorType.While) {
//             let content: GeneralScript.CalculatorDataWhile = code.data as GeneralScript.CalculatorDataWhile;
//             if (content.init)
//                 file.python(content.init);
//             file.while(content.condition);
//             file.indent();
//             currentWhile = content;
//             whileIndent = code.scopeIndent;
//         } else if (code.type == GeneralScript.CalculatorType.Continue) {
//             let content: GeneralScript.CalculatorContinueData = code.data as GeneralScript.CalculatorContinueData;
//             if (content.condition == 'True')
//                 file.continue();
//             else {
//                 file.if(content.condition);
//                 file.indent();
//                 file.python(currentWhile.loop);
//                 file.continue();
//                 file.unindent();
//             }
//         } else if (code.type == GeneralScript.CalculatorType.Break) {
//             let content: GeneralScript.CalculatorBreakData = code.data as GeneralScript.CalculatorBreakData;
//             if (content.condition == 'True')
//                 file.break();
//             else {
//                 file.if(content.condition);
//                 file.indent();
//                 file.break();
//                 file.unindent();
//             }
//         } else {
//             if (whileIndent > -1 && code.scopeIndent <= whileIndent) {
//                 file.indent(whileIndent + 2);
//                 if (currentWhile.loop)
//                     file.python(currentWhile.loop);
//                 file.indent(code.scopeIndent + 1);
//                 currentWhile = null;
//                 whileIndent = -1;
//                 file.endWhile();
//             }
//             if (code.type == GeneralScript.CalculatorType.Call) { // 不处理CALL
//                 let content: GeneralScript.CalculatorDataCall = code.data as GeneralScript.CalculatorDataCall; 
//                 file.comment(`WARNING: IGNORE CALL ${content.target} WITH PARAM ${content.param.join(', ')}`);
//                 file.python('True == True');
//             } else if (code.type == GeneralScript.CalculatorType.ShouldConvertManual) { // 不处理TEXTINS
//                 let content: GeneralScript.CalculatorDataShouldConvertManual = code.data as GeneralScript.CalculatorDataShouldConvertManual; 
//                 file.comment(`WARNING: IGNORE TEXTINS ${content.content} ON ${content.target}`);
//                 file.python('True == True');
//             } else if (code.type == GeneralScript.CalculatorType.Pause) {
//                 let content: GeneralScript.CalculatorDataPause = code.data as GeneralScript.CalculatorDataPause;
//                 if (content.condition != null) // 不处理WAIT的条件
//                     file.comment(`WARNING: IGNORE CONDITION OF WAIT ${content.condition}`);
//                 if (content.time > 0)
//                     file.pause(content.time);
//                 else
//                     file.python('True == True');
//             } else if (code.type == GeneralScript.CalculatorType.CreateVariable) {
//                 let content: GeneralScript.CalculatorDataCreateVariable = code.data as GeneralScript.CalculatorDataCreateVariable;
//                 file.defineVariable(content);
//             } else if (code.type == GeneralScript.CalculatorType.ClearVariable) {
//                 let content: GeneralScript.CalculatorDataClearVariable = code.data as GeneralScript.CalculatorDataClearVariable;
//                 file.python(`${content.name} = None`);
//             } else if (code.type == GeneralScript.CalculatorType.PlaySound) {
//                 let content: GeneralScript.CalculatorDataSound = code.data as GeneralScript.CalculatorDataSound;
//                 file.pythonSound(content.name, content.source, content.repeat);
//             } else if (code.type == GeneralScript.CalculatorType.DeleteObject) {
//                 let content: GeneralScript.CalculatorDataDeleteObject = code.data as GeneralScript.CalculatorDataDeleteObject;
//                 file.pythonHide(content.name);
//             } else if (code.type == GeneralScript.CalculatorType.StopMedia) {
//                 let content: GeneralScript.CalculatorDataStopMedia = code.data as GeneralScript.CalculatorDataStopMedia;
//                 file.pythonStopSound(content.name, content.fadeTime);
//                 if (content.wait)
//                     file.pause(content.fadeTime);
//             } else if (code.type == GeneralScript.CalculatorType.If) {
//                 let content: GeneralScript.CalculatorIfData = code.data as GeneralScript.CalculatorIfData;
//                 file.if(content.condition);
//             } else if (code.type == GeneralScript.CalculatorType.Elseif) {
//                 let content: GeneralScript.CalculatorElseifData = code.data as GeneralScript.CalculatorElseifData;
//                 file.elif(content.condition);
//             } else if (code.type == GeneralScript.CalculatorType.Else) {
//                 file.else();
//             } else if (code.type == GeneralScript.CalculatorType.CreateImage') {
//                 let content: GeneralScript.CalculatorDataCreateImage = code.data as GeneralScript.CalculatorDataCreateImage;
//                 file.pythonShow(content.name, content.source, null, content.priority);
//             } else if (code.type == GeneralScript.CalculatorType.RawCode) {
//                 let content: GeneralScript.CalculatorDataRawCode = code.data as GeneralScript.CalculatorDataRawCode;
//                 if (content.content.startsWith('SetArray')) {
//                     let reg = new RegExp('(\\w+)[,\\)]', "g");
//                     let matched: string[];
//                     let params: string[] = new Array<string>();
//                     while (matched = reg.exec(content.content))
//                         params.push(matched[1].trim());
//                     let result = params[0];
//                     params.splice(0, 1);
//                     let arrayContent: string = '0';
//                     for (let i = params.length - 1; i > -1; i--) {
//                         arrayContent = `[${arrayContent}] * ${params[i]}`;
//                     }
//                     file.python(`${result} = ${arrayContent}`);
//                 } else {
//                     if (content.content.startsWith('AddArray'))
//                         file.comment(`WARNING: IGNORE ADDARRAY`);
//                     if (content.content.startsWith('AddDelimiter'))
//                         file.comment(`WARNING: IGNORE ADDDELIMITER`);
//                     if (content.content.startsWith('TrimArray'))
//                         file.comment(`WARNING: IGNORE TRIMARRAY`);
//                     if (content.content.startsWith('StringToArray'))
//                         file.comment(`WARNING: IGNORE STRINGTOARRAY`);
//                     if (content.content.startsWith('UniqueArray'))
//                         file.comment(`WARNING: IGNORE UNIQUEARRAY`);
//                     file.python(content.content);
//                 }
//             }
//         }
//         i++;
//     }
// }
// 
// function saveNormal(commands: GeneralScript.Command[], file: RenpyFile): void {
//     let i = 0;
//     let inDiaogue: boolean = false;
//     let effects = findAllEffect(commands);
//     while (i < commands.length) {
//         let command = commands[i];
//         if (command.type == GeneralScript.CommandType.Text) {
//             let dialogue: string = '';
//             let character: string = '';
//             while (i < commands.length && (command.type == GeneralScript.CommandType.Text ||
//                                            command.type == GeneralScript.CommandType.Wait ||
//                                            command.type == GeneralScript.CommandType.WaitForClick ||
//                                            command.type == GeneralScript.CommandType.ChangeTextSpeed ||
//                                            command.type == GeneralScript.CommandType.ShowVariableContent )) {
//                 if (command.type == GeneralScript.CommandType.Text) {
//                     if (inDiaogue) {
//                         dialogue += styleText(command.content as GeneralScript.CommandContentText);
//                     } else {
//                         let text = findCharacter(styleText(command.content as GeneralScript.CommandContentText));
//                         file.comment(`CHARACTER ${text.realName}`);
//                         character = text.character;
//                         dialogue = text.content;
//                         inDiaogue = true;
//                     }
//                 } else if (command.type == GeneralScript.CommandType.Wait) {
//                     dialogue += `{w=${(command.content as GeneralScript.CommandContentWait).time / 1000}}`;
//                 } else if (command.type == GeneralScript.CommandType.ShowVariableContent) {
//                     dialogue += `[${(command.content as GeneralScript.CommandContentNameTarget).name}]`;
//                 } else {
//                     dialogue += '{w}';
//                 }
//                 i ++;
//                 command = commands[i];
//             }
//             if (command && command.type != GeneralScript.CommandType.WaitAndClear)
//             dialogue += '{nw}';
//             dialogue = removeUselessCharacter(dialogue);
//             if (character != '')
//                 file.text(character, `"${dialogue}"`);
//             else
//                 file.extend(`"${dialogue}"`);
//             file.line();
//             i --;
//         } else if (command.type == GeneralScript.CommandType.WaitAndClear) {
//             inDiaogue = false;
//             //file.pause();
//             file.line();
//         } else if (command.type == GeneralScript.CommandType.MessageBox) {
//             file.window(true);
//             file.with(`Dissolve(${(command.content as GeneralScript.CommandContentTimeTarget).time / 1000})`)
//             file.line();
//         } else if (command.type == GeneralScript.CommandType.DestroyMessageBox) {
//             file.window(false);
//             file.with(`Dissolve(${(command.content as GeneralScript.CommandContentTimeTarget).time / 1000})`)
//             file.line();
//         } else if (command.type == GeneralScript.CommandType.ChangeMessageBox) {
//             file.python(`set_window("${(command.content as GeneralScript.CommandContentNameTarget).name}")`);
//         } else if (command.type == GeneralScript.CommandType.Sound) {
//             let commandContent = command.content as GeneralScript.CommandContentSound;
//             file.sound(commandContent.source, findSoundtrack(commandContent.track));
//             file.line();
//         } else if (command.type == GeneralScript.CommandType.StopSound) {
//             let commandContent = command.content as GeneralScript.CommandContentStopSound;
//             file.stopSound(findSoundtrack(commandContent.track), commandContent.time / 1000);
//             file.line();
//         } else if (command.type == GeneralScript.CommandType.Wait) {
//             file.pause((command.content as GeneralScript.CommandContentWait).time / 1000);
//             file.line();
//         } else if (command.type == GeneralScript.CommandType.DestroyImage) {
//             let commandContent = command.content as GeneralScript.CommandContentDestroyImage;
//             commandContent.target.forEach(target => {
//                 file.pythonHide(`"${target}"`);
//             });
//             if (commandContent.effect && commandContent.effect != "") {
//                 file.pythonWith(getEffectString(effects, commandContent.effect));
//             }
//             file.line();
//         } else if (command.type == GeneralScript.CommandType.ChangeImage) {
//             let commandContent = command.content as GeneralScript.CommandContentChangeImageAnimation;
//             if (commandContent.animation && commandContent.animation.length > 0) {
//                 commandContent.animation.forEach(animation => {
//                     file.defineAnimation(animation);
//                 });
//                 file.line();
//                 i++;
//                 continue;
//             }
//             file.pythonShow(`"${commandContent.name}"`, `"${commandContent.source}"`);
//             if (commandContent.useFlip && commandContent.useFlip != "") {
//                 file.pythonWith(getEffectString(effects, commandContent.useFlip));
//             }
//             file.line();
//         } else if (command.type == GeneralScript.CommandType.Image) {
//             let commandContent = command.content as GeneralScript.CommandContentImageAnimation;
//             if (commandContent.animation && commandContent.animation.length > 0) {
//                 commandContent.animation.forEach(animation => {
//                     file.defineAnimation(animation);
//                 });
//                 file.line();
//                 i++;
//                 continue;
//             }
//             let transform: string = '';
//             if (commandContent.x == GeneralScript.Align.Left && commandContent.y == GeneralScript.Align.Top)
//                 transform = 'left_top';
//             else if (commandContent.x == GeneralScript.Align.Left && commandContent.y == GeneralScript.Align.Bottom)
//                 transform = 'left_bottom';
//             else if (commandContent.x == GeneralScript.Align.Left && commandContent.y == GeneralScript.Align.Center)
//                 transform = 'left_center';
//             else if (commandContent.x == GeneralScript.Align.Right && commandContent.y == GeneralScript.Align.Top)
//                 transform = 'right_top';
//             else if (commandContent.x == GeneralScript.Align.Right && commandContent.y == GeneralScript.Align.Center)
//                 transform = 'right_center';
//             else if (commandContent.x == GeneralScript.Align.Right && commandContent.y == GeneralScript.Align.Bottom)
//                 transform = 'right_bottom';
//             else if (commandContent.x == GeneralScript.Align.Center && commandContent.y == GeneralScript.Align.Top)
//                 transform = 'center_top';
//             else if (commandContent.x == GeneralScript.Align.Center && commandContent.y == GeneralScript.Align.Center)
//                 transform = 'center_center';
//             else if (commandContent.x == GeneralScript.Align.Center && commandContent.y == GeneralScript.Align.Bottom)
//                 transform = 'center_bottom';
//             else
//                 transform = `Transform(xpos=${commandContent.x}, ypos=${commandContent.y})`
//             file.pythonShow(`"${commandContent.name}"`, `"${commandContent.source}"`, [transform], commandContent.priority);
//             if (commandContent.useFlip && commandContent.useFlip != "") {
//                 file.pythonWith(getEffectString(effects, commandContent.useFlip));
//             }
//             file.line();
//         }
//         i++;
//     }
// }
// 
// function findAllEffect(commands: GeneralScript.Command[]): GeneralScript.CommandContentEffect[] {
//     return commands.filter(v => v.type == GeneralScript.CommandType.Effect).map(v => v.content as GeneralScript.CommandContentEffect);
// }
// 
// function styleText(text: GeneralScript.CommandContentText): string {
//     let result = text.text;
//     if (text.bold)
//         result = `{b}${result}{/b}`;
//     if (text.color && text.color != '')
//         result = `{color=${text.color}}${result}{/color}`;
//     if (text.italic)
//         result = `{i}${result}{/i}`;
//     if (text.size && text.size > 0)
//         result = `{size=${text.size}}${result}{/size}`;
//     if (text.underline)
//         result = `{u}${result}{/u}`;
//     result = result.replace(/\n/g, '\\n');
//     result = result.replace(/　/g, '');
//     return result;
// }
// 
// function removeUselessCharacter(text: string): string {
//     text = text.replace(/\\n/g, '');
//     text = text.replace(/「/g, '');
//     text = text.replace(/」/g, '');
//     if (text.endsWith('{w}'))
//         text = text.substring(0, text.lastIndexOf('{w}'));
//     if (text.endsWith('{w}{nw}'))
//         text = text.substring(0, text.lastIndexOf('{w}{nw}'));
//     return text;
// }
// 
// function findCharacter(text: string): { character: string, realName: string, content: string } {
//     let keys = Object.keys(characters);
//     for (let i = 0; i < keys.length; i++) {
//         if (text.startsWith(keys[i]) && text[keys[i].length] == '\\') {
//             return {
//                 character: characters[keys[i]],
//                 realName: keys[i],
//                 content: text.substring(keys[i].length + 2)
//             };
//         }
//     }
//     return {
//         character: 'character_normal',
//         realName: 'normal',
//         content: text
//     };
// }
// 
// function findSoundtrack(track: GeneralScript.Soundtrack): Renpy.SoundChannel {
//     switch(track) {
//         case GeneralScript.Soundtrack.BGM:
//             return Renpy.SoundChannel.Bgm;
//         case GeneralScript.Soundtrack.BGM2:
//             return Renpy.SoundChannel.Bgm2;
//         case GeneralScript.Soundtrack.Effect:
//             return Renpy.SoundChannel.Effect;
//         case GeneralScript.Soundtrack.Effect2:
//             return Renpy.SoundChannel.Effect2;
//         case GeneralScript.Soundtrack.Voice:
//             return Renpy.SoundChannel.Voice;
//         case GeneralScript.Soundtrack.Voice2:
//             return Renpy.SoundChannel.Voice2;
//         default:
//             throw '找不到对应的音轨：' + track;
//     }
// }

function getEffectString(target: LiteScript.EffectResource): string {
    switch (target.extraData.type) {
        case LiteScript.EffectType.None:
            return 'None';
        case LiteScript.EffectType.Fade:
            return `Dissolve(${target.extraData.time / 1000})`
        case LiteScript.EffectType.BlindHorizontal:
            return `ImageDissolve("lib/lmeffect/blind_h.png", ${target.extraData.time / 1000}, reverse=${target.extraData.reverse ? 'True' : 'False'})`;
        case LiteScript.EffectType.BlindVertical:
            return `ImageDissolve("lib/lmeffect/blind_v.png", ${target.extraData.time / 1000}, reverse=${target.extraData.reverse ? 'True' : 'False'})`;
        case LiteScript.EffectType.CurtainHorizontal:
            return `ImageDissolve("lib/lmeffect/curtain_h.png", ${target.extraData.time / 1000}, reverse=${target.extraData.reverse ? 'True' : 'False'})`;
        case LiteScript.EffectType.CurtainVertical:
            return `ImageDissolve("lib/lmeffect/curtain_v.png", ${target.extraData.time / 1000}, reverse=${target.extraData.reverse ? 'True' : 'False'})`;
        case LiteScript.EffectType.ScrollHorizontal:
            return `PushMove(${target.extraData.time / 1000}, "push${target.extraData.reverse ? 'right' : 'left'}")`;
        case LiteScript.EffectType.ScrollVertical:
            return `PushMove(${target.extraData.time / 1000}, "push${target.extraData.reverse ? 'up' : 'down'}")`;
        case LiteScript.EffectType.Grid:
            return `ImageDissolve("lib/lmeffect/grid.png", ${target.extraData.time / 1000}, reverse=${target.extraData.reverse ? 'True' : 'False'})`;
        case LiteScript.EffectType.GridHorizontal:
            return `ImageDissolve("lib/lmeffect/grid_h.png", ${target.extraData.time / 1000}, reverse=${target.extraData.reverse ? 'True' : 'False'})`;
        case LiteScript.EffectType.GridVertical:
            return `ImageDissolve("lib/lmeffect/grid_v.png", ${target.extraData.time / 1000}, reverse=${target.extraData.reverse ? 'True' : 'False'})`;
        case LiteScript.EffectType.Dither:
            return `ImageDissolve("lib/lmeffect/dither.png", ${target.extraData.time / 1000}, reverse=${target.extraData.reverse ? 'True' : 'False'})`;
        case LiteScript.EffectType.White:
            return `Fade(${target.extraData.time / 1000}, 0.0, ${target.extraData.time / 1000}, color="#FFFFFF")`;
        case LiteScript.EffectType.Black:
            return `Fade(${target.extraData.time / 1000}, 0.0, ${target.extraData.time / 1000}, color="#000000")`;
        case LiteScript.EffectType.Flash:
            return `Fade(${target.extraData.time / 4000}, 0.0, ${target.extraData.time / 4000 * 3}, color="#FFFFFF")`;
        case LiteScript.EffectType.Mosaic:
            return `Pixellate(${target.extraData.time, 10})`;
        case LiteScript.EffectType.ScratchHorizontal: // 无法实现，使用Mosaic替代
            return `Pixellate(${target.extraData.time, 10}) # Origin: ScratchHorizontal`;
        case LiteScript.EffectType.ScratchVertical: // 无法实现，使用Mosaic替代
            return `Pixellate(${target.extraData.time, 10}) # Origin: ScratchVertical`;
        case LiteScript.EffectType.Spot: // 无法实现，采用中心淡入淡出替代
            return `ImageDissolve("lib/lmeffect/center.png", ${target.extraData.time / 1000}, reverse=${target.extraData.reverse ? 'True' : 'False'})`;
        case LiteScript.EffectType.Mask: // AYUMI里此效果等价于Fade
            return `Dissolve(${target.extraData.time / 1000}) # Origin: Mask`;
        case LiteScript.EffectType.MaskWhite: // AYUMI里此效果等价于Fade
            return `Dissolve(${target.extraData.time / 1000}) # Origin MaskWhite`;
        case LiteScript.EffectType.MaskBlack: // AYUMI里此效果等价于Fade
            return `Dissolve(${target.extraData.time / 1000}) # Origin: MaskBlack`;
        case LiteScript.EffectType.ZoomSmall:
            return `OldMoveTransition(${target.extraData.time / 1000}, enter_factory=ZoomInOut(0.01, 1.0))`;
        case LiteScript.EffectType.ZoomBig:
            return `OldMoveTransition(${target.extraData.time / 1000}, enter_factory=ZoomInOut(1.0, 0.01))`;
        case LiteScript.EffectType.ZoomIn:
            return `OldMoveTransition(${target.extraData.time / 1000}, enter_factory=ZoomInOut(0.01, 1.0), leave_factory=ZoomInOut(1.0, 0.01))`;
        case LiteScript.EffectType.Ripple: // 无法实现，采用中心淡入淡出替代
            return `ImageDissolve("lib/lmeffect/center.png", ${target.extraData.time / 1000}, reverse=${target.extraData.reverse ? 'True' : 'False'}) # Origin: Ripple`;
        case LiteScript.EffectType.BlurWhite: // 模糊效果性能消耗过大，舍弃之
            return `Fade(${target.extraData.time / 1000}, 0.0, ${target.extraData.time / 1000}, color="#FFFFFF") # Origin: BlurWhite`;
        case LiteScript.EffectType.BlurBlack: // 模糊效果性能消耗过大，舍弃之
            return `Fade(${target.extraData.time / 1000}, 0.0, ${target.extraData.time / 1000}, color="#000000") # Origin: BlurBlack`;
        case LiteScript.EffectType.TwistHorizontal: // 无法实现，采用CropMove替代
            return `CropMove(${target.extraData.time / 1000}, "slide${target.extraData.reverse ? 'right' : 'left'}") # Origin: TwistHorizontal`;
        case LiteScript.EffectType.TwistVertical: // 无法实现，采用CropMove替代
            return `CropMove(${target.extraData.time / 1000}, "slide${target.extraData.reverse ? 'up' : 'bottom'}") # Origin: TwistVertical`;
        case LiteScript.EffectType.Crack: // 无法实现，采用震动+淡出替代
            return `ComposeTransition(Shake((0.5, 1.0, 0.5, 1.0), ${target.extraData.time / 1000}, dist=5), after=dissolve) # Origin: Crack`
        case LiteScript.EffectType.Clockhand:
            return `ImageDissolve("lib/lmeffect/circle.png", ${target.extraData.time / 1000}, reverse=${target.extraData.reverse ? 'True' : 'False'})`;
        case LiteScript.EffectType.RubberHorizontal: // 无法实现，使用Mosaic替代
            return `Pixellate(${target.extraData.time, 10}) # Origin: RubberHorizontal`;
        case LiteScript.EffectType.RubberVertical: // 无法实现，使用Mosaic替代
            return `Pixellate(${target.extraData.time, 10}) # Origin: RubberVertical`;
        case LiteScript.EffectType.FanCenter:
            return `ImageDissolve("lib/lmeffect/fan.png", ${target.extraData.time / 1000}, reverse=${target.extraData.reverse ? 'True' : 'False'})`;
        case LiteScript.EffectType.FanBorder:
            return `ImageDissolve("lib/lmeffect/fan_h.png", ${target.extraData.time / 1000}, reverse=${target.extraData.reverse ? 'True' : 'False'})`;
        case LiteScript.EffectType.Circle:
            return `ImageDissolve("lib/lmeffect/center.png", ${target.extraData.time / 1000}, reverse=${target.extraData.reverse ? 'True' : 'False'})`;
        case LiteScript.EffectType.BlockCoil:
            return `ImageDissolve("lib/lmeffect/block.png", ${target.extraData.time / 1000}, reverse=${target.extraData.reverse ? 'True' : 'False'})`;
        case LiteScript.EffectType.BlockRandom:
            return `ImageDissolve("lib/lmeffect/block_random.png", ${target.extraData.time / 1000}, reverse=${target.extraData.reverse ? 'True' : 'False'})`;
    }
}
