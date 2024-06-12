class Users {

    constructor(db) {
    this.db = db
    this.client = db 
    this.dbName  = "Asso"
    this.userCount = 1
    this.connectToMongo();
    this.createAdmin()
    // suite plus tard avec la BD
    }

    getUserCount(){
        return this.userCount
    }
    
    async createAdmin(){
        const adminExists = await this.get("1")
        if (adminExists){
            return 
        }
        else{
            const newMessage = {
                "id": 1,
                "login":"admin",
                "firstname": "admin",
                "lastname": "admin",
                "password":"admin",
                "confirmed": true,
                "admin":true
            }
            await this.client.connect();
            await this.client.db(this.dbName).collection("Users").insertOne(newMessage)
        }
    }


    async connectToMongo() {
        try {
            // Connect to MongoDB
            await this.client.connect();
            
            console.log("Connected to MongoDB Users");
        } catch (error) {
            console.error("Error connecting to MongoDB:", error);
            throw error;
        }
    }
    async closeConnection() {
        try {
            if (this.client && this.client.topology && this.client.topology.isConnected()) {
                await this.client.close();
                console.log("MongoDB connection closed");
            } else {
                console.log("MongoDB connection is already closed");
            }
        } catch (error) {
            console.error("Error closing MongoDB connection:", error);
            throw error;
        }
    }
    async search(query){
        //console.log("test 4")
        try{
            await this.client.connect();
            
            const foundMessage = await this.client.db(this.dbName).collection("Users").find(query)
            const arrayListMessages = await foundMessage.toArray();
            

            return arrayListMessages[0]
            
        } catch (erreur) {
            console.error(erreur);
        } 

    }
    async searchAll(){ /// JE VAIS MODIFIER ÇA PLUS TARD
        //console.log("test 4")
        try{
            await this.client.connect();
            
            const foundMessage = await this.client.db(this.dbName).collection("Users").find({})
            const arrayListMessages = await foundMessage.toArray();
            

            return arrayListMessages
            
        } catch (erreur) {
            console.error(erreur);
        } finally {
            await this.client.close();
        }


    }
    async create(login, password, lastname, firstname) {
        
        try{

            await this.client.connect();
            this.userCount += 1
            const id = this.userCount 
            
            console.log("id: " + id)

            const user = await this.client.db(this.dbName).collection("Users").findOne({"login":login})
            if (user){
                return -1
            }
            

            const newMessage = {
                "id": id,
                "login":login,
                "firstname": firstname,
                "lastname": lastname,
                "password":password,
                "confirmed": false,
                "admin":false
            }
            await this.client.db(this.dbName).collection("Users").insertOne(newMessage)
            return id
        } catch (erreur) {
            console.error(erreur);
        }
    }
    
    async get(userid) {
        try {
            await this.client.connect();
            //console.log("we are inside the get");
            const query = { "id": parseInt(userid) };
            const findUser = await this.search(query);
            if (findUser) {
                return findUser;
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error in get:", error);
            throw error;
        }
    }


    async delete (userid){
        //console.log("entered delete in Users")
        try {  
            
            const query = { "id": parseInt(userid) };
            const findUser = await this.search(query);

            if (findUser){
                await this.client.db(this.dbName).collection("Users").deleteOne(query)
                return userid
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

    async exists(login) {
        try {
            
            const query = { "login": login };
            const findUser = await this.search(query);
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
    async checkpassword(login, password) {

            try {
                
                const query = { "login": login};
                const findUser = await this.search(query);
                //console.log("findUser TEST9: " )
                //console.log(findUser)
                if(findUser.password != password) {
                    //erreur
                        return null
                    } else {
                        const userid = findUser.id
                        return userid
                        
                    }
            }catch (error) {
                console.error("Error in get:", error);
                throw error;
            }


     
    }
    async setAdmin(userid){
        try{
       
        const updateQuery = { "id":parseInt(userid) };
        const updateOperation = { $set: { "admin": true } }; 


        const exists = await this.search(updateQuery);

        if (exists){
            

            await this.client.db(this.dbName).collection("Users").updateOne(updateQuery, updateOperation);
            
            return parseInt(userid)
        }
        else{
        
            return -1
        }
        }catch(error){
       
            console.error("Error in get:", error);
            throw error;
        }
    }
    async verifyAdmin(userid){
        const query ={ "id":parseInt(userid)}
        const possibleAdmin = await this.search(query)
        if (!possibleAdmin){
            return false
        }
        return (possibleAdmin.admin == true)


    }
    async confirmUser(userid){
        try{
       
        const updateQuery = { "id":parseInt(userid) };
        const updateOperation = { $set: { "confirmed": true } }; 


        const exists = await this.search(updateQuery);


        if (exists){
            await this.client.db(this.dbName).collection("Users").updateOne(updateQuery, updateOperation);
            return parseInt(userid)
        }
        else{
            return -1
        }
        }catch(error){

            console.error("Error in get:", error);
            throw error;
        }
    }
}
exports.default = Users;