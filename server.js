import express from 'express'
import cors from 'cors'
import uPick from './api/uPick.route.js'

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/v1/farms', uPick);
app.use('*', (req, res) => {
    res.status(404).json({error: "not found"});
});

export default app;