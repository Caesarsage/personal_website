import dot from "dotenv";
if (process.env.NODE_ENV !== "production") {
  dot.config();
}
import express from "express";
import path, {dirname} from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose"
import flash from "connect-flash"
import ejsMate from "ejs-mate"
import { db } from "./db/index.js";
import morgan from "morgan"
import chalk from "chalk"

const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// connect db
db()

// middleware
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use(express.static(path.join(__dirname, '/node_modules/font-awesome')))
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(morgan('tiny'));

// FLASH CONFIG
app.use(flash());
// locals: available to the template 
// must be after express session  and passport config
app.use((req, res, next )=>{
  console.log(req.session);
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

// Connection
const port = process.env.PORT || 3000

app.listen(port, ()=>{
  console.log(`listing at port ${chalk.green(port)}`)
});