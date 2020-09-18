const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const config = require("./config/production.config");

// Connect database
require("./config/mongoose.config");

app.use(cookieParser());
app.use(cors({ credentials: true, origin: config.CLIENT_LOGIN_PAGE }));
app.use(express.json(), express.urlencoded({ extended: true}));

const appRoutes = require("./routes/app.routes");
appRoutes(app);
const server = app.listen(config.SERVER_PORT, () => console.log(`Server listening on URL ${config.PROD_URL}`));

const io = require("socket.io")(server);

io.on("connection", socket => {
    console.log("Received connection: "+socket.id);
    socket.emit("Hello","Welcome message from the server");
    
    socket.on("event_from_client", data => {
        console.log("Message from client"+JSON.stringify(data));
        socket.broadcast.emit("new_message_from_server", data);
    })
});