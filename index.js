const express = require("express");
require("dotenv").config();
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;

const app = express();

// middleware
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 7000;
const { MongoClient } = require("mongodb");

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ftdof.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("easy-travels");
    const servicesCollection = database.collection("easy-travels-services");
    const blogsCollection = database.collection("easy-travels-blogs");
    const OrdersCollection = database.collection("easy-travels-orders");
    const confirmOrdersCollection = database.collection(
      "easy-travels-confirmOrders"
    );

    //  get services api
    app.get("/services", async (req, res) => {
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });

    //get blogs api
    app.get("/blogs", async (req, res) => {
      const cursor = blogsCollection.find({});
      const blogs = await cursor.toArray();
      res.send(blogs);
    });

    // get orders api
    app.get("/orders", async (req, res) => {
      const cursor = OrdersCollection.find({});
      const orders = await cursor.toArray();
      res.send(orders);
    });

    // get single order api
    app.get("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const order = await OrdersCollection.findOne(query);
      res.json(order);
    });

    // post services api

    app.post("/services", async (req, res) => {
      const service = req.body;

      const result = await servicesCollection.insertOne(service);

      res.json(result);
    });

    //post orders api
    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = await OrdersCollection.insertOne(order);
      res.json(result);
    });

    //post confirm orders api

    // app.post("/orders/Confirm", async (req, res) => {
    //   const order = req.body;
    //   const result = await OrdersCollection.insertOne(order);
    //   res.json(result);
    // });

    //delete api

    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };

      const result = await OrdersCollection.deleteOne(query);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send(`<h1>Server Says Hello!</h1>`);
});

app.listen(port, () => {
  console.log(`App listening at Port: ${port}`);
});
