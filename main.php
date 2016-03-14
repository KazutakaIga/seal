

<!DOCTYPE html>
<head>
<meta charset="UTF-8">
<meta http-equiv="Pragma" content="no-cache" />
<meta http-equiv="cache-control" content="no-cache" />
<meta http-equiv="expires" content="0" />
<title>T-Shoting</title>

<link rel="stylesheet" type="text/css" href="./css/main.css">
<link rel="stylesheet" type="text/css" href="./css/header.css">

<script src="./api/jquery-2.1.4.min.js"></script>

<!-------------------------->
<!-- include THREE.js API -->
<!-------------------------->
<script type="text/javascript" src="./api/three.min.js"></script>

<!-------------------------->
<!-- include game API     -->
<!-------------------------->
<script type="text/javascript" src="./js/Include.js"></script>
<script type="text/javascript" src="./js/Const.js"></script>
<script type="text/javascript" src="./js/GameControl.js"></script>
<script type="text/javascript" src="./js/Shot.js"></script>
<script type="text/javascript" src="./js/Chara.js"></script>
<script type="text/javascript" src="./js/BackGround.js"></script>
<script type="text/javascript" src="./js/Key.js"></script>
<script type="text/javascript" src="./js/ModelContainer.js"></script>
<script type="text/javascript" src="./js/Item.js"></script>
<script type="text/javascript" src="./js/Bomb.js"></script>
<script type="text/javascript" src="./js/Gameover.js"></script>

<!------------------------------------>
<!-- include THREE post process API -->
<!------------------------------------>
<script type="text/javascript" src="./api/extension/examples/js/shaders/CopyShader.js"></script>
<script type="text/javascript" src="./api/extension/examples/js/postprocessing/EffectComposer.js"></script>
<script type="text/javascript" src="./api/extension/examples/js/postprocessing/MaskPass.js"></script>
<script type="text/javascript" src="./api/extension/examples/js/postprocessing/RenderPass.js"></script>
<script type="text/javascript" src="./api/extension/examples/js/postprocessing/ShaderPass.js"></script>

<!--------------------------->
<!-- include THREE shaders -->
<!--------------------------->
<script src="./api/extension/examples/js/shaders/HorizontalBlurShader.js"></script> 
<script src="./api/extension/examples/js/shaders/ColorifyShader.js"></script> 


</head>
<body id="body">
<!--------------------------->
<!-- include OrbitControl  -->
<!--------------------------->
<script type="text/javascript" src="./api/OrbitControls.js"></script>
<div id="menu">
  <script type="text/javascript" >
    Include.include("header.html"); 
  </script>
</div>

<script>
//###
//### 対象の JSON 設定ファイルの読み込み
//###
var postedData = "./js/setting/temp.json";

var game = new GameControl(postedData);

//###
//### THREE.js Basic Object の定義
//###
var scene, camera, controls, renderer, composer;

//###
//### 自機キャラ
//### ベースオブジェクト定義
//###
var fran = new Chara(PLAYER_INIT_HP, 0, 0, 0, true);

//###
//### BackGround  用ベースオブジェクト定義
//###
var backGround = new BackGround();

//###
//### SE
//###
var bgm = new Sound();
bgm.createSound("bgm", BGM1_URL);
var shotSe = new Sound();
shotSe.createSound("shot", SHOT_SE_URL, false);
var itemSe = new Sound();
itemSe.createSound("item", ITEM_SE_URL, false);
var deleteSe = new Sound();
deleteSe.createSound("delete", DELETE_SE_URL, false);
var bombSe = new Sound();
bombSe.createSound("bomb", BOMB_SE_URL, false);

//==============================================//
// ### init ###                                 //
// 描画 canvas, camera, light, chara, renderer  //
// 等の基本オブジェクトの割り当て               //
//==============================================//
var init = function(){
  //###
  //### scene
  //###
  scene = new THREE.Scene();

  //###
  //### camera
  //###
  camera = new THREE.PerspectiveCamera(15, RENDER_WIDTH / RENDER_HEIGHT, 1, 10000);
  camera.position.y = 3000;// カメラの位置
  camera.position.z = 0;// カメラの位置
  camera.lookAt(CAMERA_FOCUS);

  //###
  //### light
  //###
  var directionalLight = new THREE.DirectionalLight(0x000000, 0.1);// 平行光
  directionalLight.position.set(LIGHT_POS);// 光源の位置
  scene.add(directionalLight);

  //###
  //### BackGround サンプル
  //###
  backGround.createBackGround();

  //###
  //### effect サンプル
  //###
  effect.createEffect("./model/effect/delete1.png");
  hitEffect.createEffect("./model/effect/hit.png");

  //###
  //### gameover 時の選択肢
  //###
  gameover.createGameover( "./model/gameover/continue.png" );
  gameover.createGameover( "./model/gameover/giveup.png" );

  //###
  //### Bomb
  //###
  bomb = new Bomb();
  bomb.createMagicCircle("./model/effect/circle.png");

  //###
  //### renderer
  //###
  var canvas = document.getElementById('canvas');// 描画要素
  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setClearColor('#777777', 1);// 背景色
  renderer.setSize(RENDER_WIDTH, RENDER_HEIGHT);// 描画領域の大きさ
  renderer.setFaceCulling(THREE.CullFaceBack);
  canvas.appendChild(renderer.domElement);

  //controls = new THREE.OrbitControls(camera);
  //controls.center = new THREE.Vector3(0, 0, 0);

  //###
  //### ポストプロセスの設定
  //###
  var parameters = {                  // EffectComposerのデフォパラメータ
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter, 
    format: THREE.RGBFormat,
    stencilBuffer: false
  };
  var renderTarget = new THREE.WebGLRenderTarget( RENDER_WIDTH, RENDER_HEIGHT, parameters ); 
  composer = new THREE.EffectComposer(renderer, renderTarget);
  composer.addPass(new THREE.RenderPass(scene, camera));

  var toScreen = new THREE.ShaderPass(THREE.CopyShader);
  toScreen.renderToScreen = true;
  composer.addPass(toScreen);

  //###
  //### 自機キャラ
  //###
  modelContainer.load( fran.createChara(PLAYER_INIT_POS, PLAYER_MESH_URL, true, true));
  };


