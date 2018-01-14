// Initialize Firebase
// var config =
// { // demo no auth db
//   apiKey: "AIzaSyANDywSVU9hHax6WE8PMuaiDK3qdTdsj78",
//   authDomain: "fir-21155.firebaseapp.com",
//   databaseURL: "https://fir-21155.firebaseio.com",
//   projectId: "fir-21155",
//   storageBucket: "fir-21155.appspot.com",
//   messagingSenderId: "614199486533"
// };
var config =
{ // 'production' db with google auth
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
  $("#inp_train").val("");
  $("#inp_dest").val("");
  $("#inp_arrival").val("");
  $("#inp_freq").val("");
});

// Firebase on childAdded event
timetable_ref.orderByChild("train").on("child_added", function(child)
{
  var train = child.val();
  // log child
  console.log(train);
  // calculate variable values
  var values = calc_train(train);
  // build the table row
  var tr = $('<tr>'
            + '<td>' + train.train + '</td>'
            + '<td>' + train.destination + '</td>'
            + '<td>' + train.frequency + '</td>'
            + '<td>' + moment(values.next).format("HH:mm") + '</td>'
            + '<td>' + values.eta + '</td></tr>'
            );
  // Writes the saved value from firebase to our display
  $("#additionalRows").append(tr);
}, function(errorObject)
{ // Handles firebase failure if it occurs
  console.log("The read failed: " + errorObject.code);
});

//
// Utility Functions
//

// calculate train times
function calc_train(train)
{
  var freq = train.frequency
  // first arrival time - subtract 1 day to fudge number for the calculation
  var first = moment(train.first_arrival, "HH:mm").subtract(1, "days");
  console.log("first:", moment(first).format("HH:mm"));
  // time difference
  var diff = moment().diff(moment(first), "minutes");
  console.log("diff (min):", diff);
  // modulus
  var modulus = diff % freq;
  console.log("modulus:", modulus);
  // arrival
  var eta = freq - modulus;
  console.log("arrival (min):" + eta);
  // Next Train
  var next_train = moment().add(eta, "minutes");
  console.log("arrival time: " + moment(next_train).format("HH:mm"));

  return {"next": next_train, "eta": eta};
}
