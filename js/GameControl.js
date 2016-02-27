
//***********************************************************//
//************************ GameControl.js *******************//
//***********************************************************//
document.write("<script type='text/javascript' src='./js/ModelContainer.js'></script>");
document.write("<script type='text/javascript' src='./js/Clear.js'></script>");


function GameControl(targetJSON){

  //###
  //### this.gameFrame : game 中の frame
  //###
  this.gameFrame = 0;

  //###
  //### ゲーム制御用のステータス
  //###
  this.state = {
               PREPLAY  : 0,
               PLAY     : 1,
               DEAD     : 2,
               GAMEOVER : 3,
               EDIT     : 4,
               STEP_FRAME : 5, 
               RELOAD   : 6, 
               CLEAR    : 7 
               };
  this.playerState = this.state["PREPLAY"];

  //###
  //### continue 回数
  //###
  this.continue = 0;

  //###
  //### DEAD 時、再描画までの frame を計算する変数
  //###
  this.deadFrame = 0;

  //###
  //### DEAD 時、再描画までの frame を計算する変数
  //###
  this.clearFlag = true;

  //###
  //### 敵キャラ管理用の配列
  //###
  this.enemyArray = new Array();

  //###
  //### game 制御データ格納用オブジェクト
  //###
  var gameData = new Array();
  this.getGameData = function(){return gameData;};
  this.setGameData = function(data){gameData = data;};


  //###
  //### オブジェクト作成時に game data をロード
  //###
  if(targetJSON == "" || typeof targetJSON === "undefined") this.targetJSON = targetJSON = './js/setting/1.json';
  else this.targetJSON = targetJSON;
  var load = function(){
    $.getJSON(targetJSON , function(data) {
      gameData = data;
      });
    };
  load();
  };


//===============================================//
// ### changeGameData ###                        //
// 設定変更後 temp.json に変更を更新し読み込む   //
//===============================================//
GameControl.prototype.changeGameData = function(){
  this.playerState = game.state["RELOAD"];
  $.getJSON('./js/setting/temp.json' , (function(data) {
    game.setGameData(data);
    game.playerState = game.state["PLAY"];
    game.initGame();
    }).bind(this));
  };


//===============================================//
// ### initGame ###                              //
// scene 内描画 obj, game 変数等全てを初期化     //
//===============================================//
GameControl.prototype.initGame = function(){
  //###
  //### 現在描画中の enemy mesh を scene から削除
  //###
  for(var i = 0; i < this.enemyArray.length; i++){
    scene.remove(this.enemyArray[i].charaMesh);
    scene.remove(this.enemyArray[i].chara);
    }

  //###
  //### 現在描画中の enemy shot mesh を scene から削除
  //###
  for(var i = 0; i < this.enemyArray.length; i++){
    for(var j = 0; j < this.enemyArray[i].charaShot.shots.length; j++){
      scene.remove( this.enemyArray[i].charaShot.shots[j] );
      }
    }

  //###
  //### 現在描画中の 自機 shot mesh を scene から削除
  //###
  for(var i = 0; i < fran.charaShot.shots.length; i++){
    scene.remove( fran.charaShot.shots[j] );
    }

  //###
  //### 現在描画中の item を scene から削除
  //###
  item.initItem();

  //###
  //### clearFlag の初期化
  //###
  this.clearFlag = true;

  //###
  //### gameover 画面の削除
  //###
  gameover.disableGameover();

  //###
  //### this オブジェクトの初期化
  //###
  this.gameFrame = 0;
  this.playerState = this.state["PREPLAY"];
  this.continue = 0;
  this.deadFrame = 0;
  this.enemyArray = new Array();

  fran.continueChara();
  };


//===============================================//
// ### continueGame ###                          //
// continue 選択時に player のみ init する       //
//===============================================//
GameControl.prototype.continueGame = function(){
  this.playerState = game.state["PLAY"];
  fran.continueChara();
  this.continue++;
  };

//===============================================//
// ### checkShotFrame ###                        //
// interval の場合に shot 描画 frame か返す      //
//===============================================//
GameControl.prototype.checkShotFrame = function(gameDataShot){
  if(this.gameFrame == gameDataShot["frame"]) return true;
  else if(gameDataShot["shotNum"] > 1){
    for(var i = 0; i < gameDataShot["shotNum"]; i++){
      if(this.gameFrame == gameDataShot["frame"] +  gameDataShot["interval"]*i) return true;
      }
    }
  else return false;
  };


//===============================================//
// ### checkGameClear ###                        //
// game clear かどうか判定する関数               //
//===============================================//
GameControl.prototype.checkGameClear = function(){ 
  if(this.clearFlag == true &&
     this.gameFrame > this.getGameData()[String(Object.keys(this.getGameData()).length)][0]["enableFrame"]){
     this.playerState = this.state["CLEAR"];
     }
  };


