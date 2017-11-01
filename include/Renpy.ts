import * as LiteScript from './LiteScript';

export enum SoundChannel {
    Bgm = 'music',
    Bgm2 = 'music2',
    Effect = 'effect',
    Effect2 = 'effect2',
    Voice = 'voice',
    Voice2 = 'voice2'
}

export interface IdContent<T> {
    id: T;
}

export interface NameWithId extends IdContent<string> {
    name: string;
}

export interface NameWithIds extends IdContent<string[]> {
    name: string;
}

export interface PendingImage {
    name: string;
    transform: string;
    zorder: number;
    target: LiteScript.ImageResource | LiteScript.AnimationResource;
}
