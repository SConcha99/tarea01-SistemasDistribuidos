const express = require('express');
const cors = require("cors");
const axios = require("axios");
const https = require('https')
const redis = require('redis');
const result = require("dotenv").config();

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

const app = express();


const port=3000;

//FUNCION QUE HACE EL LLAMADO AL SERVIDOR

//-------------
app.get("/reset", async (req, res) => {
  await client.flushAll();
  res.send("Cache eliminado :(");
});

app.get("/keys", async (req, res) => {
  try {
      console.log("mostrando todas las llaves con su contenido")
      var all_keys = await client.keys(`*`);
      var response = await Promise.all(all_keys.map(async key => {
          let new_item = {}
          let temp = await client.get(key)
          new_item[key] = JSON.parse(temp)
          return new_item
      }))
      res.json(response);
  } catch (error) {
      console.error("Error: ", error)
      return res.status(500).json(error)
  }

});

app.get('/inventory/search', async (req, res) => {
  const item = req.query.q;
  var keys = await client.keys(`*${item}*`);
  try {
      if (keys.length == 0 ) {
        //si no esta en el cache
        let peticion = await axios.get(`http://${process.env.rpc_host}:3001/items`, { params: { name: item }, headers: {
            'Content-Type': 'application/json',
        }});
        if(peticion.status == 200){
            console.log("Salio bien")
        }
        console.log("No estoy en el cache pero voy a guardarlo")
        let data = peticion.data
        let guardado = JSON.stringify(data);
        await client.set(item, guardado)
        console.log("guardado")
        console.log(await client.get(item))
        return res.json(data);
      }else{
        
        //SI SE ENCUENTRA EN EL CACHE
        console.log("Estoy en el cache")
        let data= await client.get(item)
        return res.json(JSON.parse(data));

      }
  } catch (error) {
      console.error("Error: ", error)
      return res.status(500).json(error)
  }
  
});

app.listen(port, ()=>{
    console.log(`Express listening at http://localhost:${port}`)
})

app.get("/", function (req,res){
    res.send('https://www.youtube.com/watch?v=2WPCLda_erI')
});