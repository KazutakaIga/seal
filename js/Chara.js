//**************************************************************//
//************************* Chara.js ***************************//
//**************************************************************//
//
// [BASE OBJECT]
// + Chara
//
// [FUNCTIONS]
// + prototype
//  - createChara
//  - damageChara
//  - charaRotate
//  - charaMove
//
//**************************************************************//
document.write("<script type='text/javascript' src='./api/three.js'></script>");
document.write("<script type='text/javascript' src='./js/Shot.js'></script>");
document.write("<script type='text/javascript' src='./js/Sound.js'></script>");
document.write("<script type='text/javascript' src='./js/Collision.js'></script>");
document.write("<script type='text/javascript' src='./js/Effect.js'></script>");
document.write("<script type='text/javascript' src='./js/ModelContainer.js'></script>");



//==============================================//
// ### Chara ###                                //
// Chara ベースオブジェクト                     //
//==============================================//
function Chara(HP, 
               powerItem, 
               scoreItem,
               bombItem, 
               ifPlayer,
               enemyID){
  //###
  //### 衝突判定用、モデル用 Mesh オブジェクト
  //###
  this.chara;     //### 衝突判定用 Box Mesh 
  this.charaMesh; //### モデル用 Skinned Mesh

  //###
  //### HP
  //###
  this.HP = HP;

  //###
  //### shot オブジェクト
  //###
  var shotVector = PLAYER_SHOT_VECTOR;
  this.charaShot = new Shot(PLAYER_INIT_SHOT_POWER,
                            shotVector,
                            20,
                            20,
                            './model/shot/shot1.png');

  //###
  //### キャラ移動用プロパティ
  //###
  this.destination = new THREE.Vector3(0, 0, 0);
  this.moveSpeed = new THREE.Vector3(0, 0, 0);

  //###
  //### 敵キャラ当たり判定用オブジェクト
  //###
  this.ray = null;

  //#################################
  //### enemy ID
  //### enemy のみ使用
  //#################################
  this.enemyID = enemyID;


  //#################################
  //### enemy の DROP ITEM
  //### enemy のみ使用
  //#################################
  var itemMesh = new Array();
  this.powerItem = {name : "power", num : powerItem};
  this.scoreItem = {name : "score", num : scoreItem};
  this.bombItem  = {name : "bomb" , num : bombItem };

  //###
  //### Player mesh か否か
  //###
  this.ifPlayer = ifPlayer == true ? true : false;

  //#################################
  //### Player のプロパティ
  //### Player のみ使用
  //#################################
  this.power = PLAYER_INIT_POW;
  this.score = PLAYER_INIT_SCORE;
  this.bomb = PLAYER_INIT_BOMB;
  this.playerNum = PLAYER_INIT_NUM;

  this.col = new Collision();
  };


//==============================================//
// ### initChara ###                            //
// DEAD => PLAY 時のパラメータ初期化            //
//==============================================//
Chara.prototype.initChara = function(){
  this.HP = PLAYER_INIT_HP;
  this.power = PLAYER_INIT_POW;
  this.bomb = PLAYER_INIT_BOMB;

  this.charaMesh.visible = true;
  this.charaMesh.position.set(PLAYER_INIT_POS.x, PLAYER_INIT_POS.y, PLAYER_INIT_POS.z);
  this.chara.position.set(PLAYER_INIT_POS.x, PLAYER_INIT_POS.y, PLAYER_INIT_POS.z);
  var OFFSET = -50;
  this.chara.position.z += OFFSET;
  };


//==============================================//
// ### continueChara ###                        //
// GAMEOVER => PLAY 時のパラメータ初期化        //
//==============================================//
Chara.prototype.continueChara = function(){
  this.playerNum = PLAYER_INIT_NUM;
  this.initChara();
  };

