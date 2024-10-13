const express = require("express");
const dbRoute = require('./routes/db');
const indexRoute = require('./routes/index');
const registerRoute = require('./routes/register');
const loginRoute = require('./routes/login');
const usersRoute = require('./routes/users');

const app = express();
const port = 3000;

app.use(dbRoute);
app.use("/", indexRoute);
app.use("/register", registerRoute);
app.use("/login", loginRoute);
app.use("/users", usersRoute);

app.listen(port, () => {
    console.log("Server running on " + port);
});