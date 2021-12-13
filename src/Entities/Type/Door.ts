import {DoorType} from '../../Decode/door-type';
import { Player } from './Player';

export class Door {
    public x: number;
    public y: number;
    public isOpen: boolean;
    public type: DoorType;
    public vertical: boolean;
    public textureIndex: number;
    private player: Player;
    private timer: { x: number, y: number, t: number, opening: boolean };//object
    
    //const
    private timeOpen = 64


    constructor(x: number, y: number, player: Player) {
        this.x = x;
        this.y = y;
        this.player = player;
    }

    public tick(): void {
        const timer = this.timer;
        if (timer) {
            timer.t += 1;
            if (timer.t > this.timeOpen) {
                this.isOpen = timer.opening;
                this.timer = undefined;
            }
        }
    }

    public update(keys: any): void {
        if (keys[' ']) {
            if (!this.timer) {
                let player = this.player;
                let playerPosition = this.player.getPosition();
                if (this.x !== playerPosition.worldX || this.y !== playerPosition.worldY) 
                    return;
                let opening = true;
                if (this.isOpen) {
                    if ((playerPosition.dx > 0 && playerPosition.worldX - player.x <= player.radius) ||
                        (playerPosition.dx < 0 && player.x - playerPosition.worldX - 1 <= player.radius) ||
                        (playerPosition.dy > 0 && playerPosition.worldY - player.y <= player.radius) ||
                        (playerPosition.dy < 0 && player.y - playerPosition.worldY - 1 <= player.radius)) {
                        return;
                    } else {
                        opening = false;
                        this.isOpen = false;
                    }
                }
                this.timer = {
                    x: playerPosition.worldX,
                    y: playerPosition.worldY,
                    t: 0,
                    opening: opening
                };
            }
        }
    }

    public getTimer(): { x: number, y: number, t: number, opening: boolean } {
        return this.timer;
    }
}
