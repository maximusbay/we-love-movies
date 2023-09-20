const service = require("./reviews.service");

async function reviewExists(req, res, next) {
    const reviewId = req.params.reviewId;
    const foundReview = await service.read(reviewId);

     if (foundReview) {
         res.locals.review = foundReview;
        return next();
    } else {
        res.status(404).json({ error: "Review cannot be found." });
    }  
}

async function update(req, res) {
    const updatedReview = {
        ...res.locals.review,
        ...req.body.data,
        review_id: res.locals.review.review_id,
    };
     const data = await service.update(updatedReview);
     res.json({ data });
    
}
async function destroy(req, res, next) {
  const reviewId = req.params.reviewId;
  await service.destroy(reviewId);
  res.sendStatus(204);
}

module.exports = {
  update: [reviewExists, update],
  delete: [reviewExists, destroy],
};