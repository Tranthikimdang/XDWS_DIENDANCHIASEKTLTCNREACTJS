const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const categoryRoutes = require('./routes/categoryRoutes');
const commentRoutes = require('./routes/commentRoutes');
const userRoutes = require('./routes/userRoutes');

const announcementRoutes = require('./routes/announcementRoutes');
const authorityRoutes = require('./routes/authorityRoutes');



const announcementRoutes = require('./routes/announcementRoutes');
const authorityRoutes = require('./routes/authorityRoutes');
const articleRoutes = require('./routes/articleRoutes');
const path = require('path')
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(cors());
const port = 4000;
// Cấu hình để phục vụ tệp tin tĩnh từ thư mục uploads
app.use('/assets/uploads', express.static(path.join(__dirname, './assets/uploads')));


// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use('/api', categoryRoutes);
app.use('/api', commentRoutes);
app.use('/api', userRoutes); 

app.use('/api', announcementRoutes); 
app.use('/api', authorityRoutes); 


app.use('/api', announcementRoutes);
app.use('/api', authorityRoutes);
app.use('/api', articleRoutes);
app.use('/api', userRoutes); 


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
