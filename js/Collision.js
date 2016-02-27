
//***********************************************************//
//********************* Collision.js ************************//
//***********************************************************//
document.write("<script type='text/javascript' src='./api/three.js'></script>");

function Collision(){
  this.colImg = null;
  this.frame = 0;
  };

Collision.prototype.createCollision = function(colBoxLen,
                                               targetPos){
  var boxGeometry = new THREE.BoxGeometry( colBoxLen, colBoxLen, colBoxLen );
  var boxMaterial = new THREE.MeshBasicMaterial({color: 0xffff,
                                                 wireframe: true});
  colBox = new THREE.Mesh(boxGeometry, boxMaterial);
  colBox.visible = false;
  colBox.position.set(targetPos.x, targetPos.y, targetPos.z);

  return colBox;
  };


Collision.prototype.createColImg = function(targetPos, colImgSize){
  var geometry = new THREE.PlaneBufferGeometry(colImgSize + 10, colImgSize + 10);
  var tex = THREE.ImageUtils.loadTexture(COL_IMG_URL);
  var material = new THREE.MeshBasicMaterial( { map: tex, transparent: true } );
  this.colImg = new THREE.Mesh(geometry, material);
  this.colImg.rotation.x = -Math.PI/2;

  const OFFSET = 40;
  this.colImg.position.set(targetPos.x, targetPos.y + OFFSET, targetPos.z);

  scene.add(this.colImg);
  };


Collision.prototype.updateColImg = function(targetPos){
  const OFFSET = 40;
  this.colImg.position.set(targetPos.x, targetPos.y + OFFSET, targetPos.z);

  this.frame++;
  this.colImg.rotation.z = Math.PI/72*this.frame; 
  };
