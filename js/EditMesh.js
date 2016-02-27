//**************************************************************//
//************************ EditMesh.js *************************//
//**************************************************************//

function EditMesh(){
  this.checkMesh;
  this.ifCeckMesh = true;

  this.arrowMesh = new Array();
  this.selectedArrowMeshPos;
  this.selectedArrowMeshIndex;
  this.ifArrowMesh = false;

  this.vectorMesh;
  this.ifVectorMesh = false;

  this.enemyMesh;
  this.ifEnemyMesh = false;
  };


//==========================================//
// ### createEditMesh ###                   //
// 背景画像描画用 Sphere オブジェクトの作成 //
//==========================================//
EditMesh.prototype.createEditMesh = function(){
  //###
  //### 座標取得用 Mesh
  //###
  var geometry = new THREE.PlaneBufferGeometry(600,1000);
  var material = new THREE.MeshBasicMaterial( { color : 0x00000 } );
  this.checkMesh = new THREE.Mesh(geometry, material);
  this.checkMesh.rotation.x = -Math.PI/2;
  this.checkMesh.position.y = -100;
  this.checkMesh.visible = false;
  scene.add( this.checkMesh );

  //###
  //### enemy 描画用 Mesh
  //###
  var geometry = new THREE.PlaneBufferGeometry(100,100);
  var material = new THREE.MeshBasicMaterial( { color : 0x00000 } );
  this.enemyMesh = new THREE.Mesh(geometry, material);
  this.enemyMesh.rotation.x = -Math.PI/2;
  this.enemyMesh.position.y = 100;
  this.enemyMesh.visible = false;
  scene.add( this.enemyMesh );

  //###
  //### enemy の初期位置矢印描画用 Mesh
  //###
  var arrowGeo = new THREE.PlaneBufferGeometry(80,80);
  var arrowTex = THREE.ImageUtils.loadTexture("./model/backGround/arrow.png");
  var arrowMat = new THREE.MeshBasicMaterial( { map : arrowTex, 
                                                transparent : true } );
  for(var x = -2; x <= 2; x++){
    var arrowMeshTop = new THREE.Mesh(arrowGeo, arrowMat);
    arrowMeshTop.rotation.x = -Math.PI/2;
    arrowMeshTop.position.x = 80*x;
    arrowMeshTop.position.y = -100;
    arrowMeshTop.position.z = -470;
    arrowMeshTop.visible = false;
    scene.add(arrowMeshTop);
    this.arrowMesh.push(arrowMeshTop);

    var arrowMeshBot = new THREE.Mesh(arrowGeo, arrowMat);
    arrowMeshBot.rotation.x = -Math.PI/2;
    arrowMeshBot.rotation.z = Math.PI;
    arrowMeshBot.position.x = 80*x;
    arrowMeshBot.position.y = -100;
    arrowMeshBot.position.z = 270;
    arrowMeshBot.visible = false;
    scene.add(arrowMeshBot);
    this.arrowMesh.push(arrowMeshBot);
    }

  for(var z = -5; z <= 2; z++){
    var arrowMeshLeft = new THREE.Mesh(arrowGeo, arrowMat);
    arrowMeshLeft.rotation.x = -Math.PI/2;
    arrowMeshLeft.rotation.z = Math.PI/2;
    arrowMeshLeft.position.x = -250;
    arrowMeshLeft.position.y = -100;
    arrowMeshLeft.position.z = 80*z;
    arrowMeshLeft.visible = false;
    scene.add(arrowMeshLeft);
    this.arrowMesh.push(arrowMeshLeft);

    var arrowMeshRight = new THREE.Mesh(arrowGeo, arrowMat);
    arrowMeshRight.rotation.x = -Math.PI/2;
    arrowMeshRight.rotation.z = -Math.PI/2;
    arrowMeshRight.position.x = 250;
    arrowMeshRight.position.z = 80*z;
    arrowMeshRight.visible = false;
    scene.add(arrowMeshRight);
    this.arrowMesh.push(arrowMeshRight);
    } 

  //###
  //### dest 指定時のベクトル描画用 Mesh
  //### (material は  arrowMat 使いまわし)
  //###
  var vectorGeo = new THREE.PlaneBufferGeometry(50,200);
  this.vectorMesh = new THREE.Mesh(vectorGeo, arrowMat);
  this.vectorMesh.rotation.x = -Math.PI/2;
  this.vectorMesh.posit100;
  this.vectorMesh.visible = false;
  scene.add( this.vectorMesh );
  };


//==========================================//
// ### controlArrowMesh ###                 //
// arrowMesh の有効/無効                    //
//==========================================//
EditMesh.prototype.controlArrowMesh = function(ifValid){
  for(var i = 0; i < this.arrowMesh.length; i++){
    this.arrowMesh[i].visible = ifValid;
    }
  this.ifArrowMesh = ifValid;

  //###
  //### もし ifValid が false のときは arrow の focus を解除
  //###
  if(ifValid == false){
    this.controlEnemyMesh(false);
    for(var i = 0; i < this.arrowMesh.length;i++){
      this.arrowMesh[i].scale.set(1, 1, 1);
      }
    }
  };

//==========================================//
// ### returnArroMeshIndex ###              //
// arrowMesh の有効/無効                    //
//==========================================//
EditMesh.prototype.returnArroMeshIndex = function(x, z){
  for(var i = 0; i < this.arrowMesh.length; i++){
    if(this.arrowMesh[i].position.x == x && this.arrowMesh[i].position.z == z) return i;
    }
  };

//==========================================//
// ### controlCheckMesh ###                 //
// arrowMesh の有効/無効                    //
//==========================================//
EditMesh.prototype.controlCheckMesh = function(ifValid){
  this.ifCheckMesh = ifValid;
  };


//==========================================//
// ### controlVectorMesh ###                //
// arrowMesh の有効/無効                    //
//==========================================//
EditMesh.prototype.controlVectorMesh = function(ifValid, enemyPos, destPos){
  this.vectorMesh.visible = ifValid;
  this.ifVectorMesh = ifValid;
  if(this.ifVectorMesh == true){
    this.vectorMesh.position.set(enemyPos.x, enemyPos.y, enemyPos.z);
    var vectorDest = (new THREE.Vector3()).subVectors(destPos, enemyPos);
    
    //###
    //### angleTo は 180 度以下の値しか返さないので相対ベクトルの象限に応じて角度オフセットを計算
    //###
    if((vectorDest.x < 0 && vectorDest.z > 0) || (vectorDest.x > 0 && vectorDest.z > 0)){
      this.vectorMesh.rotation.z = Math.PI*3/2 + (new THREE.Vector3(-1, 0, 0)).angleTo(vectorDest);
      }
    else{
      this.vectorMesh.rotation.z = Math.PI/2 + (new THREE.Vector3(1, 0, 0)).angleTo(vectorDest); 
      }   
    this.vectorMesh.position.set(enemyPos.x + 80*Math.sin(this.vectorMesh.rotation.z), 
                                 enemyPos.y, 
                                 enemyPos.z + 80*Math.cos(this.vectorMesh.rotation.z));
    }
  };

//==========================================//
// ### controlEnemyMesh ###                 //
// arrowMesh の有効/無効                    //
//==========================================//
EditMesh.prototype.controlEnemyMesh = function(ifValid, pos){
  this.ifEnemyMesh = ifValid;
  this.enemyMesh.visible = ifValid;
  if(ifValid == true){
    this.enemyMesh.position.set(pos.x , pos.y, pos.z);
    }
  };
