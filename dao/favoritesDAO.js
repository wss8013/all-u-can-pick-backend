import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId;

let FavoritesCollection;

export default class FavoritesDAO {
    static async injectDB(conn) {
        if (FavoritesCollection) {
            return;
        }

        try {
            FavoritesCollection = await conn.db(process.env.U_PICK_NS).collection('favorites');
        }
        catch (e) {
            console.error(`Unable to connect in FavoritesDAO: ${e}`);
        }

    }

    static async updateFavorites(userId, favorites) {
        try {
            const updateResponse = await FavoritesCollection.updateOne(
                { _id: userId },
                { $set: { favorites: favorites } },
                { upsert: true }
            )

            return updateResponse
        }
        catch (e) {
            console.error(`Unable to update favorites: ${e}`);
            console.log(e)
            return { error: e };
        }
    }

    static async getFavorites(id) {
        let cursor;
        try {
            cursor = await FavoritesCollection.find({
                _id: id
            });
            const favorites = await cursor.toArray();
            return favorites[0];
        } catch (e) {
            console.error(`Something went wrong in getFavorites: ${e}`);
            throw e;
        }
    }
}