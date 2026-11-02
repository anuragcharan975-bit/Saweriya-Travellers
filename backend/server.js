require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 4000;

const cors = require("cors");
const Dbasync = require("./config/db");

const routerAdmin = require("./router/admin/index");
const routerFrontend = require("./router/frontend/index");

app.use(express.json());
app.use(cors());
Dbasync();

app.use("/uploads", express.static("uploads"));

app.use(routerAdmin);
app.use("/frontend", routerFrontend);

app.listen(port, () => {
    console.log("server started on port", port);
});