//==============================================//
// ### createChara ###                          //
// 衝突判定、skinned Mesh を作成し scene に add //
//==============================================//
Chara.prototype.createChara = function(position, 
                                       url, 
                                       ifPlayer,
                                       ifFirstLoad){

  ifFirstLoad = ifFirstLoad == true ? true : false;

  //###
  //### 衝突判定用 BOX Mesh の作成
  //###
  var OFFSET = -50;
  var COL_BOX_SIZE = 40;
  if(this.ifPlayer == true ) COL_BOX_SIZE = 6;

  this.chara = this.col.createCollision(COL_BOX_SIZE, position);
  if(this.ifPlayer == true ){
    this.chara.position.z += OFFSET;
    //###
    //### 衝突判定範囲描画用画像
    //###
    this.col.createColImg(this.chara.position, COL_BOX_SIZE);
    }
  else{
    OFFSET = -30;
    this.chara.position.z += OFFSET;
    }
  scene.add(this.chara);

  

  //###
  //### モデル用 Skinned Mesh の作成
  //###
  var ifModel = modelContainer.serachModelUrl(url);
  if(ifModel == false){
    var loader = new THREE.JSONLoader(true);
    loader.load(url, loadModel.bind(this, position));
    }
  //###
  //### ロード済みであれば、このスコープでの this => Chara をいったん bind し
  //### loadModel の実行
  //### Chara を bind しないと Window グローバルオブジェクトを this としてしまう
  //###
  else{
    var loadModelFromMemory = loadModel.bind(this); 
    loadModelFromMemory(position, ifModel["geometry"], ifModel["material"]);
    }


  //###
  //### THREE.JSONLoader.load の callback 関数 
  //###
  function loadModel(position, geometry, materials){

    //###
    //### 全メッシュ共通の処理
    //### Skinned Mesh の作成とマテリアル、テクスチャの割り当て
    //###
    var material = new THREE.MeshFaceMaterial(materials);
    this.charaMesh = new THREE.SkinnedMesh(geometry, material);
    var scale = 15;
    if(this.ifPlayer == true) scale = 12;
    this.charaMesh.scale.addScalar(scale);
    this.charaMesh.position.set(position.x, position.y, position.z);
    this.destination.set(position.x, position.y, position.z);
    this.charaMesh.rotation.x = -Math.PI*2/5;
    this.charaMesh.material.materials.forEach(function (mat) {
      mat.skinning = true;
      });
    scene.add(this.charaMesh);

    //###
    //### player mesh であれば向き変更
    //### player mesh でなければ当たり判定用 ray オブジェクトの定義
    //###
    if(this.ifPlayer == true)this.charaMesh.rotation.y = Math.PI;
    else this.ray = new THREE.Raycaster();

    //###
    //### もし Mesh.geometry.animations 配列に要素があれば
    //### AnimationHandler に animation 情報を渡す
    //###
    if(this.charaMesh.geometry.animations.length == 0) return;
    for(var i = 0; i < this.charaMesh.geometry.animations.length; i++){
      THREE.AnimationHandler.add( this.charaMesh.geometry.animations[ i ] );
      }

    //###
    //### 渡すのは fran.charaMesh.geometry.animations[ 0 ],
    //### fran.charaMesh.geometry.animations[ 0 ].name ではない
    //###
    animation = new THREE.Animation(
                                   this.charaMesh,
                                   this.charaMesh.geometry.animations[ 0 ],
                                   THREE.AnimationHandler.CATMULLROM
                                   );

    animation.play();
    console.log(ifFirstLoad);
    if(ifFirstLoad == true )animate();
    };
  };


//====================================================//
// ### damageChara ###                                //
// chara ダメージ計算関数                             //
// HP 0 で scene から衝突判定、skinned Mesh を remove //
//====================================================//
Chara.prototype.damageChara = function(damage){
  this.HP -= damage;
  const PLAY = 1;
  const DEAD = 2;

  if(this.chara == null || this.charaMesh == null) return DEAD;

  //###
  //### HP = 0 で mesh を remove
  //###
  if(this.HP == 0){
    deleteSe.enableSound("delete");
    effect.enableEffect(this.charaMesh.position);
    item.dropItem(this.powerItem, this.charaMesh.position);
    item.dropItem(this.scoreItem, this.charaMesh.position);
    item.dropItem(this.bombItem, this.charaMesh.position);


    //###
    //### Player であれば player の状態遷移のために
    //### GameControl.state["DEAD"] に対応した値を返す
    //### それ以外を GameControl.state["PLAY"] に対応した値を返す
    //###
    if(this.ifPlayer == true){
      this.charaMesh.visible = false;
      const OFFSET = 300;
      this.chara.position.set(PLAYER_INIT_POS.x, PLAYER_INIT_POS.y, PLAYER_INIT_POS.z + OFFSET);
      return DEAD;
      }
    else{
      scene.remove(this.chara);
      scene.remove(this.charaMesh);
      this.chara = null;
      this.charaMesh = null;

      return PLAY;
      }
    }
  return PLAY;
  };



