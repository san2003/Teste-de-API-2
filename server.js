//rodar: npm intall
//       npm run dev
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
 
const user = require("./models/usuarioModes");
const User = require("./models/usuarioModes");
 
const express = require("express");
require("./config/bd");
const app = express();
 
//middleware para entender JSON no corpo das requisições
app.use(express.json());
 
const PORT = 3000;
 
app.get("/", (req, res) => {
  res.status(200).send("Bem-Vindo à API!");
});
 
app.post("/auth/register", async (req, res) => {
  const { name, email, password, confirmpassword } = req.body;
  if (!name) {
    return res.status(422).json({ msg: "O nome é obrigatório!" });
  }
  if (!email) {
    return res.status(422).json({ msg: "O email é obrigatório!" });
  }
  if (!password) {
    return res.status(422).json({ msg: "A senha é obrigatória!" });
  }
  if (password != confirmpassword) {
    return res.status(422).json({ msg: "As senhas devem ser iguais!" });
  }
 
  const userExists = await user.findOne({ email: email });
 
  if (userExists) {
    return res.status(422).json({ msg: "Usuario já existe!" });
  }
 
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);
 
  const User = new user({
    name,
    email,
    password: passwordHash,
  });
 
  try {
    await User.save();
    return res.status(201).json({ msg: "Usuario criado!" });
  } catch (error) {
    return res.status(500).json({ msg: error });
  }
});
 
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
 
  if (!email) {
    return res.status(422).json({ msg: "O email é obrigatório!" });
  }
  if (!password) {
    return res.status(422).json({ msg: "A senha é obrigatória!" });
  }
 
  const user = await User.findOne({ email: email });
 
  if (!user) {
    return res.status(422).json({ msg: "Faça um cadastro!" });
  }
 
  const checkPassword = await bcrypt.compare(password, user.password);
 
  if (!checkPassword) {
    return res.status(422).json({ msg: "Senha incorreta!" });
  }
 
  try {
    const secret = process.env.SECRET;
 
    const token = jwt.sign(
      {
        id: user._id,
      },
      secret
    );
 
    res.status(200).json({ msg: "Autenticação realizada!" });
  } catch (erro) {
    res.status(500).json({ msg: erro });
  }
});
 
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
 