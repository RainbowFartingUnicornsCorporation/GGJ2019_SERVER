// Home.js

class Home {

  constructor(){
    this.type = 1;
    this.food = 100;
    this.ressources = 0;
    this.population = 0;
    this.foodGoal = 150;
    this.reservePop = 0;
  }

  tickFood(){
    this.food -= Math.ceil(this.population/5);
    if(this.food <= 0){
      console.log("THE NATION FAILED US ! WORKERS ARE DYING")
      //TODO Make some worker die. Yeah. I know.
      this.food = 0;
    }
  }

  incomingRsc(nbRsc){
    this.ressources += nbRsc;
  }

  tickRessources(){
    let nbRessourcesConverted = 10;
    if(this.ressources > 0){
      if(this.ressources < 10){
        this.food += this.ressources;
        this.ressources = 0;
      }
      this.ressources -= 10;
      this.food += 10;

      // Create worker ?
      if(this.food > this.foodGoal){
        this.food -= 50;  // use 50 food to create a worker
        this.foodGoal += 50; // next goal is 50 food higher
        this.reservePop++;
      }
    }
  }


  addReservePop(nbWorker){
    this.reservePop += nbWorker;
  }

  // Use the reserve population, and return the number of workers
  useReservePop(){
    let reserve = this.reservePop;
    this.reservePop = 0;
    return reserve;
  }

  getInfo(){
    return {
      type : this.type,
      food : this.food,
      ressources : this.ressources,
      population : this.population,
      foodGoal : this.foodGoal,
      reservePop : this.reservePop
    }
  }

};

module.exports = Home;