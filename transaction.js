const { MongoClient } = require ('mongodb')
const uri = require("./atlas_uri")
const client = new MongoClient(uri)


//STABLISH A CONNECTION WITH DATABASE AND TABLES
const accountUsers = client.db("bank").collection("accountUsers")
const transferUser = client.db("bank").collection("transferAccount")
//==================

let senderId = "PUNB0213456"
let receiverId = "PUNB0213458"
let transactionAmount = 100

//START NEW SESSION
let session;
const main = async () => {
    try{
        // await ConnectToDatabase()
        session = client.startSession()
        const transactionResult = await session.withTransaction(async () => {
            const senderUpdate = await accountUsers.updateOne(
                { account_id : senderId },
                { $inc : { balnace : -transactionAmount } },
                { session }
            )

            console.log(`${senderUpdate.matchedCount} ${senderUpdate.modifiedCount} sender data is updated`)
        
            const receiverUpdate = await accountUsers.updateOne(
                { account_id: receiverId },
                { $inc : { balnace : transactionAmount } },
                { session }
            )
            console.log(`${receiverUpdate.modifiedCount} receiver data is updated`)
        
            const transfer = {
                transfer_id: "TR21872187",
                amount: 100,
                from_account: senderId,
                to_account: receiverId,
            };
        
            const transection = await transferUser.insertOne(
                transfer ,
                { session }
            )

            console.log(`${transection.insertedId}  data is inserted`)
        
            const updateSenderData = await accountUsers.updateOne(
                { account_id : senderId },
                { $push : { transactionInfo : transfer.transfer_id }},
                { session }
            )
            console.log(`${updateSenderData.modifiedCount} sender data is updated`)
        
            const updateReceiverData = await accountUsers.updateOne(
                { account_id : receiverId },
                { $push : { transactionInfo : transfer.transfer_id }},
                { session }
            )
            console.log(`${updateReceiverData.modifiedCount} receiver data is updated`)
            // return true;
        });
        
        if(transactionResult){
            console.log("Transaction Completed")
        }else {
            console.log("Transaction Not Completed")
        }
    } catch (err) {
        console.log(`Error connecting to the database: ${err}`);
    }  finally {
        await session.endSession();
        await client.close();
    }
}
main();

