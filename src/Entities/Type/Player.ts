import {Map} from '../../Main/map';
import {TileType} from '../../Main/TileTypeEnum';

export class Player {
    //loc
    public x: number;
    public y: number;

    //dets
    public dx: number;
    public dy: number;
    
    public speed = 0.065;
    public speedRotation = 0.05;
    
    public radius = 0.25;
    private map: Map;

    constructor(map: Map) {
        this.map = map;
    }


    public move(length: number): void {
        const x = this.x + this.dx * length;
        const y = this.y + this.dy * length;

        if (this.isValidMove(x, this.y)) 
            this.x = x;
        if (this.isValidMove(this.x, y)) 
            this.y = y;
        
    }

    
    public getPosition(): { worldX: number, worldY: number, dx: number, dy: number } {
        let worldX = Math.floor(this.x);
        let worldY = Math.floor(this.y);
        let dx = 0;
        let dy = 0;
        if (Math.abs(this.dx) >= Math.abs(this.dy)) {
            dx = this.dx >= 0 ? 1 : -1;
            worldX += dx;
        } else {
            dy = this.dy >= 0 ? 1 : -1;
            worldY += dy;
        }
        return {
            worldX,
            worldY,
            dx,
            dy
        };
    }


    public turn(alpha: number): void {
        const dx = this.dx * Math.cos(alpha) - this.dy * Math.sin(alpha);
        this.dy = (this.dx * Math.sin(alpha) + this.dy * Math.cos(alpha));
        this.dx = dx;
    }

    private shoot(): void{
        console.log("shoot")
    }

    private isValidMove(x: number, y: number): boolean {
        let radius = this.radius;
        let fx = x % 1;
        let xi = Math.floor(x);
        let fy = y % 1;
        let yi = Math.floor(y);
        return !(this.isValidMoveInto(xi, yi)
            ||(fx < radius&&((this.isValidMoveInto(xi - 1, yi))|| (fy > 1 - radius && this.isValidMoveInto(xi - 1, yi + 1))||(fy < radius && this.isValidMoveInto(xi - 1, yi - 1))) )
            || (fx > 1 - radius) && ((this.isValidMoveInto(xi + 1, yi)) || (fy < radius && this.isValidMoveInto(xi + 1, yi - 1)) || (fy > 1 - radius && this.isValidMoveInto(xi + 1, yi + 1)))
            || (fy < radius && this.isValidMoveInto(xi, yi - 1)) || (fy > 1 - radius && this.isValidMoveInto(xi, yi + 1))
        ) 
    }

    private isValidMoveInto(x: number, y: number): boolean {
        if (this.map.doors.containsKey(x.toFixed() + y.toFixed())) {
            const door = this.map.doors.get(x.toFixed() + y.toFixed());
            return !door.isOpen;
        }
        let tileType = this.map.tileMap[x][y];
        if (tileType === TileType.WALL_TILE || tileType === TileType.BLOCK_TILE || tileType === TileType.PUSHWALL_TILE) 
            return true;
        
        return this.map.entityLocations[x][y] !== undefined
    }

    public handleInput(keys: any): void {
        if (keys['ArrowRight']) 
            this.turn(this.speedRotation);
        if (keys['ArrowLeft'])
            this.turn(-this.speedRotation);
        if (keys['ArrowUp']) 
            this.move(this.speed);
        if (keys['ArrowDown']) 
            this.move(-this.speed);
        if (keys['z']) 
            this.shoot()
    }
}
