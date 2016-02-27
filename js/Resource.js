//**************************************************************//
//********************** Resource.js **************************//
//**************************************************************//
function Resource(trackFlag){
  this.__ifTracked = trackFlag;

  //*** objects which are tracked ***//
  this.vertice = 0;
  this.face = 0;
  };

//*********************************//
//**** load JSON and textures *****//
//*********************************//
Resource.prototype.getVerticeNum = function(name, vertices){
  //if(this.__ifTracked == "false") return;
  for(var i = 0; i < vertices.length; i++) this.vertice++;
  console.log("vertice of this model : " + this.vertice);
  };

Resource.prototype.getFaceNum = function(name, faces){
  //if(this.__ifTracked == "false") return;
  for(var i = 0; i < faces.length; i++) this.face++;
  console.log("face of this model : " + this.face);
  };

var resource = new Resource("true");
