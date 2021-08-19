import dot from "dotenv";
if (process.env.NODE_ENV !== "production") {
  dot.config();
}
import express from "express";
import path, {dirname} from "path";
import { fileURLToPath } from "url";
import ejsMate from "ejs-mate"
import { db } from "./db/index.js";
import morgan from "morgan"
import chalk from "chalk"
import flash from "connect-flash"
import session from 'express-session'
import { router } from "./routes/resume-route.js";
const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
import {ExpressError} from "./utils/expressError.js";
// connect db
db()

// middleware
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use(express.static(path.join(__dirname, '/node_modules/font-awesome')))
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.json());

app.use(express.urlencoded({extended:true}));
app.use(morgan('tiny'));

const sessionConfig = {
  secret: "abcdefghijklmnopqrstuvwxyz",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));

// FLASH CONFIG
app.use(flash());
// locals: available to the template
// must be after express session  and passport config
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.get('/home',(req,res)=>{
  res.send('home')
})

app.get('/', (req,res)=>{
  res.render('index.ejs')
})

app.use('/contact', router)

app.all('*', (req, res, next)=>{ 
  next(new ExpressError('Page not found', 404))
})

app.use((err, req, res, next)=>{
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong!!!, it's not your fault but ours" 
  res.status(statusCode);
  res.render('404', {
    err
  })
});

// Connection
const port = process.env.PORT || 3000

app.listen(port, ()=>{
  console.log(`listing at port ${chalk.green(port)}`)
});