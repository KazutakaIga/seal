/********************************************************************/
/************************** key.js **********************************/
/********************************************************************/

function Key(){
  //###
  //### キーコード定数
  //###
  this.keyCode = {
   KEY_DOWN   : 40,
   KEY_UP     : 38,
   KEY_LEFT   : 37,
   KEY_RIGHT  : 39,
   KEY_Z      : 90, 
   KEY_X      : 88,
   KEY_SHIFT  : 16,
   KEY_ENTER  : 13
   };

  //###
  //### ゲーム以外がクリックされた場合にはスクロールを有効にするフラグ
  //###
  var preventDefaultFlag = true;
  this.updatePreventDefaultFlag = function(flag){preventDefaultFlag = flag;};

  var _input_key_buffer = null;

  function KeyDownFunc (e){
    _input_key_buffer[e.keyCode] = true;
    if(preventDefaultFlag == true) e.preventDefault();
    }
  function KeyUpFunc (e){
    _input_key_buffer[e.keyCode] = false;
    if(preventDefaultFlag == true) e.preventDefault();
    }
  function BlurFunc (e){
    _input_key_buffer.length = 0;
    if(preventDefaultFlag == true) e.preventDefault();
    }

 this.isDown = function (key_code){
  if(_input_key_buffer[key_code]) return true;
   return false;
   };

  (function (){
    _input_key_buffer = new Array();
    if(window.addEventListener){
      document.addEventListener("keydown",KeyDownFunc);
      document.addEventListener("keyup",KeyUpFunc);
      window.addEventListener("blur",BlurFunc);
      }
    else if(window.attachEvent){
      document.attachEvent("onkeydown",KeyDownFunc);
      document.attachEvent("onkeyup",KeyUpFunc);
      window.attachEvent("onblur",BlurFunc);
      }
    })();
  }

//###
//### Key 用ベースオブジェクト定義
//###
var key = new Key();
