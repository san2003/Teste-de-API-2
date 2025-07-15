//rodar: npm intall
//       npm run dev
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtonken");
const mongoose = require("mongoose");

const User = require("./models/usuarioModes");

const express = require("express");
require("./config/db");
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
    return res.status(422).json({ msg: "O nome é obrigatório" });
  }
  if (!email) {
    return res.status(422).json({ msg: "O email é obrigatório" });
  }
  if (!password) {
    return res.status(422).json({ msg: "A senha é obrigatória" });
  }
  if (!confirmpassword) {
    return res
      .status(422)
      .json({ msg: "A confirmação de senha é obrigatória" });
  }
  if (password != confirmpassword) {
    return res
      .status(422)
      .json({ msg: "A confirmação de senha é obrigatória" });
  }

  const userExistis = await User.findOne({ email: email });

  if (userExistis) {
    return res.status(422).json({ msg: "Usuario já existente!" });
  }

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  const User = new User({
    name,
    email,
    password: passwordHash,
  });

  try {
    await User.save();
    return res.status(201).json({ msg: "Usuário criado!" });
  } catch (error) {
    return res.status(500).json({ msg: error });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
