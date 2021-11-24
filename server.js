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
const adminOnly = require('./middlewares/adminOnly');
const Question = require('./models/questions');
const Article = require('./models/articles');
const getNewDescription = require('./functions/getNewDescription');
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
app.use('/admin', adminOnly, adminRoutes);
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

app.post('/searchquestion', async (req, res) => {
    const { search } = req.body;
    const questions = await Question.find({$text: {$search: search }})
    .limit(10);
    res.status(200).json(questions);
});

app.post('/searcharticle', async (req, res) => {
    const { search } = req.body;
    const articles = await Article.find({$text: {$search: search }})
    .limit(10);
    res.status(200).json(articles);
});

app.get('/search', (req, res) => {
    res.render('search');
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/', checkUserMiddleware, async (req, res) => {
    const questions = await Question.find({}).limit(4).sort({ views: -1 });
    for (let i = 0; i < questions.length; i++) {
        let newStr = getNewDescription(questions[i].description);
        questions[i].description = newStr;
    }

    const articles = await Article.find({}).limit(4).sort({ views: -1 });
    for (let i = 0; i < articles.length; i++) {
        let newStr = getNewDescription(articles[i].description);
        articles[i].description = newStr;
    }

    res.render('index', { questions, articles });
});

app.use((req, res) => {
    res.render('error');
});

app.listen(port, () => {
    console.log('App listening at port', port);
});

