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
    } = {}) {// empty object is default parameter is case arg is undefined 
        let query;
        if (filters) {
            if ("farm_name" in filters) {
                query = { $text: { $search: filters['farm_name'] } }
            } 
            // add fruit filter 
            // else if ("rated" in filters) {
            //     query = { "rated": { $eq: filters['rated'] } }
            // }
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

    // todo: implement fruit filter when db is ready 
    // static async getRatings() {
    //     let ratings = [];
    //     try {

    //         ratings = await movies.distinct("rated");
    //         return ratings;
    //     } catch (e) {
    //         console.error(`Unable to get ratings, ${e}`);
    //         return ratings;
    //     }
    // }

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
// todo: may implement when needed 

//     static async getMoviesByIds(ids) {
//         let cursor;
//         try {
//             if (!ids) {
//                 return;
//             }
//             let objectIds = [];
//             for (let i = 0; i < ids.length; i++) {
//                 objectIds.push(new ObjectId(ids[i]));
//             }

//             console.error(objectIds);
//             cursor = await movies.find({
//                 _id: { $in: objectIds }
//             });
//             console.error(ids);
//             const favorites = await cursor.toArray();
//             console.error(favorites);
//             return favorites;
//         } catch (e) {
//             console.error(`Something went wrong in getMoviesByIds: ${e}`);
//             throw e;
//         }
//     }
}