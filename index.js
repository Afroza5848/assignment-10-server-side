const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());
// timberZone
// 9o4tFpMeAo3L9xzI



//const uri = "mongodb+srv://<username>:<password>@cluster0.uc5r0l2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uc5r0l2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    const itemsCollection = client.db("itemsDB").collection('item');
    const categoriesCollection = client.db("itemsDB").collection('categories');
   
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        app.get('/items', async(req,res) => {
            const cursor = itemsCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/items/:id', async(req,res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const result = await itemsCollection.findOne(query);
            res.send(result);
        })
        app.get('/myCraftList/:email', async(req,res) => {
            const email = req.params.email;
            const query = {user_email: email};
            const result = await itemsCollection.find(query).toArray();
            res.send(result)
            
        })

        app.post("/items" , async(req,res) => {
            console.log(req.body);
            const result = await itemsCollection.insertOne(req.body);
            res.send(result)
        })

        app.delete('/items/:id', async(req,res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const result = await itemsCollection.deleteOne(query);
            res.send(result)
        })
        app.put('/items/:id', async(req,res) => {
            const updateItem = req.body;
            const id = req.params.id;
            const filter = {_id: new ObjectId(id)};
            const options = { upsert: true };

            const item = {
                $set: {
                    item_name: updateItem.item_name,
                    subCatOption: updateItem.subCatOption,
                    massage: updateItem.massage,
                    photo: updateItem.photo,
                    price: updateItem.price,
                    rating: updateItem.rating,
                    processing_time: updateItem.processing_time,
                    stockOption: updateItem.stockOption,
                    customOption: updateItem.customOption
                }
            }
            const result = await itemsCollection.updateOne(filter,item,options);
            res.send(result);
        })
        //  art and craft categories
        app.get('/categories', async(req,res) => {
            const cursor = categoriesCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        }) 


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
    res.send('jute and timberZone server is running')
})
app.listen(port, () => {
    console.log(`timberZone server create on port:${port}`);
})