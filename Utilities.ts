import * as GS from './include/GeneralScript';

export function toLiveMakerHexName(num: number, length: number = 8){
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

export function normalizeVariableValue(variable: GS.Variable<any>): GS.Variable<any> {
    let result: GS.Variable<any> = {
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
