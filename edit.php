

<!DOCTYPE html>
<head>
<meta charset="UTF-8">
<meta http-equiv="Pragma" content="no-cache" />
<meta http-equiv="cache-control" content="no-cache" />
<meta http-equiv="expires" content="0" />
<title>Three.js JSON Loader Demo</title>

<!--======================-->
<!--    css inclusion     -->    
<!--======================-->
<link rel="stylesheet" type="text/css" href="./css/header.css">
<link rel="stylesheet" type="text/css" href="./css/edit.css">

<!--======================-->
<!--  include jquery API  -->
<!--======================-->
<script src="./api/jquery-2.1.4.min.js"></script>

<!--======================-->
<!-- include THREE.js API -->
<!--======================-->
<script type="text/javascript" src="./api/three.min.js"></script>

<!--======================-->
<!-- include game API     -->
<!--======================-->
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

</head>
<body id="body">

<!--=======================================-->
<!--           header html の追加          -->
<!--=======================================-->
<div id="menu">
  <script type="text/javascript" >
    Include.include("header.html");
  </script>
</div>


<!--=======================================-->
<!--        補助線追加/削除のボタン        -->
<!--=======================================-->
<button id="enableGrid" class='button'> ENABLE GRID  </button>
<button id="disableGrid" class='button'> DISABLE GRID </button>


<!--=======================================-->
<!-- ゲームフレーム(GameControl.gameFrame) -->
<!--=======================================-->
<div id="controlFrame">
  <div id="frame" class="infoTable"> FRAME : 0</div>
  <button id="start"  class='button'> START FRAME </button>
  <button id="stop"  class='button'> STOP FRAME </button>
  <button id="increment"  class='button'> INCREMENT FRAME </button>
  <button id="check"  class='button'> RESTART </button>
</div>


<!--=======================================-->
<!--   edit 中のタイトル、ファイル情報     -->
<!--=======================================-->
<!--
<div id="targetTitle" class="infoTable">編集中のタイトル : </div>
<button id="saveMain"  class='button'> SAVE AS MAIN </button>
-->

<!--=======================================-->
<!--     enemy の情報を edit する領域      -->
<!--=======================================-->
<div id="edit">
  <div id="information" class="information">select target enemy or add new enemy for edit info</div>
  <div id="targetEnemy" class="infoTable"> TARGET ENEMY INDEX : null</div>

  <div id="enemyInfo"></div>

  <div id="addEnemyInfo" class="infoTable">
    <button id="addEnemyButton"  class='button'> ADD NEW ENEMY </button>
    <div id="addEnemy"></div>
    <div id="addEnemyCommit"></div>
    <div id="addEnemyCancel"></div>
  </div>

  <div id="editEnemyInfo" class="infoTable" style="visibility: hidden"></div>
  <div id="editEnemyInfoCommit"></div>
  <div id="editEnemyInfoCancel"></div>

  <div id="addAction" class="infoTable"> move/shot を追加する敵を選んでください</div>
  <div id="addActionCommit"></div>
  <div id="addActionCancel"></div>

  <div id="editInfoRegion">
    <div id="editInfo" class="infoTable" style="visibility: hidden"> edit する move/shot を選んでください</div>
    <div id="editInfoCommit"></div>
    <div id="editInfoCancel"></div>
  </div>
</div>


<script>
//###
//### 対象の JSON 設定ファイルの読み込み
//###
//var postedData = "<?php echo($_POST['datapath']); ?>";
var postedData = "./js/setting/temp.json";
var game = new GameControl(postedData);

var targetTitle = "<?php echo($_POST['title']); ?>";
$("#targetTitle").text("編集中のタイトル : " + targetTitle);


//###
//### THREE.js Basic Object の定義
//###
var scene, camera, controls, renderer;

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
//bgm.createSound("bgm", BGM1_URL);
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
  camera = new THREE.PerspectiveCamera(15, DEV_RENDER_WIDTH / DEV_RENDER_HEIGHT, 1, 10000);
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
  renderer.setSize(DEV_RENDER_WIDTH, DEV_RENDER_HEIGHT);// 描画領域の大きさ
  renderer.setFaceCulling(THREE.CullFaceBack);
  canvas.appendChild(renderer.domElement);

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
      }

    //###
    //### 下キー、
    //###
    if( key.isDown( key.keyCode["KEY_DOWN"] ) ){
      if( fran.charaMesh.position.z > MAX_SCENE_Z ) return;
      fran.charaMesh.position.z += moveSpeed;
      fran.chara.position.z = fran.charaMesh.position.z + OFFSET;
      }

    //###
    //### 左キー、
    //###
    if( key.isDown( key.keyCode["KEY_LEFT"] ) ){
      if( fran.charaMesh.position.x < -MAX_SCENE_X ) return;
      fran.chara.position.x = fran.charaMesh.position.x -= moveSpeed;
      }

    //###
    //### 右キー、
    //###
    if( key.isDown( key.keyCode["KEY_RIGHT"] ) ){
      if( fran.charaMesh.position.x > MAX_SCENE_X ) return;
      fran.chara.position.x = fran.charaMesh.position.x += moveSpeed;
      }
    break;

    //###
    //### gameover 時のコンテニュー選択
    //###
    case game.state["GAMEOVER"] :
      if( key.isDown( key.keyCode["KEY_UP"] ) ||
          key.isDown( key.keyCode["KEY_DOWN"] )) gameover.chageFocus();

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
  }



//==============================================//
// ### animate ###                              //
// 位置 update、レンダリング等の main loop      //
//==============================================//
var animate = function() {
        //###
        //### gameFrame の update
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
        doKey();

        //###
        //### 背景画像の回転
        //###
        backGround.rotateBackGround();

        //###
        //### 最後に rendering
        //###
	renderer.render(scene, camera);

        //###
        //### 現在のフレーム数を表示
        //###
        Edit.showGameFrame(game.gameFrame);
        Edit.showTargetEnemy();
}
</script>
</head>
<div id="canvas"></div>
<script type="text/javascript" src="./js/Grid.js"></script>
<script type="text/javascript" src="./js/Marker.js"></scripT>
<script type="text/javascript" src="./js/EditMesh.js"></scripT>
<script>
init();

var editMesh = new EditMesh();
editMesh.createEditMesh();

game.playerState = game.state["EDIT"];

