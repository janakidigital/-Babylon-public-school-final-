require('dotenv').config();
const http = require("http");

const app = require("./src/app");
const connectDB = require("./src/db/db");


const PORT = process.env.PORT || 5000;

connectDB();

const server = http.createServer(app);


server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});