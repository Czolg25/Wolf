import {Map} from '../Main/map';
import { entity } from './entity';

export class Enemy extends entity {
    public deathSprites: any;
    public alive: boolean = true;

    constructor(map: Map, x: number, y: number, txt: number, deathSprites: any, orientable: boolean = false, direction: number = 0) {
        super(map, x, y, txt, false, orientable);
        this.direction = direction;
        this.deathSprites = deathSprites;
    }

}
