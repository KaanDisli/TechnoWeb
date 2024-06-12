const express = require("express");
const Messages = require("./entities/messages.js");


const { MongoClient } = require('mongodb');
const url = "mongodb+srv://elyes2507:elyes2002@cluster0.k8lvexg.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(url);

function init(db) {

    const router = express.Router();
    router.use(express.json());
    router.use((req, res, next) => {
        console.log('API: method %s, path %s', req.method, req.path);
        console.log('Body', req.body);
        next();
    });
    const messages = new Messages.default(client);
    router.get("/infos", async (req,res) =>{

        
        try{
            const AllMessages = await messages.getMessages({})

            console.log("All Messages:")
            console.log(AllMessages.length)
            res.status(200).json({
                status: 200,
                count: AllMessages.length

            });
            return
        }catch{
            res.status(500).json({
                status: 500,
                message: "erreur interne"

            });
            return
        }

    })
    router.get("/messages", async (req,res) =>{
        try{
            const AllMessages = await messages.getMessages({})

            console.log("All Messages:")
            console.log(AllMessages)
            res.status(200).json({
                status: 200,
                message: AllMessages

            });
            return
        }catch{
            res.status(500).json({
                status: 500,
                message: "erreur interne"

            });
            return
        }
    })

    router.get("/user/:user_id(\\d+)/infos", async (req, res) => { 
        try{
            const userid = req.params.user_id
            const query = {"userID":parseInt(userid)}
            const messageRetrieved = await messages.getMessages(query)
            console.log("messageRetrieved")
            console.log(messageRetrieved)
            const messageCount = messageRetrieved.length
            res.status(200).json(
                {messages: messageRetrieved }
            );
        }
        catch{
            res.status(500).json({
                status: 500,
                message: "erreur interne"

            });
            return            
        }



    })
    router.post("/user/:user_id(\\d+)/messages", async (req, res) => { 

        
        try{
            console.log("TEST2")
            const messageContent = req.body.message 
            const userid =  req.params.user_id;
            const messageID = await messages.createMessage(messageContent, userid,0)
            console.log("TEST 5")
            if (messageID == -1 || !messageContent){
                res.status(401).json({
                    status: 401,
                    "message" : "User doesn't exist or missing fields"
                });
                return 
            }
            console.log("TEST 6")
            if (messageID){
                res.status(200).json({
                    status: 200,
                    "id" : messageID 
                });
                return

            }
        }catch{
            res.status(500).json({
                status: 500,
                message: "erreur interne"

            });
            return
        }

        
    })
    
    router.delete("/user/:user_id(\\d+)/messages", async (req, res) => { 

        
        try{
            
            const messageContent = req.body.message
            
            const userid =  req.params.user_id;
            
            const query = {"message": messageContent, "userID": parseInt(userid)};
            
            const retrievedMessage = await messages.deleteMessage(query)
           
            
            if (retrievedMessage == -1 || !messageContent){
                res.status(401).json({
                    status: 401,
                    "message" : "User/message doesn't exist or wrong fields"
                });
                return 
            }

            else{
                res.status(200).json({
                    status: 200,
                    "message" : "message " + retrievedMessage + " deleted"
                });
                return

            }
        }catch{
            res.status(500).json({
                status: 500,
                message: "erreur interne"

            });
            return
        }

        
    })
    router.put("/user/:user_id(\\d+)/messages", async (req, res) => { 

        
        try{
            const newMessage = req.body.new_message
            const oldMessage = req.body.old_message
            const userid =  req.params.user_id;
            const messageID = await messages.modifyMessage(oldMessage,newMessage,userid)
            console.log("TEST 4 ")
            console.log("messageID " + messageID)
            if (messageID == -1 || !newMessage || !oldMessage){
                res.status(401).json({
                    status: 401,
                    "message" : "Message doesn't exist for this user or  wrong fields"
                });
                return 
            }
            else{
                res.status(200).json({
                    status: 200,
                    "message" : newMessage
                });
                return
            }
            
            
        }catch{
            res.status(500).json({
                status: 500,
                message: "erreur interne"

            });
            return
        }

        
    })

    router.post("/user/:user_id(\\d+)/messages/:message_id(\\d+)/reply", async (req, res) => { 
        try{

            const messageContent = req.body.message 
            const userid =  req.params.user_id;
            const reply_id = req.params.message_id;
            const messageID = await messages.createMessage(messageContent, userid,reply_id)

            if (messageID == -1 || !messageContent){
                res.status(401).json({
                    status: 401,
                    "message" : "User doesn't exist or missing fields"
                });
                return 
            }

            if (messageID){
                res.status(200).json({
                    status: 200,
                    "id" : messageID 
                });
                return

            }
        }catch{
            res.status(500).json({
                status: 500,
                message: "erreur interne"

            });
            return
        }


    })
    return router;

}
exports.default = init;