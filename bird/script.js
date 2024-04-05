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
    //shows the modal after 5 seconds (thats how long the loader is shown for)
    setTimeout(function() {
    $('#sent').modal('show');
  }, 3000);
}


//autofills what the current time is in the feed the birds form
function fillCurrentTime() {
        var now = new Date();
        var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
        var timeString = now.toLocaleString('en-US', options);
        document.getElementById('time').value = timeString;
    }

//gets the users coordinates, converts it to a city, state format and puts in a read only input field.
function getUserCity() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(function(position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      // Make a request to Nominatim API for reverse geocoding (YAY FREE API!!)
      fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
        .then(response => response.json())
        .then(data => {
          const city = data.address.city || data.address.town || data.address.village || data.address.hamlet;
          const state = data.address.state;
          if (city && state) {
            const location = `${city}, ${state}`;
            document.getElementById("zip").value = location;
          } else {
            document.getElementById("zip").placeholder = "City not found";
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
    });
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}


//clock for real time vs stream time 
//lets user see the stream time delay and decide if they need to refresh the page
function updateClock() {
    const clockElement = document.getElementById('clock');
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    const timeString = `${hours}:${minutes}:${seconds}`;
    clockElement.textContent = timeString;
}

setInterval(updateClock, 1000);

updateClock();

//this sets the display name to uppercase letters, this is just so it looks nice and match
//the reason that you can only type three letters is becasue i can ony think of 3 bad words you can spell with letters compared to like 50 with four letters.
function convertToUpperCase(event) {
            var input = event.target;
            input.value = input.value.toUpperCase();
        }

        document.addEventListener("DOMContentLoaded", function () {
            var inputField = document.getElementById("username");
            inputField.addEventListener("input", convertToUpperCase);
        });

//runs the uptime clock on the "who has fed the birds" section
// this is when i made the website
const targetDate = new Date("April 1, 2024 00:00:00").getTime();

// update the count up timer every second
const timer = setInterval(function() {
    // get the current date and time
    const now = new Date().getTime();

    // calculate the difference between now and the target date
    const difference = now - targetDate;

    // calculate years, months, days, hours, minutes, and seconds
    const years = Math.floor(difference / (1000 * 60 * 60 * 24 * 365));
    const months = Math.floor((difference % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
    const days = Math.floor((difference % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    // display the count up timer
    document.getElementById("countup").innerHTML = years + " years, " + months + " months, " + days + " days, " + hours + " hours, " + minutes + " minutes, and " + seconds + " seconds.";

}, 1000);


// does the little spin animation on the feed birds button
$('#load1').on('click', function() {
    var $this = $(this);
    $this.button('loading');
    setTimeout(function() {
        $this.button('reset');
    }, 3000);
});

//birdfeeder function i used to just use a fetch request but that stopped working in safari 

function feedthem() {
  var xhr1 = new XMLHttpRequest();
  xhr1.open('GET', 'https://ny3.blynk.cloud/external/api/update?token=rvzws28JzOyML_Sfi5boeAJ3V8n7kj6P&v0=180', true);
  xhr1.onreadystatechange = function() {
    if (xhr1.readyState === 4 && xhr1.status === 200) {
      console.log('First request successful');
      setTimeout(function() {
        var xhr2 = new XMLHttpRequest();
        xhr2.open('GET', 'https://ny3.blynk.cloud/external/api/update?token=rvzws28JzOyML_Sfi5boeAJ3V8n7kj6P&v0=0', true);
        xhr2.onreadystatechange = function() {
          if (xhr2.readyState === 4 && xhr2.status === 200) {
            console.log('Second request successful');
            // You can perform further actions here upon successful response
          }
        };
        xhr2.send();
      }, 2000);
    }
  };
  xhr1.send();
}


//this button is for testing the birdfeeder without having to use the form each time
function promptPassword(event) {
  event.preventDefault();
  var password = prompt("Please enter the password:");
  if (password === "123") {
    document.getElementById("admin").style.display = "block";
  } else {
    alert("Incorrect password!");
  }
}
document.getElementById("pword").addEventListener("click", promptPassword);




