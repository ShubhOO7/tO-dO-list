const ejs = require("ejs");
const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');
const { title } = require("process");

const app = express();

let items = ["Buy food","Eat food","Give food"]; 
let workItems =  ["Home Work"];

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine','ejs');
app.use(express.static("public"));
//app.use(express.static(path.join(__dirname, 'public')));

var today = new Date();

var options = {
    weekday : "long",
}
var day = today.toLocaleDateString("en-US",options);
var koptions = {
    day : "numeric",
}
var date = today.toLocaleDateString("en-US",koptions);





app.get("/",function(req,res){
    // console.log(req.body.btn);

    res.render("index",{
        title : "To Do List",
        btnName : "Work list",
        btnAct : "Work",
        kindofDay : day,
        kindofDate : date,
        newListItems : items
    });
})

app.get("/work",function(req,res){
 //   console.log(req.body.btn);
    res.render("index",{
        title : "Work List",
        btnName : "To Do List",
        btnAct : "",
        kindofDay : day,
        kindofDate : date,
        newListItems : workItems
    })
})



// app.post("/work",function(req,res){
    
//     let item = req.body.newItem;
//     workItems.push(item);
//     res.redirect("/work");
// })


app.post('/',function(req,res){
    var item = req.body.newItem; 
    console.log(req.body.list);
    if(req.body.list === "Work"){
        console.log(item);
        workItems.push(item);
        res.redirect("/work")
    }
    else{
        items.push(item);
        res.redirect("/"); 
    }
})





app.listen(process.env.PORT || 3000,function(){
    console.log("server is listening at port : 3000");
})