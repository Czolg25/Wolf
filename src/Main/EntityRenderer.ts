import {palette} from '../Decode/palette';
import {GameAssets} from './GameAssets';
import {Map} from './map';
import {WorldRenderer} from './WorldRender';
import { Renders } from './Renderers';

export class EntityRenderer implements Renders{
    public gameAssets: GameAssets;
    public readonly gameWidth: number;
    public readonly gameHeight: number;
    public map: Map;
    public worldRenderer: WorldRenderer;
    public wallHeight: number;

    private stack:number = 64;

    constructor(gameAssets: GameAssets, map: Map, gameWidth: number, gameHeight: number, worldRenderer: WorldRenderer) {
        this.worldRenderer = worldRenderer;
        this.gameAssets = gameAssets;
        this.map = map;
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.wallHeight = this.gameWidth / 2;
    }

    public render(data: DataView, entities: Array<EntityInterface>): void {
        for (let i = 0; i < entities.length; i++) {
            if (entities[i].rx < this.map.player.radius) 
                continue;
            else if (Math.abs(entities[i].ry) > entities[i].rx + 1) 
                continue;
            
            const th = this.wallHeight / entities[i].rx;
            const tx = Math.floor((entities[i].ry / entities[i].rx + 1) * this.wallHeight - th / 2);
            const ty = Math.floor((this.gameHeight - th) / 2);
            let rad = entities[i].spriteIndex;
            if (entities[i].orientable) // sym nieozn
                rad += (Math.round(4 * Math.atan2(entities[i].x - this.map.player.x, entities[i].y - this.map.player.y) / Math.PI - entities[i].direction) + 16) % 8;
            this.drawSprite(data, rad, tx, ty, th, entities[i].rx);
        }
    }

    private drawSprite(data: DataView, index: number, x: number, y: number, height: number, distance: number = 0): void {
        let firstSprite = this.gameAssets.wsMap.getUint16(2, true);
        let spriteOffset = this.gameAssets.wsMap.getUint32(6 + 4 * (firstSprite + index), true);
        let firstCollumn = this.gameAssets.wsMap.getUint16(spriteOffset, true);
        let lastCollumn = this.gameAssets.wsMap.getUint16(spriteOffset + 2, true);
        let nextCollumn = lastCollumn - firstCollumn + 1;
        let pixelPoolOffset = spriteOffset + 4 + 2 * nextCollumn;
        for (let col = firstCollumn; col <= lastCollumn; col++) {
            let colOffset = spriteOffset + this.gameAssets.wsMap.getUint16(spriteOffset + 4 + 2 * (col - firstCollumn), true);
            while (true) {
                let endRow = this.gameAssets.wsMap.getUint16(colOffset, true) / 2;
                if (endRow === 0) 
                    break;
                let startRow = this.gameAssets.wsMap.getUint16(colOffset + 4, true) / 2;
                colOffset += 6;
                for (let row = startRow; row < endRow; row++) {
                    this.drawScaledPixel(
                        data,
                        x + Math.floor(col * height / this.stack),
                        y + Math.floor(row * height / this.stack),
                        this.gameAssets.wsMap.getUint8(pixelPoolOffset),
                        Math.ceil(height / this.stack),
                        distance
                    );
                    pixelPoolOffset += 1;
                }
            }
        }
    }


    private drawScaledPixel(data: DataView, x: number, y: number, paletteCollor: number, scale: number, distance: number = 0): void {
        if (paletteCollor === undefined) return
        const color = palette[paletteCollor];
            for (let col = x >= 0 ? x : 0; col < x + scale && col < this.gameWidth; col++) {
                if (distance >= this.worldRenderer.zIndex[col]) continue;
                
                for (let row = y >= 0 ? y : 0; row < y + scale && row < this.gameWidth; row++) {
                    try {
                        data.setUint32((this.gameWidth * row + col) << 2, color, true);
                    } catch (e) {

                    }
                }
            }
    }
}