//==============================================//
// ### doKey ###                                //
// 移動、shot 等キーアクションの設定            //
//==============================================//
function doKey() {

  //###
  //### 矢印キーを押された際に true へ、true の時は OrbitComtrol の視点移動を禁止する
  //###
  var moveKeyFlag = false;
  switch( game.playerState ){

    case game.state["PLAY"] :

    //###
    //### 自機キャラが被弾した場合(mesh が scene から removeされたら)は以降処理を行わない
    //###
    if(fran.charaMesh == null) return;

    //###
    //### Z キーで Shot
    //###
    if(key.isDown(key.keyCode["KEY_Z"])){
      if(fran.charaShot.createShot(fran.charaMesh.position) == true) shotSe.enableSound("shot");
      }

    //###
    //### X キーで Bomb
    //###
    if( key.isDown( key.keyCode["KEY_X"] ) && 
        fran.bomb != 0 &&
        bomb.ifEnable == false){
      bomb.enableMagicCircle(fran.charaMesh.position);
      fran.bomb--;
      shotSe.enableSound("bomb");
      }

    //###
    //### 方向キーで移動、Shift を押しながらだと低速移動
    //###
    var moveSpeed = 7;
    const OFFSET = -50;
    
    //###
    //### Shift キー、低速移動
    //###
    if( key.isDown( key.keyCode["KEY_SHIFT"] ) ) moveSpeed = 3;

    //###
    //### 上キー、
    //###
    if( key.isDown( key.keyCode["KEY_UP"] ) ){
      if( fran.charaMesh.position.z < -MAX_SCENE_Z ) return;
      fran.charaMesh.position.z -= moveSpeed;
      fran.chara.position.z = fran.charaMesh.position.z + OFFSET;

      moveKeyFlag = true;
      }

    //###
    //### 下キー、
    //###
    if( key.isDown( key.keyCode["KEY_DOWN"] ) ){
      if( fran.charaMesh.position.z > MAX_SCENE_Z ) return;
      fran.charaMesh.position.z += moveSpeed;
      fran.chara.position.z = fran.charaMesh.position.z + OFFSET;

      moveKeyFlag = true;
      }

    //###
    //### 左キー、
    //###
    if( key.isDown( key.keyCode["KEY_LEFT"] ) ){
      if( fran.charaMesh.position.x < -MAX_SCENE_X ) return;
      fran.chara.position.x = fran.charaMesh.position.x -= moveSpeed;

      moveKeyFlag = true;
      }

    //###
    //### 右キー、
    //###
    if( key.isDown( key.keyCode["KEY_RIGHT"] ) ){
      if( fran.charaMesh.position.x > MAX_SCENE_X ) return;
      fran.chara.position.x = fran.charaMesh.position.x += moveSpeed;

      moveKeyFlag = true;
      }

    //###
    //### ENTER キー
    //###
    if( key.isDown( key.keyCode["KEY_ENTER"] ) ){
      camera.position.y = 3000;// カメラの位置
      camera.position.z = 0;// カメラの位置
      camera.lookAt(CAMERA_FOCUS);

      moveKeyFlag = true;
      }
    break;

    //###
    //### gameover 時のコンテニュー選択
    //###
    case game.state["GAMEOVER"] :
      if( key.isDown( key.keyCode["KEY_UP"] ) ||
          key.isDown( key.keyCode["KEY_DOWN"] )){
        gameover.chageFocus();
        moveKeyFlag = true;
        }

      if( key.isDown( key.keyCode["KEY_ENTER"] )){
        switch( gameover.focus ){
          case gameover.state["AGAIN"] :
            game.playerState = game.state["PLAY"];
            fran.continueChara();
            game.continue++;
            break;

          case gameover.state["GIVEUP"] :
            game.initGame();
            break;
          }
        gameover.disableGameover();
        }      
      break;   
    }

  return moveKeyFlag;
  }



//==============================================//
// ### animate ###                              //
// 位置 update、レンダリング等の main loop      //
//==============================================//
var animate = function() {
        //###
        //### ***** GAME MAIN LOOP *****
        //###
        game.incrementGameFrame();

        //###
        //### bone Animation を update
        //###
	requestAnimationFrame(animate);
	THREE.AnimationHandler.update(ANIMATION_STEP);

        //###
        //### key action を実行
        //###
        //if(doKey() == false) controls.update();
        doKey();

        //###
        //### 背景画像の回転
        //###
        backGround.rotateBackGround();


        //###
        //### 最後に rendering
        //###
	composer.render();
}
</script>
  <div id="canvas"></div>
  <div id="gameStatus"></div>
<script>
init();
</script>
</body>
</html>
