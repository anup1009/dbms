const path = require('path');
const express = require('express');
const ejs = require('ejs');
const bodyParser =require('body-parser');
const mysql = require('mysql');
const app = express();
const shortid = require('shortid');


const connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'password',
    database:'team'
})

connection.connect(function(error){
    if(error) console.log(error);
    else console.log('Database Connected');
});

//sett views file
app.set('views',path.join(__dirname,'views'));

//set view engine
app.set('view engine','ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));

app.get('/',(req,res)=>{
    // res.send('CRUD operation')
    let sql= "SELECT * FROM pltb";
    let query = connection.query(sql,(err,rows)=>{
        if(err) throw err;
        res.render('user_index',{
            title:'',
            pltb: rows
        })
    })
    
});

app.get('/add',(req, res) => {
    res.render('user_add', {
        title : 'CRUD Operation using NodeJS / ExpressJS / MySQL'
    });
});
 
app.post('/save',(req, res) => { 
    let data = { KN: req.body.KN, PN: req.body.PN, DOB: req.body.DOB, Location: req.body.Location};
    let sql = "INSERT INTO pltb SET ?";
    let query = connection.query(sql, data,(err, results) => {
      if(err) throw err;
      res.redirect('/');
    });
});
app.get('/edit/:Playerid',(req, res) => {
    const Playerid = req.params.Playerid;
    let sql = `Select * from pltb where id = ${Playerid}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.render('user_edit', {
            title : 'Editing a Player',
            Player : result[0]
        });
    });
});

app.post('/update',(req, res) => {
    const Playerid = req.body.id;
    let sql = `update pltb SET KN='"+req.body.KN+"',  PN='"+req.body.PN+"',    Location='"+req.body.Location+"',  MP='"+req.body.MP+"',  GS='"+req.body.GS+"',  ASI='"+req.body.ASI+"' where id =${Playerid}`;
    let query = connection.query(sql,(err, results) => {
      if(err) throw err;
      res.redirect('/');
    });

});

app.get('/delete/:Playerid',(req, res) => {
    const Playerid = req.params.Playerid;
    let sql = `DELETE fROM team.pltb WHERE id = ${Playerid}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.redirect('/');
    });
});


// http://localhost:3000/home
app.get('/', function(request, response) {
	// If the user is loggedin
	if (request.session.loggedin) {
		// Output username
		response.send('Welcome back, ' + request.session.username + '!');
	} else {
		// Not logged in
		response.send('Please login to view this page!');
	}
	response.end();
});


app.listen(3000,()=>{
    console.log('server is running at port 3000');
});


