import {Map} from '../../Main/map';
import {Enemy} from '../Enemy';

export class GuardEnemy extends Enemy {
    constructor(map: Map, x: number, y: number, direction: number = 0) {
        super(map, x, y, 50, [90, 91, 92, 93, 95], true, direction);
    }

}
