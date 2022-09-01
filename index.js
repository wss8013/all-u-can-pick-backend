import app from './server.js';
import mongodb from "mongodb";
import dotenv from "dotenv";
import FarmDAO from './dao/farmDAO.js';
import ReviewsDAO from './dao/farmReviewDAO.js';
import FavoritesDAO from './dao/favoritesDAO.js';

async function main() {

    dotenv.config();
    const client = new mongodb.MongoClient(
        process.env.U_PICK_DB_URI
    )
    const port = process.env.PORT || 8000;
    try {
        // connect to MongoDB server make sure the connection is open 
        await client.connect();
        await FarmDAO.injectDB(client);
        await ReviewsDAO.injectDB(client);
        await FavoritesDAO.injectDB(client);
        app.listen(port, () => {
            console.log('Server is running on port: ' + port);
        })
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

main().catch(console.error);