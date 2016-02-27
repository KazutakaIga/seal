
//**********************************************************//
//************************ Marker.js**************************//
//**********************************************************//
"<script type='text/javascript' src='./api/three.min.js'></script>"

function Marker(){
  this.markerMesh = null;
  };

Marker.prototype.createMarker = function(){
  var geometry = new THREE.BoxGeometry(80,80,80);
  var material = new THREE.MeshBasicMaterial( { wireframe : true } );

  this.markerMesh = new THREE.Mesh(geometry, material);
  scene.add( this.markerMesh );
  };


Marker.prototype.enableMarkerMesh = function(targetPos){
  if(this.markerMesh == null) this.createMarker();
  this.markerMesh.position.set(targetPos.x, targetPos.y, targetPos.z);
  this.markerMesh.visible = true;
  };

Marker.prototype.disableMarkerMesh = function(targetPos){
  this.markerMesh.visible = false;
  };

var marker = new Marker();
