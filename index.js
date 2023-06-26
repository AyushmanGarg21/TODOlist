const express = require("express");
const bodyParser = require("body-parser");
const e = require("express");

const app = express();
let items = [];
let workItems = [];
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.get("/", (req, res) => {
    var today = new Date();
    var options = {
        weekday : "long",
        day : "numeric",
        month : "long",
        year : "numeric"
    };
    var day  = today.toLocaleDateString("en-US", options);
    res.render("list", {title : day,listItems : items});
});

app.get("/work",(req, res)=>{
    res.render("list", {title : "work list",listItems : workItems});
});

app.post("/",(req,res) => {
    item = req.body.newItem;
    if(req.body.add == "work"){
        workItems.push(item);
        res.redirect("/work");
    }else{
        items.push(item);
        res.redirect("/");
    } 
});

app.post("/delete",(req,res) => {
    const index = req.body.index;
    if(req.body.delete == "work"){
        if (index !== undefined && index < workItems.length) {
            workItems.splice(index, 1);
        }
        res.redirect("/work");
    }else{
        if (index !== undefined && index < items.length) {
            items.splice(index, 1);
        }
        res.redirect("/");
    } 
});

app.post("/work",(req, res) => {
    let item = req.body.newItem;
    workItems.push(item);
    res.render("/work");
});



app.listen(3000,()=>{
    console.log("listening");
});