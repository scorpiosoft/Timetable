// Initialize Firebase
var config =
{
  apiKey: "AIzaSyANDywSVU9hHax6WE8PMuaiDK3qdTdsj78",
  authDomain: "fir-21155.firebaseapp.com",
  databaseURL: "https://fir-21155.firebaseio.com",
  projectId: "fir-21155",
  storageBucket: "fir-21155.appspot.com",
  messagingSenderId: "614199486533"
};
// var config =
// {
//   apiKey: "AIzaSyAmo21fRAZj2Qob-T3rWAe2dSI2dLJ9i0c",
//   authDomain: "fullstackproje.firebaseapp.com",
//   databaseURL: "https://fullstackproje.firebaseio.com",
//   projectId: "fullstackproje",
//   storageBucket: "fullstackproje.appspot.com",
//   messagingSenderId: "632114626173"
// };
firebase.initializeApp(config);
// grab handle to entire database
// var database = firebase.database();
// grab handle to the database 'timetable' child
var timetable_ref = firebase.database().ref("timetable");

//
// Event Functions
//

// on click event for submit button
$("#submit_train").on("click", function(event)
{
  event.preventDefault();
  // Capture User Inputs and store them into variables
  var train       = $("#inp_train").val().trim();
  var destination = $("#inp_dest").val().trim();
  var arrival     = $("#inp_arrival").val().trim();
  var frequency   = $("#inp_freq").val().trim();
  // NOTE - the use of the Unix epoch prevents start years from before the start of the epoch
  //        those years work fine if the epoch is not used
  // var startDate = moment($("#startDate").val().trim(), "DD/MM/YY").format("X"); <> moment.unix(child.val().startDate).format("MM/DD/YY")
  // var monthlyRate = $("#monthlyRate").val().trim();
  // log data
  console.log("train: ", train, "destination: ", destination, "arrival: ", arrival, "frequency: ", frequency);
  // store data
  timetable_ref.push(
  {
    train: train,
    destination: destination,
    first_arrival: arrival,
    frequency: frequency,
    date_added: firebase.database.ServerValue.TIMESTAMP,
  });
  // clear form
  // $("#name").val("");
  // $("#role").val("");
  // $("#startDate").val("");
  // $("#monthlyRate").val("");
});

// Firebase on childAdded event
timetable_ref.orderByChild("dateA_added").on("child_added", function(child)
{
  // log child
  console.log(child.val());
  // calculate months worked and total billed
  // var monthsWorked = moment().diff(moment.unix(child.val().startDate, "X"), "months");
  // var totalBilled = monthsWorked * child.val().monthlyRate;
  // console.log("monthsWorked", monthsWorked, "totalBilled", totalBilled);
  // build the table row
  var tr = $('<tr>'
            + '<td>' + child.val().train + '</td>'
            + '<td>' + child.val().destination + '</td>'
            + '<td>' + child.val().frequency + '</td>'
            + '<td>' + child.val().first_arrival + '</td>'
            + '<td>' + 0 + '</td></tr>'
            );
  // Writes the saved value from firebase to our display
  $("#additionalRows").prepend(tr);
}, function(errorObject)
{ // Handles firebase failure if it occurs
  console.log("The read failed: " + errorObject.code);
});
