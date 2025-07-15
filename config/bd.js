const mongoose = require("mongoose");

mongoose.set("strictQuery", true);

require("dotenv").config();

//credenciais do DB
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

async function main() {
  await mongoose.connect(
    `mongodb+srv://${dbUser}:${dbPassword}@api.9c0qnnu.mongodb.net/?retryWrites=true&w=majority&appName=API`
  );

  console.log("Conectou ao banco de dados!");
}
main().catch((err) => console.log(err));

module.exports = main;
