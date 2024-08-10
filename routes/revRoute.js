const express = require('express');
const Review = require('../models/reviews');
const revRouter = express.Router();

revRouter.get("/reviews", async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.render("reviews", { reviews });
  } catch (err) {
    console.log(err);
    res.redirect("/index?message=Error%20fetching%20reviews&type=danger");
  }
});

revRouter.post("/reviews", async (req, res) => {
  const data = req.body;
  console.log(data);
  const { revname, revplace, revemail, revnumber, review } = req.body;

  const reviewDoc = new Review({
    revname: req.body.revname,
    revplace: req.body.revplace,
    revemail: req.body.revemail,
    revnumber: req.body.revnumber,
    review: req.body.review
  });

  try {
    await reviewDoc.save();
    res.redirect("/reviews");
  } catch (err) {
    console.log(err);
    res.redirect("/index?message=Error%20adding%20review&type=danger");
  }
});

module.exports = revRouter;