const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

// Importing routes
const calculateRoute = require('./routes/calculateRoute');
const loadDataRoute = require('./routes/loadData');

// Routes middlewares
app.use('/calculate', calculateRoute);
app.use('/load', loadDataRoute)

app.listen(process.env.PORT || 8080, () => console.log('Server up!'));