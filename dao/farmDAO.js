import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId

let farms;
export default class FarmsDao {
    static async injectDB(conn) {
        if (farms) {
            return;
        }
        try {
            farms = await conn.db(process.env.U_PICK_NS).collection('farms');
        } catch (e) {
            console.error(`Unable to connect in FarmsDao: ${e}`);
        }
    }

    
    static async getFarms({
        filters = null,
        page = 0,
        farmsPerPage = 20,
    } = {}) {
        let query;
        if (filters) {
            if ("farm_name" in filters) {
                query = { $text: { $search: filters['farm_name'] } }
            } 
        }
        let cursor;
        try {
            cursor = await farms.find(query)
                .limit(farmsPerPage)
                .skip(farmsPerPage * page);
            const farmsList = await cursor.toArray();
            const totalNumFarms = await farms.countDocuments(query);
            return { farmsList, totalNumFarms }
        } catch (e) {
            console.error(`Unable to issue find command, ${e}`);
            return { farmsList: [], totalNumFarms: 0 };
        }
    }

    static async getFarmById(id) {
        try {
            return await farms.aggregate([
                {
                    $match: {
                        _id: new ObjectId(id)
                    }
                },
                {
                    $lookup: {
                        from: 'reviews',
                        localField: '_id',
                        foreignField: 'farm_id',
                        as: 'reviews'
                    }
                }
            ]).next();

        } catch (e) {
            console.error(`Something went wrong in getMovieById: ${e}`);
            throw e;
        }
    }

    static async getFarmsByIds(ids) {
        let cursor;
        try {
            if (!ids) {
                return;
            }
            let objectIds = [];
            for (let i = 0; i < ids.length; i++) {
                objectIds.push(new ObjectId(ids[i]));
            }
            cursor = await farms.find({
                _id: { $in: objectIds }
            });
            console.error(ids);
            const favorites = await cursor.toArray();
            console.error(favorites);
            return favorites;
        } catch (e) {
            console.error(`Something went wrong in getFarmsByIds: ${e}`);
            throw e;
        }
    }
}