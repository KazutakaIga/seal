Name
===
Sealing (2D like 3D shooting game, which describe with THREE.js)
![img](https://user-images.githubusercontent.com/17387215/59800810-7bff2280-9322-11e9-9fa6-0a297a25b8da.jpg)

## Description/Feature
***
+ This is sample for webGL, THREE.js API
+ 2D like shooting game.
+ Base Model is MMD format(.pmx)
+ converted pmx to JSON by Blender(https://www.blender.org/)

<!-- 
## Screen Shot
***
![リンクテキスト](http://i.imgur.com/LFkUOlg.jpg "タイトル")
-->

## Installation
***
You only put these files in some directory under apache document root.  
Then access main.php

http://your apache server IP/some directory/main.php

## Files Outline(same name object described in each files)
***
```
+ main.php
  - js/Include.js                : Include other html files(not related game)
  - js/Const.js                  : which contains constant
  - js/GameControl.js            : which contains game main loop( GameControl.incrementGameFrame )
  - js/Shot.js                   : for shots which are generated by enemy and player
  - js/CustomShot/SingShot.js    : for sign special shot
  - js/CustomShot/SpiralShot.js  : for spriral special shot
  - js/BackGround.js             : background sphere and rotate infinitely
  - js/Key.js                    : key input control
  - js/ModelContainer            : Container for json 3D model(which created from blender)
  - js/Item.js                   : item which will be dropped by enemy
  - js/Bomb.js                   : player bomb 
  - js/Gameover.js               : control gameover effect and state
  - js/Collision.js              : Collision between enemy,player,shot and item 
  - js/Sound.js                  : container sound effect in game
```

## Code Structure
***
All game information is described in json files under "js/settings/".  
JS code only parse this json file in GameControl.incrementGameFrame,  
so you can change enemy info and enemy shot info by setting temp.json.  

## About Game Setting JSON 
***
This file describes enemy information when and where enemy appear, when start to move,  
when start to shot, what kind of shot. Please refer "js/setting/temp.json"


### Basic Information Section  
```
            "enemyID": 1,        // enemyID. Currently only 1 type enemy, so please insert 1.  
            "enemyName": "NaN",  // "NaN", not use this name in code 
            "enableFrame": 10,   // frame enemy will appear  
            "hp": 3,             // enemy HP  
            "powerItem": 2,      // number of power item which enemy will drop  
            "scoreItem": 2,      // number of power score which enemy will drop  
            "bombItem": 0,       // number of power bomb which enemy will drop  
            "initPos": [         // enemy init position 
                {
                    "x": 160,
                    "y": 0,      // this game will be handled onlt X-Z axis, keep 0 value in Y-axis
                    "z": 370
                }
            ]
```

### Move Information Section 
```
            "move": [
                {
                    "frame": 60,       // Frame staring to move
                    "type": "null",    // null only straight forward move 
                    "dest": [          // destination
                        {
                            "x": 45,
                            "y": 0,    // this game will be handled onlt X-Z axis, keep 0 value in Y-axis
                            "z": 56
                        }
                    ],
                    "speed": 10        // move speed
                }
            ]
```

### Shot Information Section  
##### normal shot
```
			"shot": [
                {
                    "frame": 200,     // Frame stating to shot
                    "type": null,     // normal shot, go straight to destination
                    "dest": [         // destination cordinate
                        {
                            "x": 0, 
                            "y": 0,   // this game will be handled onlt X-Z axis, keep 0 value in Y-axis
                            "z": 5
                        }
                    ],
                    "interval": 30,   // shot interval. 
                    "shotNum": 10,    // overall shot num
                    "speed": 5        // shot speed
                }
		     ]
```  

##### tracking shot
```
            "shot": [
                {
                    "frame": 200,       // Frame stating to shot
                    "type": "tracking", // tracking shot, destination will be decieded where player is
                    "interval": 30,     // shot interval
                    "shotNum": 20,      // overall shot num
                    "speed": 5          // shot speed
                }
		     ]
```  

##### spiral shot
```
            "shot": [
                {
                    "frame": 200,           // Frame stating to shot
                    "type": "spiral",       // spiral shot
                    "r": 30,                // initial radius
                    "rSpeed": 3,            // radius increase speed
                    "intervalAngle": 0.52,  // interval angle between each spiral shot
                    "angleSpeed": 0.00314,  // angle incerease speed
                    "interval": 25,         // shot interval
                    "shotNum": 30,          // overall shot num
                    "speed": 30             // shot speed
                }
			]
```  

##### random shot
```
            "shot": [
                {
                    "frame": 200,          // Frame starting to shot
                    "type": "random",      // random shot
                    "randomXMin": -500,    // X minimun range
                    "randomXMax": 500,     // X max range
                    "randomZMin": -500,    // Z minimun range
                    "randomZMax": 500,     // Z max range
                    "interval": 60,        // shot interval
                    "randomShotNum": 25,   // shot num at 1 set
                    "shotNum": 20          // over all random shot num
                }
			]
```  

##### sign shot
```
            "shot": [
                {
                    "frame": 200,          // Framne starting to shot 
                    "type": "sign",        // sign shot
                    "dest": [              // destination, this vestor do not influence shot speed
                        {
                            "x": 0,
                            "y": 0,
                            "z": 5
                        }
                    ],
                    "amplitude": 5,        // amplitude of sign wave
                    "interval": 50,        // shot interval
                    "angleSpeed": 0.005,   // deciding wave shape
                    "shotNum": 60,         // overall shot num
                    "speed": 0.3           // shot speed
                }
            ]
```		 


