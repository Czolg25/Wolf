import { GameAssets } from "./GameAssets";
import { Map } from "./map";

export interface Renders{
    gameAssets: GameAssets;
    readonly gameWidth: number;
    readonly gameHeight: number;
    map: Map;
    wallHeight: number;
}