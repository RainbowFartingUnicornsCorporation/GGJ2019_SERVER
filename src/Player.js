// Player.js
// To import this file :
// var player  = require('./Player');

class Player {

  constructor(name, x, y){
    this.type = 0;
    this.name  = name;
    this.posX  = x;
    this.posY  = y;
    this.food  = 100;
    this.inventory  = 0;
    this.maxFood  = 100;
    this.maxInventory  = 100;
  }

  initialization(name,posX,posY){
    this.name = name;
    this.posX = posX;
    this.posY = posY;
  }

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
  }

  moveTo(x,y){
    this.posX = x;
    this.posY = y;
  }

  getRsc(){
    this.inventory += 5;
  }

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
  }

  addToMaxFood(foodToAdd){
    this.maxFood += foodToAdd;
  }

  addToMaxInventory(inventoryToAdd){
    this.maxFood += inventoryToAdd;
  }

  getFood(nbFood){
    this.food += nbFood;
  }

  consumeFood(nbFood){
    this.food -= nbFood;
  }

}

module.exports = Player;
