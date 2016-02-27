
//**********************************************************//
//************************ Grid.js**************************//
//**********************************************************//
"<script type='text/javascript' src='./api/three.min.js'></script>"

function Grid(){
  this.gridMesh = new Array();
  };

Grid.prototype.createGrid = function(){
  var geometry = new THREE.PlaneBufferGeometry(1000,1);
  var material = new THREE.MeshBasicMaterial( { color: 0xff0000} );

  //###
  //### x 座標に対して add
  //###
  var gridX = Math.floor(RENDER_WIDTH/GRID_INTERVAL)
  for(var i = -gridX; i <= gridX; i++){
    if(i == 0) var material = new THREE.MeshBasicMaterial( { color: 0xffffff} );
    else var material = new THREE.MeshBasicMaterial( { color: 0xff0000} );
    var mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI/2;
    mesh.position.set(0, 1, GRID_INTERVAL*i);
    scene.add( mesh );
    this.gridMesh.push(mesh);
    }
 
  //###
  //### z 座標に対して add
  //###
  var geometry = new THREE.PlaneBufferGeometry(1,1000);
  var gridZ = Math.floor(RENDER_HEIGHT/GRID_INTERVAL);
  for(var i = -gridZ; i <= gridZ; i++){
    if(i == 0) var material = new THREE.MeshBasicMaterial( { color: 0xffffff} );
    else var material = new THREE.MeshBasicMaterial( { color: 0x0000ff} );
    var mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI/2;
    mesh.position.set(GRID_INTERVAL*i, 1, 0);
    scene.add( mesh );
    this.gridMesh.push(mesh);
    }
  };


Grid.prototype.enableGrid = function(){
  for(var i =0 ; i < this.gridMesh.length; i++){
    this.gridMesh[i].visible = true;
    }
  };

Grid.prototype.disableGrid = function(){
  for(var i =0 ; i < this.gridMesh.length; i++){
    this.gridMesh[i].visible = false;
    }
  };

var grid = new Grid();
