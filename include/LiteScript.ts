import * as Utilities from '../Utilities';
import * as _ from 'lodash';

export class Project {
    private _files: File[] = new Array<File>();
    private _globalVariables: Variable[] = new Array<Variable>();
    private _galleryImages: ImageResource[] = new Array<ImageResource>();
    private _extraResources: Resource<any>[] = new Array<Resource<any>>();

    public get files(): File[] {
        return this._files;
    }

    public get variables(): Variable[] {
        return this._globalVariables;
    }

    public get galleries(): ImageResource[] {
        return this._galleryImages;
    }

    public get resources(): Resource<any>[] {
        return this._extraResources;
    }

    public findFile(id: string): File {
        let result = this._files.find(file => file.id == id);
        return result ? result : null;
    }

    public findVariable(name: string): Variable {
        let result = this._globalVariables.find(variable => variable.name == name);
        return result ? result : null;
    }

    public findImage(id: string): ImageResource {
        let result = this._galleryImages.find(image => image.id == id);
        if (!result)
            result = this._extraResources.find(resource => resource.type == ResourceType.Image && resource.id == id);
        return result ? result : null;
    }

    public findSound(id: string): SoundResource {
        let result = this._extraResources.find(resource => resource.type == ResourceType.Sound && resource.id == id);
        return result ? result : null;
    }

    public findAnimation(id: string): AnimationResource {
        let result = this._extraResources.find(resource => resource.type == ResourceType.Animation && resource.id == id);
        return result ? result : null;
    }

    public findMenu(id: string): MenuResource {
        let result = this._extraResources.find(resource => resource.type == ResourceType.Menu && resource.id == id);
        return result ? result : null;
    }

    public findEffect(id: string): EffectResource {
        let result = this._extraResources.find(resource => resource.type == ResourceType.Effect && resource.id == id);
        return result ? result : null;
    }

    public findMovie(id: string): MovieResource {
        let result = this._extraResources.find(resource => resource.type == ResourceType.Movie && resource.id == id);
        return result ? result : null;
    }

    public findCharacter(id: string): CharacterResource {
        let result = this._extraResources.find(resource => resource.type == ResourceType.Character && resource.id == id);
        return result ? result : null;
    }

    public findResourceByPath<T extends Resource<any>>(path: string): T {
        let result = this._galleryImages.find(image => image.path == path);
        if (!result)
            result = this._extraResources.find(resource => resource.path == path);
        return result ? result as T : null;
    }

    public addResource<T>(type: ResourceType, path: string, extraData?: T, id?: string): string {
        let targetId = id ? id : Utilities.newUUID();
        if (this._extraResources.find(resource => resource.type == type && resource.id == id))
            throw `Cannot add resource with type ${type} and id ${id}: Same id has already used in this type`;
        if (type == ResourceType.Image && this._galleryImages.find(resource => resource.id == id))
            throw `Cannot add image resource with id ${id}: Same id has already used in gallery`;
        this._extraResources.push({
            id: targetId,
            path: path,
            type: type,
            extraData: extraData
        });
        return targetId;
    }

    public addGallery(path: string, id?: string): string {
        let targetId = id ? id : Utilities.newUUID();
        if (this._galleryImages.find(resource => resource.id == id))
            throw `Cannot add image to gallery: Same id has already used in gallery`;
        if (this._extraResources.find(resource => resource.type == ResourceType.Image && resource.id == id))
            throw `Cannot add image to gallery: Same id has already used in resources`;
        this._galleryImages.push({
            id: targetId,
            path: path,
            type: ResourceType.Image
        });
        return targetId;
    }

    public addFile(id?: string): File {
        if (!id) id = Utilities.newUUID();
        if (this.findFile(id) != null)
            throw `Cannot add file with id ${id}: Same id has already used in file list`;
        let result = new File(this, id);
        this._files.push(result);
        return result;
    }

    public addVariable(name: string, type: VariableType, scope: VariableScope): Variable {
        if (!name || name == '')
            throw `Cannot add variable: name cannot be null`;
        if (this.findVariable(name) != null)
            throw `Cannot add variable with name ${name}: Same name has already in variable list`;
        let result = new Variable(name, type, scope);
        this._globalVariables.push(result);
        return result;
    }

