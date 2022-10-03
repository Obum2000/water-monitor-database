import * as sqlite from 'sqlite';
import sqlite3 from 'sqlite3';
import express from 'express';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

const db = await sqlite.open({
    filename: './data_pipeline.db',
    driver: sqlite3.Database
});
console.log('db initialised')
await db.migrate();



app.get('/api/pipeline_dataset', async function (req, res) {
    const pipeline_dataset = await db.all('select * from pipeline_dataset');
    res.json({
        pipeline_dataset
    })
});

app.get('/api/pipeline_dataset/Pressure1', async function (req, res) {
    const Time = req.body.Time;
    // const Time = req.body.value2; 

    const pipeline_dataset = await db.all(`SELECT id,Time,P1 FROM pipeline_dataset
    WHERE Time >= ? LIMIT 10;`, Time);

    res.json({
        pipeline_dataset
    })
    

});


console.log('done!');
const PORT = process.env.PORT || 6002;
app.listen(PORT, function () {
    console.log(`Pipeline Data Plan API started on port ${PORT}`)
});