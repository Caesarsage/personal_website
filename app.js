import dot from "dotenv";
dot.config();

import express from "express";
import path, {dirname} from "path";
import { fileURLToPath } from "url";
import ejsMate from "ejs-mate"
import cors from "cors";

// import { db } from "./db/index.js";
import morgan from "morgan"
import chalk from "chalk"

const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
import {ExpressError} from "./utils/expressError.js";
// connect db
// db()

// middleware
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use(express.static(path.join(__dirname, '/node_modules/font-awesome')))
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.json());

app.use(express.urlencoded({extended:true}));
app.use(morgan('tiny'));
app.use(cors());



app.get('/home',(req,res)=>{
  res.send('jjjjj')
})

app.get('/', (req,res)=>{
  res.render('index')
})


app.all('*', (req, res, next)=>{ 
  next(new ExpressError('Page not found', 404))
})

app.get("/", (req, res) => {
  res.render("views/index");
});

app.use((err, req, res, next)=>{
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong!!!, it's not your fault but ours" 
  res.status(statusCode);
  res.render('404', {
    err
  })
});

// Connection
const port = process.env.PORT || 3001

app.listen(port, ()=>{
  console.log(`listing at port ${chalk.green(port)}`)
});