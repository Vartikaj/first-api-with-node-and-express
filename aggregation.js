const { MongoClient } = require('mongodb')
const uri = require('./atlas_uri')
const client = new MongoClient(uri)

const dbName = "orderData";
const collectionName = "order";

const dbCollections = client.db(dbName).collection(collectionName)

const ConnectToDB = async () => {
    try {
        await client.connect();
        console.log(`connect with database`);

    } catch (err) {
        console.log(`Having a connection error : ${err}`);
    }
};

const main = async () => {
    try {
        await ConnectToDB()

        // let result = await dbCollections.insertMany( [
        //     { _id: 0, name: "Pepperoni", size: "small", price: 19,
        //       quantity: 10, date: Date( "2021-03-13T08:14:30Z" ) },
        //     { _id: 1, name: "Pepperoni", size: "medium", price: 20,
        //       quantity: 20, date : Date( "2021-03-13T09:13:24Z" ) },
        //     { _id: 2, name: "Pepperoni", size: "large", price: 21,
        //       quantity: 30, date : Date( "2021-03-17T09:22:12Z" ) },
        //     { _id: 3, name: "Cheese", size: "small", price: 12,
        //       quantity: 15, date : Date( "2021-03-13T11:21:39.736Z" ) },
        //     { _id: 4, name: "Cheese", size: "medium", price: 13,
        //       quantity:50, date : Date( "2022-01-12T21:23:13.331Z" ) },
        //     { _id: 5, name: "Cheese", size: "large", price: 14,
        //       quantity: 10, date : Date( "2022-01-12T05:08:13Z" ) },
        //     { _id: 6, name: "Vegan", size: "small", price: 17,
        //       quantity: 10, date : Date( "2021-01-13T05:08:13Z" ) },
        //     { _id: 7, name: "Vegan", size: "medium", price: 18,
        //       quantity: 10, date : Date( "2021-01-13T05:10:13Z" ) }
        //  ] );

        await dbCollections.aggregate([
            {
                $match : { $size : "medium" }
            },
            {
                $group: { 
                    _id : "$name", totalQuantity : {$sum : "$quantity"}
                }
            }
        ])

        //console.log(`${result.insertCount} Number of stuent added!!!`)

    } catch (err) {
        console.log(`Error occur while insertion : ${err}`)
    } finally {
        await client.close()
    }
};

main();
