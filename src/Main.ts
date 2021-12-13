import {GameAssets} from './Main/GameAssets';
import {Game} from './Main/game';

export class Main {
    private gameAssets = new GameAssets();
    private canvas: HTMLCanvasElement;
    private game: Game;
    private keys: any = {};//keyboard
    private id:number = 0;

    public async run(): Promise<void> {
        if(!this.isLegal) return //becouse exception

        await this.gameAssets.loadResources();

        this.canvas = document.createElement('canvas') as HTMLCanvasElement;
        this.game = new Game(this.canvas, this.gameAssets);
        document.getElementById("game").appendChild(this.canvas);
        this.game.init();

        this.tick = this.tick.bind(this);
        this.tick();
        this.keyboardControler()
    }

    private keyboardControler():void{
        document.onkeydown = event => {
            event.preventDefault();
            this.keys[event.key] = true;
        };
        document.onkeyup = event => {
            event.preventDefault();
            this.keys[event.key] = false;
        };
    }


    private isLegal(){
        this.id++;
        return this.id===1
    }

    private tick(): void {
        this.game.update(this.keys);
        this.game.render();
        requestAnimationFrame(this.tick);
    }
}
