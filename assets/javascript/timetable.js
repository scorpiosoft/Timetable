// Initialize Firebase
var config =
{
  apiKey: "AIzaSyAmo21fRAZj2Qob-T3rWAe2dSI2dLJ9i0c",
  authDomain: "fullstackproje.firebaseapp.com",
  databaseURL: "https://fullstackproje.firebaseio.com",
  projectId: "fullstackproje",
  storageBucket: "fullstackproje.appspot.com",
  messagingSenderId: "632114626173"
};
firebase.initializeApp(config);
// grab handle to entire database
// var database = firebase.database();
// grab handle to the database 'timesheet' child
var timesheet_ref = firebase.database().ref("timesheet");

//
// setup auth
//
var provider = new firebase.auth.GoogleAuthProvider();
// auth event handler
firebase.auth().getRedirectResult().then(function(result)
{
  if (result.credential)
  {
    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = result.credential.accessToken;
    // ...
  }
  // The signed-in user info.
  var user = result.user;
}).catch(function(error)
{
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // The email of the user's account used.
  var email = error.email;
  // The firebase.auth.AuthCredential type that was used.
  var credential = error.credential;
  // log the error
  console.log("ERROR:", errorCode, errorMessage, "User email:", email, "Credential:", credential);
});

// listen for user change
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    console.log("User:", user);
  } else {
    // No user is signed in.
  }
});

//
// Event Functions
//

// on click event for submit button
$("#submit").on("click", function(event)
{
  event.preventDefault();
  // Capture User Inputs and store them into variables
  var name = $("#name").val().trim();
  var role = $("#role").val().trim();
  // NOTE - the use of the Unix epoch prevents start years from before the start of the epoch
  //        those years work fine if the epoch is not used
  var startDate = moment($("#startDate").val().trim(), "DD/MM/YY").format("X");
  var monthlyRate = $("#monthlyRate").val().trim();
  // log data
  console.log("name: " + name);
  console.log("role: " + role);
  console.log("start: " + startDate);
  console.log("rate: " + monthlyRate);
  // store data
  timesheet_ref.push(
  {
    name: name,
    role: role,
    startDate: startDate,
    monthlyRate: monthlyRate,
    dateAdded: firebase.database.ServerValue.TIMESTAMP,
  });
  // clear form
  $("#name").val("");
  $("#role").val("");
  $("#startDate").val("");
  $("#monthlyRate").val("");
});

// Firebase on childAdded event
timesheet_ref.orderByChild("dateAdded").on("child_added", function(child)
{
  // log child
  console.log(child.val());
  // calculate months worked and total billed  
  var monthsWorked = moment().diff(moment.unix(child.val().startDate, "X"), "months");
  var totalBilled = monthsWorked * child.val().monthlyRate;
  console.log("monthsWorked", monthsWorked, "totalBilled", totalBilled);
  // build the table row
  var tr = $('<tr>'
            + '<td>' + child.val().name + '</td>'
            + '<td>' + child.val().role + '</td>'
            + '<td>' + moment.unix(child.val().startDate).format("MM/DD/YY") + '</td>'
            + '<td>' + monthsWorked + '</td>'
            + '<td>' + child.val().monthlyRate + '</td>'
            + '<td>' + totalBilled + '</td></tr>'
            );
  // Writes the saved value from firebase to our display
  $("#additionalRows").prepend(tr);
}, function(errorObject)
{ // Handles firebase failure if it occurs
  console.log("The read failed: " + errorObject.code);
});
