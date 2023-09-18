const { MongoClient } = require('mongodb')
const uri = require('./atlas_uri')
const client = new MongoClient(uri)

const dbName = "bank"
const collectionDB = "accountUsers"

const dbConnection = client.db(dbName).collection(collectionDB)

const ConnectToDb = async () => {
    try{
        await client.connect()
        console.log(`Connected the the database`)
    } catch (err) {
        console.log(`Error : ${err} , While connecting with the database`)
    }
};

let pipeline = [
    { $match : { account_type : "saving", balnace : { $gte : 1500 } } },
    { $sort : { balnace : -1 } },
    { $project : { _id : 0, account_id : 1, account_type : 1, balnace : 1, gbp_balance: { $divide : ["$balnace", 1.3] }} }
];

const main = async () => {
    try{
        await ConnectToDb()
        let result = await dbConnection.aggregate(pipeline);
        for await (const doc of result) {
            console.log(doc);
        }
    } catch (err) {
        console.log(`Having an error : ${err}`);
    } finally {
        await client.close();
    }
};

main();