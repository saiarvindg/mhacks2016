var fbRef = new Firebase("https://amber-torch-4745.firebaseio.com/");
    
var usersRef = fbRef.child("users");

var listNum = 0;

//clearing the db everytime - just temporary
usersRef.remove();

/*
desired structure:

phoneNum: {
firstName: fname,
lastname: lname,
items: [apple, banana, orange] -> be able to append and remove items later on
}

*/

function addUser( phoneNum,  firstName,  lastName){
    usersRef.child(phoneNum).set({
        first_name: firstName,
        last_name: lastName,
        items: []
    });    
}

function removeUser(phoneNum){
    usersRef.child(phoneNum).set(null);
}

function searchItem(item){
    
}

function addItem(item, phoneNum){
    console.log('Adding ' + item)
    usersRef.child(phoneNum).child("items").child(item).set(true)
}

function removeItem(item, phoneNum){
   usersRef.child(phoneNum).child("items").child(item).set(null);
    //usersRef.child(phoneNum).child(item).set(null);
}

function removeAll(phoneNum){
    usersRef.child(phoneNum).remove();
}
//usersRef.push({
//    firstname: "bob",
//    lastname: "the builder",
//    timeupdate: Firebase.ServerValue.TIMESTAMP
//});
//
//usersRef.update({
//    firstname: "rolly",
//    lastname: "the steam roller"
//});