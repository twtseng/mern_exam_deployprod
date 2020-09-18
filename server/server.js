const express = require("express");
const app = express();
const cors = require("cors");

// Connect database
require("./config/mongoose.config");

app.use(express.json(), express.urlencoded({ extended: true}));
app.use(cors());

const appRoutes = require("./routes/app.routes");
appRoutes(app);
const server = app.listen(8000, () => console.log(`Server listening on port 8000`));

const io = require("socket.io")(server);

io.on("connection", socket => {
    console.log("Received connection: "+socket.id);
    socket.emit("Hello","Welcome message from the server");
    
    socket.on("event_from_client", data => {
        console.log("Message from client"+JSON.stringify(data));
        socket.broadcast.emit("new_message_from_server", data);
    })
});