const express = require('express');
const app = express();
const cors = require("cors")
app.use(express.json());
const path = require("path");
app.use(cors())

const {open} = require("sqlite");
const sqlite3 = require("sqlite3");
const dbPath = path.join(__dirname,"task.db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")


let db = null;
initializeDBAndServer = async() =>{
    try{
    db = await open({
        filename:dbPath,
        driver:sqlite3.Database
    })

     await db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT,
                password TEXT
            );
        `)

     await db.run(` CREATE TABLE IF NOT EXISTS todo (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        description TEXT);`)

    await db.run(`CREATE TABLE IF NOT EXISTS bullet (id INTEGER PRIMARY KEY AUTOINCREMENT,titles TEXT);`)
    app.listen(5000,()=>{console.log("server is started and running")})
}
   catch(error){
    console.log(`connection error ${error.message}`)
   }
}

initializeDBAndServer() 

const authenticateToken = (request,response,next) =>{
   let jwtToken;
   const authHeader = request.headers['authorization']

   if (authHeader !== undefined){
     jwtToken = authHeader.split(" ")[1]
   }
   if(jwtToken == undefined){
     response.status(401)
     response.send("Invalid jwt Token")
   }else{
    jwt.verify(jwtToken,'MY_SECRET', (error,payload)=>{
        if(error){
            response.status(401)
            response.send("Invalid jwtToken")
        }else{
            //console.log(payload)
            request.username = payload.username
            next();
        }
    })
   }
}

app.post("/signup", async (req,res)=>{
    const {username,password} = req.body
    const passwordEncrypted = await bcrypt.hash(password,10) 
    const userExists = `SELECT * FROM users WHERE username='${username}';`
    const dbUser = await db.get(userExists) 

    if(dbUser === undefined){
         const createUser = `INSERT INTO users (username,password) VALUES ('${username}','${passwordEncrypted}');`
         if(password.length < 5){
            res.status(400)
            res.send("Password is too short")
         }else{
            await db.run(createUser)
            res.status(200)
            res.send("User Created Successfully")
         }
        }else{
            res.status(400)
            res.send("User already Exists")
        }
})

app.post('/login', async (req,res) =>{
    const {username,password} = req.body 
    const selectQuery = `SELECT * FROM users WHERE username='${username}';`
    const userexists = await db.get(selectQuery)

    if(userexists !== undefined){
        let isUser = await bcrypt.compare(password,userexists.password) 

        if(isUser === true){
            const payload = {
                username:username
            }
            const jwtToken = jwt.sign(payload,'MY_SECRET')
            res.status(200) 
            res.send({jwtToken})
        }else{
            res.status(400)
            res.send("Invalid Password")
        }
    }else{
        res.status(400)
        res.send("Invalid User")
    }
})

app.get('/tasks',authenticateToken, async (req,res)=>{
    const getQuery = `SELECT * FROM todo;` 
    const resp = await db.all(getQuery) 
    res.send(resp);
})

app.post('/add-task',authenticateToken,async (req,res)=>{
    const {title,description} = req.body;
    const insertQuery = `INSERT INTO todo (title,description) VALUES ('${title}','${description}');`
    await db.run(insertQuery);
    res.send("task added sucessfully")
})

app.put('/update-task/:id',authenticateToken, async (req,res)=>{
    const {id} = req.params 
    const {title,description} = req.body
    const updateQuery = `UPDATE todo SET title='${title}',description='${description}' WHERE id=${id};`
    await db.run(updateQuery)
    res.send("task Updated Successfully")
})

app.get('/profile',authenticateToken , async (req,res)=>{
    const username = req.username 
    res.send({username})
})

app.delete('/delete-task/:id',authenticateToken, async (req,res)=>{
    const {id} = req.params 
    const deleteQuery = `DELETE FROM todo WHERE id=${id};`
    await db.run(deleteQuery);
    res.send("task Deleted Successfully")
})

app.post('/bullet',authenticateToken,async (req,res)=>{
    const {titles} = req.body 
    console.log(titles)
    const addBulletQuery = `INSERT INTO bullet (titles) VALUES ('${titles}');`
    db.run(addBulletQuery)
    res.send("bullet added successfully")
})

app.get("/get-bullet",authenticateToken,async (req,res)=>{
     const getBulletQuery = `SELECT * FROM bullet;`
     const bulletsData = await db.all(getBulletQuery) 
     res.send(bulletsData);
})

app.delete('/delete-bullet',authenticateToken,async (req,res)=>{
    const deleteBulletQuery = 'DELETE FROM bullet'
    await db.run(deleteBulletQuery);
    res.send("bullet deleted successfully")
})


module.exports = app;