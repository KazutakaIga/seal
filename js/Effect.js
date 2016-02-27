
//***********************************************************//
//************************ Effect.js ************************//
//***********************************************************//
"<script type='text/javascript' src='./api/three.min.js'></script>"

function Effect(){
  this.effect = null;
  this.frame = 0;
  };

Effect.prototype.createEffect = function(texPath){
  var geometry = new THREE.PlaneBufferGeometry(10,10);
  var tex = THREE.ImageUtils.loadTexture(texPath);
  var material = new THREE.MeshBasicMaterial( { map: tex, transparent: true } );
  this.effect = new THREE.Mesh(geometry, material);
  this.effect.rotation.x = -Math.PI/2;
  this.effect.visible = false;

  scene.add( this.effect );
  };

Effect.prototype.enableEffect = function(pos){
  this.effect.position.set(pos.x, pos.y, pos.z);
  this.effect.visible = true;
  this.frame = 0;
  };

Effect.prototype.effectUpdate = function(updateSpeed, effectFrame){
  if(this.effect == null) return;
  if(this.frame < effectFrame){
    this.effect.scale.add(updateSpeed);
    this.frame++;
    }
  else{
    this.effect.visible = false;
    this.effect.scale.set(10, 10, 10);
    }
  };

var effect = new Effect();
var hitEffect = new Effect();
