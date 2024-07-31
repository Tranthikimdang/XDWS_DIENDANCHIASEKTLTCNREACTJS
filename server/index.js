const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const categoryRoutes = require('./routes/categoryRoutes');
const commentRoutes = require('./routes/commentRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const authorityRoutes = require('./routes/authorityRoutes');

const app = express();
app.use(cors());
const port = 4000;

app.use(bodyParser.json());

app.use('/api', categoryRoutes);
app.use('/api', commentRoutes);
app.use('/api', announcementRoutes); 
app.use('/api', authorityRoutes); 

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
