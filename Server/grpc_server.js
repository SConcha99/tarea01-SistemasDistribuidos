const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const PROTO_PATH = "./cambio.proto";

const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

//conexion a base de datos
const { Client } = require('pg')
const baseDdatos = {
    user: 'postgres',
    host: '',
    database: 'tiendita',
    password: 'marihuana',
}
const cliente = new Client(baseDdatos)

const packageDefinition = protoLoader.loadSync(PROTO_PATH, options);
const itemProto = grpc.loadPackageDefinition(packageDefinition);

const server = () => {
  const server = new grpc.Server();
  server.addService(itemProto.ItemService.service, {
    getItem: (_, callback) => {
      const itemName = _.request.name;
      const item = items.item_list.filter((obj) => obj.name.includes(itemName));
      callback(null, { items: item});
    }
});


server.bindAsync("0.0.0.0:3000", grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err != null) console.log(err);
    else {
      console.log("GRPC SERVER RUN AT http://localhost:3000");
      server.start();
    }
  });
};

exports.server = server;