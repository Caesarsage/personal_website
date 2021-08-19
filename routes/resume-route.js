import express from "express";
import { ResumeContact } from "../model/resumeContact.js";
import { catchAsync } from "../utils/catchAsync.js";

export const router = express.Router()

router.route('/')
.get((req, res) => {
  res.render('index')
})
.post(catchAsync(async(req,res, next)=>{
  const {name, email, message} = req.body
  console.log(req.body);
  try {
    const resumeContact = await ResumeContact.create({
      name,
      email,
      message
    })
    req.flash("success", "Successfully, you will be contacted soon");
    res.redirect('/')
    console.log(resumeContact)
  } catch (error) {
    next(error)
    req.flash("error", "An error, kindly refresh your browser and retry");
    console.log(error);
  }
}))