//==========================================================//
// ### callback functions  ###                              //
// game frame 操作用のボタン call back 関数                 //
//==========================================================//
$(function(){
  $("#stop").click(function(){
    console.log(Edit.datapath);
    game.playerState = game.state["EDIT"];
    });
  });

$(function(){
  $("#start").click(function(){
    if(marker.markerMesh != null) marker.disableMarkerMesh();
    editMesh.controlArrowMesh(false);
    editMesh.controlVectorMesh(false);
    game.playerState = game.state["PLAY"];
    });
  });

$(function(){
  $("#increment").click(function(){
    if(marker.markerMesh != null) marker.disableMarkerMesh();
    game.playerState = game.state["STEP_FRAME"];
    game.gameFrame++;
    });
  });

$(function(){
  $("#check").click(function(){
    if(marker.markerMesh != null) marker.disableMarkerMesh();

    Focus.currentFocus = Focus.focus.NONE;
    editMesh.controlArrowMesh(false);
    editMesh.controlVectorMesh(false);

    Edit.clearEnemyInfo();
    Edit.clearAddEditInfo();
    $("#editEnemy").empty();
    $("#deleteEnemy").empty();
    $("#addAction").text("move/shot を追加する敵を選んでください");
    $("#editInfo").text("edit する move/shot を選んでください");
    game.playerState = game.state["RELOAD"];
    key.updatePreventDefaultFlag(true);
    game.changeGameData();
    });
  });

$(function(){
  $("#addEnemyButton").click(function(){
    Edit.addPramInput(undefined, "addE", $("#addEnemy")); 
    editMesh.controlArrowMesh(true);
    Focus.changeFocus(Focus.focus["ADD_ENEMY"]);
    });
  });

$(function(){
  $("#enableGrid").click(function(){
    if(grid.gridMesh.length == 0) grid.createGrid();
    grid.enableGrid();
    });
  });

$(function(){
  $("#disableGrid").click(function(){
    grid.disableGrid();
    });
  });

$(function(){
  $("#saveMain").click(function(){
    game.playerState = game.state["RELOAD"];
    key.updatePreventDefaultFlag(true);
    Edit.outputGameDataToFile([game.changeGameData, game.initGame]);
    grid.disableGrid();
    });
  });

$(function(){
  $("#body").click(function(){
    Focus.checkCurrentFocus();
    });
  });

$(function(){
  $("#enemyInfo").children("table").click(function(){   
      Focus.currentFocus = Focus.focus.SELECT_ENEMY;
      Focus.checkCurrentFocus();
    });
  });

$(function(){
  $("#addEnemyInfo").click(function(){
      if($("#addEnemy").children().length == 0) return;

      Focus.currentFocus = Focus.focus.ADD_ENEMY;
      Focus.checkCurrentFocus();
    });
  });

$(function(){
  $("#addAction").click(function(){
      Focus.currentFocus = Focus.focus.ADD_SHOT;
      Focus.checkCurrentFocus();
    });
  });

$(function(){
  $("#editInfo").click(function(){
      Focus.currentFocus = Focus.focus.EDIT_SHOT;
      Focus.checkCurrentFocus();
    });
  });

$(function(){
  $("#editEnemyInfo").click(function(){
      Focus.currentFocus = Focus.focus.EDIT_ENEMY;
      Focus.checkCurrentFocus();
    });
  });


