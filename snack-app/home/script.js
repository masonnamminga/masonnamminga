import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-analytics.js";

const firebaseConfig = {
    apiKey: "AIzaSyD84Y9JcDQxLv_z7QZ0jGM1exjzlCfFX40",
    authDomain: "vending-machine-b91f1.firebaseapp.com",
    databaseURL: "https://vending-machine-b91f1-default-rtdb.firebaseio.com",
    projectId: "vending-machine-b91f1",
    storageBucket: "vending-machine-b91f1.appspot.com",
    messagingSenderId: "765571810166",
    appId: "1:765571810166:web:dfa4ef6b1fa04b7e37f057",
    measurementId: "G-ZGLVKV6E2Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

import { getDatabase, ref, get, set, child, update, remove }
    from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js"


const db = getDatabase();

var enterID = document.querySelector("#enterID");
var enterName = document.querySelector("#enterName");
var enterAge = document.querySelector("#enterAge");
var enterPin = document.querySelector("#enterPin");

var findID = document.querySelector("#findID");
var findName = document.querySelector("#findName");
var findAge = document.querySelector("#findAge");


var insertBtn = document.querySelector("#insert");
var updateBtn = document.querySelector("#update");
var removeBtn = document.querySelector("#remove");
var findBtn = document.querySelector("#find");


//insert data
function InsertData() {
    set(ref(db, "People/" + enterID.value), {
        Name: enterName.value,
        ID: enterID.value,
        Age: enterAge.value,
        Pin: enterPin.value
    })
        .then(() => {
            // alert("Dev Code ");
        })
        .catch((error) => {
            alert(error);
        });
}

//find data
function FindData() {
    const dbref = ref(db);

    get(child(dbref, "People/" + findID.value))
        .then((snapshot) => {
            if (snapshot.exists()) {
                findName.innerHTML = "Name: " + snapshot.val().Name;
                findAge.innerHTML = "Age: " + snapshot.val().Age;
                if (snapshot.val().Pin !== undefined) {
                    findPin.innerHTML = "Pin: " + snapshot.val().Pin;
                } else {
                    findPin.innerHTML = "Pin: N/A";
                }
            } else {
                alert("No data found");
            }
        })
        .catch((error) => {
            alert(error);
        });
}

//updata data
function UpdateData() {
    update(ref(db, "People/" + enterID.value), {
        Name: enterName.value,
        Age: enterAge.value
    })
        .then(() => {
            // alert("Data updated successfully");
        })
        .catch((error) => {
            alert(error);
        });
}


//remove data (dont use)
function RemoveData() {
    remove(ref(db, "People/" + enterID.value))
        .then(() => {
            alert("Data deleted successfully");
        })
        .catch((error) => {
            alert(error);
        });
}

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!find name and pin for the login modal
function FindByNameAndPin() {
    const dbref = ref(db);

    get(child(dbref, "People/"))
        .then((snapshot) => {
            let foundUser = null;

            snapshot.forEach((childSnapshot) => {
                const userData = childSnapshot.val();
                if (userData.Name === findNameInput.value && userData.Pin === findPinInput.value) {
                    foundUser = userData;
                    return;
                }
            });

            if (foundUser !== null) {
               

        $("#modal7").modal("show");
        // After 2 seconds, close modal1 and open modal2
        setTimeout(function () {
            $("#modal8").modal("show");
        }, 4000);
        setTimeout(function () {
            $("#modal7").modal("hide");
            showDiv();
        }, 5000);
        

                foundName.innerHTML =  foundUser.Name;
                foundID.innerHTML =  foundUser.ID;
                foundAge.innerHTML = foundUser.Age;


            } else {
                // If no matching record is found
                $("#modal6").modal("show");
                foundID.innerHTML = "";
                foundAge.innerHTML = "";
            }
        })
        .catch((error) => {
            alert(error);
        });
}


insertBtn.addEventListener('click', InsertData);
updateBtn.addEventListener('click', UpdateData);
removeBtn.addEventListener('click', RemoveData);
findBtn.addEventListener('click', FindData);

var findNameInput = document.querySelector("#findNameInput");
var findPinInput = document.querySelector("#findPinInput");
var findByNameAndPinBtn = document.querySelector("#findByNameAndPinBtn");
var foundName = document.querySelector("#foundName");
var foundID = document.querySelector("#foundID");
var foundAge = document.querySelector("#foundAge");

findByNameAndPinBtn.addEventListener('click', FindByNameAndPin);



//random auth key generator
function generateRandomID(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

// Event listener for the "GENERATE ID" button
const generateIDBtn = document.querySelector("#generateID");
generateIDBtn.addEventListener('click', function () {
    const generatedID = generateRandomID(10);
    // Set the generated ID in the input field
    enterID.value = generatedID;
});


//this triggers the modal for the creating account animation
$(document).ready(function () {
    $("#insert").click(function () {
        // Open modal1
        $("#modal3").modal("show");
        // After 2 seconds, close modal1 and open modal2
        setTimeout(function () {
            $("#modal4").modal("show");
        }, 4000);
        setTimeout(function () {
            $("#modal3").modal("hide");
        }, 5000);

        setTimeout(function () {
            $("#modal5").modal("show");
        }, 8000);
        setTimeout(function () {
            $("#modal4").modal("hide");
        }, 9000);
    });
});




//create accnt modal 
$(document).ready(function () {
    $("#Create").click(function () {
        $("#modal1").modal();
    });
});


//create login modal 
$(document).ready(function () {
    $("#Login").click(function () {
        $("#modal2").modal();
    });
});


//subtract 1-3 functions
document.getElementById("subtractButton1").addEventListener("click", subtractAge1);
function subtractAge1() {
    let ageElement = document.getElementById("foundAge");
    let updatedAge = parseInt(ageElement.innerText) - 1;

    update(ref(db, "People/" + enterID.value), {
        Name: enterName.value,
        Age: updatedAge
    })
        .then(() => {
            ageElement.innerText = updatedAge;
            alert("Age updated successfully");
        })
        .catch((error) => {
            alert(error);
        });
}

document.getElementById("subtractButton2").addEventListener("click", subtractAge2);
function subtractAge2() {
    let ageElement = document.getElementById("foundAge");
    let updatedAge = parseInt(ageElement.innerText) - 2;

    update(ref(db, "People/" + enterID.value), {
        Name: enterName.value,
        Age: updatedAge
    })
        .then(() => {
            ageElement.innerText = updatedAge;
            alert("Age updated successfully");
        })
        .catch((error) => {
            alert(error);
        });
}

document.getElementById("subtractButton3").addEventListener("click", subtractAge3);
function subtractAge3() {
    let ageElement = document.getElementById("foundAge");
    let updatedAge = parseInt(ageElement.innerText) - 3;

    update(ref(db, "People/" + enterID.value), {
        Name: enterName.value,
        Age: updatedAge
    })
        .then(() => {
            ageElement.innerText = updatedAge;
            alert("Age updated successfully");
        })
        .catch((error) => {
            alert(error);
        });
}


//adding functions!!
document.getElementById("addButton1").addEventListener("click", addAge1);
function addAge1() {
    let ageElement = document.getElementById("foundAge");
    let updatedAge = parseInt(ageElement.innerText) + 1;

    update(ref(db, "People/" + enterID.value), {
        Name: enterName.value,
        Age: updatedAge
    })
        .then(() => {
            ageElement.innerText = updatedAge;
            alert("Age updated successfully");
        })
        .catch((error) => {
            alert(error);
        });
}

document.getElementById("addButton2").addEventListener("click", addAge2);
function addAge2() {
    let ageElement = document.getElementById("foundAge");
    let updatedAge = parseInt(ageElement.innerText) + 2;

    update(ref(db, "People/" + enterID.value), {
        Name: enterName.value,
        Age: updatedAge
    })
        .then(() => {
            ageElement.innerText = updatedAge;
            alert("Age updated successfully");
        })
        .catch((error) => {
            alert(error);
        });
}

document.getElementById("addButton3").addEventListener("click", addAge3);
function addAge3() {
    let ageElement = document.getElementById("foundAge");
    let updatedAge = parseInt(ageElement.innerText) + 3;

    update(ref(db, "People/" + enterID.value), {
        Name: enterName.value,
        Age: updatedAge
    })
        .then(() => {
            ageElement.innerText = updatedAge;
            alert("Age updated successfully");
        })
        .catch((error) => {
            alert(error);
        });
}


// make the QR code (safer: check for DOM + QR lib, use MutationObserver)
function generateQRCode() {
    const element = document.getElementById("foundID");
    const container = document.getElementById("qrcode");

    if (!element || !container) {
        console.warn("QR: missing #foundID or #qrcode in DOM");
        return;
    }
    if (typeof QRCode === "undefined") {
        console.warn("QR: QRCode library not loaded");
        return;
    }

    // clear any previous
    container.innerHTML = "";

    const qrcode = new QRCode(container, {
        text: (element.textContent || element.innerText || "").trim(),
        width: 300,
        height: 300,
        colorDark: "black",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });

    // Use MutationObserver instead of DOMSubtreeModified
    const observer = new MutationObserver(() => {
        const value = (element.textContent || element.innerText || "").trim();
        qrcode.clear();
        qrcode.makeCode(value);
    });

    observer.observe(element, { childList: true, subtree: true, characterData: true });
}

// ensure generateQRCode runs after DOM is ready (and after qrcode lib is loaded — scripts reordered)
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", generateQRCode);
} else {
    generateQRCode();
}

function showDiv() {
    var x = document.getElementById("hidden");
    if (x.style.display === "none") {
       x.style.display = "block";
    } else {
       x.style.display = "none";
    }
   }




