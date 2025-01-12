document.addEventListener('DOMContentLoaded', function () {
  // Wait for 1 second (1000 milliseconds)
  setTimeout(function () {
      // Show the modal
      var delayedModal = new bootstrap.Modal(document.getElementById('delayedModal'));
      delayedModal.show();
  }, 1000);
});



//congfig for my google firebase database
var firebaseConfig = {
apiKey: "AIzaSyBA398n3Q1Xul0t3ZfRYBozkftB5O5pLbQ",
authDomain: "bird-log-6f28b.firebaseapp.com",
projectId: "bird-log-6f28b",
storageBucket: "bird-log-6f28b.appspot.com",
messagingSenderId: "236271810113",
appId: "1:236271810113:web:a7ece86be03837e99df8c0",
measurementId: "G-ZK5JZ9ERSE"
};
// initialize firebase
firebase.initializeApp(firebaseConfig);
// set database variable
var database = firebase.database();
// retrieve reference to the users node in the database
var usersRef = database.ref('users');

//gathers the data from firebase and populates the table of users who have used the site
function populateTable(snapshot) {
    var tbody = document.getElementById('tbody1'); //tbody1 is id of the table data

    tbody.innerHTML = ''; // clear existing table rows

    var userDataArray = []; // array to store user data

    snapshot.forEach(function(childSnapshot) {
        userDataArray.push(childSnapshot.val()); // push user data to the array
    });
    
    userDataArray.reverse(); // reverse the order of entries in the array so newest is on top
    // populate the table with the reversed array
    userDataArray.forEach(function(userData) {
        var tr = '<tr>';
            tr += '<td>' + (userData.username || '') + '</td>';
            tr += '<td>' + (userData.zip || '') + '</td>';
            tr += '<td>' + (userData.time || '') + '</td>';
        tr += '</tr>';
        tbody.innerHTML += tr;
    });
}

// listen for changes in the data so the table is always up to date
usersRef.on('value', function(snapshot) {
    populateTable(snapshot); // call the populateTable function when data changes
});

//checks to make sure the form is filled out by the user before it runs the save function
//keep the user from submitting nothing to firebase and still using the birdfeeder
function checkFieldsAndSave() {
    var name = document.getElementById('name').value;
    var username = document.getElementById('username').value;
    var time = document.getElementById('time').value;
    var zip = document.getElementById('zip').value;

    // check if all fields are filled out
    if (name && username && time && zip) {
        // all fields are filled out, call the save function
        save();
    } else {
        // alert the user to fill out all fields
        alert('Please fill out all fields. (Leaving a note is optional)');
    }
}

//saves the data from the form to firebase MOST IMPORTANT PART!!
function save() {
  
    var name = document.getElementById('name').value;
    var username = document.getElementById('username').value;
    var zip = document.getElementById('zip').value;
    var time = document.getElementById('time').value;
    var note = document.getElementById('note').value;

    // generate a new key for the entry (this keeps it from overwriting the data if someone uses the feeder twice)
    var newEntryKey = database.ref().child('users').push().key;

    // set the data with the new key
    var updates = {};
    updates['/users/' + newEntryKey] = {
        name: name,
        username: username,
        zip: zip,
        time: time,
        note: note
    };

    database.ref().update(updates);
    feedthem();
    //shows the modal after 1 seconds 
    setTimeout(function() {
    $('#sent').modal('show');
  }, 1500);
}


//autofills what the current time is in the feed the birds form
function fillCurrentTime() {
        var now = new Date();
        var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
        var timeString = now.toLocaleString('en-US', options);
        document.getElementById('time').value = timeString;
    }

  
 
// Function to get the current location and fill the input field
function fillCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      // Extract latitude and longitude
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      // Use Nominatim API to reverse geocode the coordinates into a location
      fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
        .then(response => response.json())
        .then(data => {
          if (data.address) {
            // Extract town (city) and state from the API response
            const town = data.address.city || data.address.town || data.address.village;
            const state = data.address.state;

            if (town && state) {
              // Fill the input field with town and state
              document.getElementById('zip').value = `${town}, ${state}`;
            } else {
              alert('Town and state not found for your location. Report error: contact@masonnamminga.com');
            }
          } else {
            alert('Location not found. Report error: contact@masonnamminga.com');
          }
        })
        .catch(error => {
          console.error('Error fetching location data:', error);
          alert('Unable to retrieve location data. Report error: contact@masonnamminga.com');
        });
    }, function() {
      alert('Geolocation permission denied or not supported. Report error: contact@masonnamminga.com');
    });
  } else {
    alert('Geolocation is not supported by this browser. Report error: contact@masonnamminga.com');
  }
}
    


//birdfeeder function i used to just use a fetch request but that stopped working in safari 

function feedthem() {
  var xhr1 = new XMLHttpRequest();
  xhr1.open('GET', 'https://ny3.blynk.cloud/external/api/update?token=yld7ZSxKUKs8WQrOjDHk4iAJbYitL250&v1=1', true);
  xhr1.onreadystatechange = function() {
    if (xhr1.readyState === 4 && xhr1.status === 200) {
      console.log('First request successful');
      setTimeout(function() {
        var xhr2 = new XMLHttpRequest();
        xhr2.open('GET', 'https://ny3.blynk.cloud/external/api/update?token=yld7ZSxKUKs8WQrOjDHk4iAJbYitL250&v1=0', true);
        xhr2.onreadystatechange = function() {
          if (xhr2.readyState === 4 && xhr2.status === 200) {
            console.log('Second request successful');
            // You can perform further actions here upon successful response
          }
        };
        xhr2.send();
      }, 5000);
    }
  };
  xhr1.send();
}









