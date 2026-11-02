require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const Dbasync = require("./config/db");

const routerAdmin = require("./router/admin/index");
const routerFrontend = require("./router/frontend/index");

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

// Connect database
Dbasync();

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use("/uploads", express.static(uploadsDir));

// Healthcheck endpoint for Render / Uptime monitors
app.get("/", (req, res) => {
    res.status(200).json({
        status: "ok",
        message: "Saweriya Travellers / DriveBus API is running live!",
        timestamp: new Date().toISOString()
    });
});

app.use(routerAdmin);
app.use("/frontend", routerFrontend);

app.listen(port, () => {
    console.log("server started on port", port);
});
