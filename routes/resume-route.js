import express from "express";

export const router = express.Router()

router.route('/')
.get((req, res) => {
  res.render('index')
})