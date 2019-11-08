window.addEventListener('online', function(event){
    localStorage.removeItem('appeals');
    console.log('All data moved to server.');
    // --- Moving data to indexedDB ---
});

// --- Appeal Constructor ---

var Appeal = function(){};

Appeal.prototype.name = '';
Appeal.prototype.text = '';
Appeal.prototype.time = '';
Appeal.prototype.date = '';

// --- Functions ---

function addAppeal(){

    var date = new Date();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear() - 2000;
    var time = hour+":"+minute;
    var fullDate = month+"."+day+"."+year;

    var form = document.getElementById("appeal-form");
    var appealText = form.value;
    var name = prompt("What is your name?");

    if(name != "" && appealText != ""){
        form.value = "";
        var content = document.getElementsByClassName('content');
        var appeal = document.createElement("div");
        appeal.innerHTML = `<div class="section">
                                <div class="row">
                                    <div class="col-sm-2">
                                        <p class="border border-light text-center">`+name+`<br>`+time+`<br>`+fullDate+`</p>
                                    </div>
                                    <div class="col-sm-1"></div>
                                    <div class="col-sm-9 border border-light">`+appealText+`</div>
                                </div>
                            </div>
                            <hr class="hor-line">`;
        
        content[0].insertBefore(appeal, content[0].childNodes[content[0].childNodes.length - 2]);

        newAppeal = new Appeal();
        newAppeal.name = name;
        newAppeal.text = appealText;
        newAppeal.time = time;
        newAppeal.date = fullDate;

        saveData('appeals', newAppeal);

        alert("Success! Thank you for lefting an appeal.")
    }
    else{
        if(name==""){
            alert("Please enter valid name.");
        }
        if(appealText==""){
            alert("Please enter valid text.");
        }
    }
}

function isOnline() {
    return window.navigator.onLine;
}

function checkOnline() {
    if(isOnline()) {
        checkStorage('appeals', true);
    } else {
        checkStorage('appeals', false);
    }
}

function checkStorage(key, online){
    var appealList = localStorage[key];
    if(appealList) {
        availableAppeals = JSON.parse(appealList);
        for(i = 0; i < availableAppeals.length; i++){
            pasteAppeal(availableAppeals[i]);
        }
        if(online) {
            localStorage.removeItem(key);
            console.log('All data moved to server.');
            // --- Moving data to IndexedDB ---
        }
    } else {
        if(online) {
            // --- Read data from server ---
        } else {
            localStorage.setItem(key, '[]');
        }
    }
}

function getStorageItems(key) {
    return JSON.parse(localStorage[key]);
}

function saveData(key, appeal) {
    if(!isOnline()) {
        savedAppeals = getStorageItems(key);

        if(savedAppeals) {
            savedAppeals.push(appeal)
            localStorage[key] = JSON.stringify(savedAppeals);
        } else {
            savedAppeals = [];
            savedAppeals.push(appeal);
            localStorage[key] = JSON.stringify(savedAppeals);
        }
    } else {
        // --- Saving data to IndexedDB ---
    }
}

function pasteAppeal(appealIn){
    var content = document.getElementsByClassName('content');
    var appeal = document.createElement("div");
    appeal.innerHTML = `<div class="section">
                            <div class="row">
                                <div class="col-sm-2">
                                    <p class="border border-light text-center">`+appealIn.name+`<br>`+appealIn.time+`<br>`+appealIn.date+`</p>
                                </div>
                                <div class="col-sm-1"></div>
                                <div class="col-sm-9 border border-light">`+appealIn.text+`</div>
                            </div>
                        </div>
                        <hr class="hor-line">`;
    
    content[0].insertBefore(appeal, content[0].childNodes[content[0].childNodes.length - 2]);
}
