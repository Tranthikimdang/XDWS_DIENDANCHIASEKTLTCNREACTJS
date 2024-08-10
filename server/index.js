const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const categoryRoutes = require('./routes/categoryRoutes');
const commentRoutes = require('./routes/commentRoutes');
const userRoutes = require('./routes/userRoutes');
const loginRoutes = require('./routes/loginRoutes');

const articleRoutes = require('./routes/articleRoutes');
const path = require('path')


const app = express();
app.use(cors());
const port = 4000;
// Cấu hình để phục vụ tệp tin tĩnh từ thư mục uploads
app.use('/assets/uploads', express.static(path.join(__dirname, './assets/uploads')));


// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.use('/api', categoryRoutes);
app.use('/api', commentRoutes);
app.use('/api', userRoutes); 
app.use('/api', loginRoutes); 


app.use('/api', articleRoutes);
 


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
