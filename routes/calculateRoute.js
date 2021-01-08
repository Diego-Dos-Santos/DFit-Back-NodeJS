const router = require("express").Router();
const clients = require("../data/clients");

let listTrainerAndClient = []; // LISTA FINAL
let valueTrainer = undefined; // ENTRENADOR CON MAYOR VALOR
let valueClient = undefined; // CLIENTE CON MAYOR VALOR

// 2 - Creamos dos funciones haciendo el map en los entrenadores y los clientes

function mapTrainer(trainers) {
  //TRAINER
  trainers.map((trainer) => {
    if (valueTrainer == undefined) {
      valueTrainer = trainer;
    } else {
      if (valueTrainer.rep < trainer.rep) { // Se queda el entrenador con mayor valoración
        valueTrainer = trainer;
      }
    }
  });
}

function mapClient(client) {
  //CLIENT
  for (user in client) {
    if (valueClient == undefined) {
      valueClient = [user, client[user]]; // Recojo el valor del nombre de cada cliente y la valoración que pide en un array, Convertimos en un Array
    } else {
      if (valueClient[1] < client[user]) { // Se queda el cliente con mayor valoración
        valueClient = [user, client[user]];
      }
    }
  }
}

// 3 - Cruzamos los datos y organizamos los valores

function relacionClienteEntrenador(body) {
  const { trainers, client } = body; // Estraigo los elementos
  if (valueTrainer == undefined) {
    mapTrainer(trainers); // Selecciona el entrenador con mayor reputación
  }
  mapClient(client); // Selecciona el cliente con mayor reputación

  if (valueTrainer.client == undefined) {
    // Verifico que existe el cliente
    valueTrainer.client = []; // si no existe lo creo
  }
  valueTrainer.client.push(valueClient); // Hago un push a ese Array

  if (valueTrainer.disp != valueTrainer.client.length) { // Verifico que la cantidad de clientes de los entrenadores sea menor y diferente a la cantidad de clientes asignada

    delete client[valueClient[0]]; // Borro el cliente de mi objeto inicial
    const newObj = { trainers, client }; // Creo un nuevo objeto de clientes y entrenadores
    valueClient = undefined; // Hago un reset para poder hacer un Map más adelante
    relacionClienteEntrenador(newObj); // llama nuevamente la función con nuevos datos (quitando el cliente anterior)
  } else {
    const index = trainers.indexOf(valueTrainer); // Busco el indice del entrenador
    trainers.splice(index, 1); // Elimino el entrenador del Array
    delete client[valueClient[0]]; // Elimino el cliente
    const newObj = { trainers, client }; // Creo un nuevo objeto
    listTrainerAndClient.push(valueTrainer); // Hago un push a la variable global que vamos a retornar
    valueTrainer = undefined; // Asigna el valor inicial al entrenador
    valueClient = undefined; // Asigna el valor inicial al cliente

    if (trainers.length > 0) {
      relacionClienteEntrenador(newObj); // Si los entrenadores son mayor que cero, se ejecuta la misma funcion para seguir proceso
    }
  }

  if (trainers.length == 0) {  // Cuando la longitud de los entrenadores llegan a cero
    return listTrainerAndClient; // Retorno la lista final de entrenadores y clientes
  }
}

router.post("/", (req, res) => {
  const list = relacionClienteEntrenador(req.body); // 1 - Sacar la relación entre entrenadores y clientes
  res.status(200).json(list);
  listTrainerAndClient = [];
});

module.exports = router;
