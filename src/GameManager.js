Player  = require('./Player');
Home  = require('./Home');
Ressource  = require('./Ressource');

const radius = 20;
const radiusHome = 12;

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

        let oldPos = {posX:0, posY:0};
        let dist = 0;
        let distHome = 0;
        for(let i=0; i<nbRessource; i++){
            let pos = {};
            do {
                pos = {
                    posX: Math.floor(Math.random() * Math.floor(400)-200),
                    posY: Math.floor(Math.random() * Math.floor(400)-200)
                };
                dist = this.computeDistance(oldPos, pos);
                distHome = this.computeDistance(this.home, pos);

            } while((dist < 75 || dist > 200) && (distHome < 75 || distHome > 200));
            console.log('NEW RSC : ' + pos.posX + ', ' + pos.posY);
            this.ressources.push(new Ressource(pos.posX,pos.posY,Math.random()*(65-45)+45));
        }
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
    collectRsc(ip, index){
        let player = this.players[ip]['player'];
        let rest = player.maxInventory-player.inventory;
        rest = Math.min(rest, 10);
        if(rest > 0) {
            let nbRsc = this.ressources[index].takeRessource(rest);
            this.players[ip]['player'].getRsc(nbRsc);
        }
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
            //this.players[ip]['ws'].send(false);
        }
    }

    /**
     *
     * @param ip
     * Get five food and give it to the player
     */
    getRscHome(ip){
        let step = 5;
        let player = this.players[ip]['player'];

        step = Math.min(player.maxFood-player.food,step);

        let nbFood = this.home.takeFood(step);
        if (nbFood > 0) {
            player.getFood(nbFood);
        } else {
            //this.players[ip]['ws'].send(false);
        }
    }

    /**
     *
     * @param idResc
     * Make a new flow of workers on the ressource
     */
    activateFlux(ip){
        let player = this.players[ip]['player'];
        this.ressources.forEach((rsc)=> {
            if(this.computeDistance(player, rsc) <= radius){

                let nbWorkers = this.home.useReservePop();

                if(rsc.nbWorker == 0) {
                    rsc.addWorker(nbWorkers);
                } else {
                    this.motivateFlux(rsc.id, nbWorkers);
                }
            }
        });
    }

    /**
     *
     * @param id
     * Increase the flow to the ressource
     */
    motivateFlux(rscId, nbWorker){
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

        let players = [];
        for (let i in this.players){
             if(i != ip){
                 players.push({posX:this.players[i]["player"].posX, posY:this.players[i]["player"].posY, name: this.players[i]["player"].name});
             }
        }
        model.otherPlayers = players;
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
                this.home.incomingRsc(ressource.tickRessource());
            });

            //HOME
            this.home.tickRessources();
            this.home.tickFood();

            //PLAYER
            for(let ip in this.players) {
                let player = this.players[ip]['player'];

                //NEAR HOME
                if(this.computeDistance(player, this.home) <= radiusHome){
                    this.dropRscHome(ip);
                    //TODO SEND EVENT !
                }

                //NEAR RESSOURCES ?
                this.ressources.forEach((rsc,index)=>{

                    if(this.computeDistance(player, rsc) <= radius){
                        this.collectRsc(ip, index);
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
            if(player['ws'].readyState === player['ws'].OPEN) {
                player['ws'].send(this.model(ip));
            } else {
                console.log("/!\\ CONNECTION CLOSED")
            }
        }

        //DEBUG
        if(this.debug) {
            if (isRessourceLoop) {
                console.log("RESSOURCE TICK !!!!");
                this.ressources.forEach((r)=>{
                    //console.log(r.size);
                });
            }
        }
    }


    computeDistance(vec1,vec2){
        let tmp1 = (vec1.posX - vec2.posX) * (vec1.posX - vec2.posX);
        let tmp2 = (vec1.posY - vec2.posY) * (vec1.posY - vec2.posY);
        return Math.sqrt(tmp1 + tmp2);
    }
}

module.exports = GameManager;
