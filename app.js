const express=require('express');
const bodyParser=require('body-parser');
const request=require('request');
const https=require('https');

const app=express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html");
});
app.post("/",function(req,res){
    var fname=req.body.firstName;
    var lname=req.body.lastName;
    var email=req.body.email;
     
    var data={
        members:[{
            email_address: email,
            status: "subscribed",
            merge_fields:{
                FNAME:fname,
                LNAME:lname
            }
        }] 
    };
    var jsonData=JSON.stringify(data);

    const url="https://us2.api.mailchimp.com/3.0/lists/42128f3c5b";
    const options={
        method:"POST",
        auth:"akshat:9f99ae77db7583922a3d13a94143ef17-us2"
    };

    const request=https.request(url,options,function(response){
        if(response.statusCode==200)
        {
            res.sendFile(__dirname+"/success.html");
        }
        else{
            res.sendFile(__dirname+"/failure.html");
        }
        response.on("data",function(data){
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end(); 

});

// app.post("/signup",function(req,res){
//     res.send("signedup");
// });

app.post("/failure",function(req,res){
    res.redirect("/");
})


app.listen(process.env.PORT || 3000,function(){
    console.log("The server is running on port 3000");
});

//9f99ae77db7583922a3d13a94143ef17-us2
//42128f3c5b