import * as UUID from 'uuid';

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

export function normalizeVariableValue(variable: GS.Variable): GS.Variable {
    let result: GS.Variable = {
        type: variable.type,
        name: variable.name,
        value: variable.value,
        scope: variable.scope
    };
    if (result.type == GS.VariableType.String && result.value[0] != '"')
        result.value = `"${result.value}"`;
    if (result.type == GS.VariableType.Boolean)
        result.value = result.value ? 'True' : 'False';
    return result;
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

export function findOrAddImageByPath(path: string, project: LiteScript.Project): LiteScript.ImageResource {
    let result = project.findResourceByPath<LiteScript.ImageResource>(path);
    if (!result)
        result = project.findImage(project.addResource<LiteScript.ImageResource>(LiteScript.ResourceType.Image, path));
    return result;
}
