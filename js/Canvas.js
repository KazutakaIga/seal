
//**********************************************************//
//************************ Canvas.js ***********************//
//**********************************************************//

function Canvas(){
  this.canvas = {};
  };

Canvas.prototype.initCanvas = function(){
  for(var i = 0; i < $("canvas").length; i++){
    this.canvas[$("canvas").eq(i).attr("id")] = $("canvas")[i].getContext('2d');
    }
  };

Canvas.prototype.drawRect = function(){
  for(var key in this.canvas){
    this.canvas[key].rect(0, 0, 295, 100); 
    this.canvas[key].stroke();
    }
  };

Canvas.prototype.replacePoperty = function(targetID, left, top, width, height){
  $("#" + targetID).remove();
  $("#edit").append($("<canvas id'" + targetID + "'"));
  };

var canvas = new Canvas();
canvas.initCanvas();
canvas.drawRect();
