import {Map} from '../Main/map';
import {Player} from './Type/Player';
import {TileType} from '../Main/TileTypeEnum';

export abstract class entity implements EntityInterface {
    public blocking: boolean;
    public collectible: boolean;
    public orientable: boolean;
    public spriteIndex: number;
    public animation: any;
    public x: number;
    public rx: number;
    public y: number;
    public ry: number;
    public direction: number;
    private player: Player;
    private map: Map;
    private time: number = 0;

    constructor(map: Map, x: number, y: number, spriteIndex: number, collectible: boolean = false, orientable: boolean = false, blocking: boolean = false) {
        this.map = map;
        this.player = map.player;
        this.x = x;
        this.y = y;
        this.spriteIndex = spriteIndex;
        this.collectible = collectible;
        this.orientable = orientable;
        this.blocking = blocking;

    }

    public startAnimation(animation: any): void {
        this.animation = animation;
        this.spriteIndex = animation.sprites[0];
    }

    public tick(): void {
        this.map.entityLocations[this.x][this.y] = undefined;
        this.rx = this.x - this.player.x;
        this.ry = this.y - this.player.y;
        const rx = this.rx * this.player.dx + this.ry * this.player.dy;
        this.ry = -this.rx * this.player.dy + this.ry * this.player.dx;
        this.rx = rx;
        if (this.animation) {
            const a = this.animation;
            a.timer += 1;
            if (a.timer >= 8) {
                a.timer = 0;
                if (a.spriteIndex >= a.sprites.length - 1) {
                    if (a.loop) {
                        // animation loops
                        a.spriteIndex = 0;
                    } else {
                        // animation ended
                        this.animation = undefined;
                    }
                } else {
                    a.spriteIndex += 1;
                }
                this.spriteIndex = a.sprites[a.spriteIndex];
            }
        }
        this.map.entityLocations[this.x][this.y] = this;
    }

    public canMoveInto(x: number, y: number): boolean {
        //Check if we are allowed to pass trough a door
        if (this.map.doors.containsKey(x.toFixed() + y.toFixed())) {
            const door = this.map.doors.get(x.toFixed() + y.toFixed());
            return !door.isOpen;
        }
        //Check impassable tile types
        const tileType = this.map.tileMap[x][y];
        return tileType === TileType.WALL_TILE || tileType === TileType.BLOCK_TILE || tileType === TileType.PUSHWALL_TILE;

    }

    
    private canMoveTo(x: number, y: number): boolean {
        const r = this.direction;
        const fx = x % 1;
        const xi = ~~x;
        const fy = y % 1;
        const yi = ~~y;
        if (this.canMoveInto(xi, yi)) {
            return false;
        }
        //Check if we are getting too close to a wall/solid/entity
        if (fx < r) {
            if (this.canMoveInto(xi - 1, yi)) {
                return false;
            }
            if (fy < r && this.canMoveInto(xi - 1, yi - 1)) {
                return false;
            }
            if (fy > 1 - r && this.canMoveInto(xi - 1, yi + 1)) {
                return false;
            }
        }
        if (fx > 1 - r) {
            if (this.canMoveInto(xi + 1, yi)) {
                return false;
            }
            if (fy < r && this.canMoveInto(xi + 1, yi - 1)) {
                return false;
            }
            if (fy > 1 - r && this.canMoveInto(xi + 1, yi + 1)) {
                return false;
            }
        }
        if (fy < r && this.canMoveInto(xi, yi - 1)) {
            return false;
        }
        if (fy > 1 - r && this.canMoveInto(xi, yi + 1)) {
            return false;
        }
        return true;
    }


    public update(keys: any): void {
        this.time += 1
        if(this.time % 100 != 0) return

        this.time = 1

        let distance = Math.sqrt(Math.pow((this.x-this.player.x),2)+ Math.pow((this.y-this.player.y),2))
        if(!this.canMoveTo(this.player.x,this.player.y)||distance > 20) return

        console.log(1)


        let newX: number = this.x + 2*Math.sign((this.x-this.player.x))
        let newY: number = this.y + 2*Math.sign((this.y-this.player.y))
        if(this.canMoveTo(newX,newY)){

            
            this.x = newX
            this.y = newY
            console.log(this.x,this.y)
        }
    }
}
