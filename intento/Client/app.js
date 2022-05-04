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


// Obtiene todas las keys de redis
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
/* intento 10000 pipe
app.get('/inventory/search', (req, res) => {
  const item = req.query.q;
  (async () => {
    var respuesta = await axios.get('http://grcp:3001/items', { params: {name: item}}).then( async x => {
      console.log(x,x.status,x.data)
      let response = await x.data
      return response;
    }).then(res2 => {

    console.log(res2)
    console.log("statusCode:", res2.status)
    //console.log(res)
    data = JSON.stringify(res2.data);
     
    client.set(item,data)
    res.json(data);
    console.log(client.get(item))
  }).catch(error => {console.error(error)})

  })();
});

*/
//principal
/*app.get('/inventory/search', (req, res) => {
    const item = req.query.q;
    console.log('query item: ',item);
    //keys ve si al ingresar esta en el cache
    const keys = client.keys(`*${item}*`);
    console.log(keys.length);
    
    if (keys.length == null) {
        console.log("No encontrado en cache");
        // Realizar llamado grpc
        console.log("Realizando llamado grpc");
        (async () => {
          await axios.get('http://grcp:3001/items', { params: {name: item}}).then(res2 => {
          console.log("statusCode:", res2.status)
          //console.log(res)
          data = JSON.stringify(res2.data);
          
          //ingresa al cache
          client.set(item , data)
          console.log(await client.get(item));
          res.json(data);
        }).catch(error => {console.error(error)})
        })();


        console.log("Guardado en cache {key: value}");

    }
    else{
        console.log("Encontrado en cache");
        
        console.log(keys);
        
        const value =  client.get(item);

        console.log(value); 

        res.send({ "search_results": value });
    
    }
*/


/*
      (async () => {
        await axios.get('http://grcp:3001/items', { params: {name: item}}).then(res2 => {
        console.log("statusCode:", res2.status)
        //console.log(res)
        data = res2.data;
        res.json(data);
      }).catch(error => {console.error(error)})
      })();
 */     
    
//-------------

app.listen(port, ()=>{
    console.log(`Express listening at http://localhost:${port}`)
})

app.get("/", function (req,res){
    res.send('wohooo')
});