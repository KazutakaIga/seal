
//***********************************************************//
//************************ Sound.js**************************//
//***********************************************************//
function Sound(){

  //=================================//
  // ### createSound ###             //
  // sound 用 audio エレメントの作成 //
  //=================================//
  this.createSound = function(id, 
                              soundPath, 
                              autostart){
    var audio = document.createElement("audio");
    audio.src = soundPath;
    audio.preload = "auto";
    audio.setAttribute("id", id);
    if(autostart != false){
      audio.autoplay = "true";
      audio.loop = "true";
      }
    audio.consrols = "hidden";
    audio.volume = 0.2;
    document.getElementById("body").appendChild(audio);
    };

  //=================================//
  // ### enableSound ###             //
  // 対象の id の Sound を再生       //
  //=================================//
  this.enableSound = function(id){
    var se = document.getElementById(id);
    se.currentTime = 0;
    se.play();
    };


  //=================================//
  // ### disableSound ###            //
  // 対象の id の Sound を停止       //
  //=================================//
  this.stopSound = function(id){
    document.getElementById(id).pause();
    };
  };

