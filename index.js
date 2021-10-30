const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId= require('mongodb').ObjectId;
const cors=require('cors');
require('dotenv').config()
const app = express()
const port =process.env.PORT || 5000;
// middlewire
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qqycq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run(){
    try{
        await client.connect();
        // console.log('connected to database');

        const database=client.db('tour_Hub');
        const toursCollection=database.collection('tours');
         
        // GET Tour API
        app.get('/tours',async (req,res)=>{
            const cursor =toursCollection.find({});
            const tours=await cursor.toArray();
            res.send(tours);
        })

    }
    finally{
        // await client.close();

    }
}


run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('TourHub server is running')
  })
  
  app.listen(port, () => {
    console.log('Running TourHub server on port',port)
  })