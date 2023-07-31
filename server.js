const express = require("express");
const bodyParser = require("body-parser");
const e = require("express");
const uri = 'mongodb+srv://userForlist:umnGh9FLJVUl4vcJ@cluster0.6nypzlt.mongodb.net/todolistDB?retryWrites=true&w=majority';
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch((error) => {
      console.error('Error connecting to MongoDB:', error);
    });
  
const itemsSchema = {
    name : String
};

const listSchema ={
    name : String,
    items :[itemsSchema]
};

const Item = mongoose.model("Item", itemsSchema);
const List = mongoose.model("List", listSchema);

const item1 = new Item({name : "Welcome to TODO list"});
const item2 = new Item({name : "Add new items by Clicking +"});
const item3 = new Item({name : "Remove the items by -->"});

const defaultItems = [item1, item2, item3];

app.get("/", (req, res) => {
    Item.find()
        .then((items) => {
            res.render("list", {title : "Today",listItems : items});
        })
        .catch((error) => {
            console.error('Error retrieving Items:', error);
        });
});

app.post("/",(req,res) => {
    const itemname = req.body.newItem;
    const listname = req.body.add;
    const item = new Item({ name : itemname});
    if(listname == "Today"){
        item.save()
            .then(() => {
                console.log("Item saved successfully");
                res.redirect("/")
            })
            .catch((error) => {
                console.error('Error in adding Item:', error);
            });
    }else{
        List.findOne({name: listname})
            .then((foundlist) => {
                foundlist.items.push(item);
                foundlist.save()
                        .then(() => {
                            res.redirect("/"+listname);
                        })
                        .catch((error) => {
                            console.log('Error in adding Item:', error);
                        });
            })
            .catch((error) => {
                console.log('Error in adding Item:', error);
            });
    } 
});

app.post("/delete",(req,res) => {
    const id = req.body.id;
    const listname = req.body.delete;
    if(listname == "Today"){
        Item.findOneAndDelete({ _id: id })
        .then(() => {
            console.log('Item deleted successfully');
            res.redirect("/");
          })
          .catch((error) => {
            console.error('Error:', error);
        });
    }else{
        List.findOneAndUpdate({name: listname},{$pull:{items:{_id: id}}})
            .then(() => {
                res.redirect("/"+listname);
            })
            .catch((error) => {
                console.log('Error in deleting Item:', error);
            });
    } 
});

app.get("/:customList",(req, res)=>{
    const newlist = _.capitalize(req.params.customList);
    List.findOne({name:newlist})
        .then((foundlist) => {
            if(!foundlist){
                const list  = new List({
                    name : newlist,
                    items : defaultItems
                })
                list.save()
                    .then(() => {res.redirect("/"+newlist);})
            }else{
                res.render("list", {title : foundlist.name,listItems : foundlist.items});
            }
          })
          .catch((error) => {
            console.error('Error:', error);
          });
});


app.listen(3000,()=>{
    console.log("listening");
});