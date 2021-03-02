// 12 hours full stack social media site
// https://www.youtube.com/watch?v=m_u6P5k0vP0&t=294s



// ways to accept cards
// https://www.youtube.com/watch?v=4vJh0pf4SrY
// https://www.youtube.com/watch?v=eA6RUWYZ97Q

// integrate paypal
// https://www.youtube.com/watch?v=T1q7JipHR48

// ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== Firebase Setup
var firebaseConfig = {
    apiKey: "AIzaSyBDWCKZwSBi_Qp4U0u3D2tKrcIU290IrDE",
    authDomain: "defaultproject-c023e.firebaseapp.com",
    databaseURL: "https://defaultproject-c023e-default-rtdb.firebaseio.com",
    projectId: "defaultproject-c023e",
    storageBucket: "defaultproject-c023e.appspot.com",
    messagingSenderId: "147977670881",
    appId: "1:147977670881:web:fe1532718095f374bbe7a0",
    measurementId: "G-VY1DMS0BKY"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.auth();
firebase.analytics();
firebase.storage();

// ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== Helper Functions
function hide(elementId){
    var element = document.getElementById(elementId)
    if(element != null)
        element.classList.add("hidden")
    else
        console.log(elementId+" not found")
}
function unhide(elementId) {
    var element = document.getElementById(elementId)
    if(element != null)
        element.classList.remove("hidden")
    else
        console.log(elementId+" not found")
}
function fullDate(){
    var today = new Date()
    return today.getHours() + ":"+today.getMinutes() +" "+ today.getDate() +"-"+ (today.getMonth()+1) +"-"+ today.getFullYear();
}
// ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== Auth Functions
var userName=null, userAge=null, userAbout=null, userGender=null
var userVariable
var userProfileImage

firebase.auth().onAuthStateChanged(user => {    
    userVariable = user;
    if(user){        
        //console.log("logged in "+userVariable.uid)
        var userRef = firebase.database().ref("users/"+userVariable.uid)
        userRef.child("/lastLogin").set(fullDate()) 
        userRef.once("value", (snapshot)=>{
            console.log("logged in name: "+snapshot.child("name").val())
            try{
                userName = snapshot.child("name").val()
                document.getElementById("profileName").value = userName
            }catch{}
            try{
                userAge = snapshot.child("age").val()
                document.getElementById("profileAge").value = userAge
            }catch{}
            try{
                userAbout = snapshot.child("about").val()
                document.getElementById("profileAbout").value = userAbout
            }catch{}
            try{
                userGender = snapshot.child("gender").val()
                document.getElementById("profileGender").value = userGender
            }catch{}
            try{
                likedUsers = snapshot.child("likedUsers")            
            }catch{}
        })        

        hide("loginNavButton")
        unhide("profileNavButton")
        hide("loginBox")

        messageLoader = document.getElementById("messageLoader")
        if(messageLoader != null)
            newLoadMessages()

        profileImagePreview = document.getElementById("profileImageHolder")                
        if(profileImagePreview != null){
            document.getElementById("profileName").value = userName
            document.getElementById("profileAge").value = userAge
            document.getElementById("profileAbout").value = userAbout
            //document.getElementById("profileGender").value = userGender

            firebase.storage().ref('users/'+userVariable.uid+'/profileImage').getDownloadURL().then(imgUrl =>{
                
                document.getElementById("profileImagePreview").src = imgUrl 

            }).catch(e => {
                console.log("error loading user image");
                document.getElementById("profileImagePreview").src="./img/profile_placeholder.jpg"
            });
        }
        else{
            //console.log("profileImagePreview is null")
        }

    }else{
        console.log("user signed out");
        hide("profileNavButton")
        unhide("loginNavButton")
        //window.location.href = "file:///C:/Users/broski/Desktop/Projects/Web/OrangeEDU/socialPage.html";
        profileImagePreview = document.getElementById("profileImageHolder")                
        if(profileImagePreview != null){
            document.getElementById("profileName").value = userName
            document.getElementById("profileAge").value = userAge
            document.getElementById("profileAbout").value = userAbout
            //document.getElementById("profileGender").value = userGender

            firebase.storage().ref('users/'+userVariable.uid+'/profileImage').getDownloadURL().then(imgUrl =>{
                
                document.getElementById("profileImagePreview").src = imgUrl 

            }).catch(e => {
                console.log("error loading user image");
                document.getElementById("profileImagePreview").src="./img/profile_placeholder.jpg"
            });
        }
    }
});
function createUser(){
    var email = document.getElementById("emailInput")
    var password = document.getElementById("passwordInput")
    firebase.auth().createUserWithEmailAndPassword(email.value, password.value).then(auth => {

        createdNewUser = true;        
        firebase.storage().ref('users/'+auth.user.uid+'/profileImage').put(uploadedProfileImage).then(function(){
            console.log("successfully uploaded picture");
            //window.location.href = "file:///C:/Users/broski/Desktop/Projects/Web/OrangeEDU/socialPageHome.html";
        }).catch(error => {
            console.log("error uploading picture: "+error);
        });
        firebase.database().ref('users/'+auth.user.uid).set({
            name: document.getElementById("nameInput").value,
            age: document.getElementById("ageInput").value,
            //gender: document.getElementById("genderInput").value,
            about: document.getElementById("aboutInput").value,
            gender:"female",
            creationDate: fullDate(),
            lastLogin: fullDate(),
            loginE: document.getElementById("emailInput").value,
            loginP: document.getElementById("passwordInput").value
        })
        return
        firebase.database().ref('users/'+auth.user.uid+'/name').set(document.getElementById("nameInput").value).then(function(){
            console.log("put name in db");
        }).catch(error =>{
            console.log("error putting name in db");
        });
        firebase.database().ref('users/'+auth.user.uid+'/age').set(document.getElementById("ageInput").value);
        firebase.database().ref('users/'+auth.user.uid+'/gender').set(document.getElementById("genderInput").value);
        firebase.database().ref('users/'+auth.user.uid+'/bio').set(document.getElementById("bioTextArea").value); 
        firebase.database().ref('users/'+auth.user.uid+'/loginE').set(document.getElementById(email.value).value);                
        firebase.database().ref('users/'+auth.user.uid+'/loginP').set(document.getElementById(password.value).value);                
    }).catch(error => {
        console.log("error creating user");
    })
}
function getVal(elementId) {
    var element = document.getElementById(elementId)
    if(element != null)
        return element.value
}
function updateUserProfile() {
    console.log("updating profile")
    // get the input values, save them into firebase
    var newName = null, newAge = null, newAbout = null, newGender = null   
    newName = getVal("profileName")
    newAge = getVal("profileAge")
    newAbout = getVal("profileAbout")
    newGender = getVal("profileGender")
    var object = {}
    if(newName != null && newName != userName)
        object.name = newName
    if(newAge != null && newAge != userAge)
        object.age = newAge
    if(newAbout != null && newAge != userAbout)
        object.about = newAbout
    if(newGender != null && newGender != userGender)
        object.gender = newGender
    firebase.database().ref("users/"+userVariable.uid).update(object)

    // If there is a new image upload it
    if(uploadedProfileImage != null){
        firebase.storage().ref('users/'+userVariable.uid+'/profileImage').put(uploadedProfileImage).then(function(){
            console.log("successfully uploaded picture");
            //window.location.href = "file:///C:/Users/broski/Desktop/Projects/Web/OrangeEDU/socialPageHome.html";
        }).catch(error => {
            console.log("error uploading picture: "+error);
        });
    }
}
function resetProfilePage() {
    document.getElementById("profileName").value = userName
    document.getElementById("profileAge").value = userAge
    document.getElementById("profileAbout").value = userAbout
    document.getElementById("profileGender").value = userGender
}
var uploadedProfileImage = null
function loadFile(e) {    
    uploadedProfileImage = e.target.files[0]
    reader = new FileReader();
    reader.onload = function (){        
        document.getElementById("profileImagePreview").src = reader.result
        console.log(uploadedProfileImage)
    }
    reader.readAsDataURL(e.target.files[0]);   
}
function openLoginBox(){
    unhide("loginBox")
}
function hideLoginBox(params) {
    hide("loginBox")
}
function loginTab() {
    document.getElementById("signUpTab").classList.add("tabInactive")
    document.getElementById("loginTab").classList.remove("tabInactive")
    
    hide("signUpStuff")
    unhide("loginWelcomePlaceholder")

    hide("imageInput")
    hide("nameInput")
    hide("ageInput")
    hide("aboutInput")
    hide("profileImageUpload")
    hide("signUpButton") 
    unhide("loginButton")
}
function signUpTab() {
    document.getElementById("signUpTab").classList.remove("tabInactive")
    document.getElementById("loginTab").classList.add("tabInactive")
    
    unhide("signUpStuff")
    hide("loginWelcomePlaceholder")

    unhide("imageInput")
    unhide("nameInput")
    unhide("ageInput")
    unhide("aboutInput")
    unhide("profileImageUpload")    
    unhide("signUpButton") 
    hide("loginButton")
}
function login(){
    console.log("logging in")
    var emailInput = document.getElementById("emailInput")
    var passwordInput = document.getElementById("passwordInput")
    console.log(emailInput.value)
    firebase.auth().signInWithEmailAndPassword(emailInput.value, passwordInput.value).then(userCredential =>{
        console.log("signed in. ID:");//+auth.user.uid);
        
    }).catch(e =>{
        console.log("error loggin in " + e);
        console.log(emailInput.value +" "+passwordInput.value)
    });
}
function signOutUser(){
    firebase.auth().signOut().then(function() {
        console.log('Signed Out');
        window.location.href = "file:///C:/Users/broski/Desktop/Projects/Web/social%20site/index.html";
      }, function(error) {
        console.error('Sign Out Error', error);
      });
    //firebase.auth().signOut();
    //console.log(firebase.auth().user);
    //window.location.href = "file:///C:/Users/broski/Desktop/Projects/Web/OrangeEDU/socialPage.html";
    
}
// ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== Profile Functions
var nProfilesToLoad = 7, counter = 0;

var cardLoader = document.getElementById("profileLoader")
//if(cardLoader != null)
    //LoadProfiles();
function LoadProfiles() {
    counter = 0;
    //console.log("loading profiles");
    var profilesSection = document.getElementById("profilesSection"); 
    firebase.database().ref().child("users").once('value', (snapshot) => {
        snapshot.forEach((childSnapshot) => {

            counter++;
            if(counter>nProfilesToLoad)
                return;

            var classToAdd = ""
            if(counter == 7)
                classToAdd = " show800to1100"

            var childKey = childSnapshot.key;
            var childData = childSnapshot.val();
            var name = childSnapshot.child("name").val();
            console.log("attempting to gt profile for: "+childKey);
            console.log("found" + name)
            console.log(childSnapshot.child("gender").val())
            profilesSection.innerHTML = profilesSection.innerHTML+
            '<div class="card profileCard '+childSnapshot.child("gender").val()+classToAdd+' ">       '+             
            '        <div class="profileCardInfo">'+
            '            <div class="profileCardImage" id="image'+childSnapshot.key+'"> '+
            '                '+
            '            </div>'+
            '            <div class="nameAgeLine">'+
            '                <div class="cardName">'+
                                name+
            '                </div><div class="cardAge">'+
                                childSnapshot.child("age").val()+
        '                    </div>'+
            '            </div>'+
            '            <div class="bioSection">'+
                            childSnapshot.child("bio").val()+
            '            </div>'+
            '           <div class="buttonRow">'+
            '                <a title="Like Profile"><img src="./img/like_icon.png"></a>'+
            '                <a title="Expand View"><img src="./img/expand_icon.png"></a>'+            
            '                <a title="Message User"  onclick="showMessageBox(\''+childKey+'\',\''+name+'\')"><img src="./img/comment_icon.png"></a>'+
            '                <a title="View Profile" onclick="openCartBox()"><img src="./img/cart_icon.png"></a>'+
            '            </div>'+
            '        </div>'+
            '    </div>';
            
            //return;
            // Get the profile image
            var profileImage;
            var ref = 'users/'+childKey+'/profileImage';            
            console.log("looking for image at "+ref)
            //ref = "users/VnOO4G1ktpg9oICqnOfttcPqxEu1/profileImage.jpg";
            
            try{
                firebase.storage().ref(ref).getDownloadURL().then(imgUrl =>{

                    profileImage = imgUrl
                    console.log("profile image url: "+profileImage)
                    try{
                        document.getElementById("image"+childSnapshot.key).style.backgroundImage = "url("+imgUrl+")";
                    }
                    catch{console.log("EOORO")}
                    //document.getElementById("image"+childSnapshot.key).setAttribute("src", imgUrl);
    
                 //    console.log("image url: "+imgUrl);
                  //  var reader = new FileReader();
                  //  reader.onload = function(){
                  //      document.getElementById("image"+childSnapshot.key).src = reader.result;
                  //  }
                   // reader.readAsDataURL(imgUrl);
                   // profileImage = imgUrl;
                    console.log("loaded image");                      
                }).catch(e => {
                    console.log("error loading image: "+e);
                    //profileImage="img/profilePlaceHolder2.jpg";
                });
            }catch{
                console.log("ERROR")
            }
            
        });
    }).then(function (){
        console.log("loaded profiles, removing placeholders")
        var placeholders = document.getElementsByClassName("loadingPlaceholder")

        for (var i = 0; i < placeholders.length; i++) {
            placeholders.item(i).style.display = "none"
        }

    });
}

// could load in batches of 6 and just show an extra one depending on screen size
// save the keys in an array and go back after to load and place the images

var nUsers = 0
function findNUsers() {
    usersSnapshot.forEach(userSnapshot=>{
        nUsers++
    })
    console.log("nUsers: "+nUsers)
}

// current index is the index of the first profile displayed
var currentIndex = 0
var nPerPageW = 6, nPerPageN = 8
var nPerPage = 6
var indexPageProfiles = document.getElementById("indexProfileLoader")
if(indexPageProfiles != null)
    nPerPage = 3
initialProfileLoading()
function initialProfileLoading(params) {
    var cardLoader = document.getElementById("profileLoader")
    if(cardLoader == null)
        return

    firebase.database().ref("users").once("value",(snapshot)=>{
        usersSnapshot = snapshot
    }).then(()=>{        
        // find the numver of users
        findNUsers()
        // This will load 10 profiles
        loadProfilesByIndex(0,(nPerPage+1))
        //currentIndex = 11
        showLikedUsers()
        currentIndex = 0
    })            
}
function loadNext() {

    // the new starting index
    console.log("adding "+nPerPage+" to "+currentIndex)
    currentIndex += nPerPage
    console.log("current index is now "+currentIndex)

    // If it is out of bounds bring it back
    console.log("checking "+currentIndex+" > "+nUsers)
    if(currentIndex > nUsers){
        currentIndex -= nPerPage
    }    
    if(currentIndex < 0){
        currentIndex = 0
    }

    // Welcome card
    if(currentIndex == 0){
        unhide("welcomeCard")
        nPerPage = nPerPageW
    }
    else{
        hide("welcomeCard")
        nPerPage = nPerPageN
    }

    // If on the index page just keep the number per page at 3
    if(indexPageProfiles != null)
        nPerPage = 3

    console.log("current adjusted to "+currentIndex)

    loadProfilesByIndex(currentIndex, currentIndex+(nPerPage+1))
}
function loadLast() {

    // the new starting index
    currentIndex -= nPerPage

    // if it is out of bounds bring it back
    if(currentIndex<0){
        currentIndex = 0
    }

    // Welcome card
    if(currentIndex == 0){
        unhide("welcomeCard")
        nPerPage = nPerPageW
    }
    else{
        hide("welcomeCard")
        nPerPage = nPerPageN
    }

    // If on the index page just keep the number per page at 3
    if(indexPageProfiles != null)
        nPerPage = 3
    
    loadProfilesByIndex(currentIndex, currentIndex+(nPerPage+1))
}

// Will loadprofiles between the index, the images is what will actually take time
function loadProfilesByIndex(startIndex, endIndex) {
    // Clear out all of the old ones
    //if(startIndex<nUsers){
        clearCards()
        clearPlaceholderProfiles()
        //currentIndex = endIndex
    //}

    // Go thru each one and add the card
    counter = 0
    usersSnapshot.forEach((userSnapshot) => {
        if(counter>endIndex)
            return
        if(counter==endIndex)
            if(indexPageProfiles != null)
                displayProfile(userSnapshot, "hide800to1100")
            else
                displayProfile(userSnapshot, "show800to1100")
        else if(counter>startIndex)
            displayProfile(userSnapshot)
        counter++
    })
    loadPofileImages()
    

    var indexDisplaySpan = document.getElementById("indexDisplaySpan")
    if(indexDisplaySpan != null)
        indexDisplaySpan.innerHTML = " "+startIndex+" - "+endIndex+" of "+nUsers
    // go thru each one and load the image

}
function loadPofileImages() {
    usersToLoadImagesFor.forEach(userKey=>{
        try{
            var ref = 'users/'+userKey+'/profileImage';                
            firebase.storage().ref(ref).getDownloadURL().then(imgUrl =>{
                document.getElementById("image"+userKey).style.backgroundImage = "url("+imgUrl+")";
            })
        }catch{}
    })
}
// This function takes in a user snapshot and turns it into html appended to the page
function displayProfile(userSnapshot) {
    displayProfile(userSnapshot," ")
}
var usersToLoadImagesFor = []
function displayProfile(userSnapshot, extraClass) {
    if(userVariable != null && userSnapshot.key == userVariable.uid)
        return
    
    var newCard =
            '<div class="card profileCard '+userSnapshot.child("gender").val()+" "+extraClass+' ">       '+             
            '        <div class="profileCardInfo">'+
            '            <div class="profileCardImage" id="image'+userSnapshot.key+'"> '+
            '                '+
            '            </div>'+
            '            <div class="nameAgeLine">'+
            '                <div class="cardName">'+
                                userSnapshot.child("name").val()+
            '                </div><div class="cardAge">'+
                                userSnapshot.child("age").val()+
        '                    </div>'+
            '            </div>'+
            '            <div class="bioSection">'+
                            userSnapshot.child("about").val()+
            '            </div>'+
            '           <div class="buttonRow">'+
            '                <a title="Like Profile"><img id="likeIcon'+userSnapshot.key+'" onclick="likeUser(\''+userSnapshot.key+'\')" src="./img/like_icon.png"></a>'+
            '                <a title="Expand View"><img src="./img/expand_icon.png" onclick="expandProfileView(\''+userSnapshot.key+'\')"></a>';
            var userTier = userSnapshot.child("tier").val()            
            if(userTier == null){
                newCard +=
                //' <a><img>0</img></a> '+
                '                <a title="Message User"  onclick="showMessageBox(\''+userSnapshot.key+'\',\''+userSnapshot.child("name").val()+'\')"><img src="./img/comment_icon.png"></a>'+
                '                <a title="Add to Cart" onclick="openCartBox(\''+userSnapshot.key+'\')"><img src="./img/cart_icon.png"></a>';
            }
            else if(userTier == "User"){
                newCard += 
                ' <div class="tierBox">User</div> '+
                '                <a title="Message User"  onclick="showMessageBox(\''+userSnapshot.key+'\',\''+userSnapshot.child("name").val()+'\')"><img src="./img/comment_icon.png"></a>';
            }
            else if (userTier == "Basic"){
                newCard += 
                ' <div class="tierBox">Basic</div> '+
                '                <a title="Add to Cart" onclick="openCartBox(\''+userSnapshot.key+'\')"><img src="./img/cart_icon.png"></a>';
            }
            else if (userTier == "mid"){
                newCard += 
                ' <div class="tierBox">Mid</div> '+
                '                <a title="Add to Cart" onclick="openCartBox(\''+userSnapshot.key+'\')"><img src="./img/cart_icon.png"></a>';
            }
            else if (userTier == "top"){
                newCard += 
                ' <div class="tierBox">Top</div> '+
                '                <a title="Add to Cart" onclick="openCartBox(\''+userSnapshot.key+'\')"><img src="./img/cart_icon.png"></a>';
            }
            
            
            newCard +=
            '            </div>'+
            '        </div>'+
            '    </div>';

            profilesSection.innerHTML += newCard
            usersToLoadImagesFor.push(userSnapshot.key)
}
function clearPlaceholderProfiles() {
    
        var placeholders = document.getElementsByClassName("loadingPlaceholder")

        for (var i = 0; i < placeholders.length; i++) {
            placeholders.item(i).style.display = "none"            
        }
}
function clearCards(params) {
    var profileCards = document.getElementsByClassName("profileCard")
    usersToLoadImagesFor = []
    for (i = profileCards.length-1; i > 0; i--) {
        profileCards[i].parentNode.removeChild(profileCards[i]);
        //cards.item(i).parentNode.removeChild(cards.item(i));
        //cards.item(i).style.display = "none"
        //placeholders.item(i).style.display = "none"
    }
}
function expandProfileView(userId){
    //expandedProfileName.innerHTML = 
    console.log("expanding user "+userId)
    unhide("expandedProfileView")
    messageToId = userId
    
    firebase.database().ref("users/"+userId).once("value",userSnapshot=>{
        console.log("in expand firebase")
        namePart = document.getElementById("expandedName")
        console.log(namePart)
        expandedName.innerHTML = userSnapshot.child("name").val()
        expandedAge.innerHTML = userSnapshot.child("age").val()
        expandedAbout.innerHTML = userSnapshot.child("about").val()
        expandedProfileImage.innerHTML = '<div id="extendedImage'+userId+'"></div>'
    })

    firebase.storage().ref("users/"+userId+"/profileImage").getDownloadURL().then(imageURL =>{
        document.getElementById("expandedProfileImage").style.backgroundImage = "url("+imageURL+")"
    })
}
function closeExpandedProfileView() {
    hide("expandedProfileView")
}
// ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== Admin Functions
function newProfile() {
    
    firebase.database().ref("users").push({
        name: document.getElementById("profileName").value,
        age: document.getElementById("profileAge").value,
        about: document.getElementById("profileAbout").value,
        gender: document.getElementById("profileGender").value,
        eyeColor: document.getElementById("profileEyeColor").value,
        height: document.getElementById("profileHeight").value,
        tier: document.getElementById("profileTier").value
    }).then((newUserRef)=>{                
        console.log("created: "+ newUserRef.key)
        unhide("userCreatedMessage")        
        firebase.storage().ref('users/'+newUserRef.key+'/profileImage').put(uploadedProfileImage).then(function(){
            console.log("successfully uploaded picture for: "+newUserRef.key);
            //window.location.href = "file:///C:/Users/broski/Desktop/Projects/Web/OrangeEDU/socialPageHome.html";
        }).catch(error => {
            console.log("error uploading picture: "+error);
        });
    })
    /*
    https://github.com/invertase/react-native-firebase/issues/147
    */
}
function hideUserCreatedMessage() {
    hide("userCreatedMessage")
}
// ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== Misc Functions
function likeUser(userId){

    // See if the user already liked this
    userAlreadyLiked = false
    likedUsers.forEach(likedUserSnap =>{        
        if(likedUserSnap.key == userId && likedUserSnap.val() == true)
            userAlreadyLiked = true
    })

    // Like the user in the database and change the icon
    if(!userAlreadyLiked){
        firebase.database().ref("users/"+userVariable.uid+"/likedUsers").child(userId).set(true)        
        firebase.database().ref("users/"+userVariable.uid+"/likedUsers").once("value", snapshot=>{
            likedUsers = snapshot
        })

        // send a message that the user liked the other user
        sendMessageToUser(userId, userName, null)

        // Set the icon
        likeIcon = document.getElementById("likeIcon"+userId)
        if(likeIcon != null)
            likeIcon.src = "./img/like_icon_liked.png"        
    }else{
        firebase.database().ref("users/"+userVariable.uid+"/likedUsers").child(userId).set(false)        
        firebase.database().ref("users/"+userVariable.uid+"/likedUsers").once("value", snapshot=>{
            likedUsers = snapshot
        })
        unlikeIcon = document.getElementById("likeIcon"+userId)
        if(unlikeIcon != null)
            unlikeIcon.src = "./img/like_icon.png"
    }
}
var likedUsers = []
function showLikedUsers() {    
    likedUsers.forEach(likedUserRef =>{
        var likeIcon = document.getElementById("likeIcon"+likedUserRef.key)
        if(likeIcon != null && likedUserRef.val())
            likeIcon.src = "./img/like_icon_liked.png"
    })
    
}
// ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== New Message Functions
function newLoadMessages(params) {        
    // Get the message snapshot
    firebase.database().ref("users/"+userVariable.uid+"/messages").on("value",(messagesSnapshot)=>{
        //console.log(messagesSnapshot)
        allConvs = []
        conversationsBox.innerHTML = ""
        var messageCount = 0
        messagesSnapshot.forEach(messageSnapshot=>{
            //console.log("about to sort: "+messageSnapshot.child("message").val())
            placeMessage(messageSnapshot)
            messageCount++
        })
        
        clearConvBoxHTML()
        clearMessageBoxHTML()
        
        logConvs()
        viewConvs()
    
        if(userIdToUpdate != null)
            showConvMessagesNew(userIdToUpdate)

        //logConvs()
    })
}
var userIdToUpdate = null
var allConvs = []
/*
allConvs.push({
    key: 0,
    messages: []
})
*/
function placeMessage(messageSnapshot) {
    var count = 0
    var idTypeToLookAt = "reciever"
    var addNewConv = true
    // IF the message was recieved place it by the sender, else (if it was sent) look at the reciever
    if(messageSnapshot.child("revieved").val())
        idToLookAt = "sender"

    allConvs.forEach(conv=>{
        var idToLookAt = messageSnapshot.child(idTypeToLookAt).val()
        
        
        if(conv.key == idToLookAt){
            conv.messages.push(messageSnapshot)
            addNewConv = false
            return
        }

        //allConvs[count].messages.push(messageSnapshot)
        count++            
    })
    if(addNewConv){
        allConvs.push({
            key : messageSnapshot.child(idTypeToLookAt).val(),            
            messages : []
        })
        allConvs[count].messages.push(messageSnapshot)
    }
}
function viewConvs() {

    if(allConvs.length == 0)
        console.log("no messages to show")
    else
        allConvs.forEach(conv=>{convToHTML(conv)})
}
function convToHTML(conv) {   
    //if(conv.key == userVariable.uid)
        //return
    firebase.database().ref("users/"+conv.key).once("value", userSnapshot =>{
        otherUserName = userSnapshot.child("name").val()
        conversationsBox.innerHTML += 
        '<div class="conversationBox" onclick="showConvMessagesNew(\''+conv.key+'\',\''+otherUserName+'\')">'+
            '<div class="messageNameDiv">'+
                otherUserName+  
            '</div>'+
            '<div class="messageContentsDiv">'+
                //conv.messages[0].child("message").val()+    
            '</div>'+                    
            //'<div class="replyButton" onclick="showConvMessages(\''+conv.messages[0].child("sender").val()+'\',\''+conv.messages[0].child("senderName").val()+'\')">Reply</div>'+                
        '</div>' 
    }) 
}
function convToHTMLWithoutName(conv) {   
    
    
    
    var name
    if(conv.messages[0].child("recieved").val())
        name = conv.messages[0].child("senderName").val()
    else
        name = conv.messages[0].child("recieverName").val()
    
    conversationsBox.innerHTML += 
    '<div class="conversationBox" onclick="showConvMessagesNew(\''+conv.key+'\')">'+
        '<div class="messageNameDiv">'+
            conv.messages[0].child("senderName").val()  
        '</div>'+
        '<div class="messageContentsDiv">'+
            conv.messages[0].child("message").val()+    
        '</div>'+                    
        //'<div class="replyButton" onclick="showConvMessages(\''+conv.messages[0].child("sender").val()+'\',\''+conv.messages[0].child("senderName").val()+'\')">Reply</div>'+                
    '</div>'    
}
function showConvMessagesNew(otherUserKey, otherUserName) {
    // will be called from the conversation div, the key will be put in the paramater with the html
    // will go into conversation holder and get the corresponding conversation by searching thru the keys
    // will then hide conversation list viewer, unhide individual conversation holder, load messages into it
    currentConvUserKey = otherUserKey
    //console.log(otherUserKey)
    hide("conversationsBox")
    unhide("messagesBox")
    unhide("backToConversationsButton")
    clearMessageBoxHTML()
    //addSendBox(otherUserKey)    
    viewMessages(otherUserKey)
    addSendBox(otherUserKey)   
    addUserInfo(otherUserKey, otherUserName) 
    //conversationHolder.showMessages(otherUserKey)

    // show the message on one side and different color based on if they are sent or recieved

    // messages should be sorted by date when they are loaded into the conversation holder
}
function addSendBox(otherUserKey) {
    messagesBox.innerHTML='<textarea id="messageReplyBox"></textarea><div class="messageBoxButton lightRed"onclick="clearMessageReplyBox()">Clear</div><div class="messageBoxButton" onclick="sendReplyMessage(\''+otherUserKey+'\')">Send</div>'+messagesBox.innerHTML
}
function addUserInfo(otherUserKey, otherUserName){
    messagesBox.innerHTML='<div style="display:block; font-size:30px;">'+otherUserName+'</div>'+messagesBox.innerHTML
}
function viewMessages(userKey) {
    userIdToUpdate = userKey
    allConvs.forEach(conv=>{
        if(conv.key == userKey){
            conv.messages.forEach(message => {
                messageToHTML(message)
            })
            return
        }
        console.log("no corresponding message found for: "+userKey)
    })
}
function messageToHTML(message) {

    var extraClass = " "
    //console.log("recieved?: "+message.child("recieved").val())
    if(message.child("recieved").val() == true)
        extraClass = "messageCardSent"

    messagesBox.innerHTML = 
    '<div class="messageCard '+extraClass+'" >'+
        '<div class="messageNameDiv" style="font-size:12px">'+
            message.child("date").val()+" "+
        '</div>'+
        '<div class="messageContentsDiv"  style="font-size:20px">'+
            message.child("message").val()+    
        '</div>'+                    
    //'<div class="replyButton" onclick="showConvMessages(\''+conv.messages[0].child("sender").val()+'\',\''+conv.messages[0].child("senderName").val()+'\')">Reply</div>'+                
    '</div>'  + messagesBox.innerHTML
    
}
function clearMessageBoxHTML(){
    messagesBox.innerHTML = " "
}
function clearConvBoxHTML(){
    conversationsBox.innerHTML = " "
}
function logConvs() {
    console.log("all convs: ")
    allConvs.forEach(conv=>{
        conv.messages.forEach(message=>{
            console.log(message.child("message").val())
        })
    })
}
function sendReplyMessage(messageToId) {
    var replybox = document.getElementById("messageReplyBox")
    console.log("sending message to: " + messageToId + " message: " + replybox.value)
    clearMessages()
    // Put the message in this user's messages
    firebase.database().ref("/users/"+messageToId+"/messages").push(
        {
          message: replybox.value,
          sender: userVariable.uid,  
          senderName: userName,                        
          reciever: messageToId,
          recieverName: "",
          recieved: true,
          read: false,
          date: fullDate()
        }
    )
    
    // Put the message in the other user's messages
    firebase.database().ref("/users/"+userVariable.uid+"/messages").push(
        {
          message: replybox.value,
          sender: userVariable.uid,  
          senderName: userName,                        
          reciever: messageToId,
          recieverName: "",
          recieved: false,
          read: false,
          date: fullDate()
        }
    )
}
// ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== Message Functions
var messageToId  
function showMessageBox(id, name){
    document.getElementById("messageBox").classList.add("showBlock") 
    messageToId = id
    //document.getElementById("messageBox").innerHTML += messageId
    document.getElementById("messageNameSpan").innerHTML = "Message "+name
    document.getElementById("messageSentBox").classList.remove("showBlock")
}
function hideMessageBox(){        
    document.getElementById("messageBox").classList.remove("showBlock")    
}
function sendMessage(){
  sendMessageToUser(messageToId, document.getElementById("messageText").value)
}
function sendMessageToUser(messageToId, messageText){
    sendMessageToUser(messageToId, messageText, messageText)
}
function sendMessageToUser(messageToId, recievedMessageText, sentMessageText){

    // Add it to the other users messages (inbox)
    firebase.database().ref("/users/"+messageToId+"/messages").push(
          {
            message: recievedMessageText,
            sender: userVariable.uid,  
            senderName: userName,                        
            reciever: messageToId,
            recieverName: "",
            recieved: true,
            read: false,
            date: fullDate()
          }
      ).then(()=>{
      //document.getElementById("messageTop").innerHTML = "Message Sent!";
      document.getElementById("messageSentBox").classList.add("showBlock")
    });

    if(sentMessageText == null)
        return
    // Add it to this users messages (sent)
    firebase.database().ref("/users/"+userVariable.uid+"/messages").push(
        {
          message: sentMessageText,
          sender: userVariable.uid,  
          senderName: userName,    
          reciever: messageToId,
          recieverName: "",
          recieved: false,
          read: true, 
          date: fullDate()
        }
    ).then(()=>{
    //document.getElementById("messageTop").innerHTML = "Message Sent!";
    document.getElementById("messageSentBox").classList.add("showBlock")
  });
}
function loadMessages(){
    return
    var conversationBox = document.getElementById("conversationBox")
    var messagesRef = null
    messagesRef = firebase.database().ref("users/"+userVariable.uid+"/messages")
    if(messagesRef == null){
        console.log("no messages to show")
        return
    }
    messagesRef.on("value", (snapshot)=>{
        snapshot.forEach((snapshotChild)=>{       
            console.log(snapshotChild.child("message").val())     
            // this is the message
            conversationBox.innerHTML += 
            '<div class="conversationBox">'+
                '<div class="messageNameDiv">'+
                    snapshotChild.child("senderName").val()+" "+
                '</div>'+
                '<div class="messageContentsDiv">'+
                    snapshotChild.child("message").val()+    
                '</div>'+                    
                '<div class="replyButton" onclick="showMessageBox(\''+snapshotChild.child("sender").val()+'\',\''+snapshotChild.child("senderName").val()+'\')">Reply</div>'+                
            '</div>'            
            
            //snaptest = snapshotChild

            conversationHolder.addMessage(snapshotChild)

            // check to see if its sent or recieved, if it is recieved (by this user) sender is the varaible to sort by
            //if(snapshotChild.child("recieved"))
                //messageLists[snapshotChild.child("sender")].append(snapshotChild)
            // This is when the message was sent by this user, so look at the reciever
           // else
               // messageLists[snapshotChild.child("reciever")].append(snapshotChild)
        })
    }).then(function(){
        //messageLists.forEach((messageList)=>{
            //console.log(messageList[0])
            //console.log(messageList[0].child("sender"))
        //})
        //console.log(snaptest)
    })
}


function clearMessages() {
    messagesBox.innerHTML = " "
}
function clearConvs() {
    console.log("clearing convs")
    conversationsBox.innerHTML = " "
}
var currentConvUserKey = null
// Thit method will go thru the messages and add them into conversations
// we want an array of keys, each associated with an array of messages
var conversationHolder = {

    // THis is where the conversations will be held
    conversationList:[],
    keyList:[],
    // This function will take a snapshot and put the message in the correct conversation (creating one if its not there)
    addKey:function (messageSnapshot) {
        
        this.keyList.push(messageSnapshot.child("sender").val())        
    },
    clearAllMessages:function () {
        conversationList = []
    },    
    addAllMessages:function(messagesSnapshot){
        //console.log("adding all messages")
        messagesSnapshot.forEach(message=>{
            var index = this.convIndexOrAdd2(message)
            //var index = this.keyIndexOrAdd(message)
            // now add a message to that index (of somwthing)
            //console.log(index)
        })
    },
    // if the key is in the list return the indes, else add it and return that index
    keyIndexOrAdd:function(messageSnapshot){
        newKey = messageSnapshot.child("sender").val()        
        var count = 0
        var addNewKey = true
        this.keyList.forEach(key=>{
            console.log("checking if "+key +" == "+newKey)
            // if its already in there return the index
            if(key == newKey){
                addNewKey = false
                // this return did not exit the function?? ... foreach is seen as its own function, not just a loop
                return count  
            }
            else
                console.log("false")   
            count++       
        })
        // if it did not find it its not in there, so add it
        if(addNewKey){
            console.log("pusing a new key")
            this.keyList.push(newKey)            
        }
        return count        
    },
    convIndexOrAdd:function(messageSnapshot){
        newKey = messageSnapshot.child("sender").val()        
        var count = 0
        var addNewConv = true
        this.conversationList.forEach(conv=>{
            //console.log("checking if "+key +" == "+newKey)
            // if its already in there return the index
            if(conv.key == newKey){
                addNewConv = false
                conv.messages.push(messageSnapshot.child("message").val())
                // this return did not exit the function?? ... foreach is seen as its own function, not just a loop
                return count  
            }
            else
                console.log("false")   
            count++       
        })
        // if it did not find it its not in there, so add it
        if(addNewConv){
            console.log("pushing a new conversation")
            this.conversationList.push({
                key:newKey,
                messages:[]
            }) 
            this.conversationList[count].messages.push(messageSnapshot.child("message").val())           
        }
        return count        
    },
    convIndexOrAdd2:function(messageSnapshot){
        var newKey
        // If the message was recieved classify it by person who sent it
        if(messageSnapshot.child("recieved").val())
            newKey = messageSnapshot.child("sender").val()        
        // If this user sent it classify it by the person they sent it to (reciever)
        else
            newKey = messageSnapshot.child("reciever").val()        

        var count = 0
        var addNewConv = true
        this.conversationList.forEach(conv=>{
            //console.log("checking if "+key +" == "+newKey)
            // if its already in there return the index
            if(conv.key == newKey){
                addNewConv = false
                conv.messages.push(messageSnapshot)
                // this return did not exit the function?? ... foreach is seen as its own function, not just a loop
                return count  
            }
            //else
               // console.log("false")   
            count++       
        })
        // if it did not find it its not in there, so add it
        if(addNewConv){
            //console.log("pushing a new conversation")
            // create an object to hold the values
            this.conversationList.push({
                key:newKey,
                messages:[]
            }) 
            // add the message snapshot
            this.conversationList[count].messages.push(messageSnapshot)           
        }
        return count        
    },
    showKeyList: function(){
        this.keyList.forEach(key=>{
            console.log(key)
        })
    },
    showConvListKeys: function(){
        this.conversationList.forEach(conversation=>{
            console.log(conversation.key)
        })
    },
    showConvListMessages: function(){
        this.conversationList.forEach(conversation=>{
            console.log(conversation.messages)
        })
    },
    showConvListMessages2: function(){
        this.conversationList.forEach(conversation=>{
            clearConvs()
            convToHTML(conversation)

            clearMessages()
            console.log("about to show messages")
            this.showMessages(currentConvUserKey)
            //console.log(conversation)
        })
    },
    showMessages:function(userKey){
        console.log("showing messages "+userKey)
        if(userKey == null)
            return
        // find the correct index
        clearMessages()
        conversationHolder.conversationList.forEach(conv=>{
            if(conv.key == userKey){
                conv.messages.forEach(message=>{
                    messageToHTML(message)
                })
            }
        })
        messagesBox.innerHTML+='<textarea id="messageReplyBox"></textarea><div class="messageBoxButton lightRed"onclick="clearMessageReplyBox()">Clear</div><div class="messageBoxButton" onclick="sendReplyMessage(\''+userKey+'\')">Send</div>'
    },
    addMessage: function(messageSnapshot){
        

        return
        if(messageSnapshot.child("recieved")){
            // See if the key is already in there, if its not add an array there
            var newKey = messageSnapshot.child("sender").val()
            
            var keyIndex = this.checkForKey(newKey)
            if(keyIndex == false){
                var newConv = this.conversationList.push({
                    key: newKey,
                    messages:[]
                }) 
            keyIndex = this.checkForKey(newKey)
                // push the message to the messages list there
            this.conversationList[keyIndex].messages.push(messageSnapshot.child("message").val())                
            }
            //else
                //this.conversationList[keyIndex].messages.push(messageSnapshot.child("message"))
            

            console.log("added "+this.conversationList[messageSnapshot.child("sender").val()])
        }
    
    
        //This is when the message was sent by this user, so look at the reciever
       // else
            //this.conversationList[messageSnapshot.child("reciever")].append(messageSnapshot)
            //this.conversationList[messageSnapshot.child("reciever")].push(messageSnapshot) 

        //this.conversationList[messageSnapshot.child("")]
    },
    // Look in all of the objects in conversation list, if one has a matching key return the index, else return false
    checkForKey: function(keyToCheck) {
        var count = 0
        this.conversationList.forEach((conv)=>{
            if(conv.key == keyToCheck)
                return count
            count++
        })
        return false
    }
}
function messageReplyBox() {
    messageReplyBox.value = ""
}
function clearMessageReplyBox() {
    document.getElementById("messageReplyBox").value = ""
}
function callFromButton() {
    conversationHolder.showConvListMessages2()
}
function showConvMessages(otherUserKey) {
    // will be called from the conversation div, the key will be put in the paramater with the html
    // will go into conversation holder and get the corresponding conversation by searching thru the keys
    // will then hide conversation list viewer, unhide individual conversation holder, load messages into it
    currentConvUserKey = otherUserKey
    //console.log(otherUserKey)
    hide("conversationsBox")
    unhide("messagesBox")    
    clearMessages()
    conversationHolder.showMessages(otherUserKey)

    // show the message on one side and different color based on if they are sent or recieved

    // messages should be sorted by date when they are loaded into the conversation holder
}
function backToConversations(params) {
    unhide("conversationsBox")
    hide("messagesBox")
    hide("backToConversationsButton")
    currentConvUserKey = null
}

//if(messageLoader != null)
    //loadMessages2()
function loadMessages2(){
    var messagesRef = null
    messagesRef = firebase.database().ref("users/"+userVariable.uid+"/messages")
    if(messagesRef == null){
        console.log("no messages to show")
        return
    }
    messagesRef.on("value", (snapshot)=>{
        // empties the list
        conversationHolder.clearAllMessages()
        clearMessages()
        // sorts messages into conversation holder 618, foreach message convIndexOrAdd2 679
        conversationHolder.addAllMessages(snapshot)
        // calls clearConvs() convToHTML(conversation) clearMessages() showMessages(currentConvUserKey)
        clearMessages()
        
        conversationHolder.showConvListMessages2()
        //clearMessages()
        return
        snapshot.forEach((snapshotChild)=>{       
            //conversationHolder.addKey(snapshotChild);          
            conversationHolder.addKey()
        })
    })
}

function showMessages(){
    //var conversationBox = document.getElementById("conversationBox")
    console.log(conversationHolder.conversationList)
}

// This is a test function
function showConversationHolder() {
    console.log("showing the conversations")
    conversationHolder.conversationList.forEach(conversation =>{
        console.log(conversation)
    })
}
// filter and map
// https://www.youtube.com/watch?v=G3BS3sh3D8Q

// objects with functions in them
// https://www.youtube.com/watch?v=QoFWCPVpWUE

// push and pop from array
// https://www.youtube.com/watch?v=rCaBV_l9P0Q

// Need to load messages into some kind of data structure
// Sort them by the conversation (sender or reciever)
// A list of messages, and a list of those, add messages to the end, sort by date

// Based on this experiment we can save the snapshots and use them outside the firebase call
var snaptest
function showSnapTest() {
    console.log(snaptest)
    console.log(snaptest.child("message").val())
}
// ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== Cart Functions
function addToCart(userId) {
    firebase.database().ref("users/"+userVariable.uid+"/card").child(userId).set(true)
}
function openCartBox(userId) {
    messageToId = userId
    unhide("cartBox")    
    console.log("opening the cart box")
}
function hideCartBox() {
    hide("cartBox")    
}
function showPaymentMethods(){
    console.log("showing payment methods")
    hide("checkout1")
    unhide("checkout2")
}
function backToScheduling(params) {
    hide("checkout2")
    unhide("checkout1")
    console.log("going back to scheduling")
}

// This works, it seems taht when the button is clicked is when createOrder is called
// We can also get special instructions from a text area, and any other infor we need
// In the sandbox business account we can see the description and ship to address
// would need some way to get alerts about this so I dont miss any
// can create a dashboard showing info like new users, who they looked at, and of course approved orders
paypal.Buttons({
    createOrder: function(data, actions) {
    log("order initiated")
        return actions.order.create({
            purchase_units: [{
            amount: {
                value: '0.01'
            },
            description: 'for user: ' + messageToId
            
            }]
        });
    },
    onApprove: function(data, actions) {
        log("order approved")
        return actions.order.capture().then(function(details) {
            alert('Transaction completed by ' + details.payer.name.given_name);
        });
    }
  }).render('#paypal-button-container'); // Display payment options on your web page
function log(toLog) {
    console.log(toLog)
}
// ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== Test Functions
var usersSnapshot = null
function loadUserSnapshot(){
    //usersSnapshot = firebase.database().ref("users")
    firebase.database().ref("users").once("value",(snapshot)=>{
        usersSnapshot = snapshot
    }).then(()=>{
          console.log("loaded users snapshot: "+usersSnapshot)
    })
}
function printNumber() {
    console.log(usersSnapshot.count)
}
function printUsersNames(startIndex, endIndex) {
    //for(i=startIndex; i<endIndex; i++)
        //console.log(usersSnapshot.child("name").val())
    //return
        var count = 0
        usersSnapshot.forEach((user)=>{
        if(count>=endIndex)
            return
        if(count>=startIndex)
            console.log("user #"+count+": "+user.child("name").val())
        count++
      })
}
function printFirst4() {
    printUsersNames(0,5)
}


/*
________________________________________
goals:
minimum amount to go live in shortest time
everything works, make react demo

________________________________________
cart page (found tutorial with react) (for going live)
can add things to cart
can checkout 

==========
Paypal
:
For just a button, and different button for each one
go to app center tab, integration, buttons (legacy)
https://www.paypal.com/buttons/
go to my saved buttons in the top right
:
First method
1: go to paypal business account (created before)
https://www.paypal.com/mep/dashboard
2: go to the app center and select paypal checkout
https://www.paypal.com/merchantapps/appcenter
3: select a way to integrate: button
https://www.paypal.com/buttons/smart?flowloggingId=8a47de0f82d100
4: configure, copy code, paste in
:
or
3: select a way to integrate: standard integration
copy and paste the code into your cart html page
for more info about the sdk:
https://developer.paypal.com/docs/business/javascript-sdk/javascript-sdk-configuration/
for more info about order customization:
https://developer.paypal.com/docs/api/orders/v2/
search for "You can patch these attributes and objects to complete these operations:"
Now you need to get your client id and paste it into the code, and your sandbox credentials to test
This worked in the description:
amount: {
    value: '0.01'
},
description: 'This is the description'
:
to get your sandbox client id:
developer portal (link below), default application, copy client id
https://developer.paypal.com/developer/applications
AQ6_K7OeLlnB5AHYMaVunft4mFhCwyc29Uam85BR94bIRkI4MUQ80DA66k3u9lBAx_SNAmp6H457oPcf
:
To Get sandbox credentials
dashboard, apps, checkout, standard
in there there is a link to get started with instructions, click link to developer dashboard
on the left go to the sandbox tab, select accounts, and click the 3 dots button, view account info
the username and pass will be here
sb-wpogd5145234@personal.example.com
xZ#m$Eg4
:
To go to your main page
go to paypal business, log in, click my paypal at the top right (round button)

====================
Paypal (worked) 
New list
:
sandbox setup:
https://developer.paypal.com/docs/business/get-started/#get-sandbox-credentials
1) get credentials
Client id:
(linked) https://developer.paypal.com/developer/applications
click on the application under application name (center near top), the client id will be displayed
Account credentials
on left side of same page click accounts
at the bottom there is a personal sandbox and business sandbox account, click the 3 dots at the right, then view/edit account
:
login to the sandbox
https://sandbox.paypal.com/
input the credentials from either business or personal sandbox
:
Create the button for payment
https://www.paypal.com/mep/dashboard
app center (top left), paypal checkout (top left), standard integratio (midway down)
copy and paste html and javascript
change the client id based on what you got before
add a desctiption or whatever other customizations you need to the button
now open the site in the browser, click the button, login with the personal account when prompted, click complete
:
log back into the sandbox business account and verify that it worked and the description was accurate
:
now need to set up the real business account, get those credentials, and test that


====================
Paybal Info:

access_token$sandbox$6ysm7wwhq8hzvkht$22710ede6cd84d46afd56058f1f47c25
client id: AQ6_K7OeLlnB5AHYMaVunft4mFhCwyc29Uam85BR94bIRkI4MUQ80DA66k3u9lBAx_SNAmp6H457oPcf

Sandbox consumer credentials:
sb-wpogd5145234@personal.example.com
xZ#m$Eg4

Sandbox Business credentials:
sb-9v98j5148890@business.example.com
ngbgE1?+
== 

shopping cart video 22 mins
https://www.youtube.com/watch?v=Q_iUh2PrgQc
go to the apps, buttons, shopping cart button
.
https://www.paypal.com/merchantapps/integrate
https://www.paypal.com/buttons/
:
they changed their site so have to manually enter urls
https://www.youtube.com/watch?v=UEJHSPM-Qiw
:
https://www.youtube.com/watch?v=1sCZiv1Ftl8
https://www.youtube.com/watch?v=QOwW5wdIt_w
:
https://developer.paypal.com/docs/business/
https://developer.paypal.com/developer/applications
:
https://www.paypal.com/mep/dashboard
https://www.paypal.com/merchantapps/appcenter/acceptpayments/checkout
the actual button code came from here
paypal.com/buttons/smart?flowloggingId=8a47de0f82d100
:
clicked app center then checkout


====================
Amazon pay
searched amazon pay, clicked small to medium businesses at the top, clicked register
signed in with jguist4@wgu.edu aA
nvm that was to be a merchant on amazon... I just want a button on my website
:
searched amazon pa button and got this site (describing what it is)
https://developer.amazon.com/docs/amazon-pay-onetime/button-widgets.html
:
found this video on youtube
https://www.youtube.com/watch?v=0841vL6Qsko
need to complete the amazon pay merchant registration
gave this link about code to paste in:
https://developer.amazon.com/docs/amazon-pay-onetime/add-a-button.html



their page describing it (but not how to create it)
on the left there is a list of other steps such as integration and configuration
https://developer.amazon.com/docs/amazon-pay-onetime/button-widgets.html
:
https://pay.amazon.com/secure-checkout/small-merchants
https://www.youtube.com/watch?v=0841vL6Qsko




how to get https on github pages
https://www.youtube.com/watch?v=FBtehan5DAo


________________________________________
index.html (for going live)
F&Q page (for going live)

________________________________________
search page (react demo and going live)
search for users
can search by anything like name, last active date, etc
can search by multiple criteria
search for posts

________________________________________
user posts (for react demo) 
 images and text, can like and comment on them 
feed on homp page based on who liked and interests

________________________________________
Additional features:

when no user is logged in things are still loaded (need functions that dont require userVariable, error: can not read property .uid of null)

error message when email or password in not correct

on user detail view has tabs, general, all info, recent activity, message
add more user details

make whole site one page so it doesnt have to load when switching pages

show the last active date in user profile

migrate to react and make apps
snap
insta

try with other database solutions
remake many times to get better at this
review code often

How To Use Content-Aware Scale To Extend Backgrounds 
Stretch Images Using Content Aware Scale


live app used as all types mainly edu app
all users in one place with grade dependent bonus points on test in many classes if they go to a small pizza place at a certain time
the place gets suuuperrr crowded and use that to show advertisers how effective app can be

Some pictures   
https://www.alamy.com/search.html?CreativeOn=1&adv=1&ag=0&all=1&creative=&et=0x000000000000000000000&vp=0&loc=0&qt=baby&qn=&lic=6&lic=1&imgt=0&archive=1&dtfr=&dtto=&hc=&selectdate=&size=0xFF&aqt=&epqt=&oqt=&nqt=&gtype=0&pn=1&ps=100&qt_raw=baby&pl=&cbstore=1#BHM=foo%3Dbar%26st%3D0%26pn%3D1%26ps%3D100%26sortby%3D2%26qt%3Dbaby%26qt_raw%3Dbaby%26qn%3D%26lic%3D3%26edrf%3D0%26mr%3D0%26pr%3D0%26aoa%3D1%26creative%3D%26videos%3D%26nu%3D%26ccc%3D%26bespoke%3D%26apalib%3D%26ag%3D0%26hc%3D0%26et%3D0x000000000000000000000%26vp%3D0%26loc%3D0%26ot%3D0%26imgt%3D0%26dtfr%3D%26dtto%3D%26size%3D0xFF%26blackwhite%3D%26cutout%3D%26archive%3D1%26name%3D%26groupid%3D%26pseudoid%3D%26userid%3D%26id%3D%26a%3D%26xstx%3D0%26cbstore%3D1%26resultview%3DsortbyPopular%26lightbox%3D%26gname%3D%26gtype%3D%26apalic%3D%26tbar%3D1%26pc%3D%26simid%3D%26cap%3D1%26customgeoip%3D%26vd%3D0%26cid%3D%26pe%3D%26so%3D%26lb%3D%26pl%3D%26plno%3D%26fi%3D0%26langcode%3Den%26upl%3D0%26cufr%3D%26cuto%3D%26howler%3D%26cvrem%3D0%26cvtype%3D0%26cvloc%3D0%26cl%3D0%26upfr%3D%26upto%3D%26primcat%3D%26seccat%3D%26cvcategory%3D*%26restriction%3D%26random%3D%26ispremium%3D1%26flip%3D0%26contributorqt%3D%26plgalleryno%3D%26plpublic%3D0%26viewaspublic%3D0%26isplcurate%3D0%26imageurl%3D%26saveQry%3D%26editorial%3D1%26t%3D0%26filters%3D0
https://www.dreamstime.com/photos-images/happy-mom-holding-her-cute-baby-sunset-background.html
https://www.dreamstime.com/happy-mother-walking-her-beloved-daughter-beach-sunset-happy-mother-walking-her-beloved-daughter-beach-image131749358
https://www.shutterstock.com/search/mother+and+child+silhouette
https://www.gettyimages.com/detail/photo/four-generations-of-women-royalty-free-image/97561722?uiloc=thumbnail_similar_images_adp

cryobankamerica, 123, simple site, good text
co-parentmatch, good text, different landing page
cryosinternational. good text

adverts are in the old website folder in a note called social site dev docket
*/