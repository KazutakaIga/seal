
//***********************************************************//
//************************ Gameover.js **********************//
//***********************************************************//
"<script type='text/javascript' src='./api/three.min.js'></script>"

function Gameover(){
  this.gameover = new Array();
  this.ifEnable = false;
  this.frame = 0;

  this.state ={
               AGAIN  : 0,
               GIVEUP : 1
               };
  this.focus = this.state["AGAIN"];
  this.focusScale = 1.2;
  };


Gameover.prototype.createGameover = function( texPath ){
  var geometry = new THREE.PlaneBufferGeometry( 300, 100 );
  var tex = THREE.ImageUtils.loadTexture(texPath);
  var material = new THREE.MeshBasicMaterial( { map: tex, transparent: true } );
  var gameover = new THREE.Mesh( geometry, material );
  gameover.rotation.x = -Math.PI/2;
  gameover.visible = false;

  scene.add( gameover );
  this.gameover.push( gameover );
  };


Gameover.prototype.enableGameover = function(pos){

  var screen = new THREE.ShaderPass( THREE.ColorifyShader );
  composer.insertPass( screen, 1 );

  for(var i = 0; i < this.gameover.length; i++){
    this.gameover[i].position.set( pos.x, pos.y, pos.z + 100*i);
    this.gameover[i].visible = true;
    }

  this.gameover[this.focus].scale.multiplyScalar(this.focusScale );

  this.ifEnable = true;
  this.frame = 0;
  };


Gameover.prototype.chageFocus = function(){
  if( this.ifEnable == false ) return;
  if(this.frame != 0){
    this.frame++;
    if(this.frame == 10) this.frame = 0;
    return;
    }
  else this.frame++;


  this.gameover[this.focus].scale.multiplyScalar( 1/this.focusScale );

  switch( this.focus ){
    case this.state["AGAIN"] : 
      this.focus = this.state["GIVEUP"];
      break;

    case this.state["GIVEUP"] :
      this.focus = this.state["AGAIN"];
      break;
    }

  this.gameover[this.focus].scale.multiplyScalar( this.focusScale );
  };


Gameover.prototype.decideAction = function(gameControlObj){
  switch( this.focus ){
    case this.state["AGAIN"] :
      gameControlObj.playerState = gameControlObj.state["PLAY"]; 
      gameControlObj.continue++;
      break;

    case this.state["GIVEUP"] :
      gameControlObj.playerState = gameControlObj.state["PREPLAY"]; 
      gameControl.gameFrame = 0;
      break;
    }
  };


Gameover.prototype.disableGameover = function(){
  for(var i = 0; i < this.gameover.length; i++){
    this.gameover[i].visible = false;
    }
  this.gameover[this.focus].scale.multiplyScalar( 1/this.focusScale );
  this.ifEnable = false;
  this.frame = 0;
  if(typeof composer !== "undefined") composer.passes.splice(1, 1);
  };


var gameover = new Gameover();