//=================================//
// ### charaRotate ###             //
// chara SkinnedMesh 回転用関数    //
//=================================//
Chara.prototype.charaRotate = function(rotationSpeed, clockwise){
  if(this.charaMesh != null) this.charaMesh.rotation.y += Math.PI/36*rotationSpeed*clockwise;
  };



//===============================================//
// ### charaMove ###                             //
// chara 衝突判定 Mesh 、Skinned Mesh 移動用関数 //
// 自機キャラは方向キーで移動するので敵用        //
//===============================================//
Chara.prototype.charaMove = function(destination, moveSpeed){

  //###
  //### もし chara オブジェクトが null (HP が 0 で scene から remove)
  //### されている場合には終了
  //###
  if(this.chara == null || this.charaMesh == null) return;


  //###
  //### 最初の実行時に this.moveSpeed に速度をセット
  //###
  if(this.moveSpeed.length() == 0){
    this.destination = destination;
    this.moveSpeed = (new THREE.Vector3()).subVectors(destination, this.charaMesh.position);
    }


  //###
  //### 目的地に到達していない場合は this.moveSpeed 分移動
  //###
  var dest = (new THREE.Vector3()).subVectors(this.destination, this.charaMesh.position);
  if(dest.length() > 1){
    this.moveSpeed.multiplyScalar(0.002*moveSpeed);
    this.chara.position.add(this.moveSpeed);
    this.charaMesh.position.add(this.moveSpeed)
    this.moveSpeed.multiplyScalar(1/(0.002*moveSpeed));
    }
  //###
  //### 達した場合には this.moveSpeed を初期化
  //###
  else{
    this.moveSpeed.multiplyScalar(0);
    }
  };

//===============================================//
// ### getItem ###                               //
// item 取得後パラメータに反映させる処理         //
//===============================================//
Chara.prototype.getItem = function(itemName){
  if(itemName == "power") this.power++;
  if(itemName == "score") this.score++;
  if(itemName == "bomb")  this.bomb++; 
  };


//===============================================//
// ### checkEnemyCollision ##                    //
// + ray.direction の update                     //
// + 敵キャラと自機キャラが接触していないか確認  //
//===============================================//
Chara.prototype.checkEnemyCollision = function(targetCharaObj, ifBomb){
  //###
  //### Player 状態遷移のための戻り値
  //### Player に衝突した場合には GameControl.state["DEAD"] に対応した値を返す
  //###
  const PLAY = 1;
  var returnValue = PLAY;

  //###
  //### bomb 状態であれば終了
  //###
  if(ifBomb == true) return returnValue;

  //###
  //### 必要なオブジェクトが定義されていない場合には終了
  //### ※ JSON Lload は非同期なので、未定義のまま処理が行われる可能性あり
  //###
  if(this.chara == null           || 
     targetCharaObj.chara == null || 
     this.ray == null             ||
     this.ifPlayer == true) return returnValue;


  //###
  //### 現在の enemy 座標を基点に
  //###
  this.ray.ray.origin.copy(this.chara.position);

  //###
  //### enemy 座標から player 座標に向くベクトルを計算し、
  //### ベクトル上に自機キャラがいるか判定
  //###
  var newRayDirection = (new THREE.Vector3()).subVectors(targetCharaObj.chara.position, 
                                                         this.chara.position);
  newRayDirection.normalize(); 
  this.ray.ray.direction.set(newRayDirection.x,
                             newRayDirection.y,
                             newRayDirection.z);
  var intersections = this.ray.intersectObjects([targetCharaObj.chara]);

  //###
  //### もしray ベクトルの延長線上にオブジェクトが存在した場合には距離を計算
  //###
  if(typeof intersections !== "undefined" && intersections.length > 0){
    if(intersections[0].distance < 30) returnValue = targetCharaObj.damageChara(1);
    }

  return returnValue;
  };