//===============================================//
// ### incrementGameFrame ###                    //
// game 制御メインループ                         //
//===============================================//
GameControl.prototype.incrementGameFrame = function(){
  //###
  //### 全 JSON THREE モデルロード後に loop 開始
  //### this.state["PREPLAY"] => this.state["PLAY"]
  //###
  if(modelContainer.loadFinish == false) return;
  if(this.playerState == this.state["PREPLAY"]) this.playerState = this.state["PLAY"];

  //###
  //### EDIT/RELOAD/CLEAR モードなら終了
  //###
  if(this.playerState == this.state["EDIT"] ) return;
  if(this.playerState == this.state["RELOAD"])return;

  //###
  //### JSON データを取得
  //###
  var gameData = this.getGameData();
  var keyIndex = 0;

  //###
  //### 各gameData のチェック
  //###
  for(var key in gameData){
    //###
    //### メッシュの生成
    //###
    if(this.gameFrame == gameData[key][0]["enableFrame"]){
      var chara = new Chara(gameData[key][0]["hp"],
                            gameData[key][0]["powerItem"],
                            gameData[key][0]["scoreItem"],
                            gameData[key][0]["bombItem"],
                            false,
                            key);
      charaPos = new THREE.Vector3(gameData[key][0]["initPos"][0]["x"],
                                   gameData[key][0]["initPos"][0]["y"],
                                   gameData[key][0]["initPos"][0]["z"]);
      var enemyURL = './model/boneAnimation/syanhai/syanhai.json';
      chara.createChara(charaPos,  enemyURL);
      this.enemyArray.push(chara);
      }

    //###
    //### enemy メッシュの移動
    //###
    if(keyIndex < this.enemyArray.length &&
       this.enemyArray[keyIndex].charaMesh != null){

      var moveVector = this.enemyArray[keyIndex].charaMesh.position;
      if(this.gameFrame == gameData[key][0]["move"][0]["frame"]){
        var moveVector = new THREE.Vector3(gameData[key][0]["move"][0]["dest"][0]["x"],
                                           gameData[key][0]["move"][0]["dest"][0]["y"],
                                           gameData[key][0]["move"][0]["dest"][0]["z"]);
        }
      this.enemyArray[keyIndex].charaMove(moveVector,
                                          gameData[key][0]["move"][0]["speed"]);
      }

    //###
    //### shot の生成
    //###
    for(var i = 0; i < gameData[key][0]["shot"].length; i++){

      //###
      //### shot 生成 frame かチェック
      //###
      if(this.checkShotFrame(gameData[key][0]["shot"][i]) == true &&
         this.enemyArray[keyIndex].charaMesh != null && 
         fran.charaMesh != null){

        //###
        //### shot type が null
        //###
        if(gameData[key][0]["shot"][i]["type"] == null){
          var shotVector = new THREE.Vector3(gameData[key][0]["shot"][i]["dest"][0]["x"],
                                             gameData[key][0]["shot"][i]["dest"][0]["y"],
                                             gameData[key][0]["shot"][i]["dest"][0]["z"]); 
          //###
          //### shot 生成処理
          //###
          this.enemyArray[keyIndex].charaShot.createShot(this.enemyArray[keyIndex].charaMesh.position,
                                                         shotVector,
                                                         gameData[key][0]["shot"][i]["speed"],
                                                         false);
          continue;
          }

        //###
        //### shot type が tracking
        //###
        else if(gameData[key][0]["shot"][i]["type"] == "tracking"){
          var shotVector = (new THREE.Vector3()).subVectors(fran.charaMesh.position,
                                                            this.enemyArray[keyIndex].charaMesh.position);
          //###
          //### shot 生成処理
          //###
          this.enemyArray[keyIndex].charaShot.createShot(this.enemyArray[keyIndex].charaMesh.position,
                                                         shotVector,
                                                         gameData[key][0]["shot"][i]["speed"],
                                                         false);
          continue;
          }

        //###
        //### shot type が spiral
        //###
        else if(gameData[key][0]["shot"][i]["type"] == "spiral"){
          this.enemyArray[keyIndex].charaShot.createSpiralShot(this.enemyArray[keyIndex].charaMesh.position,
                                                               gameData[key][0]["shot"][i]["r"],
                                                               gameData[key][0]["shot"][i]["rSpeed"],
                                                               gameData[key][0]["shot"][i]["intervalAngle"],
                                                               gameData[key][0]["shot"][i]["angleSpeed"],
                                                               gameData[key][0]["shot"][i]["speed"]);
          continue;
          }

        //###
        //### shot type が random
        //###
        else if(gameData[key][0]["shot"][i]["type"] == "random"){
        this.enemyArray[keyIndex].charaShot.createRandomShot(this.enemyArray[keyIndex].charaMesh.position,
                                                             gameData[key][0]["shot"][i]["randomShotNum"],
                                                             gameData[key][0]["shot"][i]["randomXMin"],
                                                             gameData[key][0]["shot"][i]["randomXMax"],
                                                             gameData[key][0]["shot"][i]["randomZMin"],
                                                             gameData[key][0]["shot"][i]["randomZMax"]);

          continue;
          }

        //###
        //### shot type が sign
        //###
        else if(gameData[key][0]["shot"][i]["type"] == "sign"){
 
          var shotVector = new THREE.Vector3(gameData[key][0]["shot"][i]["dest"][0]["x"],
                                             gameData[key][0]["shot"][i]["dest"][0]["y"],
                                             gameData[key][0]["shot"][i]["dest"][0]["z"]);
          this.enemyArray[keyIndex].charaShot.createSignShot(this.enemyArray[keyIndex].charaMesh.position,
                                                             shotVector,
                                                             gameData[key][0]["shot"][i]["amplitude"],
                                                             gameData[key][0]["shot"][i]["interval"],
                                                             gameData[key][0]["shot"][i]["angleSpeed"],
                                                             gameData[key][0]["shot"][i]["speed"]);
          continue;
          }
        }
      }
    keyIndex++;
    }

  //###
  //### 生成されている enemy 対してフレーム毎の処理を行う
  //###
  for(var i = 0; i < this.enemyArray.length; i++){
    if(this.playerState == this.state["GAMEOVER"]) break;


    //###
    //### clear 状態のときは無敵(ifBomb の無敵状態で代替処理)
    //### 描画中の shot は score Item に変換
    //###
    if(this.playerState == this.state["CLEAR"]){
      bomb.ifEnable = true;
      this.enemyArray[i].charaShot.shotToItem();
      clear.enableClear(this.targetJSON);
      }
    //###
    //### enemy 自体の衝突判定と球の衝突判定
    //###
    this.enemyArray[i].charaRotate(1, 1); 
    var shotReturnVal = this.enemyArray[i].charaShot.shotUpdate([fran], bomb.ifEnable);
    var colReturnVal = this.enemyArray[i].checkEnemyCollision(fran, bomb.ifEnable);

    //###
    //### 一度 DEAD になったらそれ以降 PLAY にさせないためのハンドリング
    //###
    if(shotReturnVal == this.state["DEAD"] || 
       colReturnVal == this.state["DEAD"])  this.playerState = this.state["DEAD"];
    else if(this.playerState == this.state["DEAD"] && 
           (shotReturnVal == this.state["PLAY"] || 
            colReturnVal == this.state["PLAY"] )) this.playerState = this.state["DEAD"];

    //###
    //### enemy が出現し終わった後、enemy が全滅したらクリア処理
    //###
    if(this.enemyArray[i].chara != null){
        this.clearFlag = false;
        }

    if(i == this.enemyArray.length - 1){
        if(this.clearFlag == true){
            this.checkGameClear();
            }
        else{
            this.clearFlag = true;
            }
        }
    }
  
  //###
  //### 自機キャラの座標 update
  //###
  fran.charaMove(fran.destination, 0.03);

  //###
  //### shot 位置の update と当たり判定
  //###
  fran.charaShot.shotUpdate(this.enemyArray);

  //###
  //### item の座標 update
  //###
  item.itemUpdate(fran, bomb.ifEnable); 

  //###
  //### effect の update
  //###
  var effectUpdate = new THREE.Vector3(1, 1, 1);
  effect.effectUpdate(effectUpdate, 5);
  hitEffect.effectUpdate(effectUpdate, 3);

  //###
  //### bomb の update
  //###
  if(fran.charaMesh != null)bomb.updateMagicCircle(fran.charaMesh.position);
  bomb.updateBomb(this.enemyArray);


  //###
  //### collision 画像の update
  //###
  fran.col.updateColImg(fran.chara.position);

  //###
  //### this.state が DEAD で残機があれば 200 frame 後に再描画
  //###
  if(this.playerState == this.state["DEAD"]){
    //###
    //### 初めて DEAD になった frame のみ残機を減らす
    //###
    if(this.deadFrame == 0) fran.playerNum--;

    //###
    //### もし残機がなければ GAMEOVER
    //###
    if(fran.playerNum < 0) this.playerState = this.state["GAMEOVER"];
    if(this.playerState == this.state["GAMEOVER"]){
      var pos = new THREE.Vector3(0, 100, -100);
      gameover.enableGameover(pos);
      console.log("GAMEOVER!!!!!");
      }

    //###
    //### 再描画の frame に達したら playerState を PLAY へ
    //###
    if(this.playerState != this.state["GAMEOVER"]){
      this.deadFrame++;
      if(this.deadFrame == 100){
        this.playerState = this.state["PLAY"]
        this.deadFrame = 0;
        fran.initChara();
        }
      }
    }

  //###
  //### EDIT or STEP_FRAME (game frame 停止中)の際には
  //### gameFrame の increment なしで終了
  //###
  if(this.playerState == this.state["STEP_FRAME"]){
    this.playerState = this.state["EDIT"];
    return;
    } 

  //###
  //### gameFrame の increment
  //###
  this.gameFrame++;
  };
