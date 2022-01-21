const ejs = require("ejs");
const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');
const { title } = require("process");
const mongoose = require("mongoose");
const app = express();
const _ = require("lodash");

//Mongoose
mongoose.connect("mongodb+srv://Shubham:shubh@cluster0.9itc3.mongodb.net/todolistDB",{useNewUrlParser : true,useUnifiedTopology: true});

const todoItem = new mongoose.Schema({
    name : String
});

const listSchema = new mongoose.Schema({
    name : String,
    items : [todoItem]
})


const Item = mongoose.model("Item",todoItem);

const List = mongoose.model("List",listSchema);
  
const item1 = new Item({
    name : "Welcome to your to do list"
});
 

const item2 = new Item({
    name : "Hit + to add new item"
});


const item3 = new Item({
    name : "Hit <-- to delete the item"
});

const defaultItems = [item1 , item2 , item3];

// Item.insertMany(defaultItems,function(err){
//     if(err){
//         console.log(err);
//     }
//     else{
//         console.log("succesfully insert items");
//     }
// })







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

    Item.find({},function(err,foundItems){
        if(err){
            console.log(err);
        }else{
            // console.log(foundItems);
            if(foundItems.length === 0){
                Item.insertMany(defaultItems,function(err){
                    if(err){
                        console.log(err);
                    }
                    else{
                        console.log("succesfully insert items");
                    }
                });
                res.redirect("/");
            }else{
                res.render("index",{
                    title : "To Do List",
                    btnName : "Work list",
                    btnAct : ('Work'),
                    kindofDay : day,
                    kindofDate : date,
                    newListItems : foundItems
                });
            }
        }
    })
})

app.get("/:customListName" , function(req,res){
    customListName = req.params.customListName;

    List.findOne({name : _.lowerCase(customListName)},function(err,foundList){
        if(!err){
            if(!foundList){
                //Create a new list
                const list = new  List ({
                    name : _.lowerCase(customListName),
                    items : defaultItems
                })
                list.save();
                res.redirect("/" + _.lowerCase(customListName));
            }else{
                //Show an existing list
                res.render("index",{
                    title : _.lowerCase(customListName),
                    btnName : "To Do List",
                    btnAct : "",
                    kindofDay : day,
                    kindofDate : date,
                    newListItems : foundList.items
                });
            }
        }
    })
      
})

// app.get("/work",function(req,res){
//  //   console.log(req.body.btn);
//     res.render("index",{
//         title : "Work List",
//         btnName : "To Do List",
//         btnAct : "",
//         kindofDay : day,
//         kindofDate : date,
//         newListItems : workItems
//     })
// })

app.post("/delete",function(req,res){
   console.log(req.body.checkBox );

   const checkItemId = req.body.checkBox;
   const listName = req.body.listName; 
   console.log(listName);
   if(_.lowerCase(listName) === _.lowerCase("To Do List") ){
        Item.findByIdAndRemove(checkItemId , function(err){
         if(!err){
            console.log("succesfully deleted item.");
            res.redirect("/");
         }
         else{
            console.log(err);
          }
        });
   }else{
       List.findOneAndUpdate({name : _.lowerCase(listName)},{$pull  : {items : {_id : checkItemId} } },function(err , foundList){
           if(!err){
               console.log("Succesfully deleted Item");
               res.redirect("/" + _.lowerCase(listName));
           }
       })
   }

   
})

// app.post("/work",function(req,res){
     
//     let item = req.body.newItem;
//     workItems.push(item);
//     res.redirect("/work");
// })


app.post('/',function(req,res){


    const itemName = req.body.newItem;
    const listName = req.body.list;
    console.log(listName);
   // console.log(req.body.list);

   const item = new Item({
       name : itemName
   })


   if(listName === "To"){
       item.save();
       res.redirect("/");
   }else{
       List.findOne({name : listName} , function(err, foundList){
           foundList.items.push(item);
           foundList.save();
           res.redirect("/" + listName);
       })
   }
   

    // if(req.body.list === "Work"){
    //     console.log(item);
    //     workItems.push(item);
    //     res.redirect("/work")
    // }
    // else{
    //     items.push(item);
    //     res.redirect("/"); 
    // }
})





app.listen(process.env.PORT || 3000,function(){
    console.log("server is listening at port : 3000");
})