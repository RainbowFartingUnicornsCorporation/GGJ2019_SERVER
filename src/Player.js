// Player.js
// To import this file :
// var player  = require('./Player');

var Player = {

  // Attributes
  type :  0,
  name : "NotDefinedYet",
  posX : 0,
  posY : 0,
  food : 100,
  inventory : 0,
  maxFood : 100,
  maxInventory : 100,

  initialization(name,posX,posY){
    this.name = name;
    this.posX = posX;
    this.posY = posY;
  },

  getInfo() {
    console.log("GetInfo Called")
    return {
      type : this.type,
      name : this.name,
      posX : this.posX,
      posY : this.posY,
      food : this.food,
      inventory : this.inventory
    }
  },

  moveTo(x,y){
    this.posX = x;
    this.posY = y;
  },

  getRsc(){
    this.inventory += 5;
  },

  tryToDropRsc(){
    let nbRscDropped = 5

    if(this.inventory == 0)
      return false;
    this.inventory -= nbRscDropped;
    if(this.inventory <= 0){
      let left = -this.inventory;
      this.inventory = 0;
      return left;
    }
    return nbRscDropped;
  },

  addToMaxFood(foodToAdd){
    this.maxFood += foodToAdd;
  },

  addToMaxInventory(inventoryToAdd){
    this.maxFood += inventoryToAdd;
  },

  getFood(nbFood){
    this.food += nbFood;
  }

}

module.exports = Player;
