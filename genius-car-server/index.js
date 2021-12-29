const express = require("express");
const { MongoClient} = require('mongodb');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

const cors = require("cors")
const app = express();
const port = 5000;

// middleware
app.use(cors());
 app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zighg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// mongodb connection
async function run() {
    try {
      await client.connect();
      const database = client.db("carMechanic");
        const servicesCollection = database.collection("servicesCollection");

        // GET API
        app.get("/services", async (req, res) => { 
            const cursor = servicesCollection.find({}); 
            const services = await cursor.toArray();
            res.send(services)
        })
      
      // GET API for single  service
      app.get("/services/:id", async (req, res) => { 
        const id = req.params.id;
        const query = { _id:ObjectId(id)}
        const service = await servicesCollection.findOne(query);
        res.json(service)

      })
       
      // POST API
        app.post("/services", async (req, res) => { 
            // console.log("hit the post api");
            const service = req.body;
            const result = await servicesCollection.insertOne(service);
        //   console.log(result)
        })

      // DELETE API
      app.delete("/services/:id", async (req, res) => { 

        const id = req.params.id;
        const query = { _id:ObjectId(id) };
        const result = await servicesCollection.deleteOne(query);
        
        res.json(result)

      })
     
    }
    
    finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);

app.get("/", (req, res) => { 
    res.send("server created and check")
})

app.listen(port, (req, res) => { 
    console.log("server listening at  "+port)
})

// db user:genius-mechanics 
// db pass: IlV6CoXYNCvctoBI