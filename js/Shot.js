
//**************************************************************//
//************************* Shot.js ****************************//
//**************************************************************//

document.write("<script type='text/javascript' src='./api/three.js'></script>");
document.write("<script type='text/javascript' src='./js/Sound.js'></script>");
document.write("<script type='text/javascript' src='./js/Collision.js'></script>");
document.write("<script type='text/javascript' src='./js/Effect.js'></script>");
document.write("<script type='text/javascript' src='./js/CustomShot/SpiralShot.js'></script>");
document.write("<script type='text/javascript' src='./js/CustomShot/SignShot.js'></script>");


function Shot(shotPower,  //### パワー、scalar
              shotVector, //### Speed、vector
              shotWide,   //### shot 描画 PLANE の横幅
              shotHeight, //### shot 描画 PLANE の縦幅
              texture){

  //###
  //### shotプロパティ
  //###
  this.shotPower = shotPower;
  this.shotVector = shotVector;
  this.shotSpeed = this.shotVector.length();
  this.cooldown = 0;

  //###
  //### 描画用THREE オブジェクト
  //###
  this.geometry = new THREE.PlaneBufferGeometry(shotWide, 
                                                shotHeight);
  this.material = new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture(texture), 
                                               transparent: true});


  //###
  //### shot 用 mesh 管理配列
  //###
  this.shots = new Array();

  //###
  //### 当たり判定用 ray 管理配列
  //###
  this.ray = new Array();

  //###
  //### shot 用 Vector 配列
  //###
  this.vector = new Array();

  //###
  //### custom property
  //###
  this.custom = new Array();

  //### 
  //### shot 用のモード
  //###
  this.mode = new Array(); 

  };


//==========================================================//
// ### createShot ###                                       //
// shot 用 mesh と当たり判定用 RayCaster オブジェクトの生成 //
//==========================================================//
Shot.prototype.createShot = function(characterPos,
                                     shotVector,
                                     shotSpeed,
                                     ifPlayer,
                                     mode){

  //###
  //### cool down 中かチェック、cooldown 中なら終了
  //### cooldown は player のみ
  //###
  if(typeof ifPlayer === "undefined") ifPlayer = true;
  if(ifPlayer == true){
    if(this.cooldown == 5) this.cooldown = 0;
    else if(this.cooldown == 0 ) this.cooldown++;
    else{
      this.cooldown++;
      return false;
      }
    }

  //###
  //### 引数に指定があれば shot Vector と shotSpeed のセット
  //###
  if(typeof mode === "undefined"){
    this.mode.push("normal");
    this.custom.push(null);
    }
  else this.mode.push("custom");
  if(typeof shotVector !== "undefined") this.shotVector = shotVector;
  if(typeof shotSpeed !== "undefined") this.shotSpeed = shotSpeed;

  //###
  //### shot 描画 THREE オブジェクト
  //###
  var singleShot = new THREE.Mesh(this.geometry, this.material); 
  singleShot.position.set(characterPos.x, characterPos.y, characterPos.z);
  singleShot.rotation.x = -Math.PI/2;
  scene.add(singleShot);
  this.shots.push(singleShot);

  //###
  //### 当たり判定用 RayCaster オブジェクト
  //###
  var ray = new THREE.Raycaster();
  
  //###
  //### shotVector を単位ベクトルに変換し、RayCaster の direction にセット
  //###
  this.shotVector.normalize();
  ray.ray.direction.set(this.shotVector.x,
                        this.shotVector.y,
                        this.shotVector.z);
  this.ray.push(ray);

  //###
  //### 単位ベクトルから元の値に変換しなおす
  //###
  this.shotVector.multiplyScalar(this.shotSpeed); 
  this.vector.push(this.shotVector);

  return true;
  };


//==========================================================//
// ### createSpiralShot ###                                 //
// 螺旋上の shot 生成                                       //
//==========================================================//
Shot.prototype.createSpiralShot = function(characterPos,
                                           radius,        //### 半径
                                           radiusSpeed,   //### 半径増加速度
                                           intervalAngle, //### shot の間隔
                                           angleSpeed,    //### 角度増加間隔
                                           shotSpeed){    //### 弾の速度

  //###
  //### shot の数を確定
  //###
  var intervalShot = Math.floor(Math.PI*2/intervalAngle); 

  for(var i = 0; i < intervalShot; i++){
    //###
    //### spiral shot のプロパティの保存
    //###
    var spiral =  new SpiralShot(radius,
                                 radiusSpeed,
                                 intervalAngle,
                                 angleSpeed,
                                 i);
    var custom = {name : "spiral", 
                  obj  : spiral};
    this.custom.push(custom);

    var x = radius*Math.cos(i*Math.PI*2/intervalAngle);
    var z = radius*Math.sin(i*Math.PI*2/intervalAngle);
    var shotVector = new THREE.Vector3(x, 0, z);
    var shotPos = shotVector.add(characterPos);

    this.createShot(shotPos,
                    shotVector,
                    shotSpeed,
                    false,
                    "spiral"); 
    }
  };


