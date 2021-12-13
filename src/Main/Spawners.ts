import { GuardEnemy } from '../Entities/Type/GuardEnemy';
import {Map} from './map';

export class EntitySpawner {
    private plane0: DataView;
    private plane1: DataView;
    private entities: Array<EntityInterface>;
    private map: Map;

    private stack:number = 64

    constructor(plane0: DataView, plane1: DataView) {
        this.plane0 = plane0;
        this.plane1 = plane1;
    }

    public setup(map: Map): Array<EntityInterface> {
        this.map = map;
        this.entities = [];


        for (let y = 0; y < this.stack; y++) {
            for (let x = 0; x < this.stack; x++) {
                this.EntitiesAndProps(x, y);
            }
        }
        return this.entities;
    }

    private EntitiesAndProps(x: number, y: number): void {
        const piece = this.map1(x, y)
        if(piece > 108)
            this.spawnEnemy(x, y, piece);
    }

    private spawnEnemy(x: number, y: number, tile: number): void {
        if ((108 <= tile && tile < 116)) 
            this.entities.push(new GuardEnemy(this.map, x, y, (tile - 108) % 4));
        if ((108 <= tile && tile < 116))
            this.entities.push(new GuardEnemy(this.map,x, y, (tile - 108) % 4));
        else if ((144 <= tile && tile < 152))
            this.entities.push(new GuardEnemy(this.map,x, y, (tile - 144) % 4));
        
    }


    public map0(x: number, y: number): number {
        return this.plane0.getUint16(2 * (x + this.stack * y), true);
    }

    public map1(x: number, y: number): number {
        return this.plane1.getUint16(2 * (x + this.stack * y), true);
    }
}
