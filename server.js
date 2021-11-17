const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const port = process.env.PORT || 3000;
const methodOverride = require('method-override')
const morgan = require('morgan');
const ejsMate = require('ejs-mate');
const cookieParser = require('cookie-parser');
const authMiddleware = require('./middlewares/authMiddleware');
const checkUserMiddleware = require('./middlewares/checkUserMiddleware');
require('dotenv').config();

//middleware (order matters )
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(cookieParser());

//requiring files
const articlesRoutes = require('./routes/articles');
app.use('/articles', articlesRoutes);
const adminRoutes = require('./routes/admin');
app.use('/admin', authMiddleware ,adminRoutes);
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes); 
const userRoutes = require('./routes/user');
app.use('/user', userRoutes);
const questionRoutes = require('./routes/questions');
app.use('/questions', questionRoutes);

//setting up mongodb
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
)
.then(() => {
    console.log("DB Connection Successful!")
})
.catch((error) => {
    console.log(error);
});

//setting up ejs
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/', checkUserMiddleware, (req, res) => {
    res.render('index');
});

app.use((req, res) => {
    res.render('error');
});

app.listen(port, () => {
    console.log('App listening at port', port);
});

