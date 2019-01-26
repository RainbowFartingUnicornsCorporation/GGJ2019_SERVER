Player  = require('./Player');
Home  = require('./Home');

class GameManager {

    constructor(){
        this.size = 100;
        this.tickTime = 25; //milliseconds
        this.ressources = [];
        this.players = [];
        this.ressources = [];
        this.home = new Home();
        this.loop = null;
    }

    /**
     * Start the infinit loop
     */
    startTick(){
        this.loop = setInterval(() => {
            this.tickEvent();
        }, this.tickTime);
    }

    /**
     * Stop the inifinit loop
     */
    stopTick(){
        clearInterval(this.loop);
    }

    /**
     *
     * @param ip
     * @param name
     * @param client
     * Create a new player and store it in player.
     * Use the IP as key
     */
    createPlayer(ip, name, client){
        this.players[ip] = [];
        this.players[ip]['player'] = new Player(name, 1, 4);
        this.players[ip]['ws'] = client;
    }

    /**
     *
     * @param ip
     * @param x
     * @param y
     * Move the player to a new position
     */
    movePlayer(ip, x, y){
        this.players[ip]['player'].moveTo(x,y); //TODO Check if it's a legal position
    }

    /**
     *
     * @param ip
     * @param idRsc
     * Get some ressources from a source and gave it to the player
     */
    collectRsc(ip, idRsc){
        this.ressources[idRsc].takeRsc();
        this.players[ip]['player'].getRsc();
    }

    /**
     *
     * @param ip
     * Get some ressource from the player to put it in the home
     */
    dropRscHome(ip){
        let nbRsc = this.players[ip]['player'].tryToDropRsc();
        if(nbRsc){
            this.home.incomingRsc(nbRsc);
        } else {
            this.players[ip]['ws'].send(false);
        }
    }

    /**
     *
     * @param ip
     * Get five food and give it to the player
     */
    getRscHome(ip){
        let nbFood = this.home.takeFood();
        if(nbFood > 0) {
            this.players[ip]['player'].getFood();
        } else {
            this.players[ip]['ws'].send(false);
        }
    }

    tickEvent(){
        //RESSOURCES


        //HOME
        this.home.tickRessources();
        this.home.tickFood();

        //PLAYER
        this.players.forEach((player)=>{
            player['player'].consumeFood(1);
        });
    }

    activateFlux(){
        //TODO don't know how it will be
    }

    motivateFlux(){
        //TODO  don't know how it will be
    }

}

module.exports = GameManager;