class Ressource {

    constructor(x,y,size){

        //AUTOINCREMENT ID
        if(Ressource.id == undefined){
            Ressource.id = 1;
        }
        else{
            Ressource.id ++;
        }
        this.id = Ressource.id;
        this.type = 2;
        this.nbWorker = 0;
        this.posX  = x;
        this.posY  = y;
        this.size = size;
        this.sizeMax = 100;

        //TODO Material
    }


    addWorker(nbWorkers){
        this.nbWorker += nbWorkers;
    }

    removeWorker(){
        this.nbWorker -= 1;
    }

    tickRessource(){
        this.multiply();
        let nbRsc = this.consumeRessources();
        return nbRsc;
    }

    multiply(){
        let newSize = this.size * 1.2;
        this.size = Math.min(newSize, this.sizeMax);
    }

    consumeRessources(){
        let nbRsc = this.nbWorker*0.2;
        this.size -= nbRsc;
        return nbRsc;
    }


} module.exports = Ressource;