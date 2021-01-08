const router = require('express').Router();
const clients = require('../data/clients');

let listTrainerAndClient = []; // LISTA FINAL
let valueTrainer = undefined; // ENTRENADOR CON MAYOR VALOR
let valueClient = undefined; // CLIENTE CON MAYOR VALOR


function mapTrainer(trainers){
   //TRAINER
   trainers.map( trainer => {
    if(valueTrainer == undefined){
      valueTrainer = trainer;

    }else{
      if(valueTrainer.rep < trainer.rep){
        valueTrainer = trainer;
      }
    }

  });
}

function mapClient(client){
   //CLIENT
  for(user in client){
    if(valueClient == undefined){
      valueClient = [user,client[user]]; // RECOJO EL VALOR DEL NOMBRE DE CADA CLIENTE Y LA VALORACIÓN QUE PIDE EN UN ARRAY - CONVERTIMOS EN UN ARRAY 

    }else{

      if(valueClient[1] < client[user]){ // SE QUEDA  CON EL CLIENTE DE MAYOR VALORACIÓN 
        valueClient = [user, client[user]]
      }
    }
  }
}


function relacionClienteEntrenador(body){
  
  const {trainers, client} = body; // ESTRAIGO AMBOS ELEMENTOS
  if(valueTrainer == undefined){
    mapTrainer(trainers); // SELECCIONA EL ENTRENADOR CON MAYOR REPUTACIÓN
  }
  mapClient(client); // SELECCIONA EL CLIENTE QUE EXIGE MAYOR VALORACIÓN 

  if(valueTrainer.client == undefined){ //VERIFICO QUE EXISTE EL CLIENTE
    valueTrainer.client = []; // SI NO EXISTE LO CREO N
  }
  valueTrainer.client.push(valueClient); // HACE UN PUSH DEL CLIENTE A ESE ARRAY 

  if(valueTrainer.disp != valueTrainer.client.length) { // VERIFICO QUE LA CANTIDAD DE CLIENTES DE ENTRENADOR SEA MENOR Y DIFERENTE A LA CANTIDAD DE CLIENTES ASIGNADAS 
      
      delete client[valueClient[0]]; // BORRO EL CLIENTE DE MI OBJETO INICIAL 
      const newObj = { trainers, client}; // CREO UN NUEVO OBJETO CON CLIENTES Y ENTRENADORES 
      valueClient = undefined; // RESETEO NUEVAMENTE PARA PODER MAPEAR MAS ADELANTE 
      relacionClienteEntrenador(newObj); // LLAMA NUEVAMENTE LA FUNCIÓN CON NUEVOS DATOS (QUITANDO EL CLIENTE ANTERIOR)
      

  }else{

    const index = trainers.indexOf(valueTrainer); // BUSCO EL INDICE DEL ENTRENADOR 
    trainers.splice(index, 1); // ELIMINO EL ENTRENADOR DEL ARRAY 
    delete client[valueClient[0]]; // ELIMINO EL CLIENTE
    const newObj = {trainers, client}; // CREO UN NUEVO OBJETO 
    listTrainerAndClient.push(valueTrainer); //HAGO UN PUSH A LA VARIABLE GLOBAL DE LA LISTA QUE VAMOS A RETORNAR 
    valueTrainer = undefined; // ASIGNA EL VALOR INICIAL AL ENTRENADOR 
    valueClient = undefined; // ASIGNA EL VALOR INICIAL AL CLIENTE

    if(trainers.length > 0){
      relacionClienteEntrenador(newObj); // SE LOS ENTRENADORES SON MAYORES QUE CERO, SE EJECUTA LA MISMA FUNCIÓN PARA SEGUIR EL PROCESO
    }

  }

  if(trainers.length == 0){ // CUANDO LA LOGITUD DE LOS ENTRENADORES LLEGAN A CERO 
    return listTrainerAndClient // RETORNO LA LISTA FINAL DE ENTRENADORES Y CLIENTES 
  }
  
}


router.post('/', (req, res) => {
  const list = relacionClienteEntrenador(req.body); // 1 - Sacar la relación entre entrenadores y clientes
  res.status(200).json(list);
  listTrainerAndClient = [];
});

module.exports = router;