const express = require('express');
const cors = require("cors");
const axios = require("axios");
const https = require('https')
const app = express();


const port=3000;

//FUNCION QUE HACE EL LLAMADO AL SERVIDOR
/*
app.get("/inventory/search",(req, res) => {
    
    const item = req.query.q;
    console.log(item)
    async () => { await axios.get('http://grcp:3001/items', { params:{q: item}}).then(res2 => {
        //console.log(`statusCode: ${res.status}`)
        console.log('Data:',res2.data);
        //let data = JSON.stringify(res2.data)
        //client.set(item, data);
        cache = res2.data;
        res.json(cache);
      }).catch(error => {console.error(error)})
    
}
        //await axios.get('http://grcp:3001/items', { params:{name: item}}).then(res.json)    
});*/

//-------------
app.get('/inventory/search', (req, res) => {
    const item = req.query.q;
    console.log('query item: ',item);
      (async () => {
        await axios.get('http://grcp:3001/items', { params: {name: item}}).then(res2 => {
        console.log("statusCode:", res2.status)
        //console.log(res)
        data = res2.data;
        res.json(data);
      }).catch(error => {console.error(error)})
      })();
      
    });
//-------------

app.listen(port, ()=>{
    console.log(`Express listening at http://localhost:${port}`)
})

app.get("/", function (req,res){
    res.send('wohooo')
});