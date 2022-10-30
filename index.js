const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://mostafiz1:OOFArUk03SmK0o8r@cluster0.mniec4l.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const userCollection = client.db('nodeMongoCrud').collection('newUsers');
        // const newUser = { name: 'rasal', email: 'rasal@gmail.com' };
        // const result = await userCollection.insertOne(newUser);
        // console.log(result);

        /* get data from DB */
        app.get('/users', async (req, res) => {
            const query = {};
            const cursor = userCollection.find(query);
            const users = await cursor.toArray();
            res.send(users);
        })

        /* receive data from client side and send to DB */
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.send(result);
            console.log(result);
        })

        /* update specific user info */
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const user = await userCollection.findOne(query);
            res.send(user);
        })

        /* update user in DB and server */
        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const updatedUser = req.body;
            const option = { upsert: true };
            const newUpdatedUser = {
                $set: {
                    name: updatedUser.name,
                    address: updatedUser.address,
                    email: updatedUser.email
                }
            };
            const result = await userCollection.updateOne(filter, newUpdatedUser, option);
            res.send(result);
            console.log(updatedUser)
        })

        /* delete data from DB and server */
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await userCollection.deleteOne(query);
            res.send(result);
            console.log(result);
        })
    }
    finally {

    }
}

run().catch(error => console.error(error))


app.get('/', (req, res) => {
    res.send('Be patient!! Server is coming soon!!')
})

app.listen(port, () => {
    console.log(`listening to port ${port}`)
})