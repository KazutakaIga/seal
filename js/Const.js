
//***********************************************************//
//************************ Const.js**************************//
//***********************************************************//

//###
//### THREE 基本オブジェクトのパラメータ
//###
const CAMERA_FOCUS = new THREE.Vector3(0, 0, -100);
const LIGHT_POS = new THREE.Vector3(0, 3, 1);
const RENDER_WIDTH = 400;
const RENDER_HEIGHT = 600;
const DEV_RENDER_WIDTH = 300;
const DEV_RENDER_HEIGHT = 450;

//###
//### BONE ANIMATION 用パラメータ
//###
const ANIMATION_STEP = 0.012;

//###
//### player 基本情報
//###
const PLAYER_INIT_HP = 1;
const PLAYER_INIT_SHOT_POWER = 1;
const PLAYER_INIT_POS    = new THREE.Vector3(0, 0, 220);
const PLAYER_SHOT_VECTOR = new THREE.Vector3(0, 0, -20);
const PLAYER_INIT_POW   = 1;
const PLAYER_INIT_SCORE = 0;
const PLAYER_INIT_BOMB  = 3;
const PLAYER_INIT_NUM   = 2;

//###
//### THREE scene 内の player 稼働範囲
//###
const MAX_SCENE_X = 230;
const MAX_SCENE_Z = 340;


//###
//### MESH URL
//###
const PLAYER_MESH_URL = './model/boneAnimation/remilia_cmell/fran_cmelltest.json';
const ENEMY1_MESH_URL = './model/boneAnimation/syanhai/syanhai.json';

//###
//### IMG URL
//###
const COL_IMG_URL = './model/collision/col.png';

//###
//### SE URL
//###
const BGM1_URL = './se/1.mp3';

const SHOT_SE_URL = './se/shot.mp3';
const ITEM_SE_URL = './se/item.mp3';
const DELETE_SE_URL = './se/delete.mp3';
const BOMB_SE_URL = './se/bomb.mp3';


//###
//### JSON stringify インデント
//###
JSON_INDENT = 3;

//###
//### shot の action_template
//### radio 変更時なぜか最後の要素の bind が効かないので最後の要素に damyy を加える
//###
const SHOT_TEMPLATE = ["normal", "tracking", "spiral", "random", "sign", "dammy"];

//###
//### move の action_template
//###
const MOVE_TEMPLATE = ["normal", "dammy"];

//###
//### enemy の action_template
//###
const ENEMY_TEMPLATE = ["normal", "dammy"];


//###
//### grid の間隔
//###
const GRID_INTERVAL = 100;
