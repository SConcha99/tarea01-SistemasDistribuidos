const express = require('express');
const cors = require("cors");
const app = express();

const grpc = require("./grpc_client");
const server = require("../server/grpc_server");
//enciendo servidor
server.server();

const port=3000;

app.use(cors());
app.use(express.json());

app.listen(port, ()=>{
    console.log(`Express listening at http://localhost:${port}`)
})

app.get("/", function (req,res){
    res.send('wohooo')
});