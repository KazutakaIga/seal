
//***********************************************************//
//************************ Item.js **************************//
//***********************************************************//
document.write("<script type='text/javascript' src='./js/Sound.js'></script>");

function Item(){
  //###
  //### item 用 mesh 管理配列
  //###
  this.itemMesh = new Array();

  //###
  //### item の種類保存用配列
  //###
  this.item = new Array();

  //###
  //### 当たり判定用 ray 管理配列
  //###
  this.ray = new Array();
  };


//===============================================//
// ### initItem ##                               //
// Item オブジェクトを初期化する関数             //
//===============================================//
Item.prototype.initItem = function(){
  for(var i = 0; i < this.item.length; i++){
    scene.remove( this.itemMesh[i] );
    }
  this.itemMesh = [];
  this.item = [];
  this.ray = [];
  };


//===============================================//
// ### dropItem ##                               //
// 倒した/倒れたときに Item を落とす処理         //
//===============================================//
Item.prototype.dropItem = function(targetItem, charaPosition){
  const ITEM_LENGTH = 23;

  var itemGeometry = new THREE.PlaneBufferGeometry(ITEM_LENGTH, ITEM_LENGTH, ITEM_LENGTH);
  var texPath = "./model/item/" + targetItem["name"] + ".jpg";
  var tex =  THREE.ImageUtils.loadTexture(texPath);
  var material = new THREE.MeshBasicMaterial( { map: tex } );

  for(var i = 0; i < targetItem["num"]; i++){
    var itemMesh = new THREE.Mesh(itemGeometry, material);
    var offset = Math.floor(Math.random()*100) - 50;
    itemMesh.position.x = charaPosition.x + offset;
    itemMesh.position.y = this.itemMesh.length;
    itemMesh.position.z = charaPosition.z + offset;
    itemMesh.rotation.x = -Math.PI/2;
    this.itemMesh.push(itemMesh);
    this.item.push(targetItem["name"]);

    //###
    //### 当たり判定用 RayCaster オブジェクト
    //###
    var ray = new THREE.Raycaster();
    ray.ray.direction.set(0, 0, 1);
    this.ray.push(ray);
    scene.add(itemMesh);
    }
  };


//===============================================//
// ### itemUpdate ##                             //
// Item Mesh の移動処理                          //
//===============================================//
Item.prototype.itemUpdate = function(playerObj, ifBomb){
  var itemLength = this.itemMesh.length;

  for(var i = 0; i < itemLength; i++){


    //###
    //### 衝突判定に必要な自機 mesh が定義されていない場合には
    //### item の位置だけ update して以下の処理をスキップ
    //###
    if(playerObj.chara == null){
      this.itemMesh[i].position.z++;
      continue;
      }

    //###
    //### ray Object が null なら終了
    //###
    if(this.ray[i] == null) return;

    //###
    //### ray の視点を現在の item 座標へ
    //###
    this.ray[i].ray.origin.copy(this.itemMesh[i].position);

    //###
    //### item => player に向かう ray を作成
    //###
    var newRayDirection = (new THREE.Vector3()).subVectors(playerObj.chara.position,
                                                           this.itemMesh[i].position);
    newRayDirection.normalize();
    this.ray[i].ray.direction.set(newRayDirection.x,
                                  newRayDirection.y,
                                  newRayDirection.z);

    //###
    //### ray 上にある障害物を計算
    //###
    if(playerObj.chara != null) var intersections = this.ray[i].intersectObjects([playerObj.chara]);

    //###
    //### item を自動で引き寄せる範囲を定義
    //### bomb 時は全画面が対象
    //###
    var itemGatherDist = 80;
    if(ifBomb == true) itemGatherDist = 1000;

    //###
    //### 障害物がなければ普通に座標 update のみ   
    //###
    if(intersections.length == 0) this.itemMesh[i].position.z++;
    else{
      //###
      //### 一定距離以下になると item を自機に引き寄せる処理
      //###
      if(intersections[0].distance < itemGatherDist){
        newRayDirection.multiplyScalar(10);
        this.itemMesh[i].position.add(newRayDirection);
        }
      //###
      //### 一定距離以下になると item 取得処理
      //###
      if(intersections[0].distance > 10) this.itemMesh[i].position.z++;
      else{
        itemSe.enableSound("item");
        playerObj.getItem( this.item[i] );
        scene.remove( this.itemMesh[i] );
        this.itemMesh.splice(i, 1);
        this.ray.splice(i, 1);
        itemLength--; 
        }
      }
    }
  };

var item = new Item();
