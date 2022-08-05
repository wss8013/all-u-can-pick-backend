import FarmsDao from '../dao/farmDAO.js';

export default class FarmController {

    static async apiGetFarm(req, res, next) {
        const farmsPerPage = req.query.farmsPerPage ?
            parseInt(req.query.farmsPerPage) : 20;
        const page = req.query.page ? parseInt(req.query.page) : 0;
        let filters = {}
        // if (req.query.rated) {
        //     filters.rated = req.query.rated;
        // } else 
        if (req.query.name) {
            filters.farm_name = req.query.name;
        }

        const { farmsList, totalNumFarms } = await FarmsDao.getFarms({ filters, page, farmsPerPage });

        let response = {
            farms: farmsList,
            page: page,
            filters: filters,
            entries_per_page: farmsPerPage,
            total_results: totalNumFarms,
        };
        res.json(response);
    }

    static async apiGetFarmById(req, res, next) {
        try {
            let id = req.params.id || {}
            let farm = await FarmsDao.getFarmById(id);
            if (!farm) {
                res.status(404).json({ error: "not found" });
                return;
            }
            res.json(farm);
        } catch (e) {
            console.log(`API,${e}`);
            res.status(500).json({ error: e });
        }
    }

    // todo: add later 

    // static async apiGetRatings(req, res, next) {
    //     try {
    //         let propertyTypes = await FarmsDao.getRatings();
    //         res.json(propertyTypes);
    //     } catch (e) {
    //         console.log(`API,${e}`);
    //         res.status(500).json({ error: e });
    //     }

    // }

    //     static async apiGetFavoriteList(req, res, next) {
    //         try {
    //             let ids = req.query.farmIds;
    //             let favorites = await FarmsDao.getMoviesByIds(ids);
    //             if (!favorites) {
    //                 res.status(404).json({ error: "not found" });
    //                 return;
    //             }
    //             let response = {
    //                 movies: favorites,
    //             };
    //             console.error(favorites);
    //             res.json(response);
    //         } catch(e) {
    //             console.log(`API, ${e}`);
    //             res.status(500).json({ error: e });
    //         }
    //     }
}