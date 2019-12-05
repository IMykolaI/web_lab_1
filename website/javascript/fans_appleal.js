var useLocalStorage = false;

if(!useLocalStorage){
    window.indexedDB = window.indexedDB || window.mozIndexedDB || 
    window.webkitIndexedDB || window.msIndexedDB;

    window.IDBTransaction = window.IDBTransaction || 
    window.webkitIDBTransaction || window.msIDBTransaction;

    window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || 
    window.msIDBKeyRange;

    var db;
    var request = window.indexedDB.open("RammsteinAppealsDB", 1);

    request.onsuccess = function(event) {
        db = request.result;
    }

    request.onupgradeneeded = function(event) {
        var db = event.target.result;
        var objectStore = db.createObjectStore("appeals", {keyPath: "id"});
    }
}

function add(appeal) {
    var adder = db.transaction(["appeals"], "readwrite")
    .objectStore("appeals")
    .add(appeal);
}

function getFromDb() {
    var appealStore = db.transaction(["appeals"], "readwrite").objectStore("appeals");
    appealStore.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;

        if (cursor) {
            var appeal = cursor.value;
            cursor.delete();
            delete appeal['id'];
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "http://localhost:3000/fans-appeal");
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify({
                name: appeal.name,
                text: appeal.text,
                time: appeal.time,
                date: appeal.date
            }));
            pasteAppeal(appeal);
            cursor.continue();
        }
    }
}


window.addEventListener('online', function(event){
    if(useLocalStorage){
        var availableAppeals = JSON.parse(this.localStorage.getItem('appeals'));
        for(i = 0; i < availableAppeals.length; i++){
            pasteAppeal(availableAppeals[i])
        }
    } else {
        getFromDb();
    }
});

window.addEventListener('offline', function(event){
    if(useLocalStorage){
        if(!this.localStorage.getItem("appeals")){
            localStorage.setItem("appeals", '[]');
        }
    }
});

// --- Appeal Constructor ---

var Appeal = function(){};

Appeal.prototype.id = '';
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
    if (minute >= 0 && minute < 10){
        var time = hour+":0"+minute;
    } else {
        var time = hour+":"+minute;
    }
    var fullDate = month+"."+day+"."+year;

    var form = document.getElementById("appeal-form");
    var appealText = form.value;
    var name = prompt("What is your name?");

    if(name != "" && appealText != ""){
        form.value = "";

        newAppeal = new Appeal();
        newAppeal.id = guid();
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
        if(online) {
            if(useLocalStorage){
                availableAppeals = JSON.parse(appealList);
                for(var i in availableAppeals) {
                    pasteAppeal(availableAppeals[i]);
                }
            } else {
                getFromDb();
            }
            
        }
    } else {
        if(online) {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    availableAppeals = JSON.parse(xhr.response);
                    for(var i in availableAppeals) {
                        pasteAppeal(availableAppeals[i]);
                    }
                }
            }
            xhr.open("GET", "http://localhost:3000/fans-appeal/all");
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send();
        } else {
            if(useLocalStorage) {
                localStorage.setItem(key, '[]');
            }
        }
    }
}

function getStorageItems(key) {
    return JSON.parse(localStorage[key]);
}

function saveData(key, appeal) {
    if(!isOnline()) {
        if(useLocalStorage){
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
            add(appeal);
        }
    } else {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "http://localhost:3000/fans-appeal");
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
            name: appeal.name,
            text: appeal.text,
            time: appeal.time,
            date: appeal.date
        }));
        pasteAppeal(appeal);
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

function guid() {
    function s4() {
    	return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
}
