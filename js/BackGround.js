//**************************************************************//
//************************ BackGround.js ***********************//
//**************************************************************//
document.write("<script type='text/javascript' src='./api/three.js'></script>");

function BackGround(){
  this.backGround; 
  this.checkMesh;
  this.arrowMesh;
  };


//==========================================//
// ### createBackGround ###                 //
// 背景画像描画用 Sphere オブジェクトの作成 //
//==========================================//
BackGround.prototype.createBackGround = function(){
  var texture = THREE.ImageUtils.loadTexture("./model/backGround/backGround.jpg");
  var sg = new THREE.SphereGeometry( 600, 15, 10 );
  var mbm = new THREE.MeshBasicMaterial( { map: texture } );
  this.backGround = new THREE.Mesh( sg, mbm );
  this.backGround.scale.x = -1;
  this.backGround.position.set(0, 0, 0);
  this.backGround.rotation.z = Math.PI/2;
  scene.add( this.backGround );

  var geometry = new THREE.PlaneBufferGeometry(600,1000);
  var material = new THREE.MeshBasicMaterial( { color : 0x00000 } );
  this.checkMesh = new THREE.Mesh(geometry, material);
  this.checkMesh.rotation.x = -Math.PI/2;
  this.checkMesh.visible = false;
  scene.add( this.checkMesh );

  var arrowGeo = new THREE.PlaneBufferGeometry(100,100);
  var arrowTex = THREE.ImageUtils.loadTexture("./model/backGround/arrow.png");
  var arrowMat = new THREE.MeshBasicMaterial( { map : arrowTex, transparent : true } );
  this.arrowMesh = new THREE.Mesh(arrowGeo, arrowMat);
  this.arrowMesh.rotation.x = -Math.PI/2;
  this.arrowMesh.visible = false;
  scene.add( this.arrowMesh );
  };

//=================================//
// ### rotateBackGround ###        //
// 背景画像の回転                  //
//=================================//
BackGround.prototype.rotateBackGround = function(){
  this.backGround.rotation.x -= Math.PI*0.0005; 
  };
