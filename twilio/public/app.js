const adele = "adele";
const delimiter = ":";

var Firebase = require("firebase");
var myFirebaseRef = new Firebase("https://amber-torch-4745.firebaseio.com/");
var twilio = require('twilio'),
client = twilio('AC7dc7a5ef539bb482907e4777cd5a8ade','0f18f5ed3eea6d888aa2464273b70ae5');
var request = require("request");

const API_KEY = "AIzaSyD1OMVnuoNbvezpnYLasx2HodKIaYzmfSE";

const TRANSLATE_URL = "https://www.googleapis.com/language/translate/v2?key=";

//var twilio = require('twilio')('AC6978f6f88e8abafc6c347ee2dcfa3170','71599632f70be093f2e3caa1c33fd55c');
//
//var client = new twilio.RestClient('AC7dc7a5ef539bb482907e4777cd5a8ade','0f18f5ed3eea6d888aa2464273b70ae5');
 
//8653687074
function sendMsg(msg){
client.sendSms({
       to:'8653687074',
        from: '2402973246',
        body:msg.toString(),
    }, function(err, data){});
}

var express = require('express'),
bodyParser = require('body-parser'),
app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.post('/message', function(req, res){
   var resp = new twilio.TwimlResponse();
    var userMsg = req.body.Body.trim();
    var parsedMsg = parse(userMsg);
    resp.message();
    res.writeHead(200, {
        'Content-Type':'text/xml'
    });
    res.end(resp.toString());
});

function parse(msg){
    msg = msg.toLowerCase();
    if(msg.indexOf("adele") > -1){
        sendMsg("What would you like translated? \n Type the foreign language you would like translated followed by a ':' and then your message \n Ex. English:arreter");
    }else if (msg.indexOf(":") > -1){
         var splittedMsg = msg.split(":");
        var sourceLang;
        if(splittedMsg[0] === "english"){
            getTranslation(splittedMsg[1],"","en");
        }
    }
}

function getTranslation(query,sourceLang, targetLang){
    if(targetLang === null){
        errorNoTargetLang();
    }else if(query.length <= 0){
        errorBadQuery();
    }else if(sourceLang.length > 0){
        sendQueryWithoutSourceLang(query, sourceLang, targetLang);
    }else{
        sendQuery(query, targetLang);
    }
}

function errorNoTargetLang(){
    
}

function errorBadQuery(){
    
}

function sendQueryWithoutSourceLang(query, sourceLang, targetLang){
    var url = TRANSLATE_URL+API_KEY+"&source="+sourceLang+"&target="+targetLang+"&q="+query;
//    $.get(url, function(data){
//        sendMsg(data);
//    });
    
    request(url, function(error, reponse, body){
        sendMsg(body.toString());
    });
    
//     $.ajax({
//        url: url,
//        type: 'GET',
//        data: ,
//        success: function(data){
//            console.log(data);
//        }
//    });
}

function sendQuery(query, targetLang){
    var url = TRANSLATE_URL+API_KEY+"&target="+targetLang+"&q="+query;
//    $.get(url, function(data){
//        console.log(data);
//    });
    request(url, function(error, reponse, body){
        sendMsg(body.toString());
    });
}

app.listen(1337)

console.log("app.js");