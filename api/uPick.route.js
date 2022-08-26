import express from 'express';
import FavoritesController from './favorites.controller.js';
import FarmController from './farm.controller.js';
import ReviewsController from './farmReviews.controller.js';

const router = express.Router(); // get access to express router

router.route("/").get(FarmController.apiGetFarm);
router.route("/id/:id").get(FarmController.apiGetFarmById);
router.route("/favoritelist").get(FarmController.apiGetFavoriteList);

router.route("/review").post(ReviewsController.apiPostReview);
router.route("/updatereview").put(ReviewsController.apiUpdateReview);
router.route("/deletereview").delete(ReviewsController.apiDeleteReview);

router
    .route("/favorites")
    .put(FavoritesController.apiUpdateFavorites);

router
    .route("/favorites/:userId")
    .get(FavoritesController.apiGetFavorites);

export default router;