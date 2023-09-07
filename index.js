const express = require('express');
const app = express();

const cors = require('cors');

const { MongoClient, ServerApiVersion } = require('mongodb');
const objectId = require("mongodb").ObjectId;
require('dotenv').config();

const port = process.env.PORT || 7000;
// Middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rhkgk.mongodb.net/?retryWrites=true&w=majority`;

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


    const database = client.db("serpentineDB");
    const snakesCollection = database.collection("snakes");
    const medicineCollection = database.collection("medicine");
    const m_processCollection = database.collection("m_processing");
    const booksCollection = database.collection("books");
    const userCollection = database.collection("users");
    const orderCollection = database.collection("orders");

    app.post('/users', async (req, res) => {
      const user = req.body;
      const query = { email: user.email }
      const existingUser = await userCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: 'User already exists' })
      }
      const result = await userCollection.insertOne(user)
      res.send(result);
    })


    app.put("/users", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };

      const updateDoc = { $set: { role: "admin" } };
      const result = await userCollection.updateOne(filter, updateDoc);
      // const result = await usersCollection.updateOne(filter, updateDoc);
      res.json(result);
    });


    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await userCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === "admin") {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    });



    app.get('/snakes', async (req, res) => {
      const snake = await snakesCollection.find().toArray();
      res.send(snake);
    });

    app.post("/snakes", async (req, res) => {
      const snake = req.body;
      const result = await snakesCollection.insertOne(snake);
      res.json(result);
    });

    app.get('/snakes/:id', async (req, res) => {
      const id = req.params.id;
      const qurey = { _id: new objectId(id) };

      const snake = await snakesCollection.findOne(qurey);
      res.json(snake);
    });

    app.get('/m_processing', async (req, res) => {
      const snake = await m_processCollection.find().toArray();
      res.send(snake);
    });

    app.get('/m_processing/:id', async (req, res) => {
      const id = req.params.id;
      const qurey = { _id: new objectId(id) };
      const m_processing = await m_processCollection.findOne(qurey);
      res.send(m_processing);
    });




    app.delete("/snakes/:id", async (req, res) => {
      const id = req.params.id;
      const qurey = { _id: new objectId(id) };
      const result = await snakesCollection.deleteOne(qurey);
      res.json(result);
    });


    app.get('/medicine', async (req, res) => {
      const medcn = await medicineCollection.find().toArray();
      res.send(medcn);
    });

    app.post("/medicine", async (req, res) => {
      const medicine = req.body;
      const result = await medicineCollection.insertOne(medicine);
      res.json(result);
    });

    app.get('/medicine/:id', async (req, res) => {
      const id = req.params.id;
      const qurey = { _id: new objectId(id) };

      const medicine = await medicineCollection.findOne(qurey);
      res.json(medicine);
    });

    app.delete('/medicine/:id', async (req, res) => {
      const id = req.params.id;
      const qurey = { _id: new objectId(id) };

      const medicine = await medicineCollection.deleteOne(qurey);
      res.json(medicine);
    });




    // app.get('/m_processing', async(req,res) =>{
    //     const proessing = await m_processCollection.find().toArray();
    //     res.send(proessing);
    // });

    app.get('/books', async (req, res) => {
      const book = await booksCollection.find().toArray();
      res.send(book);
    });

    app.post("/books", async (req, res) => {
      const book = req.body;
      const result = await booksCollection.insertOne(book);
      res.json(result);
    });

    app.delete("/books/:id", async (req, res) => {
      const id = req.params.id;
      const qurey = { _id: new objectId(id) };
      const result = await booksCollection.deleteOne(qurey);
      res.json(result);
    });


    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.json(result);
    });


    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.json(result);
    });

    app.get("/orders", async (req, res) => {
      const cursor = orderCollection.find({});
      const order = await cursor.toArray();

      res.send(order);
    });

    //   app.get('/orders', async(req,res) =>{
    //     const order = await orderCollectionCollection.find().toArray();
    //     res.send(order);
    // });

    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const qurey = { _id: new objectId(id) };
      const result = await orderCollection.deleteOne(qurey);
      res.json(result);
    });



    app.put("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const updateStatus = req.body;
      const filter = { _id: new objectId(id) };
      const option = { upsert: true };
      const updateDoc = { $set: { status: updateStatus.status } };
      const result = await orderCollection.updateOne(
        filter,
        updateDoc,
        option
      );
      res.json(result);
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
  res.send('Serpentine World')
})

app.listen(port, () => {
  console.log(`Serpentine World ${port}`);
})