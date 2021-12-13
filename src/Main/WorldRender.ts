import {palette} from '../Decode/palette';
import {GameAssets} from './GameAssets';
import {Map} from './map';
import {Player} from '../Entities/Type/Player';
import { Renders } from './Renderers';

export class WorldRenderer implements Renders {
    public gameAssets: GameAssets;
    public readonly gameWidth: number;
    public readonly gameHeight: number;
    public map: Map;
    public player: Player;
    public wallHeight: number;
    private readonly stack: number = 64
    
    public zIndex: Array<number>;
    constructor(gameAssets: GameAssets, map: Map, gameWidth: number, gameHeight: number) {
        this.gameAssets = gameAssets;
        this.map = map;
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.wallHeight = this.gameWidth / 2;
        this.player = this.map.player;
        this.zIndex = [];
    }

    public renders(data: DataView): void {
        for (let i = 0; i < this.gameWidth; i++) {
            const shift =  ((i << 1) - this.gameWidth) / this.gameWidth;
            let rdx = this.player.dx - shift * this.player.dy;
            let rdy = this.player.dy + shift * this.player.dx;
            const stepx = rdx >= 0 ? 1 : -1;
            const stepy = rdy >= 0 ? 1 : -1;
            rdx = stepx * rdx; 
            rdy = stepy * rdy;
            let cx = Math.floor(this.player.x);
            let cy = Math.floor(this.player.y);
            let rfx = stepx > 0 ? 1 - (this.player.x % 1) : this.player.x % 1;
            if (rfx === 0) {
                rfx = 1;
                cx += stepx;
            }
            let rfy = stepy > 0 ? 1 - (this.player.y % 1) : this.player.y % 1;
            if (rfy === 0) {
                rfy = 1;
                cy += stepy;
            }
            let t = 0;
            let m0;
            let tx;
            let textureIndex;
            while (true) {
                m0 = this.map.map0(cx, cy);
                if (m0 <= 63) {
                    let wallShift = 0;
                    if (rfx === 1 - wallShift) {
                        textureIndex = 2 * m0 - 1;
                        tx = stepx * stepy > 0 ? 1 - rfy : rfy;
                    } else {
                        textureIndex = 2 * m0 - 2;
                        tx = stepx * stepy < 0 ? 1 - rfx : rfx;
                    }
                    break;
                } else if (m0 <= 101) {
                    let door = this.map.doors.get(cx.toFixed() + cy.toFixed());
                    let doorShift = 0;
                    let timer = door.getTimer();
                    if (timer) {
                        if (timer.opening) 
                            doorShift = timer.t / 64;
                        else 
                            doorShift = 1 - timer.t / 64;
                    }
                    if (door.isOpen) 
                        doorShift = 1;
                    
                    if (m0 % 2 === 0) {
                        if (rfx >= .5 && (rfx -0.5) * rdy < rfy * rdx) {
                            const dt = (rfx - 0.5) / rdx;
                            t += dt;
                            rfy -= dt * rdy;
                            rfx = 0.5;
                            tx = stepy > 0 ? 1 - rfy : rfy;
                            tx -= doorShift;
                            if (tx >= 0) {
                                //from file
                                switch (m0) {
                                    case 90:
                                        textureIndex = 99;
                                        break;
                                    case 92:
                                        textureIndex = 105;
                                        break;
                                    case 94:
                                        textureIndex = 105;
                                        break;
                                    case 100:
                                        textureIndex = 103;
                                        break;
                                }
                                break;
                            }
                        }
                        if (rfx * rdy >= rfy * rdx) {
                            const dt = rfy / rdy;
                            t += dt;
                            rfx -= dt * rdx;
                            rfy = 1;
                            cy += stepy;
                            textureIndex = 100;
                            tx = stepx > 0 ? 1 - rfx : rfx;
                            break;
                        } else {
                            const dt = rfx / rdx;
                            t += dt;
                            rfy -= dt * rdy;
                            rfx = 1;
                            cx += stepx;
                        }
                    } else {
                        if (rfy >= .5 && (rfy - .5) * rdx < rfx * rdy) {
                            const dt = (rfy - .5) / rdy;
                            t += dt;
                            rfx -= dt * rdx;
                            rfy = .5;
                            tx = stepx > 0 ? 1 - rfx : rfx;
                            tx -= doorShift;
                            if (tx >= 0) {
                                switch (m0) {
                                    case 91:
                                        textureIndex = 98;
                                        break;
                                    case 93:
                                        textureIndex = 104;
                                        break;
                                    case 95:
                                        textureIndex = 104;
                                        break;
                                    case 101:
                                        textureIndex = 102;
                                        break;
                                }
                                break;
                            }
                        }
                        if (rfy * rdx >= rfx * rdy) {
                            const dt = rfx / rdx;
                            t += dt;
                            rfy -= dt * rdy;
                            rfx = 1;
                            cx += stepx;
                            textureIndex = 101;
                            tx = stepy > 0 ? 1 - rfy : rfy;
                            break;
                        } else {
                            const dt = rfy / rdy;
                            t += dt;
                            rfx -= dt * rdx;
                            rfy = 1;
                            cy += stepy;
                        }
                    }
                }
                if (rfx * rdy <= rfy * rdx) {
                    const dt = rfx / rdx;
                    t += dt;
                    rfx = 1;
                    cx += stepx;
                    rfy -= dt * rdy;
                } else {
                    const dt = rfy / rdy;
                    t += dt;
                    rfy = 1;
                    cy += stepy;
                    rfx -= dt * rdx;
                }
            }
            const h = this.wallHeight / (2 * t); 
            this.zIndex[i] = t;
            let yi = Math.floor(this.gameHeight / 2 - h);
            let yf = (this.gameHeight / 2 - h) % 1;
            let stepi = Math.floor(h / this.stack*2);
            let stepf = (h / this.stack*2) % 1;
            let texelOffset = this.map.wallTextureOffset + 4096 * textureIndex + this.stack * Math.floor(this.stack * tx);
            for (let j = 0; j <= yi; j++) {
                data.setUint32((this.gameWidth * j + i) << 2, palette[29], true);
                data.setUint32((this.gameWidth * (this.gameHeight - 1 - j) + i) << 2, palette[25], true);
            }
            for (let j = texelOffset; j < texelOffset + this.stack; j++) {
                let col;
                col = palette[this.gameAssets.wsMap.getUint8(j)];
                yf += stepf;
                if (yf >= 1) {
                    for (let k = Math.max(0, yi); k < Math.min(this.gameHeight, yi + stepi + 1); k++) 
                        data.setUint32((this.gameWidth * k + i) << 2, col, true);
                    yi += stepi + 1;
                    yf -= 1;
                } else {
                    for (let k = Math.max(0, yi); k < Math.min(this.gameHeight, yi + stepi); k++) 
                        data.setUint32((this.gameWidth * k + i) << 2, col, true);
                    yi += stepi;
                }
            }
        }
    }
}
