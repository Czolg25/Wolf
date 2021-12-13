interface EntityInterface {
    //loc
    x: number;
    y: number;
    rx: number;
    ry: number;
    spriteIndex: number;
    collectible: boolean;
    orientable: boolean;
    blocking: boolean;
    direction: number;
    

    startAnimation(animation: any): void;

    tick(): void;
    update(keys: any): void;
}
