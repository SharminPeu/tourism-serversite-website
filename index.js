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
        const odersCollection = database.collection('oders')
      
         
        // GET Tour API
        app.get('/tours',async (req,res)=>{
            const cursor =toursCollection.find({});
            const tours=await cursor.toArray();
            res.send(tours)
        
        })
        // GET Singlr Tour Details
        app.get('/tours/:id',async(req,res)=>{
            const id=req.params.id;
            console.log('specific id',id);

            const query ={_id:ObjectId(id)}
            const tour=await toursCollection.findOne(query);
            res.json(tour);
        })

         // add Tour Package
  app.post("/addTourPackage", async (req, res) => {
    console.log(req.body);
    const result = await toursCollection.insertOne(req.body);
    console.log(result);
    res.json(result);
  })
//     // Place order
  app.post("/placeOrder", async (req, res) => {
    console.log(req.body);
    const result = await odersCollection.insertOne(req.body);
    res.json(result);
  });

 // Manage all oders

 app.get("/allOders", async (req, res) => {
    const result = await odersCollection.find({}).toArray();
    res.send(result);
    console.log(result);
  });
  // my oders

  app.get("/myOders/:email", async (req, res) => {
    const result = await odersCollection.find({
      email: req.params.email,
    }).toArray();
    res.send(result);
  });
   // delete Order

   app.delete("/deleteOrder/:id", async (req, res) => {
    console.log(req.params.id);
    const id=req.params.id;
    const result = await odersCollection.deleteOne({
      _id:id,
    });
    res.send(result);
  });
//   update order status
app.put('/approvedOrder/:id',async(req,res)=>{
    const updatedId=req.params.id;
    const filter={_id:updatedId}
    const options={upsert:true}
const updateDoc={
    $set:{
    status:"Approved"
},
}
const result=await odersCollection.updateOne(filter,updateDoc,options)
res.send(result)
});

}

    finally{
        // await client.close();

    }
}


run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('TourHub server is running successfully')
  })
  
  app.listen(port, () => {
    console.log('Running TourHub server on port',port)
  })