//==========================================================//
// ### Edit ###                                             //
// enemy Move, Shot 操作用 jquery rapper 静的クラス         //
//==========================================================//
window.Edit = {

  targetID      : null,
  targetPos     : null,
  shotID        : null,
  moveID        : null,
  shotCount     : 0,
  moveCount     : 0,
  gameData      : game.getGameData(),
  datapath      : postedData,

  //==========================================================//
  // ### showGameFrame ###                                    //
  // GmaeControl クラスの gameFrame を出力する関数            //
  //==========================================================//
  showGameFrame : function(gameFrame){
                    $("#frame").text("FRAME : " + gameFrame);
                    },

  //==========================================================//
  // ### showTargetEnemy ###                                  //
  // GmaeControl クラスの gameFrame を出力する関数            //
  //==========================================================//
  showTargetEnemy : function(){
                    $("#targetEnemy").text(" TARGET ENEMY INDEX : " + Edit.targetID);
                    },

  //==========================================================//
  // ### addEditButton ###                                    //
  // Scene 上の敵をクリックした際に edit move/shot button を  //
  // add する関数                                             //
  //==========================================================//
  addEditButton : function(parentNode, 
                           buttonName, 
                           id,
                           targetJSON){
                    var button = $("<button  class='button'>" + buttonName + "</button>");
                    button.attr("id", id);
                    button.width(110);

                    //###
                    //### button が押されたときの callback を bind
                    //###
                    button.bind("click", {id : id}, function(event){
                      var currentMode = this.id.substr(0,4);
    
                      if(currentMode == "move"){
                        $("#editInfoRegion").css("top", $("#" + this.id).offset().top);
                        Focus.changeFocus(Focus.focus["EDIT_MOVE"]);
                        Edit.initInfo($("#editInfo"));
                        $("#editInfo").find("input").remove();
                        $("#editInfo").find("span").remove();
                        $("#editInfo").css("visibility", "visible");
                        Edit.addToggleButton(MOVE_TEMPLATE, 
                                             $("#editInfo"), 
                                             targetJSON.type, 
                                             event.data.id);
                        Edit.addPramInput(targetJSON, 
                                          currentMode, 
                                          undefined, 
                                          undefined, 
                                          event.data.id);
                        }
                      else if(currentMode == "addM"){
                        Focus.changeFocus(Focus.focus["ADD_MOVE"]);
                        Edit.initInfo($("#addAction"));
                        $("#addAction").find("input").remove();
                        $("#addAction").find("span").remove();
                        Edit.addToggleButton(MOVE_TEMPLATE, $("#addAction"));
                        Edit.addPramInput(targetJSON, currentMode, $("#addAction"));
                        }
                      else if(currentMode == "shot"){
                        $("#editInfoRegion").css("top", $("#" + this.id).offset().top);
                        Focus.changeFocus(Focus.focus["EDIT_SHOT"]);
                        Edit.initInfo($("#editInfo"));
                        $("#editInfo").find("input").remove();
                        $("#editInfo").find("span").remove();
                        $("#editInfo").css("visibility", "visible");
                        Edit.addToggleButton(SHOT_TEMPLATE, 
                                             $("#editInfo"), 
                                             targetJSON.type,
                                             event.data.id);
                        Edit.addPramInput(targetJSON, 
                                          currentMode, 
                                          undefined, 
                                          undefined,
                                          event.data.id);
                        }
                      else if(currentMode == "addS"){
                        Focus.changeFocus(Focus.focus["ADD_SHOT"]);
                        Edit.initInfo($("#addAction"));
                        $("#addAction").find("input").remove();
                        $("#addAction").find("span").remove();
                        Edit.addToggleButton(SHOT_TEMPLATE, $("#addAction"));
                        Edit.addPramInput(targetJSON, currentMode, $("#addAction"));
                        }
                      });
                    parentNode.append(button);
                    },

  //==========================================================//
  // ### addDeleteButton ###                                  //
  // 対象の action を削除する Button を追加                   //
  //==========================================================//
  addDeleteButton : function(parentNode,
                             buttonName,
                             id,
                             targetJSON){
                      var button = $("<button  class='button'>" + buttonName + "</button>");
                      button.attr("id", id);
                      button.width(110);

                      //###
                      //### button が押されたときの callback を bind
                      //###
                      button.bind("click", {id : id}, function(event){

                        //###
                        //### 確認コンソールの表示
                        //###
                        var currentMode = this.id.substr(0,4);
                        if(window.confirm("really delete this " + currentMode + " ? ") == false) return;

                        var targetActID = Number(this.id.substr(4,5)) - 1;

                        if(currentMode == "move" || currentMode == "shot"){
                          //###
                          //### 対象の配列を削除
                          //###
                          if(gameData[Edit.targetID][0][currentMode].length > 1){
                            delete gameData[Edit.targetID][0][currentMode].splice(targetActID, 1);
                            }
                          //###
                          //### 配列が空、もしくは null の場合は php json_encode で削除されてしまうため "empty" を追加
                          //###
                          else gameData[Edit.targetID][0][currentMode][0] = "empty";

                          //###
                          //### temp.json に出力
                          //###
                          Edit.outputGameDataToFile();
                          $("#" + currentMode + this.id.substr(4,5)).nextAll().remove();
                          $("#" + currentMode + this.id.substr(4,5)).prevAll().remove();
                          $("#" + currentMode + this.id.substr(4,5)).remove(); 
                          }
                        });
                      parentNode.append(button);
                      },

  //==========================================================//
  // ### initInfo ###                                         //
  // #addAction の領域の子ノードを削除し初期化する関数        //
  //==========================================================//
  initInfo   : function(targetNode){
                      if(targetNode.find("input").length != 0){
                        targetNode.find("div").remove();
                        targetNode.find("br").remove();
                        }
                      },

  //=================================================================//
  // ### addToggleButton ###                                         //
  // editInfo, addAction で shot の種類用の radio を作成する関数     //
  //=================================================================//
  addToggleButton : function(action_template, targetNode, defaultChecked, id){
                      //###
                      //### target が定義されていない場合は editInfo に append
                      //###
                      if(typeof targetNode === "undefined") targetNode = $("#editInfo");


                      //###
                      //### デフォルトでチェックを入れる radio を決定
                      //###
                      console.log(defaultChecked);
                      if(defaultChecked == null || defaultChecked == "" || defaultChecked == "null") checked = 0;
                      else if(defaultChecked == "tracking") checked = 1;
                      else if(defaultChecked == "spiral") checked = 2;
                      else if(defaultChecked == "random") checked = 3;
                      else if(defaultChecked == "sign") checked = 4;

                      targetNode.append("<br>");

                      //###
                      //### radio name 用の変数の計算
                      //###
                      if(action_template == "addActionnormal"){
                        name = targetNode.attr('id') + "MOVE";
                        }
                      else name = targetNode.attr('id') + "SHOT";
   

                      //###
                      //### action_template(MOVE_TEMPLATE or SHOT_TEMPLATE in Const.js) に radio の要素を定義
                      //### action_template 記載の要素を radio として全て追加
                      //###
                      for(var i = 0; i < action_template.length; i++){
                        //###
                        //### デフォルトの check 項目かをチェック
                        //###
                        if(i == checked) check = "checked";
                        else check = "";

                        //###
                        //### toggle の追加
                        //###
                        var toggle = "<input class='" + name + "' type='radio' name='" + name + 
                                         "' value='" + action_template[i] + "' " + check + ">" +
                                         "<span class='label'>" + action_template[i] + "</span></input>";

                        //###
                        //### 最後の dammy 要素以外を append
                        //###
                        if(i != action_template.length - 1)targetNode.append(toggle);
                        }


                      //###
                      //### radio 変更時の callback を bind
                      //###
                      if(name == "editInfoSHOT"){
                        $('[name=' + name + ']').bind("click",{id : id}, function(event){

                          //###
                          //### editInfo 上の radio が押された場合
                          //###
                          currentMode = "shot";
                          Edit.initInfo($("#editInfo"));
                          targetNode.children().eq(0).before("<br>");
                          targetJSON = undefined;
                          Edit.addPramInput(targetJSON,
                                            currentMode,
                                            $("#editInfo"),
                                            $('[name=editInfoSHOT]:checked').val(),
                                            event.data.id);
                          });
                        }

                      if(name == "addActionSHOT"){

                        $('[name=' + name + ']').bind("click", function(){
                          //###
                          //### addAction 上の radio が押された場合
                          //###
                          currentMode = "addS";
                          Edit.initInfo($("#addAction"));
                          $("#addS").after("<br>");
                          targetJSON = undefined;
                          Edit.addPramInput(targetJSON,
                                            currentMode,
                                            $("#addAction"),
                                            $('[name=addActionSHOT]:checked').val());
                          });
                        }
                      targetNode.append("<br>");
                      },

  //==========================================================//
  // ### addCommitButton ###                                  //
  // shot/move の各項目の input を add する関数               //
  //==========================================================//
  addCommitButton : function(targetJSON, targetNode, currentMode, id){
                      //###
                      //### commitButton の初期化
                      //###
                      $("#" + targetNode.attr("id") + "Commit").empty();

                      //###
                      //### button push 時に対象 enemy の対象 Action を update/add
                      //###
                      var button = $("<button class='button'> COMMIT </button>");
                      button.width(70);
                      button.bind("click",
                                  {targetJSON  : targetJSON, 
                                   targetNode  : targetNode,
                                   currentMode : currentMode,
                                   id          : id}, 
                                   function(event){
                        //###
                        //### editInfo 領域の commit button の場合は対象を update
                        //###
                        if(event.data.currentMode == "shot" || 
                           event.data.currentMode == "move"){
                          var targetJSON = Edit.getInputData(event.data.targetJSON, event.data.targetNode);
                          Edit.updateAction(targetJSON,
                                            event.data.currentMode,
                                            event.data.id);
                          $("#editInfo").css("visibility", "hidden");
                          editMesh.controlVectorMesh(false);
                          }

                        //###
                        //### editEnemyInfo 領域の commit button の場合は対象を update
                        //###
                        else if(event.data.currentMode == "editE"){
                          var targetJSON = Edit.getInputData(event.data.targetJSON, 
                                                             event.data.targetNode);
                          Edit.updateEnemy(targetJSON);
                          $("#editEnemyInfo").css("visibility", "hidden");
                          }

                        //###
                        //### addAction 領域の commit button の場合には対象の最後に add
                        //###
                        else if(event.data.currentMode == "addS" || 
                                event.data.currentMode == "addM" ||
                                event.data.currentMode == "addE"){
                          if(event.data.currentMode == "addS") var current = "shot";
                          if(event.data.currentMode == "addM") var current = "move";
                          if(event.data.currentMode == "addE") var current = "enemy";

                          //###
                          //### JSON に新規 enemy を追加
                          //###
                          var targetJSON = Edit.getInputData(event.data.targetJSON, 
                                                             event.data.targetNode);
                          console.log(event.data.targetJSON);
                          Edit.addAction(targetJSON, current);
                          }
                          Edit.clearAddEditInfo();
                          Edit.showEnemyInfo(Edit.targetID, true);
                        });

                      $("#" + targetNode.attr("id") + "Commit").append(button);
                      },

  //==========================================================//
  // ### getInputData ###                                     //
  // input されたデータを受け取る関数                         //
  //==========================================================//
  getInputData    : function(targetJSON, targetNode){

                      //###
                      //### targetNode 上の input 領域の値を取得し保存
                      //###
                      var inputData = new Array();
                      for(var i = 0; i < targetNode.children("div").length; i++){
                        var target = targetNode.children("div").eq(i).children("input").eq(0).val();
                        if(typeof target === "undefined"){
                          target = targetNode.children("div").eq(i).children("span").eq(0).text();
                          }
                        else target = Number(target);

                        inputData.push(target);
                        }

                      //###
                      //### targetJSON を update して返す
                      //### 今のところ nest の深さは2なので再帰的に実行しない
                      //### 再帰で非同期の場合 return の仕方がわからない
                      //###
                      var count = 0;
                      var enableFrame = 0;
                      for(var key in targetJSON){
                        if(Array.isArray(targetJSON[key]) == false){
                          if(key == "enableFrame") enableFrame = inputData[count];
                          targetJSON[key] = inputData[count];
                          count++;
                          }
                        else{
                          for(var key2 in targetJSON[key][0]){
                            if(Array.isArray(targetJSON[key][0][key2]) == false){

                              //###
                              //### move/shot の開始カウントの最低値は敵出現 frame + 50 frame とする
                              //###
                              if(key2 == "frame" && inputData[count] < enableFrame + 50){
                                targetJSON[key][0][key2] = enableFrame + 50;
                                }
                              else targetJSON[key][0][key2] = inputData[count];
                              count++;
                              }
                            else{
                              for(var key3 in targetJSON[key][0][key2][0]){
                                targetJSON[key][0][key2][0][key3] = inputData[count];
                                count++;
                                }
                              }
                            }
                          }
                        }

                      return targetJSON;
                      },

  //==========================================================//
  // ### updateAction ###                                     //
  // shot/move を replace する関数                            //
  //==========================================================//
  updateAction   : function(updateJSON, currentMode, targetActID){
                     targetActID = Number(targetActID.substr(4)) - 1;
                     for(var key in gameData){
                       if(key == Edit.targetID){
                         for(var j = 0; j < gameData[key][0][currentMode].length; j++){
                           if(j == targetActID){
                             gameData[key][0][currentMode][j] = updateJSON;
                             this.outputGameDataToFile();                 
                             }
                           }
                         }
                       }                      
                     },

  //==========================================================//
  // ### updateEnemy ###                                      //
  // enemy 基本情報を update する関数                         //
  //==========================================================//
  updateEnemy   : function(updateJSON){
                     for(var key in gameData){
                       if(key == Edit.targetID){
                         gameData[key][0] = updateJSON;
                         this.outputGameDataToFile();                 
                         }
                       }
                     },

  //==========================================================//
  // ### addAction ###                                        //
  // shot/move を gamedata に add する関数                    //
  //==========================================================//
  addAction       : function(addJSON, currentMode){
                      if(typeof gameData === "undefined") gameData = game.getGameData();

                      if(currentMode == "enemy"){
                        var targetIndex = String(Object.keys(gameData).length + 1);
                        gameData[targetIndex] = [addJSON];
                        gameData = this.sortJSON(gameData);
                        this.outputGameDataToFile();
                        Edit.targetID = this.getTargetIDFromFrame(addJSON["enableFrame"]);
                        }
                      else{
                        for(var key in gameData){
                          if(key == Edit.targetID){
                            if(gameData[key][0][currentMode][0] == "empty") gameData[key][0][currentMode].splice(0, 1);
                            gameData[key][0][currentMode].push(addJSON);
                            this.outputGameDataToFile();
                            break;
                            }
                          }
                        }
                      },

  //==========================================================//
  // ### getTargetIDFromFrame ###                             //
  // enableFrame から現在 focus の ID を特定                  //
  //==========================================================//
  getTargetIDFromFrame : function(targetFrame){
                           var id = 1;
                           for(var key in gameData){
                             if(gameData[key][0]["enableFrame"] >= targetFrame){
                               return id;
                               }
                             else id++;
                             }
                           },

  //==========================================================//
  // ### sortJSON ###                                         //
  // enableFrame で降順に並ぶようにする                       //
  //==========================================================//
  sortJSON          : function(targetJSON){

                        //###
                        //### sort のため一時的に配列に保存
                        //###
                        var temp = new Array();
                        for(var key in targetJSON){
                          temp.push(targetJSON[key]); 
                          }

                        //###
                        //### sort
                        //###
                        temp.sort(function(a, b) {
                          return (a[0].enableFrame < b[0].enableFrame) ? -1 : 1;
                          });

                        //###
                        //### JSON 形式に戻す
                        //###
                        var sortedJSON = {};
                        for(var i = 0; i < temp.length; i++){
                          var key = i + 1;
                          sortedJSON[key] = temp[i];
                          }


                        return sortedJSON;
                        },

  //==========================================================//
  // ### outputGameDataToFile ##                              //
  // gameData をローカルに出力する関数                        //
  //==========================================================//
  outputGameDataToFile : function(callBackFuncArray, saveMain){
                           if(typeof saveMain === "undefined") saveMain = false;

                           //###
                           //### main として save するかのフラグとともに送信
                           //###
                           var postData = {"gameData" : gameData, "saveMain" : saveMain, "datapath" : Edit.datapath};
                           console.log("called outputGameDataToFile");
                           console.log(saveMain);

                           $.post("./php/createJSON.php", 
                                  postData, 
                                  (function(callBackFuncArray, data){
                             console.log(data);
                             if(typeof callBackFuncArray !== undefined){
                               for(var i = 0; i < callBackFuncArray.length; i++) {
                                 callBackFuncArray[i];
                                 } 
                               }
                             }).bind(callBackFuncArray));
                           },

  //==========================================================//
  // ### addCancelButton ###                                  //
  // shot/move の各項目の input を add する関数               //
  //==========================================================//
  addCancelButton : function(targetNode){
                      //###
                      //### 既に cancel button が配置されている場合は終了
                      //###
                      if($("#" + targetNode.attr("id") + "Cancel").children().length != 0) return;

                      var button = $("<button  class='button'> CANCEL </button>");
                      button.width(70);
                      button.bind("click", function(event){
                        Edit.initInfo(targetNode);
                        targetNode.find("input").remove();
                        targetNode.find("span").remove();
                        $("#" + targetNode.attr("id") + "Commit").empty();
                        $("#" + targetNode.attr("id") + "Cancel").empty();

                        if(targetNode.attr("id") == "addEnemy"){
                          Message.updateMessage(Message.initMessage);
                          if(Focus.currentFocus == Focus.focus.ADD_ENEMY) Focus.currentFocus = Focus.focus.NONE;
                          editMesh.controlArrowMesh(false);
                          }
                        else if(targetNode.attr("id") == "editEnemyInfo"){
                          if(Focus.currentFocus == Focus.focus.EDIT_ENEMY) Focus.currentFocus = Focus.focus.NONE;
                          editMesh.controlArrowMesh(false);
                          $("#editEnemyInfo").css("visibility", "hidden");
                          }
                        else if(targetNode.attr("id") == "editInfo"){
                          $("#editInfo").css("visibility", "hidden");
                          editMesh.controlVectorMesh(false);
                          }
                        });

                      $("#" + targetNode.attr("id") + "Cancel").append(button);
                      },


  //==========================================================//
  // ### addPramInput ###                                     //
  // shot/move の各項目の input を add する関数               //
  //==========================================================//
  addPramInput    : function(targetJSON, mode, targetNode, shotMode, id){
                      //###
                      //### addPramInput が nest された JSON を探索中かのフラグ
                      //###
                      this.nested = this.nested == true ? true : false;

                      //###
                      //### デフォルトは editInfo に add 
                      //###
                      if(typeof targetNode === "undefined") targetNode = $("#editInfo");

                      //###
                      //### JSON が渡されていない場合には template.json から取得
                      //###
                      if(typeof targetJSON === "undefined"){
                        //###
                        //### template から取得する shot の種類を決定
                        //###
                        if(typeof shotMode === "undefined" || shotMode == "normal") targetShot = 0;
                        else if(shotMode == "tracking") targetShot = 1;
                        else if(shotMode == "spiral") targetShot = 2;
                        else if(shotMode == "random") targetShot = 3;
                        else if(shotMode == "sign") targetShot = 4;

                        //###
                        //### targetJSON がない場合はtemplate のロード
                        //###
                        $.getJSON("./js/setting/template", function(data){
                          if(mode == "addE"){
                            Message.updateMessage(Message.addEMessage);
                            Edit.addPramInput(data["enemy"][0],
                                              mode,
                                              targetNode,
                                              undefined,
                                              id);
                            }
                          if(mode == "move" || mode == "addM"){
                            Edit.addPramInput(data["move"][0],
                                              mode, 
                                              targetNode,
                                              undefined,
                                              id);
                            }
                          if(mode == "shot" || mode == "addS"){
                            Edit.addPramInput(data["shot"][targetShot], 
                                              mode,
                                              targetNode,
                                              undefined,
                                              id);
                            }
                          });
                        return;
                        }

                      //###
                      //### 一回だけ commit/cancel button の追加
                      //###
                      if(this.nested == false){
                        this.addCommitButton(targetJSON, 
                                             targetNode, 
                                             mode,
                                             id);
                        console.log(targetJSON);
                        this.addCancelButton(targetNode);
                        }

                      //###
                      //### targetJSON が定義されている場合は、それをもとにinput 要素を追加
                      //###
                      for(var key in targetJSON){
                        if(Array.isArray(targetJSON[key]) == false){
                          this.nested = false;

                          //###
                          //### editEnemy/addEnemy の場合はデフォルトの move ,shot の input 要素を見せない
                          //###
                          if((mode == "addE" || mode == "editE") && targetNode.children("div").length > 6){
                            var type = "hidden";
                            var param = "";
                            if(mode == "addE") var typeValue = "";
                            else var typeValue = targetJSON[key];
                            }
                          else if((mode == "addE" || mode == "editE") && 
                                  (key == "enemyID" || key == "enemyName")){
                            var type = "hidden";
                            var param = "";
                            if(mode == "addE") var typeValue = "";
                            else var typeValue = targetJSON[key];
                            }
                          else{
                            var type = "number";
                            var param = key;
                            var typeValue = targetJSON[key];
                            }

                          //###
                          //### move, shot の type の場合は input 要素ではなく表示するだけ
                          //### type の設定は radio button で
                          //###
                          if(key == "type"){
                            if(mode == "editE"){
                              var visible = "style='visibility:hidden'";
                              }
                            else visible = "";
                            var input = "<div " + visible + ">" + param + 
                                        "<span class ='inputRegion'>" + 
                                        typeValue + "</span></div>"; 
                            }
                          else{
                            //###
                            //### デフォルトの Action 開始フレームは敵出現フレームより後に設定
                            //###
                            if(mode == "addS"  && key == "frame"){
                              var targetValue = gameData[Edit.targetID][0]["enableFrame"] + 10;
                              }
                            else if(mode == "addE"  && key == "enableFrame"){
                              var targetValue = game.gameFrame + 10;
                              }
                            //###
                            //### template から取得したケースでは frame が 0 なので敵出現後に設定
                            //###
                            else if(key == "frame" && targetJSON[key] == 0){
                              var targetValue = gameData[Edit.targetID][0]["enableFrame"] + 10;
                              }
                            else var targetValue = targetJSON[key];

                            var input = "<div>" + param + 
                                        "<input class ='inputRegion' type='" + type + "' value='" + 
                                        targetValue + "'></input></div>";
                            }
                          targetNode.append(input); 
                          }
                        else{
                          this.nested = true;
                          this.addPramInput(targetJSON[key][0], 
                                            mode, 
                                            targetNode, 
                                            undefined, 
                                            id);
                          }
                        }
                      },

  //==========================================================//
  // ### showEnemyInfo ###                                    //
  // Scene 上の enemy をクリックした際に対応する move/shot    // 
  // 情報を出力する関数                                       //
  //==========================================================//
  showEnemyInfo : function(enemyIndex, ifAdd){
                    if(ifAdd != true) gameData = game.getGameData();

                    for(var key in gameData){
                      if(key != enemyIndex) continue;

                      this.showJSONTable(gameData[key][0]);
                      break;
                      }
                    },

  //==========================================================//
  // ### editEnemy ###                                        //
  // enemy の基本情報を編集                                   //
  //==========================================================//
  editEnemy   : function(){
                  Focus.changeFocus(Focus.focus["EDIT_ENEMY"]);
                  editMesh.controlArrowMesh(true);
                  Edit.initInfo($("#editEnemyInfo"));
                  $("#editEnemyInfo").find("input").remove();
                  $("#editEnemyInfo").find("span").remove();


                  $("#editEnemyInfo").css("visibility", "visible");
                  Edit.addPramInput(gameData[Edit.targetID][0], 
                                    "editE", 
                                    $("#editEnemyInfo"), 
                                    undefined, 
                                    $("#editEnemyInfo").attr("id"));
                  },

  //==========================================================//
  // ### deleteEnemy ###                                      //
  // Scene 上の enemy をクリックした際に対応する move/shot    //
  // 情報を出力する関数                                       //
  //==========================================================//
  deleteEnemy  : function(){
                   if(window.confirm("really delete this enemy ? ") == false) return;

                   delete gameData[Edit.targetID]; 
                   console.log(JSON.stringify(gameData, null, JSON_INDENT));
                   Edit.outputGameDataToFile();
                   Edit.clearAddEditInfo("addAction");
                   Edit.clearAddEditInfo("editInfo");
                   },

  //==========================================================//
  // ### clearEnemyInfo ###                                   //
  // JSON データを再帰的に表示する関数                        //
  //==========================================================//
  clearEnemyInfo  : function(){
                      if($(".infoTable").length != 0 &&
                        typeof tr === "undefined"){
                        $("#enemyInfo").empty();
                        this.shotCount = 0;
                        this.moveCount = 0;
                        }
                      $("#deleteEnemy").remove();
                      $("#editEnemy").remove();
                      Edit.targetID = null;
                      Edit.targetPos = null;
                      },

  //==========================================================//
  // ### clearAddEditInfo ###                                 //
  // JSON データを再帰的に表示する関数                        //
  //==========================================================//
  clearAddEditInfo : function(target){
                       if(typeof target === "undefined"){
                         $("#addAction").empty();
                         $("#addActionCommit").empty();
                         $("#addActionCancel").empty();
                         $("#editInfo").empty();
                         $("#editInfoCommit").empty();
                         $("#editInfoCancel").empty();
                         $("#addEnemy").empty();
                         $("#addEnemyCommit").empty();
                         $("#addEnemyCancel").empty();
                         $("#editEnemyInfo").empty();
                         $("#editEnemyInfoCommit").empty();
                         $("#editEnemyInfoCancel").empty();
                         }
                       else{
                         $("#" + target).empty();
                         $("#" + target + "Commit").empty();
                         $("#" + target + "Cancel").empty();
                         }
                       },

  //==========================================================//
  // ### showJSONTable ###                                    //
  // JSON データを再帰的に表示する関数                        //
  //==========================================================//
  showJSONTable  : function(JSON, tr, tableWidth){

                     //###
                     //### 既に情報が表示されている場合はリセット
                     //###
                     if($(".infoTable").length != 0 &&
                        typeof tr === "undefined"){
                          $("#enemyInfo").empty();
                          this.shotCount = 0;
                          this.moveCount = 0;
                          }


                     //###
                     //### enemy の delete button の追加
                     //###
                     var table = $("<table>");
                     table.addClass("infoTable");
                     if(typeof tableWidth !== "undefined") table.width(tableWidth);
                     
                     if(typeof tr === "undefined"){
                       $("#enemyInfo").append(table);
                       }
                     //###
                     //### move/shot の edit/delete button の追加
                     //###
                     else{
                       tr.append(table);
                       if(tr.children("td").text() == "shot"){
                         if(this.shotCount == 0 ){
                           this.addEditButton($("#addAction"), 
                                              "ADD SHOT", 
                                              "addS");
                           }
                         this.shotCount++;
                         this.addEditButton(table, 
                                            "EDIT SHOT", 
                                            "shot" + this.shotCount,
                                            JSON);
                         this.addDeleteButton(table,
                                              "DELETE SHOT",
                                              "shot" + this.shotCount,
                                              JSON);
                         }
                       if(tr.children("td").text() == "move"){
                         if(this.moveCount == 0 ){
                           this.addEditButton($("#addAction"),
                                                "ADD MOVE", 
                                                "addM");
                           }
                         this.moveCount++;
                         this.addEditButton(table, 
                                            "EDIT MOVE", 
                                            "move" + this.moveCount,
                                            JSON);
                         this.addDeleteButton(table,
                                              "DELETE MOVE",
                                              "move" + this.moveCount,
                                              JSON);
                         }
                       }                     


                     //###
                     //### JSON データの出力
                     //###
                     for(var key in JSON){

                       //###
                       //### shot/move が empty であれば以降の処理はスキップし次の key へ
                       //###
                       if((key == "shot" || key == "move" ) && JSON[key][0] == "empty") continue;
                         

                       //###
                       //### key 内の要素を再帰的に出力
                       //###
                       var tr = $("<tr ='tr'>");
                       tr.width(200);
                       table.append(tr);

                       var td = $("<td>");
                       td.text(key);
                       tr.append(td);

                       //###
                       //### key に対応する値が配列でない場合には通常の表出力
                       //###
                       if(Array.isArray(JSON[key]) == false){
                         var td2 = $("<td>");
                         td2.text(JSON[key]);
                         tr.append(td2);
                         }
                       //###
                       //### 配列が nest されている場合にはこの関数を再帰的に実行
                       //###
                       else{
                         for(var i = 0; i < JSON[key].length; i++){
                           tr.append($("<br>"));
                           if(key == "initPos" || key == "dest") tableWidth = 80;
                           if(key == "shot" || key == "move") tableWidth = 190;
                           this.showJSONTable(JSON[key][i], tr, tableWidth);
                           }
                         }
                       }
                     }
  };

