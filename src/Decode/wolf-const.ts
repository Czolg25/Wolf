//enum from map this is to ride the filess
export const WolfConst = {
    SLICE_WIDTH: 3,
    WALL_TEXTURE_WIDTH: 64,
    NUM_WALL_TEXTURES: 55,
    HUD_FACE_WIDTH: 48,
    HUD_FACE_HEIGHT: 64,
    HUD_WEAPON_WIDTH: 256,
    NUMAREAS: 37,   // number of areas
    FIRSTAREA: 0x6B, // first area in map data (it is by the way a way to the secret floor!)
    AMBUSHTILE: 0x6A, // def guard
    AMBUSH: -2,
    TILEGLOBAL: 0x10000,
    HALFTILE: 0x8000,
    TILESHIFT: 16,
    MINDIST: 0x5800,
    FLOATTILE: 65536.0,
    TILE2POS: function (a: number): number {
        return (((a) << WolfConst.TILESHIFT) + WolfConst.HALFTILE);
    },
    POS2TILE: function (a: number): number {
        return ((a) >> WolfConst.TILESHIFT);
    },
    POS2TILEf: function (a: number): number {
        return ((a) / WolfConst.FLOATTILE);
    },
    ASTEP: 0.0078125,    // 1 FINE=x DEGREES
    ASTEPRAD: 0.000136354,  // 1 FINE=x RADIANS
    ANG_1RAD: 7333.8598,    // 1 RADIAN=x FINES
    ANG_0: 0,            //(int)((float)0/ASTEP)
    ANG_1: 128,          //(int)((float)1/ASTEP)
    ANG_6: 768,          //(int)((float)6/ASTEP)
    ANG_15: 1920,         //(int)((float)15/ASTEP)
    ANG_22_5: 2880,         //(int)((float)22.5/ASTEP)
    ANG_30: 3840,         //(int)((float)30/ASTEP)
    ANG_45: 5760,         //(int)((float)45/ASTEP)
    ANG_67_5: 8640,         //(int)((float)67.5/ASTEP)
    ANG_90: 11520,        //(int)((float)90/ASTEP)
    ANG_112_5: 14400,        //(int)((float)112.5/ASTEP)
    ANG_135: 17280,        //(int)((float)135/ASTEP)
    ANG_157_5: 20160,        //(int)((float)157.5/ASTEP)
    ANG_180: 23040,        //(int)((float)180/ASTEP)
    ANG_202_5: 25920,        //(int)((float)202.5/ASTEP)
    ANG_225: 28800,        //(int)((float)225/ASTEP)
    ANG_247_5: 31680,        //(int)((float)247.5/ASTEP)
    ANG_270: 34560,        //(int)((float)270/ASTEP)
    ANG_292_5: 37440,        //(int)((float)292.5/ASTEP)
    ANG_315: 40320,        //(int)((float)225/ASTEP)
    ANG_337_5: 43200,        //(int)((float)337.5/ASTEP)
    ANG_360: 46080,        //(int)((float)360/ASTEP)
    ANGLES: 360,          // must be divisable by 4
    DEATHROTATE: 2,
    FINE2RAD: function (a: number): number {
        return (a * Math.PI / WolfConst.ANG_180);
    },
    RAD2FINE: function (a: number): number {
        return (a * WolfConst.ANG_180 / Math.PI);
    },
    FINE2DEG: function (a: number): number {
        return (a / WolfConst.ANG_1) >> 0;
    },	// !@# don't lose precision bits
    FINE2DEGf: function (a: number): number {
        return (a / WolfConst.ANG_1);
    },
    DEG2FINE: function (a: number): number {
        return (a * WolfConst.ANG_1);
    }
};
