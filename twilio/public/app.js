/*
authors: SaiArvind Ganganapalle, Nisarg Patel, Gloria Yu
MHacks 7 2016
adelesmstranslator.com
*/
const adele = "adele";
const delimiter = ":";

var Firebase = require("firebase");
var myFirebaseRef = new Firebase("https://amber-torch-4745.firebaseio.com/");
var twilio = require('twilio'),
client = twilio('AC7dc7a5ef539bb482907e4777cd5a8ade','0f18f5ed3eea6d888aa2464273b70ae5');
var request = require("request");
var HashMap = require('hashmap');

const API_KEY = "AIzaSyD1OMVnuoNbvezpnYLasx2HodKIaYzmfSE";

const TRANSLATE_URL = "https://www.googleapis.com/language/translate/v2?key=";

var twilioNum = '+12402973246';

var phoneNum;

//var twilio = require('twilio')('AC6978f6f88e8abafc6c347ee2dcfa3170','71599632f70be093f2e3caa1c33fd55c');
//
//var client = new twilio.RestClient('AC7dc7a5ef539bb482907e4777cd5a8ade','0f18f5ed3eea6d888aa2464273b70ae5');

var mapLangs = new HashMap();

//.set("Chinese","zh_TW")
mapLangs
.set("Arabic","ar")
.set("Bulgarian","bg")
.set("Catalan","ca")
.set("Chinese","zh_CN")
.set("Croatian","hr")
.set("Czech","cs")
.set("Danish","da")
.set("Dutch","nl")
.set("English","en")
.set("Estonian","et")
.set("Filipino","tl")
.set("Finnish","fi")
.set("French","fr")
.set("German","de")
.set("Greek","el")
.set("Hebrew","iw")
.set("Hindi","hi")
.set("Hungarian","hu")
.set("Icelandic","is")
.set("Indonesian","id")
.set("Italian","it")
.set("Japanese","ja")
.set("Korean","ko")
.set("Latvian","lv")
.set("Lithuanian","lt")
.set("Malay","ms")
.set("Norwegian","no")
.set("Persian","fa")
.set("Polish","pl")
.set("Portuguese","pt")
.set("Romanian","ro")
.set("Russian","ru")
.set("Serbian","sr")
.set("Slovak","sk")
.set("Slovenian","sl")
.set("Spanish","es")
.set("Swedish","sv")
.set("Thai","th")
.set("Turkish","tr")
.set("Ukrainian","uk")
.set("Urdu","ur")
.set("Vietnamese","vi")
.forEach(function(value, key){
   console.log(value +" : "+ key); 
});
 
function sendMsg(msg){
client.sendSms({
        to: phoneNum,
        from: twilioNum,
        body: msg,
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
    phoneNum = req.body.From;
    console.log("phone num: " + phoneNum)
    var parsedMsg = parse(userMsg);
    resp.message();
    res.writeHead(200, {
        'Content-Type':'text/xml'
    });
    res.end(resp.toString());
});

function parse(msg){
    msg = capitalizeFirstLetter(msg.toLowerCase());
    if(msg.indexOf("Adele") > -1 || msg.indexOf("adele") > -1){
        sendMsg("What would you like translated? \n Type the foreign language you would like translated followed by a ':' and then your message \n Ex. English : arreter");
    }else if (msg.indexOf(":") > -1){
        var splittedMsg = msg.split(":");
        var language = splittedMsg[0];
        var query = splittedMsg[1];
        console.log("tar lang: " + splittedMsg[0]);
        if(splittedMsg.length  != 2){
            sendMsg("Hey there! I didn't get that. \n Remember the format is ' language you want ' : 'foreign word/phrase.");
            return;
        }else if(!(mapLangs.has(language))){
            sendMsg("I'm sorry I don't know "+ capitalizeFirstLetter(language) + " yet. I'll be sure to learn it soon.");
            return;
        }
        var abbrTargetLang = mapLangs.get(language);
        console.log("abbr tar lang below: " + abbrTargetLang);
        getTranslation(query,"",abbrTargetLang);
    }else{
        sendMsg("Hey there! I didn't get that. \n Remember the format is ' language you want ' : 'foreign word/phrase.");
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
    sendMsg("Oops! I think you forgot to mention the language you want the word or phrase translated into! \n Remember the format is ' language you want ' : 'foreign word/phrase ' ")
}

function errorBadQuery(){
    sendMsg("Slow down there! You forgot to mention the foreign word or phrase you want translated! \n Remember the format is ' language you want ' : 'foreign word/phrase '");
}

function sendQueryWithoutSourceLang(query, sourceLang, targetLang){
    var url = TRANSLATE_URL+API_KEY+"&source="+sourceLang+"&target="+targetLang+"&q="+query;
    request(url, function(error, reponse, body){
        sendMsg(body);
    });
    
}

function sendQuery(query, targetLang){
    var url = TRANSLATE_URL+API_KEY+"&target="+targetLang+"&q="+query;

    request(url, function(error, reponse, body){
        console.log("error code: " + error +" response: " + reponse.statusCode);
        var parsedBody = JSON.parse(body);
        console.log(body);
        console.log("target lang: " + targetLang + "key " + mapLangs.search(targetLang));
        var translation = parsedBody.data.translations[0].translatedText;
        var sourceLang  = mapLangs.search(parsedBody.data.translations[0].detectedSourceLanguage);
        var translatedLang = "'"+capitalizeFirstLetter(query) +"'"+ " in " + capitalizeFirstLetter(sourceLang) + " is '" + capitalizeFirstLetter(translation) + "' in " + capitalizeFirstLetter(mapLangs.search(targetLang));
        console.log(translatedLang);
        sendMsg(translatedLang);
    });
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

app.listen(1337)

console.log("app.js");