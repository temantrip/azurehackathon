require("dotenv").config();
const cors = require("cors");
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const chatAgentRouter = require("./routes/chatAgent");
const proposalAgentRouter = require("./routes/proposalAgentRouter");
const qootationAgentRouter = require("./routes/quotationAgentRouter");
const invoiceAgentRouter = require("./routes/invoiceAgentRouter");

const app = express();
app.use(cors());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/chat-agent", chatAgentRouter);
app.use("/proposal", proposalAgentRouter);
app.use("/quotation", qootationAgentRouter);
app.use("/invoice", invoiceAgentRouter);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
