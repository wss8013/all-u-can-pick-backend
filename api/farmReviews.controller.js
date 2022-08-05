import FarmReviewsDAO from '../dao/farmReviewDAO.js'

export default class ReviewsController {
    static async apiPostReview(req, res, next) {
        try {
            const farmId = req.body.farm_id;
            const review = req.body.review;
            const userInfo = {
                name: req.body.name,
                _id: req.body.user_id
            }
            const date = new Date();

            const reviewResponse = await FarmReviewsDAO.addReview(
                farmId,
                userInfo,
                review,
                date
            );

            var { error } = reviewResponse;
            console.log(error);
            if (error) {
                res.status(500).json({ error: "Unable to post review." });
            } else {
                res.json({ status: "success" });
            }
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiUpdateReview(req, res, next) {
        try {
            const reviewId = req.body.review_id;
            const review = req.body.review;
            const userId = req.body.user_id;

            const date = new Date();

            const updateResponse = await FarmReviewsDAO.updateReview(
                reviewId,
                userId,
                review,
                date
            );
            var { error } = updateResponse;
            console.log(error);
            if (error) {
                res.status(500).json({ error: "Unable to updated review." });
            }
            else if (updateResponse.modifiedCount == 0) {
                res.status(501).json({ error: "No review updated " });
            }
            else {
                res.json({ status: "success" });
            }
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
    static async apiDeleteReview(req, res, next) {
        try {
            const reviewId = req.body.review_id;
            const userId = req.body.user_id;
           
            const deleteResponse = await FarmReviewsDAO.deleteReview(
                reviewId,userId);
                console.log(reviewId+ " lalala "+userId)
                console.log(deleteResponse)
            var { error } = deleteResponse;
            console.log(error);
            if (error) {
                res.status(500).json({ error: "Unable to delete review." });
            }
            else if (deleteResponse.deletedCount == 0) {
                res.status(501).json({ error: "No review deleted " });
            }
            else {
                res.json({ status: "success" });
            }
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
}