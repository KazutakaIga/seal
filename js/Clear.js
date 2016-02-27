
//***********************************************************//
//************************** Clear.js ***********************//
//***********************************************************//
"<script type='text/javascript' src='./api/three.min.js'></script>"

function Clear(){
  this.ifEnable = false;
  };

Clear.prototype.enableClear = function(datapath){
  if(this.ifEnable == true) return;
  this.ifEnable = true;

  if(typeof composer !== "undefined"){
    var screen = new THREE.ShaderPass( THREE.HorizontalBlurShader );
    composer.insertPass( screen, 1 );
   }
  $.post("./php/updateClearCount.php",
         { datapath : datapath },
         function(data){ console.log(data);});
  };

var clear = new Clear();
