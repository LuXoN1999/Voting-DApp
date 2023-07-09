const express = require("express");
const knex = require("knex");
const app = express();
const cors = require("cors");
const port = 8080;

const db = knex({
  client: 'pg',
  connection: {
    host: "127.0.0.1",
    user: "postgres",
    password: "postgres",
    database: "voters"
 }
});

app.use(cors())

app.get("/voter/:id_number", async(req,res) => {
  db.select("*").from("voters").where("id_number", "=", req.params.id_number).then(voters =>{
    res.json(voters.length != 0);
  })
});

app.listen(port, () => {
  console.log("Server listening on port ${port}");
});
