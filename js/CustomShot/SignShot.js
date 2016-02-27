
//**************************************************************//
//********************** SignShot.js ***************************//
//**************************************************************//

function SignShot(vector,       //### 進行方向ベクトル
                  amplitude,    //### 振幅
                  intervalFrame,//### shot の間隔
                  angleSpeed,   //### 角度増加間隔
                  shotSpeed     //### 進行方向弾速補正
                  ){    
  this.vector = vector;
  this.amplitude = amplitude;
  this.intervalFrame = intervalFrame;
  this.angleSpeed = angleSpeed;
  this.shotSpeed = shotSpeed;

  this.count = 0;
  };

SignShot.prototype.getShotVector = function(index){

  var targetAmp = this.amplitude*Math.sin(this.angleSpeed*Math.PI*2*this.count);
  var angleFromXAxis = this.vector.angleTo(new THREE.Vector3(1, 0, 0));
  var x = this.vector.x*this.shotSpeed + targetAmp*Math.sin(angleFromXAxis);
  var z = this.vector.z*this.shotSpeed + targetAmp*Math.cos(angleFromXAxis);
  var shotVector = new THREE.Vector3(x, 0, z);

  this.count++;

  return shotVector;
  };
