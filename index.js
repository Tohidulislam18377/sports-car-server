const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@cluster0.l5bthlr.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const miniTruckCollection = client.db('miniTruckDB').collection('truck');
    const miniPoliceTruck = client.db('miniPoliceDB').collection('police');
    const sportsCollection = client.db('sportsCarDB').collection('sports');
    const allSportsCollection = client.db('allSportsDB').collection('allSports');
    const bookingCollection = client.db('sportsBookingDB').collection('sportsBooking');

    // fireTruck
    app.get('/trucks', async (req, res) => {
      const result = await miniTruckCollection.find().toArray();
      res.send(result);
    });

    app.get('/trucks/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await miniTruckCollection.findOne(query);
      res.send(result)
    });

    // policeTruck
    app.get('/polices', async (req, res) => {
      const result = await miniPoliceTruck.find().toArray();
      res.send(result);
    });

    app.get('/polices/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await miniPoliceTruck.findOne(query);
      res.send(result);
    });

    // sports
    app.get('/subSports', async (req, res) => {
      const result = await sportsCollection.find().toArray();
      res.send(result);
    });

    app.get('/subSports/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await sportsCollection.findOne(query);
      res.send(result);
    });

    // sports section

    app.post('/sports', async (req, res) => {
      const sportsCar = req.body;
      // console.log(query);
      const result = await allSportsCollection.insertOne(sportsCar);
      res.send(result);
    });

    app.get('/sports', async (req, res) => {
      const result = await allSportsCollection.find().toArray();
      res.send(result);
    });

    app.get('/sports/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const options = {
        projection: { details: 1, email: 1, price: 1, name: 1, photo: 1, quantity: 1, ratting: 1, userName: 1 }
      };
      const result = await allSportsCollection.findOne(query, options);
      res.send(result);
    });

    // booking

    app.post('/bookings', async (req, res) => {
      const query = req.body;
      const result = await bookingCollection.insertOne(query);
      res.send(result);
    });

    app.get('/bookings', async (req, res) => {
      const result = await bookingCollection.find().toArray();
      res.send(result)
    });
    
    app.get('/bookings/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const options = {
        projection: { details: 1, price: 1, quantity: 1,}
      };
      const result = await bookingCollection.findOne(query,options);
      res.send(result);
    });

    // booking delete
    app.delete('/bookings/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await bookingCollection.deleteOne(query);
      res.send(result);
    });

    // booking update

    app.put('/bookings/:id', async(req,res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const options = { upsert: true };
      const updateBookings = req.body;
      const updateDoc = {
        $set:{
            price:updateBookings.price,
            quantity:updateBookings.quantity,
            details: updateBookings.details
        }
      }
      const result = await bookingCollection.updateOne(filter,updateDoc,options);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('sports car server is running')
});
app.listen(port, () => {
  console.log(`sports car server is running on port: ${port} `);
});
