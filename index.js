const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const categoryRoutes = require('./routes/categoryRoutes');


const app = express();
app.use(cors());
const port = 4000;

app.use(bodyParser.json());

app.use('/api', categoryRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