//==========================================================//
// ### Scene 上のクリック検知関数, click callback 関数 ###  //
// ブラウザ上の information message 関連の静的クラス        //
//==========================================================//
window.Message = {
    initMessage    : "対象の enemy を選択するか、新しい enemy を追加してください",
    addEMessage    : "ゲーム画面から出現箇所を選択とパラメータの設定をしてください",
    updateMessage  : function(message){
        $("#information").text(message);
        }
    };

//==========================================================//
// ブラウザ上の focus 関連の静的クラス                      //
//==========================================================//
window.Focus = {
    focus : {
            NONE         : 1,
            SELECT_ENEMY : 2,
            ADD_ENEMY    : 3,
            EDIT_ENEMY   : 4,
            ADD_SHOT     : 5,
            EDIT_SHOT    : 6,
            ADD_MOVE     : 7,
            EDIT_MOVE    : 8
            },
    focusIdArray   : [
                     "#editInfo",
                     "#addAction",
                     "#enemyInfo",
                     "#addEnemyInfo",
                     "#editEnemyInfo"
                     ],
    currentFocus : 1,

    changeFocus  : function(targetFocus){
        Focus.currentFocus = targetFocus;
        console.log("current focus : " + Focus.currentFocus);
        },

    checkCurrentFocus : function(){
        Focus.initProperty();
        if(Focus.currentFocus == Focus.focus.ADD_ENEMY || 
           Focus.currentFocus == Focus.focus.EDIT_ENEMY){
             editMesh.controlArrowMesh(true);
             if(typeof editMesh.selectedArrowMeshIndex === "undefined") editMesh.controlVectorMesh(false);
             }
        else editMesh.controlArrowMesh(false);

        switch(Focus.currentFocus){
            case Focus.focus.NONE: 
                break;

            case Focus.focus.SELECT_ENEMY: 
                $("#enemyInfo").children("table").css({"background" : "#aaaaff"});
                break;

            case Focus.focus.ADD_ENEMY: 
                $("#addEnemyInfo").css({"background" : "#aaaaff"});
                break;

            case Focus.focus.EDIT_ENEMY: 
                $("#editEnemyInfo").css({"background" : "#aaaaff"});
                break;

            case Focus.focus.ADD_SHOT: 
                $("#addAction").css({"background" : "#aaaaff"});
                break;

            case Focus.focus.EDIT_SHOT: 
                $("#editInfo").css({"background" : "#aaaaff"});
                break; 

            case Focus.focus.ADD_MOVE: 
                $("#addAction").css({"background" : "#aaaaff"});
                break; 

            case Focus.focus.EDIT_MOVE: 
                $("#editInfo").css({"background" : "#aaaaff"});
                break; 

            default:
                console.log("current focus is none");
                break;
            }
        },


    initProperty  : function(){
        var init = "-webkit-gradient(linear, left top, left bottom, color-stop(0.00, #ddddff), color-stop(1.00, #ccccff))";
        
        $("#editInfo").css({"background" : init});
        $("#addAction").css({"background" : init});
        $("#enemyInfo").children("table").css({"background" : init});
        $("#addEnemyInfo").css({"background" : init});
        $("#editEnemyInfo").css({"background" : init});
        }
    };


