Player  = require('./Player');
Home  = require('./Home');
Ressource  = require('./Ressource');

class GameManager {

    constructor(debug){
        this.size = 100;
        this.tickPerSec = 30;
        this.ressources = [];
        this.players = [];
        this.home;
        this.loop = null;
        this.debug=debug;
    }

    generate(nbRessource){
        this.home = new Home();
        /*for(let i=0; i<nbRessource; i++){

        }*/
        this.ressources.push(new Ressource(10,8,15));
    }

    /**
     * Start the infinit loop
     */
    startTick(){
        this.loop = setInterval(() => {
            this.tickEvent();
        }, 1000/this.tickPerSec);
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

        this.players[ip]['ws'].send(this.model(ip));
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
        let isRessourceLoop = false;
        if( GameManager.tickCount == undefined){
            GameManager.tickCount = 0;
        } else {
            GameManager.tickCount +=1;
            if ( GameManager.tickCount > this.tickPerSec){
                GameManager.tickCount = 0;
                isRessourceLoop = true;
            }
        }

        //RESSOURCES
        if(isRessourceLoop) {
            this.ressources.forEach((ressource) => {
                ressource.tickRessource();
            });
        }

        //HOME
        if(isRessourceLoop) {
            this.home.tickRessources();
            this.home.tickFood();
        }

        //PLAYER
        this.players.forEach((player)=>{
            player['player'].consumeFood(1);
        });

        //DEBUG
        if(this.debug) {

            //SEND POSITION OF ALL PLAYERS/ENTITY ?
            this.players.forEach((p)=>{
                p['ws'].send("LE CACA");
            });

            if (isRessourceLoop) {
                console.log("RESSOURCE TICK !!!!");
                this.ressources.forEach((r)=>{
                    console.log(r.size);
                });
            }
        }
    }

    activateFlux(){
        //TODO don't know how it will be

    }

    motivateFlux(id){
        let nbWorker = 0;
        this.ressources.forEach((rsc)=>{
            if(rsc.id != id){
                nbWorker += rsc.removeWorker();
            }
        });
        this.ressources.forEach((rsc)=>{
            if(rsc.id == id){
               rsc.addWorker(nbWorker);
            }
        });
    }

    model(ip){
        let model = {};
        model.ressources = this.ressources;
        model.player = this.players[ip]["player"];
        model.home = this.home;
        return JSON.stringify(model);

    }

}

module.exports = GameManager;