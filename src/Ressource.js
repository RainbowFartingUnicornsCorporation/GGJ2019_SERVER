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
        if(this.nbWorker > 0) {
            this.nbWorker -= 1;
            return 1;
        } else {
            return 0;
        }
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
        let newSize = this.size - this.nbWorker*0.2;
        if(newSize < 0){
            let nbRsc = this.size;
            this.size = 0;
            return nbRsc;
        } else {
            this.size = newSize;
            return this.nbWorker*0.2;
        }
    }


} module.exports = Ressource;