//==========================================================//
// ### Scene 上のクリック検知関数, click callback 関数 ###  //
// ブラウザ上の座標を 3D 上に変換し敵をクリックしたか判定   //
//==========================================================//
window.onmousedown = function(ev){

  //###
  //### クリックされたのがゲーム画面でなければ、PreventDefaultFlag を false にてして終了
  //###
  if(ev.target != renderer.domElement){
    key.updatePreventDefaultFlag(false);
    return;
    }
  else key.updatePreventDefaultFlag(true);
  if(game.playerState != game.state.EDIT) return;


  var rect = ev.target.getBoundingClientRect();
  mouseX = ev.clientX - rect.left;
  mouseY = ev.clientY - rect.top;

  mouseX = (mouseX/DEV_RENDER_WIDTH)*2 - 1;
  mouseY = -(mouseY/DEV_RENDER_HEIGHT)*2 + 1;

  var mouseVector = new THREE.Vector3(mouseX, mouseY, 1);
  mouseVector.unproject(camera);

  
  var ray = new THREE.Raycaster(camera.position, 
                                mouseVector.sub(camera.position).normalize());

  //###
  //### enemy 判定対象の分ループ
  //###
  for(var i = 0; i < game.enemyArray.length; i++){
    if(game.enemyArray[i].chara == null) continue;
    var target = game.enemyArray[i].chara;
    var obj = ray.intersectObjects( [ target ] );

    if(obj.length > 0){
      Edit.clearAddEditInfo("addAction");
      Edit.clearAddEditInfo("editInfo");

      //###
      //### 選択中の enemy を○で囲う
      //###
      marker.enableMarkerMesh(game.enemyArray[i].chara.position);

      //###
      //### 選択した enemy の情報を表示
      //###
      Edit.targetID = game.enemyArray[i].enemyID;
      Edit.targetPos = game.enemyArray[i].chara.position;
      Edit.showEnemyInfo(Edit.targetID);

      //###
      //### edit/delete button を追加
      //###
      var button = $("<button id='deleteEnemy' class='button'>DELETE</button>");
      button.bind("click", Edit.deleteEnemy);
      $("#edit").append(button);

      var button = $("<button id='editEnemy' class='button'>EDIT</button>");
      button.bind("click", Edit.editEnemy);
      $("#edit").append(button);

      Focus.changeFocus(Focus.focus["SELECT_ENEMY"]);

      return;
      }
    }

  //###
  //### shot の normal, sign, move の normal の dest の座標取得処理
  //###
  if(Focus.currentFocus == Focus.focus.EDIT_SHOT || 
     Focus.currentFocus == Focus.focus.EDIT_MOVE){
    var checkObj = ray.intersectObjects( [ editMesh.checkMesh ] );
    if(checkObj.length > 0){

      //###
      //### 指定した方向に矢印を描画する処理
      //###
      var arrowPos = new THREE.Vector3(gameData[Edit.targetID][0]["initPos"][0]["x"],
                                       gameData[Edit.targetID][0]["initPos"][0]["y"],
                                       gameData[Edit.targetID][0]["initPos"][0]["z"]);
      var destPos = new THREE.Vector3(Math.floor(checkObj[0].point.x),
                                      0,
                                      Math.floor(checkObj[0].point.z));
      editMesh.controlVectorMesh(true, arrowPos, destPos);

      //###
      //### 対応する input タグに座標を挿入する処理
      //###
      switch(Focus.currentFocus){
        case Focus.focus.EDIT_SHOT: 
          if($('[name=editInfoSHOT]:checked').val() != "normal" &&
             $('[name=editInfoSHOT]:checked').val() != "sign") break;
          $("#editInfo").children("div").eq(2).children("input").val(Math.floor(checkObj[0].point.x));
          $("#editInfo").children("div").eq(4).children("input").val(Math.floor(checkObj[0].point.z));
          break;

        case Focus.focus.EDIT_MOVE:
          $("#editInfo").children("div").eq(2).children("input").val(Math.floor(checkObj[0].point.x));
          $("#editInfo").children("div").eq(4).children("input").val(Math.floor(checkObj[0].point.z));
          break;

        case Focus.focus.ADD_SHOT:
          if($('[name=addActionSHOT]:checked').val() != "normal" &&
             $('[name=addActionSHOT]:checked').val() != "sign") break;
          $("#addAction").children("div").eq(2).children("input").val(Math.floor(checkObj[0].point.x));
          $("#addAction").children("div").eq(4).children("input").val(Math.floor(checkObj[0].point.z));
          break;

        case Focus.focus.ADD_MOVE: 
          $("#addAction").children("div").eq(2).children("input").val(Math.floor(checkObj[0].point.x));
          $("#addAction").children("div").eq(4).children("input").val(Math.floor(checkObj[0].point.z));
          break;

        default: 
          break;
        }
      }
    }

  //###
  //### enemy の出現位置を指定する処理
  //###
  if(editMesh.ifArrowMesh == false) return;
  var arrowObj = ray.intersectObjects( editMesh.arrowMesh );
  if(arrowObj.length > 0){

    //###
    //### enemy の init x, z に座標を挿入
    //### 画面外から出現させるための OFFSET を加算
    //###
    if(arrowObj[0].object.position.x > 200) var OFFSET_X = 100;
    else if(arrowObj[0].object.position.x < -200) var OFFSET_X = -100;
    else var OFFSET_X = 0;
    if(arrowObj[0].object.position.z < -450) var OFFSET_Z = -100;
    else if(arrowObj[0].object.position.z > 250) var OFFSET_Z = 100;
    else var OFFSET_Z = 0;

    if(Focus.currentFocus == Focus.focus["ADD_ENEMY"]){
      $("#addEnemy").children("div").eq(7).children("input").val(arrowObj[0].object.position.x + OFFSET_X);
      $("#addEnemy").children("div").eq(9).children("input").val(arrowObj[0].object.position.z + OFFSET_Z);
      }
    else if(Focus.currentFocus == Focus.focus["EDIT_ENEMY"]){
      $("#editEnemyInfo").children("div").eq(7).children("input").val(arrowObj[0].object.position.x + OFFSET_X);
      $("#editEnemyInfo").children("div").eq(9).children("input").val(arrowObj[0].object.position.z + OFFSET_Z);
      }

    //###
    //### 対象の arrow の scale up 処理
    //###
    arrowObj[0].object.scale.set(2, 2, 2);
    editMesh.selectedArrowMeshPos = new THREE.Vector3(arrowObj[0].object.position.x,
                                                      0,
                                                      arrowObj[0].object.position.z);
    editMesh.controlEnemyMesh(true,
                              arrowObj[0].object.position);
    var targetIndex = editMesh.returnArroMeshIndex(arrowObj[0].object.position.x,
                                                   arrowObj[0].object.position.z);
    if(editMesh.selectedArrowMeshIndex != targetIndex) editMesh.controlVectorMesh(false);
    editMesh.selectedArrowMeshIndex = targetIndex;
    for(var i = 0; i < editMesh.arrowMesh.length; i++){
      if(i != editMesh.selectedArrowMeshIndex){
        editMesh.arrowMesh[i].scale.set(1, 1, 1);
        }
      }
    return;
    }

  //###
  //### enemy 出現位置確定後 move を設定する処理
  //###
  if(typeof editMesh.selectedArrowMeshIndex !== "undefined"){
    var checkObj = ray.intersectObjects( [ editMesh.checkMesh ] );
    if(checkObj.length > 0){
      $("#addEnemy").children("div").eq(10).children("input").val(game.gameFrame);
      $("#addEnemy").children("div").eq(12).children("input").val(Math.floor(checkObj[0].point.x));
      $("#addEnemy").children("div").eq(14).children("input").val(Math.floor(checkObj[0].point.z));
      editMesh.controlVectorMesh(true, editMesh.selectedArrowMeshPos, checkObj[0].point);
      }
    }
  };


</script>
</body>
</html>
