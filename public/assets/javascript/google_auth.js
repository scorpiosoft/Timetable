//
// This file handles the Google Auth
//
// Make sure it is loaded AFTER the file that initializes Firebase
//

// on click event for clicking the Login/Logout button
// $('#google_sign_in').on('click', function(event)
function toggleSignIn()
{
  if (!firebase.auth().currentUser)
  {
    // auth provider
    var provider = new firebase.auth.GoogleAuthProvider();
    // add a scope to the provider
    provider.addScope('https://www.googleapis.com/auth/plus.login');
    // sign in via redirect
    firebase.auth().signInWithRedirect(provider);
  } else {
    // signout
    firebase.auth().signOut();
  }
  // disble the button
  $('#google_sign_in').disabled = true;
}

//
// initApp handles setting up UI event listeners and registering Firebase auth listeners:
//  - firebase.auth().onAuthStateChanged:  This listener is called when the user is signed in or
//    out, and that is where we update the UI.
//  - firebase.auth().getRedirectResult():  This promise completes when the user gets back from
//    the auth redirect flow.  It is where you can get the OAuth access token from the IDP.
//
// function initApp()
// {
  // result from Redirect auth flow
  firebase.auth().getRedirectResult().then(function(result)
  {
    if (result.credential)
    {
      // Google Access Token, use it to access the Google API
      var token = result.credential.accessToken;
      console.log("Google Token:", token);
    }
    // signed-in user info
    var user = result.user;
    console.log("User:", user);
  }).catch(function(error)
  {
    // error handler
    var errorCode = error.code;
    var errorMessage = error.message;
    var email = error.email;
    // firebase.auth.AuthCredential type used
    var credential = error.credential;
    if (errorCode === 'auth/account-exists-with-different-credential')
    {
      alert('You have already signed up with a different auth provider for that email.');
      // handle linking the user's accounts from multiple auth providers here
    } else {
      console.log(error);
    }
  });

  // Listening for auth state changes.
  firebase.auth().onAuthStateChanged(function(user)
  {
    if (user)
    {
      // user is signed in
      var displayName = user.displayName;
      var email = user.email;
      // var emailVerified = user.emailVerified;
      // var photoURL = user.photoURL;
      // var isAnonymous = user.isAnonymous;
      var uid = user.uid;
      // var providerData = user.providerData;
      console.log(displayName, email, uid);
      // toggle text in button
      $('#google_sign_in').text('Sign out ' + displayName);
    } else {
      // user is signed out
      $('#google_sign_in').textContent = 'Sign in with Google';
    }
    $('#google_sign_in').disabled = false;
  });

  document.getElementById('google_sign_in').addEventListener('click', toggleSignIn, false);
// }

// window.onload = function()
// {
//   initApp();
// };
