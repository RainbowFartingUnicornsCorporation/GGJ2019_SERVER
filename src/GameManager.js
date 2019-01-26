Player  = require('./Player');
Home  = require('./Home');
Ressource  = require('./Ressource');

const radius = 3;

class GameManager {

    constructor(debug){
        this.size = 100;
        this.tickPerSec = 10;
        this.ressources = [];
        this.players = {};
        this.home;
        this.loop = null;
        this.isTickStarted = false;
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
        this.isTickStarted = true;
    }

    /**
     * Stop the inifinit loop
     */
    stopTick(){
        clearInterval(this.loop);
        this.isTickStarted = false;
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
        if(! this.isTickStarted){
            this.startTick();
        }
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

    /**
     *
     * @param idResc
     * Make a new flow of workers on the ressource
     */
    activateFlux(){
        let nbWorkers = home.useReservePop();
        let player = this.players[ip]['player'];
        this.ressources.forEach((rsc)=> {
            if(     player.posX < rsc.x+radius && player.posX > rsc.x-radius
                &&  player.posY < rsc.y+radius && player.posY > rsc.y-radius){
                rsc.addWorker(nbWorkers);
            }
        });
    }

    /**
     *
     * @param id
     * Increase the flow to the ressource
     */
    motivateFlux(ip){
        let nbWorker = 0;
        let rscId = 0;
        let player = this.players[ip]['player'];
        this.ressources.forEach((rsc)=> {
            if(     player.posX < rsc.x+radius && player.posX > rsc.x-radius
                &&  player.posY < rsc.y+radius && player.posY > rsc.y-radius){
                rscId = rsc.id;
            }
        });
        this.ressources.forEach((rsc)=>{
            if(rsc.id != rscId){
                nbWorker += rsc.removeWorker();
            }
        });
        this.ressources.forEach((rsc)=>{
            if(rsc.id == rscId){
               rsc.addWorker(nbWorker);
            }
        });
    }

    /**
     *
     * @param ip
     * @returns {string} JSON
     * Return the game state
     */
    model(ip){
        let model = {};
        model.ressources = this.ressources;
        model.player = this.players[ip]["player"];
        model.home = this.home;
        return JSON.stringify(model);

    }

    /**
     * Execute one tick
     */
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

        if(isRessourceLoop) {

            //RESSOURCES
            this.ressources.forEach((ressource) => {
                ressource.tickRessource();
            });

            //HOME
            this.home.tickRessources();
            this.home.tickFood();

            //PLAYER
            for(let ip in this.players) {
                let player = this.players[ip]['player'];

                //NEAR HOME
                if(player.posX > radius && player.posX < radius && player.posY > radius && player.posY < radius){
                    this.dropRscHome(ip);
                    //TODO SEND EVENT !
                }

                //NEAR RESSOURCES ?
                this.ressources.forEach((rsc)=>{
                    if(     player.posX < rsc.x+radius && player.posX > rsc.x-radius
                        &&  player.posY < rsc.y+radius && player.posY > rsc.y-radius){
                        this.collectRsc(ip, rsc.id);
                        //TODO SEND EVENT !
                    }
                });

                if (!player.consumeFood(1)) {
                    console.log("DEAD");
                    this.stopTick();
                }
            }
        }

        //PLAYER
        for(let ip in this.players){
            let player = this.players[ip];
            player['ws'].send(this.model(ip));
        }

        //DEBUG
        if(this.debug) {
            if (isRessourceLoop) {
                console.log("RESSOURCE TICK !!!!");
                this.ressources.forEach((r)=>{
                    console.log(r.size);
                });
            }
        }
    }

}

module.exports = GameManager;