    public addCharacter(name: string, id?: string): string {
        let targetId = id ? id : Utilities.newUUID();
        if (this._extraResources.find(resource => resource.type == ResourceType.Character && resource.id == id))
            throw `Cannot add character: Same id is already existed`;
        if (this._extraResources.find(resource => resource.type == ResourceType.Character && (resource as CharacterResource).extraData == name))
            throw `Cannot add character: Same character name is already existed`;
        this._extraResources.push({
            id: targetId,
            path: null,
            type: ResourceType.Character,
            extraData: name
        });
        return targetId;
    }
}

// Resource

export interface Resource<T = void> {
    id: string;
    path: string;
    type: ResourceType;
    extraData?: T
}

export enum ResourceType {
    Image = 0,
    Sound = 1,
    Animation = 2,
    Menu = 3,
    Effect = 4,
    Movie = 5,
    Character = 6
}

export interface ImageResource extends Resource<void> { }

export interface SoundResource extends Resource<void> { }

export interface MenuResource extends Resource<Menu> { }

export interface AnimationResource extends Resource<Animation[]> { }

export interface EffectResource extends Resource<Effect> { }

export interface MovieResource extends Resource<void> { }

export interface CharacterResource extends Resource<string> { }

export interface Menu {
    item: MenuItem[];
}

export interface MenuItem {
    name: string;
    position: Point;
    preview?: {
        position: Point,
        image: ImageResource
    };
    idleImage: ImageResource;
    hoverImage?: ImageResource;
}

export interface Effect {
    type: EffectType;
    time: number;
    reverse: boolean;
    parameter: number[];
}

export interface Animation {
    name: string;
    source: ImageResource;
    startTime: number;
    period: number;
    priority: number;
    horizontalReverse: boolean;
    verticalReverse: boolean;
    center: Point;
    location?: {
        start: Point,
        end: Point,
        xEase: Ease,
        yEase: Ease
    },
    rotate?: {
        start: number,
        end: number,
        ease: Ease
    },
    zoom?: {
        xStart: number,
        xEnd: number,
        yStart: number,
        yEnd: number,
        xEase: Ease,
        yEase: Ease
    },
    alpha?: {
        start: number,
        end: number,
        ease: Ease
    },
    clip?: {
        from: Rectangle,
        to: Rectangle,
        xEase: Ease,
        yEase: Ease
    }
}

export enum Ease {
    None,
    In,
    Out
}

// File

export class File {
    public entrance: Block;
    private _name: string;
    private _id: string;
    private _variable: Variable[] = new Array<Variable>();
    private _project: Project;

    public constructor(project: Project, id: string) {
        this._project = project;
        this._id = id;
    }

    public get id(): string {
        return this._id;
    }

    public get name(): string {
        return this._name;
    } public set name(value: string) {
        this._name = value.toString()
    }

    public get variables(): Variable[] {
        return this._variable;
    }

    public get project(): Project {
        return this._project;
    }

    public findVariable(name: string): Variable {
        return this.findVariableImplementation(name, []);
    }

    private findVariableImplementation(name: string, mappedFileId: string[]): Variable {
        if (mappedFileId.includes(this._id)) return null;
        mappedFileId.push(this._id);
        let result = this._variable.find(variable => variable.name == name);
        if (!result && this.entrance)
            for (let i = 0; i < this.entrance.previousBlocks.length; i++) {
                result = this.entrance.previousBlocks[i].file.findVariableImplementation(name, mappedFileId);
                if (result) break;
            }
        if (!result)
            result = this._project.findVariable(name);
        return result ? result : null;
    }

    public newBlock(id: string, type: BlockType): Block {
        if (!id) id = Utilities.newUUID();
        if (this.entrance && this.entrance.findById(id) != null)
            throw `Cannot add block with id ${id}: Same id has already used in this file`;
        let result = new Block(id, type, this);
        return result;
    }

