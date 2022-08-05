import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;

let reviews;

export default class FarmReviewsDAO {
    static async injectDB(conn) {
        if (reviews) {
            return;
        }
        try {
            reviews = await conn.db(process.env.U_PICK_NS).collection('reviews');
        } catch (e) {
            console.error(`Unable to connect in reviewsDAO: ${e}`);
        }
    }

    static async addReview(farmId, user, review, date) {
        try {
            const reviewDoc = {
                name: user.name,
                user_id: user._id,
                date: date,
                review: review,
                farm_id: ObjectId(farmId)
            }
            return await reviews.insertOne(reviewDoc);
        } catch (e) {
            console.error(`Unable to post review: ${e}`);
            return { error: e };

        }
    }

    static async updateReview(reviewId, userId, review, date) {
        try {
            const query = {
                _id: ObjectId(reviewId),
                user_id: userId
            }
            const reviewDoc = {
                $set: {
                    review: review,
                    date: date,
                }
            };
            return await reviews.updateOne(query, reviewDoc);
        } catch (e) {
            console.error(`Unable to update review: ${e}`);
            return { error: e };

        }

    }

    static async deleteReview(reviewId, userId) {
        try {
            const query = {
                _id: ObjectId(reviewId),
                user_id: userId
            }
            return await reviews.deleteOne(query);
        } catch (e) {
            console.error(`Unable to delete review: ${e}`);
            return { error: e };

        }
    }
}