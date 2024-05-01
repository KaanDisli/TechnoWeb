const Users = require("./users.js");

class Messages {

    constructor(db) {
    this.db = db
    this.client = db 
    this.dbName  = "Asso"
    this.messageCount = 0
    this.connectToMongo()
    
    // suite plus tard avec la BD
    }
    async connectToMongo() {
        try {
            // Connect to MongoDB
            await this.client.connect();
            //console.log("TEST 10")
            console.log("Connected to MongoDB");
        } catch (error) {
            console.error("Error connecting to MongoDB:", error);
            throw error;
        }
    }


    async modifyMessage(old_message,new_message,userid){
        try{
        console.log("test1")
        const updateQuery = { "message": old_message, "userID":parseInt(userid) };
        const updateOperation = { $set: { "message": new_message } }; 
        const findMessage = await this.getMessages(updateQuery);
        console.log("findMessage")
        console.log(findMessage)
        if (findMessage.length>=1){
            await this.client.db(this.dbName).collection("Messages").updateOne(updateQuery, updateOperation);
            return findMessage[0].messageID
        }
        else{
            return -1
        }
        }catch{
            console.error("Error in get:", error);
            throw error;
        }
    }
    async getMessages(query){
        try{
            console.log("query: "+ query)
            await this.client.connect();
            const foundMessages = await this.client.db(this.dbName).collection("Messages").find(query)
            const foundMessagesArray = await foundMessages.toArray()
            console.log("Found messages")
            console.log(foundMessagesArray)
            return foundMessagesArray

        } catch (error) {
            console.error("Error in get:", error);
            throw error;
        }
    }
    async deleteMessage(query){
        try {  
            
            
            const findMessage = await this.getMessages(query);

            if (findMessage.length>=1){
                
                await this.client.db(this.dbName).collection("Messages").deleteOne(query)
                
                return findMessage[0].messageID
            }
            else{
                
                //console.log("inside delete else")
                return -1
            }

        } catch (error) {
        console.error("Error in get:", error);
        throw error;
        }
    }



    async exists(userid) {
        try {
            
            const users = new Users.default(this.client);
            const query = { "id": parseInt(userid) };
            const findUser = await users.search(query);
            //console.log("query:",query)
            //console.log("findUser:",findUser)
        
                if (findUser) {
                    return true;
                } else {
                    return null;
                }
            } catch (error) {
                console.error("Error in get:", error);
                throw error;
            }
        }



    
    async createMessage(messageContent,userid){



        try{
            
            const userExists = await this.exists(userid)
            
            if (!userExists || !messageContent){
                return -1
            }
            this.messageCount +=1 
            const messageID = this.messageCount

            const messageToPost = {
                "messageID":messageID,
                "userID":parseInt(userid),
                "message": messageContent 
            }
            //console.log("TEST 3")
            await this.connectToMongo();
            await this.client.db(this.dbName).collection("Messages").insertOne(messageToPost)
            //console.log("TEST 4")
            return messageID
        }catch(erreur){
            console.error(erreur);
        }
        

    }


}


exports.default = Messages;