    public addVariable(name: string, type: VariableType, scope: VariableScope): Variable {
        if (!name || name == '')
            throw `Cannot add variable: name cannot be null`;
        if (this.findVariable(name) != null)
            throw `Cannot add variable to file ${this._id} with name ${name}: Same name has already in variable list`;
        let result = new Variable(name, type, scope);
        this._variable.push(result);
        return result;
    }
}

// Variable

export class Variable {
    public value: number | boolean | string;
    private _type: VariableType;
    private _scope: VariableScope;
    private _name: string;

    public constructor(name: string, type: VariableType, scope: VariableScope) {
        this._name = name;
        this._type = type;
        this._scope = scope;
    }

    public get name(): string {
        return this._name;
    }

    public get scope(): VariableScope {
        return this._scope;
    }

    public get type(): VariableType {
        return this._type;
    }
}

export enum VariableType {
    Integer,
    Float,
    Boolean,
    String
}

export enum VariableScope {
    Normal,
    Static
}

// Block

export class Block {
    private _name: string;
    private _id: string;
    private _type: BlockType;
    private _next: TargetWithCondition[] = new Array<TargetWithCondition>();
    private _previous: Block[] = new Array<Block>();
    private _content: BlockDataBase;
    private _file: File;

    public constructor(id: string, type: BlockType, file: File) {
        this._id = id;
        this._type = type;
        this._file = file;
        if ((type & (BlockType.SceneStart | BlockType.SceneEnd)) != 0)
            this._content = new BlockDataBase(this);
        else if (type == BlockType.Normal)
            this._content = new BlockDataNormal(this);
        else if (type == BlockType.Calculator)
            this._content = new BlockDataCalculator(this);
        else if (type == BlockType.Choice)
            this._content = new BlockDataChoice(this);
        else if (type == BlockType.Menu)
            this._content = new BlockDataMenu(this);
        else if (type == BlockType.Input)
            this._content = new BlockDataInput(this);
        else if (type == BlockType.Call)
            this._content = new BlockDataCall(this);
        else if (type == BlockType.Jump)
            this._content = new BlockDataJump(this);
        else
            throw `Cannot declare block with type ${type}: Target type is not known`;
    }

    public get id(): string {
        return this._id;
    }

    public get name(): string {
        return this._name;
    } public set name(value: string) {
        this._name = value.toString()
    }

    public get type(): BlockType {
        return this._type;
    }

    public get nextBlocks(): TargetWithCondition[] {
        return this._next;
    }

    public get previousBlocks(): Block[] {
        return this._previous;
    }

    public get file(): File {
        return this._file;
    }

    public content<T extends BlockDataBase>(): T {
        return this._content as T;
    }

    public findById(id: string): Block {
        return this.findByIdImplementation(id, []);
    }

    private findByIdImplementation(id: string, mappedList: string[]): Block {
        if (this._id == id) return this;
        if (mappedList.includes(this._id)) return null;
        mappedList.push(this._id);
        for (let i = 0; i < this._next.length; i++) {
            let result = this._next[i].target.findByIdImplementation(id, mappedList);
            if (result) return result;
        }
        return null;
    }

    public findByType(type: BlockType, ignoreThis: boolean = false): Block {
        if (!ignoreThis && this._type == type) return this;
        for (let i = 0; i < this._next.length; i++) {
            let result = this._next[i].target.findByType(type);
            if (result) return result;
        }
        return null;
    }
    public addNext(target: Block, condition: Condition[]): void {
        this._next.push({ target: target, condition: condition });
        target.addPrevious(this);
    }

    public removeNext(block: Block): void {
        let target = this._next.find(v => v.target == block);
        if (!target)
            throw `Cannot remove block from next block list: Target ${block._id} is not in this block's next list`;
        block._previous.splice(block._previous.indexOf(this), 1);
        this._next.splice(this._next.indexOf(target), 1);
    }

    public replaceNext(original: Block, target: Block): void {
        this._next.forEach(next => {
            if (next.target == original) next.target = target;
        });
    }

    private addPrevious(target: Block): void {
        this._previous.push(target);
        this._previous = _.uniqBy(this._previous, block => block._id);
    }
}

