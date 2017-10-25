import * as Path from 'path';
import * as File from 'fs';

import * as LiteScript from './include/LiteScript';
import * as Utilities from './Utilities';
import * as Renpy from './include/Renpy';

/**
 * 表示一个Ren'Py脚本文件
 */
export class RenpyFile {
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
     * 插入一个占位标记
     */
    public pass(): void {
        this.line('pass');
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
     * 删除一个变量
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
     * 转入指定标签
     * @param target 标签名称
     */
    public call(target: string): void {
        this.line(`call ${target}`);
    }

    /**
     * 转入指定场景
     * @param target 场景名称
     */
    public callScreen(target: string): void {
        this.call(`screen ${target}`);
    }

    /**
     * 转入系统场景
     * @param name 场景类型
     */
    public systemScreen(name: LiteScript.SystemPage): void {
        if (name == LiteScript.SystemPage.Event)
            this.callScreen('theater');
        else if (name == LiteScript.SystemPage.Gallery)
            this.callScreen('gallery');
        else if (name == LiteScript.SystemPage.GameMenu)
            this.callScreen('game_menu');
        else if (name == LiteScript.SystemPage.Load)
            this.callScreen('load');
        else if (name == LiteScript.SystemPage.MainMenu)
            this.callScreen('main_menu');
        else if (name == LiteScript.SystemPage.Save)
            this.callScreen('save');
        else if (name == LiteScript.SystemPage.Soundtrack)
            this.callScreen('soundtrack');
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
                result.push('"condition": ' + Utilities.stringifyCondition(cond.condition));
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
        this.line(`call lm_menu(sys_lm_menu_item, sys_lm_menu_sound, ${data.timeLimitation ? data.timeLimitation : 0}, ${data.fadeIn}, ${data.fadeOut})`);
        this.python('del sys_lm_menu_item');
        this.python('del sys_lm_menu_sound');
    }

    /**
     * 添加一个LiveMaker输入调用
     * @param items 需要用户输入的项目
     * @param caption 标题
     */
    public callInput(data: LiteScript.BlockDataInput): void {
        let itemPrompt = data.items.map(v => `"${v.hint}"`).join(', ');
        let itemTarget = data.items.map(v => this.normalizeVariableName(v.storedVariable)).join(', ');
        this.python(`_lm_input_result = lm_input("${data.title}", [${itemPrompt}], [${itemTarget}])`);
        for (let i = 0; i < data.items.length; i++)
            this.python(`${this.normalizeVariableName(data.items[i].storedVariable)} = _lm_input_result[${i}]`);
        this.python('del _lm_input_result');
    }

    /**
     * 插入一个LiveMaker选择调用
     * @param data 选项数据
     */
    public callChoice(data: LiteScript.BlockDataChoice): void {
        let itemTitle = data.items.map(v => `"${v.title}"`).join(', ');
        this.python(`sys_lm_choice_item = [${itemTitle}]`);
        let soundInfo: string[] = new Array<string>();
        if (data.hoverSound)
            soundInfo.push(`"hover": "${data.hoverSound.path}"`);
        if (data.selectSound)
            soundInfo.push(`"click": "${data.selectSound.path}"`);
        this.python(`sys_lm_choice_sound = {${soundInfo.join(', ')}}`);
        if (typeof data.time == 'number')
            this.line(`call screen lm_choice(sys_lm_choice_item, sys_lm_choice_sound, ${data.time ? data.time : 0})`);
        else {
            let name = `${RenpyFile.prefix.imageResource}_${data.time.id}`;
            this.show(name, false, false, null, null, 1000);
            this.line(`call screen lm_choice(sys_lm_choice_item, sys_lm_choice_sound, ${Utilities.calculateAnimationTime(data.time.extraData)})`);
            this.hide(name);
        }
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
    public show(name: string, withBlock: boolean = false, useExpression: boolean = false, rename: string = null, transformName: string = null, zorder: number = null, layer: string = 'master'): void {
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
        command += ` onlayer ${layer}`;
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
    public pythonShow(name: string, source: string, transformName: string[] = null, zorder: number | string = null): void {
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
    public sound(source: LiteScript.SoundResource, channel: Renpy.SoundChannel): void {
        this.line(`play ${channel} "${source.path}"`);
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
    public pythonStopSound(name: string, fadeOut: number | string = 0): void {
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
        this.line(`extend "${text}"`);
    }

    /**
     * 插入一个对话
     * @param character 对话所属角色
     * @param content 对话内容
     */
    public text(character: LiteScript.CharacterResource, content:string): void {
        this.line(`${RenpyFile.prefix.character}_${character.id} "${content}"`);
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

    private normalizeVariableName(variable: LiteScript.Variable): string {
        return `${variable.scope == LiteScript.VariableScope.Static ? 'persistent.' : ''}${variable.name}`;
    }
}
