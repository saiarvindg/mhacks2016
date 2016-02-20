var fbRef = new Firebase("https://amber-torch-4745.firebaseio.com/");
    
var usersRef = fbRef.child("users");

var listNum = 0;

function addUser(){
    usersRef.push({
        first_name: FirstName,
        last_name: LastName,
        phone_number: phone_number;
    });
    
}

function searchItem(var item){
    
}

function storeItem(var item, var userPhone){
    
}

function removeItem(var itemNum, var userPhone){
    
}

usersRef.push({
    firstname: "bob",
    lastname: "the builder",
    timeupdate: Firebase.ServerValue.TIMESTAMP
});

usersRef.update({
    firstname: "rolly",
    lastname: "the steam roller"
});