if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const cors = require('cors');
const authRoutes = require('./api/v1/userAuth');
const userInfo = require('./api/v1/userInfo');
const courseInfo = require('./api/v1/courseInfo');
const http = require("http");
const setupSocketIO = require('./socket');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const server = http.createServer(app);
setupSocketIO(server);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));

app.use('/api/v1', authRoutes);
app.use('/api/v1', userInfo);
app.use('/api/v1', courseInfo);

const PORT = 5000;
server.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`));