export enum BlockType {
    SceneStart = 0B1, // BlockDataBase
    SceneEnd   = 0B10, // BlockDataBase
    Normal     = 0B100, // BlockDataNormal
    Calculator = 0B1000, // BlockDataCalculator
    Choice     = 0B10000, // BlockDataChoice
    Menu       = 0B100000, // BlockDataMenu
    Input      = 0B1000000, // BlockDataInput
    Call       = 0B10000000, // BlockDataNavigator
    Jump       = 0B100000000 // BlockDataJump
}

export interface TargetWithCondition {
    target: Block;
    condition: Condition[];
}

export interface Condition {
    content: string;
    scopeIndent: number;
}

export class Condition implements Condition {
    public constructor(content: string, indent: number = 0) {
        this.content = content;
        this.scopeIndent = indent;
    }
}

export class BlockDataBase {
    private _block: Block;

    public get block(): Block {
        return this._block;
    }

    public constructor(block: Block) {
        this._block = block;
    }
}

export class BlockDataWithName extends BlockDataBase {
    public name: string;
}

export class BlockDataMenu extends BlockDataBase {
    public target: MenuResource;
    public fadeIn: number;
    public fadeOut: number;
    public hoverSound: SoundResource;
    public clickSound: SoundResource;
    public timeLimitation: number;
    private _condition: MenuCondition[] = new Array<MenuCondition>();

    public get condition(): MenuCondition[] {
        return this._condition;
    }

    public newCondition(): MenuCondition {
        let result: MenuCondition = { choice: null, condition: new Array<Condition>() };
        this._condition.push(result);
        return result;
    }
}

export interface MenuCondition {
    choice: string;
    condition: Condition[];
}

export class BlockDataInput extends BlockDataBase {
    private _item: Input[] = new Array<Input>();
    public title: string;

    public get items(): Input[] {
        return this._item;
    }

    public newItem(): Input {
        let result: Input = { hint: null, storedVariable: null };
        this._item.push(result);
        return result;
    }
}

export interface Input {
    hint: string;
    storedVariable: Variable;
}

export class BlockDataJump extends BlockDataBase {
    public target?: Block;
}

export class BlockDataCall extends BlockDataJump {
    public page?: SystemPage;
}

export enum SystemPage {
    Load,
    Save,
    Gallery,
    Event,
    Soundtrack,
    MainMenu,
    GameMenu
}

export class BlockDataChoice extends BlockDataBase {
    public hoverSound: SoundResource;
    public selectSound: SoundResource;
    public time: number | AnimationResource;
    private _item: Choice[] = new Array<Choice>();

    public get items(): Choice[] {
        return this._item;
    }

    public newItem(): Choice {
        let result: Choice = { title: null, condition: null };
        this._item.push(result);
        return result;
    }
}

export interface Choice {
    title: string;
    condition: string;
}

// Calculator

export class BlockDataCalculator extends BlockDataBase {
    private _code: Code[] = new Array<Code>();
    private _variable: Variable[] = new Array<Variable>();

    public get variables(): Variable[] {
        return this._variable;
    }

    public get codes(): Code[] {
        return this._code;
    }

    public addVariable(name: string, type: VariableType, scope: VariableScope): Variable {
        if (!name || name == '')
            throw `Cannot add variable: name cannot be null`;
        if (this.findVariable(name) != null)
            throw `Cannot add variable to block ${this.block.id} with name ${name}: Same name has already in variable list`;
        let result = new Variable(name, type, scope);
        this._variable.push(result);
        return result;
    }

    public addCode(type: CalculatorType): Code {
        let result = new Code(type);
        this._code.push(result);
        return result;
    }

    public findVariable(name: string): Variable {
        let result = this._variable.find(variable => variable.name == name);
        if (!result)
            result = this.block.file.findVariable(name);
        return result ? result : null;
    }
}

export class Code {
    private _type: CalculatorType;
    private _content: CalculatorDataBase;
    public scopeIndent: number = 0;

