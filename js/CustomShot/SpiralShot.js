
//**************************************************************//
//******************** SpiralShot.js ***************************//
//**************************************************************//

function SpiralShot(radius,        //### 半径
                    radiusSpeed,   //### 半径増加速度
                    intervalAngle, //### shot の間隔
                    angleSpeed,    //### 角度増加間隔
                    shotIndex){    //### spiralShot の index
  this.radius = radius;
  this.radiusSpeed = radiusSpeed;
  this.intervalAngle = intervalAngle;
  this.angleSpeed = angleSpeed;
  this.shotIndex = shotIndex;

  this.count = 0;
  };

SpiralShot.prototype.getShotVector = function(index){
  var baseAngle = this.shotIndex*Math.PI*2/this.intervalAngle;

  var x = this.radiusSpeed*Math.cos(baseAngle + this.angleSpeed*this.count);
  var z = this.radiusSpeed*Math.sin(baseAngle + this.angleSpeed*this.count);
  var shotVector = new THREE.Vector3(x, 0, z);

  this.count++; 

  return shotVector;
  };
