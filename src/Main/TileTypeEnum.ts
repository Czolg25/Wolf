//need to files
export enum TileType {
    WALL_TILE = 1,
    PUSHWALL_TILE = (1 << 20),
    DOOR_TILE = 2,
    SECRET_TILE = 4,
    DRESS_TILE = 8,
    BLOCK_TILE = 16,
    ACTOR_TILE = 32,
    DEADACTOR_TILE = 64,
    POWERUP_TILE = 128,
    AMBUSH_TILE = 256,
    EXIT_TILE = 512,
    SECRETLEVEL_TILE = 1024,
    ELEVATOR_TILE = (1 << 11),
}
