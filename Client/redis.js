const express = require("express");
const redis = require('redis');

const app = express();
const client = redis.createClient({
    url: 'redis://@redis-server:6379'
});

console.log("Esperando a redis para iniciar");

client.on("error", function (error) {
    console.error(error);
});
  
client.on('connect', () => {
    console.log('Cliente Redis, conectado');
});

client.connect();

// Borra todo el cache de redis
app.get("/reset", async (req, res) => {
    await client.flushAll();
    res.send("Cache eliminado");
});

// Obtiene todas las keys de redis
app.get("/keys", async (req, res) => {
    keys = await client.keys('*');
    res.send(keys);
});

// Obtiene los valores asociados a una llave 
// Ej.
// http://localhost:3000/key?key=llave
app.get("/key", async (req, res) => {
    console.log("Searching for: " + req.query.key);
    const key = req.query.key;
    keys = await client.keys(`*${key}*`);
    if (keys.length == 0) {
        console.log("No encontrado en cache");
        res.send("No encontrado en cache");
    }
    else{
        console.log("Encontrado en cache");
        
        console.log(keys);
        
        response = await client.get(key);

        console.log(response); 

        res.send({ value : response });
    
    }
});

// Ingresa un valor asociado a una llave
// Ej.
// http://localhost:3000/set?key=llave&value=valor
app.get("/set", async (req, res) => {
    let key = req.query.key;
    let value = req.query.value;

    client.set(key , value, function(err, reply) {
        console.log(reply);
        
    });
    res.send({ 
        key: key,
        value: value
    });
});

// Da poderes de superprogramador 100% real no-fake
app.get('/', function(req, res){
    res.send("Escuchar esto mientras se evalua el trabajo: https://www.youtube.com/watch?v=2WPCLda_erI");
});
 
// Funcion principal de la tarea
app.get("/inventory/search", async (req, res) => {
    console.log("Buscando el termino:" + req.query.q);
    const key = req.query.q;

    keys = await client.keys(`*${key}*`);
    
    if (keys.length == 0) {
        console.log("No encontrado en cache");
        // Realizar llamado grpc
        console.log("Realizando llamado grpc");
            // If true
                // Traer datos
                
                //// value = {set de datos}

                // Guardar datos en cache

                ////client.set(key , value, function(err, reply) {
                ////    console.log(reply);   
                ////});

                console.log("Guardado en cache {key: value}");

                // Mostrar datos en pantalla
                // res.send({ "search_results": value });

            
            // else 
                // res.send("Termino no encontrado en el inventario"); 

    }
    else{
        console.log("Encontrado en cache");
        
        console.log(keys);
        
        value = await client.get(key);

        console.log(value); 

        res.send({ "search_results": value });
    
    }
});

app.listen(3000, '0.0.0.0', () => {
    console.log(`SERVER RUN AT http://localhost:${3000}`);
});