    public constructor(type : CalculatorType) {
        this._type = type;
        if ((type & (CalculatorType.RawCode | CalculatorType.Comment)) != 0)
            this._content = new CalculatorDataRawCode();
        else if ((type & (CalculatorType.CreateVariable | CalculatorType.ClearVariable)) != 0)
            this._content = new CalculatorDataVariable();
        else if ((type & (CalculatorType.If | CalculatorType.Elseif | CalculatorType.Break | CalculatorType.Continue)) != 0)
            this._content = new CalcualtorDataConditionBase();
        else if (type == CalculatorType.Else)
            this._content = {};
        else if (type == CalculatorType.While)
            this._content = new CalculatorDataWhile();
        else if (type == CalculatorType.Call)
            this._content = new CalculatorDataCall();
        else if (type == CalculatorType.Pause)
            this._content = new CalculatorDataPause();
        else if (type == CalculatorType.DeleteObject)
            this._content = new CalculatorDataDeleteObject();
        else if (type == CalculatorType.CreateImage)
            this._content = new CalculatorDataCreateImage();
        else if (type == CalculatorType.PlaySound)
            this._content = new CalculatorDataSound();
        else if (type == CalculatorType.StopMedia)
            this._content = new CalculatorDataStopMedia();
        else if (type == CalculatorType.ShouldConvertManual)
            this._content = new CalculatorDataShouldConvertManual();
        else
            throw `Cannot declare calculator with type ${type}: Target type is not known`;
    }

    public get type(): CalculatorType {
        return this._type;
    }

    public content<T extends CalculatorDataBase>(): T {
        return this._content as T;
    }
}

export enum CalculatorType {
    RawCode             = 0B1, // CalculatorDataRawCode
    CreateVariable      = 0B10, // CalculatorDataVariable
    ClearVariable       = 0B100, // CalculatorDataVariable
    If                  = 0B1000, // CalcualtorDataConditionBase
    Elseif              = 0B10000, // CalcualtorDataConditionBase
    Else                = 0B100000, // CalculatorDataBase
    While               = 0B1000000, // CalculatorDataWhile
    Break               = 0B10000000, // CalcualtorDataConditionBase
    Continue            = 0B100000000, // CalcualtorDataConditionBase
    Call                = 0B1000000000, // CalculatorDataCall
    Pause               = 0B10000000000, // CalculatorDataPause
    DeleteObject        = 0B100000000000, // CalculatorDataDeleteObject
    CreateImage         = 0B1000000000000, // CalculatorDataCreateImage
    PlaySound           = 0B10000000000000, // CalculatorDataSound
    StopMedia           = 0B100000000000000, // CalculatorDataStopMedia
    ShouldConvertManual = 0B1000000000000000, // CalculatorDataShouldConvertManual
    Comment             = 0B10000000000000000 // CalculatorDataRawCode
}

export interface CalculatorDataBase { }

export class CalculatorDataContentBase<T> implements CalculatorDataBase {
    public content: T;
}

export class CalcualtorDataConditionBase implements CalculatorDataBase {
    public condition: string;
}

export class CalculatorDataRawCode extends CalculatorDataContentBase<string> { }

export class CalculatorDataVariable extends CalculatorDataContentBase<Variable> { }

export class CalculatorDataWhile extends CalcualtorDataConditionBase {
    public init: string;
    public loop: string;
}

export class CalculatorDataCall extends CalcualtorDataConditionBase {
    public target: string;
    public param: string[] = new Array<string>();
    public resultStoredVariable: Variable;
}

export class CalculatorDataPause extends CalcualtorDataConditionBase {
    public time: number;
}

export class CalculatorDataDeleteObject extends CalculatorDataContentBase<string> { }

export class CalculatorDataCreateImage implements CalculatorDataBase {
    public name: string;
    public source: ImageResource | string; // 可能存在表达式
    public priority: number | string; // 可能存在表达式
    public left: number | string; // 可能存在表达式
    public top: number | string; // 可能存在表达式
}

export class CalculatorDataSound implements CalculatorDataBase {
    public name: string;
    public source: SoundResource | string;
    public repeat: boolean;
}

export class CalculatorDataStopMedia implements CalculatorDataBase {
    public name: string;
    public fadeTime: number | string; // 可能存在表达式
}

export class CalculatorDataShouldConvertManual extends CalculatorDataContentBase<any> { }

// Scene commands

export class BlockDataNormal extends BlockDataBase {
    private _item: Command[] = new Array<Command>();

