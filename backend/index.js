const express = require("express");
const mainRouter = require ("./Routes/index")
const app= express();
const cors = require("cors");
const jwt = require("./config")
const userRouter = require("./Routes/user")
app.use(cors());
app.use(express.json())


app.use("/api/v1",mainRouter);
// app.use("/api.v1/user",userRouter);

app.listen(3000);