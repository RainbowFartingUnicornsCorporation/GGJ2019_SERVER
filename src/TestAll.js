function RunTest(){

// Test Player
  var player  = require('./Player');
  player.initialization("Maxipanda",1,4);
  player.moveTo(5,6);
  player.getRsc();
  player.tryToDropRsc();
  player.addToMaxFood(20);
  player.addToMaxInventory(20);
  player.getFood(10);
  console.log(player.getInfo());


// Test Home
  var home = require('./Home');
  var homeworld1 = new home();
  homeworld1.incomingRsc(100);
  homeworld1.tickRessources();
  homeworld1.tickRessources();
  homeworld1.tickRessources();
  homeworld1.tickRessources();
  homeworld1.tickRessources();
  homeworld1.tickRessources();
  homeworld1.tickFood();
  homeworld1.useReservePop();
  homeworld1.addReservePop(10);
  console.log(homeworld1.getInfo())



}

module.exports = RunTest;
