var useLocalStorage = false;

if(!useLocalStorage){
    window.indexedDB = window.indexedDB || window.mozIndexedDB || 
    window.webkitIndexedDB || window.msIndexedDB;

    window.IDBTransaction = window.IDBTransaction || 
    window.webkitIDBTransaction || window.msIDBTransaction;

    window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || 
    window.msIDBKeyRange;

    var db;
    var request = window.indexedDB.open("RammsteinNewsDB", 1);

    request.onsuccess = function(event) {
        db = request.result;
    }

    request.onupgradeneeded = function(event) {
        var db = event.target.result;
        var objectStore = db.createObjectStore("news", {keyPath: "id"});
    }
}


function add(news) {
    var adder = db.transaction(["news"], "readwrite")
    .objectStore("news")
    .add(news);
}

function getFromDb() {
    var newsStore = db.transaction(["news"], "readwrite").objectStore("news");
    newsStore.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;

        if (cursor) {
            var news = cursor.value;
            cursor.delete();
            delete news['id'];
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "http://localhost:3000/news");
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify({
                title: news.title,
                body: news.body,
                image: news.image
            }));
            cursor.continue();
        }
    }
}

window.addEventListener('online', function(event){
    if(useLocalStorage){
        var availableNews = JSON.parse(this.localStorage.getItem('news'));
        for(i = 0; i < availableNews.length; i++) {
            pasteNews(availableNews[i])
        }
    } else {
        getFromDb();
    }
});

window.addEventListener('offline', function(event){
    if(useLocalStorage){
        if(!this.localStorage.getItem('news')){
            this.localStorage.setItem('news', "[]")
        }
    }
});


// --- News Constructor ---
var News = function(){};

News.prototype.id = '';
News.prototype.title = '';
News.prototype.body = '';
News.prototype.image = '';

// --- Functions ---

function checkOnline() {
    if(isOnline()) {
        checkStorage('news', true);
    } else {
        checkStorage('news', false);
    }
}

function checkStorage(key, online){
    var newsList = localStorage[key];
    if(newsList) {
        if(online) {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    availableNews = JSON.parse(xhr.response);
                    for(var i in availableNews) {
                        pasteNews(availableNews[i]);
                    }
                }
            }
            xhr.open("GET", "http://localhost:3000/news/all");
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send();
        }
    } else {
        if(!online) {
            if(useLocalStorage){
                localStorage.setItem(key, '[]');
            }
        }
    }
}

function checkNewNews() {
    var newsList = localStorage['news'];
    if(newsList) {
        if(isOnline()) {
            if(useLocalStorage){
                var availableNews = JSON.parse(newsList);
                for(i = 0; i < availableNews.length; i++) {
                    pasteNews(availableNews[i]);
                }
            } else {
                getFromDb();
            }
            
        }
    } else {
        if(isOnline()) {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = () => {
                console.log(xhr.readyState);
                if (xhr.readyState === 4) {
                    availableNews = JSON.parse(xhr.response);
                    for(var i in availableNews) {
                        pasteNews(availableNews[i]);
                    }
                }
            }
            xhr.open("GET", "http://localhost:3000/news/all");
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send();
        }
    }
}

function addImage(input){
    if(input.files && input.files[0]){
        var reader = new FileReader();

        reader.onload = function(e){
            document.getElementById("news-image").setAttribute("src", e.target.result);
        };

        reader.readAsDataURL(input.files[0]);
    }
}

function validateNews(){
    var titleForm = document.getElementById("news-title");
    var title = titleForm.value;
    var bodyForm = document.getElementById("news-body");
    var body = bodyForm.value;
    var imageSrc = document.getElementById("news-image").getAttribute("src");
    if(title != "" && body != "" && imageSrc != "images/image-placeholder.jpg"){
        titleForm.value = "";
        bodyForm.value = "";
        document.getElementById("image-input").value = "";
        document.getElementById("news-image").setAttribute("src", "images/image-placeholder.jpg");
        
        newNews = new News();
        newNews.id = guid();
        newNews.title = title;
        newNews.body = body;
        newNews.image = imageSrc;

        saveData('news', newNews);

        alert("News in queue. Thank you for using our site.");
    }
    else{
        if(title == ""){
            alert("Please, enter valid title.");
        }
        if(body == ""){
            alert("Please, enter valid body.");
        }
        if(imageSrc == "images/image-placeholder.jpg"){
            alert("Please, choose image from your storage.");
        }
    }
}

function saveData(key, newsIn){
    if(isOnline()){
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "http://localhost:3000/news");
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
            title: newsIn.title,
            body: newsIn.body,
            image: newsIn.image
        }));
    } else {
        if(useLocalStorage){
            savedNews = getStorageItems(key);
            if(savedNews) {
                savedNews.unshift(newsIn);
                localStorage[key] = JSON.stringify(savedNews);
            } else {
                savedNews = [];
                savedNews.unshift(newsIn);
                localStorage[key] = JSON.stringify(savedNews);
            }
        } else {
            add(newsIn);
        }
    }
}

function pasteNews(newsIn){
    var row = document.getElementsByClassName('row');
    var news = document.createElement("div");
    news.innerHTML  =   `<div class="card">
                            <img src="`+ newsIn.image +`" class="card-img-top" alt="image">
                            <div class="card-body">
                                <h4 class="card-text" style="color: black">` + newsIn.title + `</h4>
                                <p class="card-text" style="color: black">` + newsIn.body + `</p>
                            </div>
                        </div>`
    news.classList.add("col-lg-4", "col-md-6", "col-sm-12", "news");
    row[0].insertBefore(news, row[0].childNodes[1]);
}

function isOnline() {
    return window.navigator.onLine;
}

function getStorageItems(key) {
    return JSON.parse(localStorage[key]);
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
