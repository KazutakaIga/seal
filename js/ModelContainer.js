
//***********************************************************//
//***************** ModelContainer.js ***********************//
//***********************************************************//
function ModelContainer(){
  this.modelData = new Array();
  this.loadFinish = false;

  var targetJSON = [
                    PLAYER_MESH_URL,
                    ENEMY1_MESH_URL
                    ];
  var loadedCount = 0;

  this.load = function(func){
    var loader = new THREE.JSONLoader(true);
    loader.load(targetJSON[loadedCount], callBack.bind(this, func));
    };

  var callBack = (function(func, geometry, material){
    var data = {url      : targetJSON[loadedCount],
                geometry : geometry,
                material : material};
    this.modelData.push(data);
    loadedCount++;
    if(loadedCount != targetJSON.length){
      this.load();
      }
    else{
      this.loadFinish = true;
      func; 
      }
    }).bind(this);
  };

ModelContainer.prototype.serachModelUrl = function(url){
  for(var i = 0; i < this.modelData.length; i++){
    if(this.modelData[i]["url"] == url) return this.modelData[i];
    }
  return false;
  };



var modelContainer = new ModelContainer();
