const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const app = express();

app.use(bodyParser.urlencoded({extented:true}));

app.use(express.static("public"));

app.get("/",function(req,res){
  res.sendFile(__dirname + "/signup.html");

});

app.post("/",function(req,res){
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;
//  console.log(firstName +" "+lastName+" "+email);

// creating JS object to send our data to mailchimp

const data = {
  members: [
    {
      email_address:email,
      status:"subscribed",
      merge_fields: {
        FNAME:firstName,
        LNAME:lastName
      }

    }
  ]
};

//send to mailchimp - turning JS to JSON object
const jsonData = JSON.stringify(data);

const url ="https://us5.api.mailchimp.com/3.0/lists/7977f54741";
const options = {
  method : "POST",
  auth : "AnanyaTomar25:1a5943277318e050455ec34ce9ec0171-us5"
}

const request = https.request(url,options,function(response){

  if(response.statusCode===200){
    res.sendFile(__dirname+"/success.html");
  }
  else{
    res.sendFile(__dirname +"/failure.html");
  }

  response.on("data",function(data){
    console.log(JSON.parse(data));
  });

});

request.write(jsonData);
request.end();

});

app.post("/failure",function(req,res){
  res.redirect("/");
});


// dynamic port heroku will decide to run the app on
app.listen(process.env.PORT || 3000, function(){
  console.log("Server started on port 3000");
});

//API KEY
//1a5943277318e050455ec34ce9ec0171-us5

//list where I want to put my subscribers
//7977f54741
