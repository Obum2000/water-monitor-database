import * as sqlite from 'sqlite';
import sqlite3 from 'sqlite3';
import express from 'express';
import cors from 'cors';

// const express = require('express');
const app = express();
app.use("/javaFolder", express.static('./javaFolder/'));
// app.use(express.static('public'));
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

app.get('/api/pipeline_dataset/history', async function (req, res) {
    const history_dataset = await db.all('select * from history');
    res.json({
        history_dataset
    })
});

app.get('/api/pipeline_dataset/Pressure1', async function (req, res) {
    const Time = req.query.Time;
    const Limit = req.query.Limit;


    const pipeline_dataset = await db.all(`SELECT id,Time,P1 FROM pipeline_dataset
    WHERE Time>=${Time} LIMIT ${Limit}`);

    res.json({
        pipeline_dataset
    })
    

});

app.get('/api/pipeline_dataset/history/store', async function (req, res) {
    const { 
        ph,
        temp,
        turb,
        hard,
        day,
        time,
        flow,
        water,
        leakD,
        qualityD}= req.query;


    const update = await db.all(`INSERT INTO history(
        ph,
        temperature,
        turbidity,
        hardness,
        day_of_week,
        time,
        flow_rate,
        water_pressure,
        leak_detector,
        quality_detector) 
VALUES (
    ${ph},
    ${temp},
    ${turb},
    ${hard},
    ${day},
    ${time},
    ${flow},
    ${water},
   '${leakD}',
   '${qualityD}');`);

    res.json({
        status : 'successfully'
    })
    

});

app.get('/api/pipeline_dataset/history/deleterows', async function (req, res) {
    const {Limit }= req.query;

    const result = await db.all(`DELETE FROM history
    WHERE id IN (
      SELECT id
      FROM (
        SELECT id
        FROM history
        ORDER BY id ASC LIMIT ${Limit}
      )
    )`);
    res.json({
        status: 'success'
    })
});

app.get('/api/pipeline_dataset/history/selection', async function (req, res) {
    const {selectNum }= req.query;


    const selectedRes = await db.all(`SELECT *
    FROM history
    ORDER BY id ASC 
    LIMIT ${selectNum};`);

    res.json({
        selectedRes
    })
    

});


console.log('done!');
const PORT = process.env.PORT || 6002;
app.listen(PORT, function () {
    console.log(`Pipeline Data Plan API started on port ${PORT}`)
});