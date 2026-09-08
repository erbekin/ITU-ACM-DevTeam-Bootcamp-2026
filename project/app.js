import express from "express";
import todosRouter from "./modules/todos/todos.router.js";
import usersRouter from "./modules/users/users.router.js";
import notFoundHandler from "./utils/notFoundHandler.js";
import globalErrorHandler from "./utils/globalErrorHandler.js";
// import loadDotEnv from "./utils/loadDotEnv.js"

// Load from .env
// loadDotEnv()

const server = express();


// initialize storage
server.use((req, res, next) => {
  req.storage = new Map();
  next()
})
server.use(express.json());

server.use("/todos", todosRouter);
server.use("/users", usersRouter);


server.get("/", (req, res) => {
  res.send("Hello World");
});
server.use(notFoundHandler);
server.use(globalErrorHandler);


export default server;