    public get items(): Command[] {
        return this._item;
    }

    public newItem(type: CommandType): Command {
        let result = new Command(type);
        this._item.push(result);
        return result;
    }
}

export class Command {
    private _type: CommandType;
    private _content: CommandContentBase;

    public constructor(type: CommandType) {
        this._type = type;
        if (type == CommandType.Dialogue)
            this._content = new CommandContentDialogue();
        else if (type == CommandType.Effect)
            this._content = new CommandContentEffect();
        else if ((type & (CommandType.MenuToggle | CommandType.SaveLoadToggle)) != 0)
            this._content = new CommandContentToggle();
        else if (type == CommandType.Image)
            this._content = new CommandContentImage();
        else if (type == CommandType.ChangeImage)
            this._content = new CommandContentChangeImage();
        else if (type == CommandType.DestroyImage)
            this._content = new CommandContentDestroyImage();
        else if (type == CommandType.Sound)
            this._content = new CommandContentSound();
        else if (type == CommandType.ChangeVolume)
            this._content = new CommandContentChangeVolume();
        else if (type == CommandType.StopSound)
            this._content = new CommandContentStopSound();
        else if (type == CommandType.SetMessageBoxTarget)
            this._content = new CommandContentNameTarget();
        else if ((type & (CommandType.ShowMessageBox | CommandType.HideMessageBox)) != 0)
            this._content = new CommandContentTimeTarget();
        else if (type == CommandType.Movie)
            this._content = new CommandContentMovie();
        else if (type == CommandType.ShowVariableContent)
            this._content = new CommandContentVariable();
        else if (type == CommandType.Wait)
            this._content = new CommandContentTimeTarget();
        else if ((type & (CommandType.WaitForClick | CommandType.WaitAndClear)) != 0)
            this._content = {};
        else if (type == CommandType.ChangeTextSpeed)
            this._content = new CommandContentTextSpeed();
        else
            throw `Cannot declare command with type ${type}: Target type is not known`;
    }

    public get type(): CommandType {
        return this._type;
    }

    public content<T extends CommandContentBase>(): T {
        return this._content as T;
    }
}

export enum CommandType {
    Dialogue            = 0B1, // CommandContentText
    Effect              = 0B10, // CommandContentEffect
    MenuToggle          = 0B100, // CommandContentToggle
    SaveLoadToggle      = 0B1000, // CommandContentToggle
    Image               = 0B10000, // CommandContentImage
    ChangeImage         = 0B100000, // CommandContentChangeImage
    DestroyImage        = 0B1000000, // CommandContentDestroyImage
    Sound               = 0B10000000, // CommandContentSound
    ChangeVolume        = 0B100000000, // CommandContentChangeVolume
    StopSound           = 0B1000000000, // CommandContentStopSound
    ShowMessageBox      = 0B10000000000, // CommandContentTimeTarget
    SetMessageBoxTarget = 0B100000000000, // CommandContentNameTarget
    HideMessageBox      = 0B1000000000000, // CommandContentTimeTarget
    Movie               = 0B10000000000000, // CommandContentMovie
    ShowVariableContent = 0B100000000000000, // CommandContentVariable
    Wait                = 0B1000000000000000, // CommandContentTimeTarget
    WaitForClick        = 0B10000000000000000, // CommandContentBase
    WaitAndClear        = 0B100000000000000000, // CommandContentBase
    ChangeTextSpeed     = 0B1000000000000000000 // CommandContentTextSpeed
}

export interface CommandContentBase { }

export class CommandContentNameTarget implements CommandContentBase {
    public name: string;
}

export class CommandContentVariable implements CommandContentBase {
    public target: Resource<Variable>;
}

export class CommandContentDialogue implements CommandContentBase {
    public character: CharacterResource;
    private _text: Text[] = new Array<Text>();

    public get texts(): Text[] {
        return this._text;
    }

    public newText(): Text {
        let result = new Text(this);
        this._text.push(result);
        return result;
    }
}

