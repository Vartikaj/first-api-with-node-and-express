//import mongo client
const { MongoClient, ObjectId } = require("mongodb")

//import the database connection string...
const uri = require("./atlas_uri");
const { param } = require("express/lib/request");
console.log(uri);
//initialize the mongo class object to 
const client = new MongoClient(uri)
//add the database name and collection name for stablishing the collection
const dbName = "bank"
const collectionName = "accountUsers"
const transferAccount = "transferAccount"

const accountCollections = client.db(dbName).collection(collectionName)
//const accountCollections = client.db(dbName).collection(transferAccount)


const ConnectToDatabase = async () => {
    try{
        await client.connect();
        console.log(`connected to the ${dbName} database`);
    } catch (err) {
        console.log(`Error connecting to the database: ${err}`);
    }
};



const accountDetails = [{
    account_holder : "Yukti Awasthi",
    account_id : "PUNB02134577",
    account_type : "saving",
    balnace: 4700,
    last_updated: new Date(),
},
{
    account_holder : "Shreya Shukla",
    account_id : "PUNB0213448",
    account_type : "saving",
    balnace: 4000,
    last_updated: new Date(),
}

]

//For multiple result based on condition
//const documentToFind = {balnace: { $gt : 9000 }}
//===========

/*
 * FOR CALL "OBJECTID" WE NEED TO ADD THIS AT THE TOP OF THE BAR WHERE WE DECLARE
 * THE MONGO CLIENT
 */

const main = async () => {
    try{
        await ConnectToDatabase()

        let result = await accountCollections.insertMany(accountDetails)
        //let countData = await accountDetails.insertedCount(accountDetails)
        console.log(`${(result.insertedCount)} Data Added Successfully!!!`)
        //For multiple result based on condition
        // let result = accountCollections.find(documentToFind)
        //==============

        // let documentToFind = {account_type: "saving"}
        // let updateFilter = { $push: { TransactionId: "TBAC00023456"} }
        // let deleteFilter = { account_holder: "Vrinda Mishra" }


        //FOR DOING UPDATION IN THE SINGLE INSTANCE
        // let updateData = { $inc : { balnace : 100 }}
        //=========================================
        
        // let result = await accountCollections.findOne(documentToFind)
        
        //FOR UPDATING THE SINGLE DOCUMENT
        // let updateResult = await accountCollections.updateOne(documentToFind, updateData)
        // updateResult.modifiedCount === 1 ? console.log('Update one document') : console.log('Update no document')
        //===========================

        //UPDATE MULTIPLE DOCUMENT
        // let updateResult = await accountCollections.updateMany(documentToFind, updateFilter)
        // updateResult.modifiedCount > 0 ? console.log(`upadte ${ updateResult.modifiedCount }`) : console.log(`No data has been updated`)
        //======================

        //DELETE MULTIPLE DOCUMENT
        // let deleteResult = await accountCollections.deleteMany(deleteFilter)
        // deleteResult.deletedCount > 0 ? console.log(`Delete ${ deleteResult.deletedCount }`) : console.log(`No data has been Deleted`)
        //======================

        // let countData = accountCollections.countDocuments(documentToFind)
        // for await (const doc of result) {
        //     console.log(doc)
        // }
        console.log(result)
        // console.log(`Found Data: ${await countData}`);
    } catch (err) {
        console.log(`Error during insertion to the document : ${err}`);
    } finally {
        await client.close();
    }
};

//RUN THE MAIN FUNCTION
main();