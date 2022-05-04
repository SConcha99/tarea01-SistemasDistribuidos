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
  res.send("Cache eliminado");
});

app.get("/keys", async (req, res) => {
  try {
      console.log("hola 1")
      var all_keys = await client.keys(`*`);
      var response = await Promise.all(all_keys.map(async key => {
          let new_item = {}
          let temp = await client.get(key)
          new_item[key] = JSON.parse(temp)
          return new_item
      }))
      console.log("hola 2", response)
      res.json(response);
      console.log("hola 3")
  } catch (error) {
      console.error("Error: ", error)
      return res.status(500).json(error)
  }

});

app.get('/inventory/search', async (req, res) => {
  const item = req.query.q;
  console.log("item",item)
  var keys = await client.keys(`*${item}*`);
  console.log("tamaaño",keys.length, keys)
  try {
    //keys == null
      if (keys.length == 0 ) {
        //si no esta en el cache
        let peticion = await axios.get(`http://${process.env.rpc_host}:3001/items`, { params: { name: item }, headers: {
            'Content-Type': 'application/json',
        }});
        if(peticion.status == 200){
            console.log("Salio bien")
        }
        let data = peticion.data
        console.log("aqui esta la peticion",data)
        let guardado = JSON.stringify(data);
        await client.set(item, guardado)
        console.log(await client.get(item))
        return res.json(data);
      }else{
        
        //SI SE ENCUENTRA EN EL CACHE
        console.log("entre al cache")
        let data= await client.get(item)
        return res.json(data);

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
    res.send('wohooo')
});