export class Text {
    public text: string | Variable;
    public size?: number;
    public color?: string;
    public borderWidth?: number;
    public borderColor?: string;
    public bold?: boolean;
    public italic?: boolean;
    public underline?: boolean;
    private _dialogue: CommandContentDialogue;

    public get dialogue(): CommandContentDialogue {
        return this._dialogue;
    }

    public constructor(dialogue: CommandContentDialogue) {
        this._dialogue = dialogue;
    }

    public changeSize(value: number | string): Text {
        if (!this.size) this.size = 0;
        if (typeof value == 'number')
            this.size = value;
        else if (value[0] == '+' && value.length > 1)
            this.size = this.size + parseInt(value.slice(1));
        else if (value[0] == '-' && value.length > 1)
            this.size = this.size - parseInt(value.slice(1));
        else if (value.length > 0)
            this.size = parseInt(value);
        return this;
    }

    public changeBorder(width: number, color: string): Text {
        this.borderWidth = width;
        this.borderColor = color;
        return this;
    }
}

export class CommandContentToggle implements CommandContentBase {
    public value: boolean;
}

export class CommandContentTextSpeed implements CommandContentBase {
    public speed: TextSpeed;
}
export class CommandContentEffect implements CommandContentBase {
    public target: EffectResource;
}

export class CommandContentTimeTarget implements CommandContentBase {
    public time: number;
}

export class CommandContentMovie implements CommandContentBase {
    public source: MovieResource;
}

export class CommandContentSound implements CommandContentBase {
    public source: SoundResource;
    public track: Soundtrack;
    public mode: RepeatMode;
    public volume: number;
}

export class CommandContentStopSound extends CommandContentTimeTarget {
    public track: Soundtrack;
}

export class CommandContentChangeVolume extends CommandContentTimeTarget {
    public track: Soundtrack;
    public volume: number;
    public waitUntilFinish: boolean;
}

export class CommandContentChangeImage extends CommandContentNameTarget {
    public source: ImageResource | AnimationResource;
    public effect: EffectResource;
    public mode: RepeatMode;
}

export class CommandContentImage extends CommandContentChangeImage {
    public position: Point;
    public priority: number;
}

export class CommandContentDestroyImage implements CommandContentBase {
    public target: string[] = new Array<string>();
    public effect: EffectResource;
}

export enum RepeatMode {
    Normal,
    Repeat,
    WaitUntilFinish,
    DestroyAfterFinish
}

export enum Soundtrack {
    BGM,
    BGM2,
    Voice,
    Voice2,
    Effect,
    Effect2
}

export enum TextSpeed {
    Normal = -1,
    Fatest = -2,
    Slow = -3
}

export enum EffectType {
    None,
    Fade,
    BlindHorizontal,
    BlindVertical,
    CurtainHorizontal,
    CurtainVertical,
    ScrollHorizontal,
    ScrollVertical,
    Grid,
    GridHorizontal,
    GridVertical,
    Dither,
    White,
    Black,
    Flash,
    Mosaic,
    ScratchHorizontal,
    ScratchVertical,
    Spot,
    Mask,
    MaskWhite,
    MaskBlack,
    ZoomSmall,
    ZoomBig,
    ZoomIn,
    Ripple,
    BlurWhite,
    BlurBlack,
    TwistHorizontal,
    TwistVertical,
    Crack,
    Clockhand,
    RubberHorizontal,
    RubberVertical,
    FanCenter,
    FanBorder,
    Circle,
    BlockCoil,
    BlockRandom
}

export interface Point {
    x: number;
    y: number;
    percentageModeX?: boolean;
    percentageModeY?: boolean;
}

export class Point implements Point {
    public constructor(x: number, y: number, percentageModeX: boolean = false, percentageModeY: boolean = false) {
        this.x = x;
        this.y = y;
        this.percentageModeX = percentageModeX;
        this.percentageModeY = percentageModeY;
    }
}

export interface Vector {
    width: number;
    height: number;
}

export class Vector implements Vector {
    public constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }
}

export interface Rectangle extends Point, Vector { }

export class Rectangle implements Rectangle {
    public constructor(point: Point, size: Vector) {
        this.x = point.x;
        this.y = point.y;
        this.width = size.width;
        this.height = size.height;
    }
}
