const express = require("express");
const Users = require("./entities/users.js");


const { MongoClient } = require('mongodb');
const url = "mongodb+srv://elyes2507:elyes2002@cluster0.k8lvexg.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(url);




function init(db) {
    const router = express.Router();
    // On utilise JSON
    router.use(express.json());
    router.use((req, res, next) => {
        console.log('API: method %s, path %s', req.method, req.path);
        console.log('Body', req.body);
        next();
    });
    const users = new Users.default(client);

    router.post("/user/register",async (req,res) => {
        console.log("inside register")
        try{
            const { login,firstname, lastname, password, repeatpassword } = req.body;
            if (!login || !password ||!firstname||!lastname||!repeatpassword || (password != repeatpassword)) {

                //console.log("test4")
                res.status(400).json({
                    status: 400,
                    "message": "Requête invalide : missing credentials"
                });
                return  
            }       
            const userid = await users.create(login, password, lastname, firstname)  
            //console.log("userid in api: " + userid) 
            if (userid == -1){
                res.status(409).json({
                    status: 409,
                    message: "Login already exists",

                });
                return
            }
            if (userid){
                res.status(200).json({
                    status: 200,
                    message: "User succesfully registered",
                    userID: userid,  // ON PEUT LE CHANGER APRES PAS SUR
                    
                });
                return  
            }
        }
        catch{
            res.status(500).json({
                status: 500,
                message: "erreur interne",
                details: (e || "Erreur inconnue").toString()
            });

        }
    })

    router.get("/user/infos", async (req, res) => { 
        const userCount = users.getUserCount()
        try{
            res.status(200).json({
                status: 200,
                "count" : userCount 
            });
        }catch{

        }

    })

    
    router.post("/user/login", async (req, res) => {
        //console.log("test1o")
        //console.log("req: " + JSON.stringify(req.body))
        try {
            //console.log("test3")
            const { login, password } = req.body;
            // Erreur sur la requête HTTP
            //console.log("password: "+ password)
            if (!login || !password) {
                //console.log("test4")
                res.status(400).json({
                    status: 400,
                    "message": "Requête invalide : login et password nécessaires"
                });
                return;
            }
            if(! await users.exists(login)) {
                //console.log("test5")
                res.status(401).json({
                    status: 401,
                    message: "Utilisateur inconnu"
                });
                return;
            }
            //console.log("test6")
            let userid = await users.checkpassword(login, password);
            //console.log("userid: " + userid)
            //console.log("userid is api: ",userid)
            if (userid) {
                // Avec middleware express-session
                //console.log("theres userid")
                req.session.regenerate(function (err) {
                    if (err) {
                        //console.log("test7")
                        res.status(500).json({
                            status: 500,
                            message: "Erreur interne"
                        });
                    }
                    else {
                        // C'est bon, nouvelle session créée
                        req.session.userid = userid;
                        
                        res.status(200).json({
                            status: 200,
                            message: "Login et mot de passe accepté",
                            userID: userid  // ON PEUT LE CHANGER APRES PAS SUR
                        });
                    }
                });
                return;
            }
            //console.log("there isnt userid")
            // Faux login : destruction de la session et erreur
            req.session.destroy((err) => { });
            res.status(403).json({
                status: 403,
                message: "login et/ou le mot de passe invalide(s)"
            });
            return;
        }
        catch (e) {
            // Toute autre erreur
            res.status(500).json({
                status: 500,
                message: "erreur interne",
                details: (e || "Erreur inconnue").toString()
            });
        }
    });



    router
        .route("/user/:user_id(\\d+)") 
        
        .get(async (req, res) => {
            //console.log("entered userid")
        try {
            console.log("req.params.user_id: " + req.params.user_id)
            const user = await users.get(req.params.user_id);
            console.log("User:")
            console.log(user)
            if (!user)
                res.sendStatus(404);
            else

                res.send(user);
        }
        catch (e) {
            res.status(500).send(e);
        }
    })
        .delete(async (req, res) => {
        
        try {
            const userId = req.params.user_id;
            const deletedUserId = await users.delete(userId);
            if (deletedUserId != -1) {
                res.status(200).json({
                    status: 200,
                    message: "User successfully deleted"
                });
            } else {
                res.status(404).json({
                    status: 404,
                    message: "User not found"
                });
            }
        } catch (error) {
            res.status(500).json({
                status: 500,
                message: "Internal server error",
                details: error.toString()
            });
        }
    });

    router
        .route("/user/:user_id(\\d+)/logout") //peut avoir un probleme
        
        .delete(async (req, res) => {
            console.log("inside /logout")
            try {
                const userId = req.params.user_id;
                const logoutID = await users.exists(userId);
                if (logoutID){
                    res.status(401).json({
                        status: 401,
                        message: "User not found"
                    });
                }
                else{
                    users.closeConnection()
                    res.status(200).json({
                        status: 200,
                        message: "Session ended"
                    });                    
                }
            } catch (error) {
                res.status(500).json({
                    status: 500,
                    message: "Internal server error",
                    details: error.toString()
                });
            }
        });

    
    router
        .route("/user/:user_id(\\d+)/admin")

        .get(async (req, res) => {
            try{
                const userId = req.params.user_id;
                const isAdmin = await users.verifyAdmin(userId)
                if (!isAdmin){
                    res.status(403).json({
                    status: 403,
                    message: "Access Denied"
                    
                });
                return  
                }

                const AllUsers = await users.searchAll()
                res.status(200).json({
                    status: 200,
                    message: AllUsers
                    
                });
                return  
    
            }
            catch{
                res.status(500).json({
                    status: 500,
                    message: "erreur interne",

                });
    
            }
        })
        
    router
        .route("/user/:user_id(\\d+)/admin/:user_id2(\\d+)/setAdmin")

        .post(async (req, res) => {
            try{

                const userId = req.params.user_id;
                const userId2 = req.params.user_id2;
                const isAdmin = await users.verifyAdmin(userId)
                if (!isAdmin){
                    res.status(403).json({
                    status: 403,
                    message: "Access Denied"
                    
                });
                    return  
                }
                console.log("TEST 1")
                const setAdmin = await users.setAdmin(userId2)
                console.log("TEST 2")
                if (setAdmin == -1){
                    res.status(401).json({
                        status: 401,
                        message: "User not found"
                    });
                    return 
                }
                res.status(200).json({
                    status: 200,
                    message: "User succesfully set admin"
                    
                });
                return  
                
    
   
            }
            catch{
                res.status(500).json({
                    status: 500,
                    message: "erreur interne",

                });
    
            }
        })
    router
        .route("/user/:user_id(\\d+)/admin/:user_id2(\\d+)/confirmed")

        .post(async (req, res) => {
            try{

                const userId = req.params.user_id;
                const userId2 = req.params.user_id2;
                const isAdmin = await users.verifyAdmin(userId)
                if (!isAdmin){
                    res.status(403).json({
                    status: 403,
                    message: "Access Denied"
                    
                });
                    return  
                }

                const setAdmin = await users.confirmUser(userId2)

                if (setAdmin == -1){
                    res.status(401).json({
                        status: 401,
                        message: "User not found"
                    });
                    return 
                }
                res.status(200).json({
                    status: 200,
                    message: "User succesfully confirmed"
                    
                });
                return  
                
    
   
            }
            catch{
                res.status(500).json({
                    status: 500,
                    message: "erreur interne",

                });
    
            }
        })
    
    
    router.put("/user", (req, res) => {
        const { login, password, lastname, firstname } = req.body;
        if (!login || !password || !lastname || !firstname) {
            res.status(400).send("Missing fields");
        } else {
            users.create(login, password, lastname, firstname)
                .then((user_id) => res.status(201).send({ id: user_id }))
                .catch((err) => res.status(500).send(err));
        }
    });

    return router;
}
exports.default = init;

