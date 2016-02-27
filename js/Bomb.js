
//**********************************************************//
//************************ Bomb.js**************************//
//**********************************************************//
"<script type='text/javascript' src='./api/three.min.js'></script>"

function Bomb(){
  this.magicCircle = new Array();
  this.bombMesh = null;
  this.frame = 0;
  this.bombFrame = 300;
  this.ifEnable = false;
  };

Bomb.prototype.createMagicCircle = function(texPath){
  var geometry = new THREE.PlaneBufferGeometry(10,10);
  var tex = THREE.ImageUtils.loadTexture(texPath);
  var material = new THREE.MeshBasicMaterial( { map: tex, transparent: true } );
  material.side = THREE.DoubleSide;

  var mesh = new THREE.Mesh(geometry, material);
  mesh.visible = false;
  mesh.rotation.x = -Math.PI/2;
  mesh.rotation.y = -Math.PI/4;
  scene.add( mesh );
  this.magicCircle.push(mesh);
  };


Bomb.prototype.enableMagicCircle = function(playerObjPos){
  for(var i =0 ; i < this.magicCircle.length; i++){
    this.magicCircle[i].visible = true;
    }
    this.ifEnable = true;
  };

Bomb.prototype.updateMagicCircle = function(playerObjPos){
  if(this.ifEnable == false) return;
  else if(this.frame == this.bombFrame) return;

  for(var i =0 ; i < this.magicCircle.length; i++){
    this.magicCircle[i].position.set(playerObjPos.x, playerObjPos.y - 50, playerObjPos.z);

    var CIRCLE_MAX = 70;
    const MALTIPLY_VALUE = 1.4;
    if(this.magicCircle[i].scale.length() < CIRCLE_MAX ){
      this.magicCircle[i].scale.multiplyScalar(MALTIPLY_VALUE);
      }
    var rotation = Math.PI/72*MALTIPLY_VALUE*this.frame;
    if(i % 3 == 0) this.magicCircle[i].rotation.z = rotation;
    }
  };

Bomb.prototype.updateBomb = function(enemyArray){
  if(this.ifEnable == false) return;
  else if(this.frame == this.bombFrame) return;

  const OFFSET = 50;

  //###
  //### 描画範囲内の敵全てに damage
  //###
  for(var i = 0; i < enemyArray.length; i++){
    if(enemyArray[i].chara == null) continue;

    if(enemyArray[i].chara.position.x < MAX_SCENE_X + OFFSET  &&
       enemyArray[i].chara.position.x > -MAX_SCENE_X - OFFSET &&
       enemyArray[i].chara.position.z < MAX_SCENE_Z - OFFSET  &&
       enemyArray[i].chara.position.z > -MAX_SCENE_Z - OFFSET){
      enemyArray[i].damageChara(1);
      }
    enemyArray[i].charaShot.shotToItem();
    }

  this.frame++;
  if(this.frame == this.bombFrame){
    for(var i =0 ; i < this.magicCircle.length; i++){
      this.magicCircle[i].scale.set(1, 1, 1);
      this.magicCircle[i].visible = false;
      }
    this.frame = 0;
    this.ifEnable = false;
    }
  };

var bomb = new Bomb();
