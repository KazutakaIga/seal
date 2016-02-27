
//***********************************************************//
//************************ EnemyShot.js *********************//
//***********************************************************//
document.write("<script type='text/javascript' src='./js/Shot.js'></script>");

//###
//### wrapper of Shot Object for enemy
//###

function EnemyShot(mode,
                   shotNum){
  //###
  //### shot の MODE と shot の数
  //###
  this.mode = mode;

  //###
  //### shot の frame 間隔
  //###
  this.shotDuration = 5;

  //###
  //### shot の end frame 
  //###
  this.endFrame = 100;

  //###
  //### 全ての Shot が生成済みか否か
  //###
  this.ifShotCreateFinish = false;

  //###
  //### 各 shot の間隔計算用 frame
  //###
  this.frame = 0;

  //###
  //### 予備パラメータ
  //###
  this.param1 = 0;
  this.param2 = 0;
  this.param3 = 0;
  };

EnemyShot.prototype = new Shot;

//==============================================//
// ### spiralShot ###                           //
// キャラを中心に螺旋上に広がる template shot   //
//==============================================//
EnemyShot.prototype.spiralShot = function(characterPos,
                                          intervalAngle,
                                          intervalFrame,
                                          endFrame){
  if(this.frame % intervalFrame == 0){
    var shotNum = Math.floor(Math.PI*2/intervalAngle);

    for(var i = 0; i < shotNum; i++){
      
      }
    }
  };

