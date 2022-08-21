const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const loginRoutes = require("./routes/login");
const githubRoutes = require("./routes/github");

const app = express();
const port = process.env.PORT || 3001;

const whitelist = [process.env.CLIENT_URI]
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true,
}

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use('/api', loginRoutes, githubRoutes);
  
app.listen(port, () => console.log('Server listening on port' + port));