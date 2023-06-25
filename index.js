const express = require("express");
const bodyParser = require("body-parser");

const app = express();
let items = [];
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
    var time = today.toLocaleTimeString("en-US");
    var day  = today.toLocaleDateString("en-US", options);
    res.render("list", {day : day, time : time,listItems : items});
});

app.post("/",(req,res) => {
    item = req.body.newItem;
    items.push(item);
    res.redirect("/");
});

app.post("/delete",(req,res) => {
    const index = req.body.index;
    if (index !== undefined && index < items.length) {
        items.splice(index, 1);
    }
    res.redirect("/");
});

app.listen(3000,()=>{
    console.log("listening");
});