//==========================================================//
// ### createSignShot ###                                   //
// sign 波の shot                                           //
//==========================================================//
Shot.prototype.createSignShot = function(characterPos,
                                         vector,        //### 進行方向ベクトル
                                         amplitude,     //### 振幅
                                         intervalFrame, //### shot の間隔
                                         angleSpeed,    //### 角度増加間隔
                                         shotSpeed){    //### 弾の速度

  //###
  //### spiral shot のプロパティの保存
  //###
  var sign =  new SignShot(vector,
                           amplitude,
                           intervalFrame,
                           angleSpeed,
                           shotSpeed);
  var custom = {name : "sign",
                obj  : sign};
  this.custom.push(custom);

  var targetAmp = amplitude*Math.sin(angleSpeed*Math.PI*2);
  var angleFromXAxis = vector.angleTo(new THREE.Vector3(1, 0, 0));
  var x = vector.x + targetAmp*Math.sin(angleFromXAxis);
  var z = vector.z + targetAmp*Math.cos(angleFromXAxis);
  var shotVector = new THREE.Vector3(x, 0, z);
  var shotPos = shotVector.add(characterPos);

  this.createShot(shotPos,
                  shotVector,
                  shotSpeed,
                  false,
                  "sign");
  };

//==========================================================//
// ### createRandomShot ###                                 //
// randomShot の生成                                        //
//==========================================================//
Shot.prototype.createRandomShot = function(characterPos,
                                           shotNum,
                                           randomXMin,
                                           randomXMax,
                                           randomZMin,
                                           randomZMax){

  for(var i = 0; i < shotNum; i++){
    var x = Math.random()*(randomXMax - randomXMin) + randomXMin;
    var z = Math.random()*(randomZMax - randomZMin) + randomZMin;
    var shotVector = new THREE.Vector3(x, 0, z);
    
    const MIN_SHOT_SPEED = 10;
    if(shotVector.length() < 10){
      var shotSpeed = shotVector.length()*10/randomXMax;
      }
    else var shotSpeed = shotVector.length()*2/randomXMax;

    this.createShot(characterPos,
                    shotVector,
                    shotSpeed,
                    false);
    }
  };


//=================================//
// ### shotUpdate ###              //
// + Shot の描画座標の update      //
// + Shot の当たり判定と当たり処理 //
//=================================//
Shot.prototype.shotUpdate = function(chara, ifBomb){
  const PLAY = 1;
  var returnValue = PLAY;
  var shotsLength = this.shots.length;

  for(var i = 0; i < shotsLength; i++){

    //###
    //### mode が "custom" ならば、cutom のプロパティを使用して
    //### vector の update
    //###
    if(this.mode[i] != "normal"){
      var vector = this.shotVectorUpdate(i);
      }
    //###
    //### mode が "normal" ならば、vector そのまま
    //###
    else var vector = this.vector[i];

    //###
    //### shot の座標 update
    //###
    this.shots[i].position.add(vector);


    //###
    //### bomb 中であれば shot 座標を update のみ
    //###
    if(ifBomb == true && chara[0].ifPlayer == true) continue;

    //###
    //### 現在描画中の shot 座標を ray の始点に
    //###
    this.ray[i].ray.origin.copy(this.shots[i].position);

    for(var j = 0; j < chara.length; j++){

      //###
      //### 当たり判定対象キャラが ray ベクトル上にいるかチェック
      //### もし ray ベクトルの延長線上にいれば そのオブジェクトの配列を得る
      //###
      if(chara[j].chara == null) continue;
      else var intersections = this.ray[i].intersectObjects([chara[j].chara]);
   
      //###
      //### もしray ベクトルの延長線上にオブジェクトが存在した場合には距離を計算
      //###
      if(intersections.length > 0){
        //###
        //### + 距離が一定以下 => 当たり判定(damage)の処理を行う
        //###
        if(intersections[0].distance < 30){
          hitEffect.enableEffect(this.shots[i].position);
          returnValue = chara[j].damageChara(this.shotPower);
          this.removeShot(i);
          shotsLength--;
          break;
          }
        }
      //###
      //### 画面上から出た場合には scene から mesh を削除
      //### mesh 管理用配列(this.shots)からも削除
      //###
      else{
        const MAX_SCENE_Z_OFFSET = 160;
        const MAX_SCENE_X_OFFSET = 50;
        if(this.shots[i].position.z < -MAX_SCENE_Z - MAX_SCENE_Z_OFFSET ||
           this.shots[i].position.z > MAX_SCENE_Z + MAX_SCENE_Z_OFFSET  ||
           this.shots[i].position.x < -MAX_SCENE_X - MAX_SCENE_X_OFFSET ||
           this.shots[i].position.x > MAX_SCENE_X + MAX_SCENE_X_OFFSET){
          this.removeShot(i);
          shotsLength--;
          break;
          }
        }
      }
    }

  return returnValue;
  };

//=================================//
// ### removeShot ###              //
// 単一 shot の削除処理            //
//=================================//
Shot.prototype.removeShot = function(index){
  scene.remove( this.shots[index] );
  this.shots.splice(index, 1);
  this.ray.splice(index, 1);
  this.vector.splice(index, 1);
  this.custom.splice(index, 1);
  this.mode.splice(index, 1);
  };

//=================================//
// ### shotVectorUpdate ###        //
// shot の方向や速度の update      //
// ray vector も合わせて update    //
//=================================//
Shot.prototype.shotVectorUpdate = function(index){
  if(this.custom[index]["name"] == "spiral") return this.custom[index]["obj"].getShotVector();
  if(this.custom[index]["name"] == "sign")   return this.custom[index]["obj"].getShotVector();
  };

//==================================================//
// ### shotToItem ###                               //
// BOMB 時に自身のクラスの shots を全て Item へ     //
//==================================================//
Shot.prototype.shotToItem = function(){
  for(var i = 0; i < this.shots.length; i++){
    item.dropItem({name : "score", num : 1}, this.shots[i].position);
    this.removeShot(i);
    }
  };
