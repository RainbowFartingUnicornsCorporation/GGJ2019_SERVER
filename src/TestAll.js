GameManager = require('./GameManager');
Ressource = require('./Ressource');



let ressource = new Ressource(4,4,10);
ressource.addWorker(11);
let arr = [ressource];
let gameManager = new GameManager(arr, true);
gameManager.startTick();


