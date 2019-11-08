window.addEventListener('online', function(event){
    localStorage.removeItem('news');
    // --- Moving data to indexedDB ---
});


// --- News Constructor ---
var News = function(){};

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
            localStorage.removeItem(key);
            // --- Moving data to IndexedDB ---
        }
    } else {
        if(!online) {
            localStorage.setItem(key, '[]');
        }
    }
}

function checkNewNews() {
    var newsList = localStorage['news'];
    if(newsList) {
        var availableNews = JSON.parse(newsList);
        for(i = 0; i < availableNews.length; i++) {
            pasteNews(availableNews[i]);
        }
        if(isOnline()) {
            localStorage.removeItem['news'];
            // --- Move data to DB
        }
    } else {
        if(isOnline()) {
            // --- Read data from IndexedDB ---
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
        // --- Saving to IndexedDB ---
    } else {
        savedNews = getStorageItems(key);
        if(savedNews) {
            savedNews.push(newsIn);
            localStorage[key] = JSON.stringify(savedNews);
        } else {
            savedNews = [];
            savedNews.push(newsIn);
            localStorage[key] = JSON.stringify(savedNews);
        }
    }
}

function pasteNews(newsIn){
    var row = document.getElementsByClassName('row');
    var news = document.createElement("div");
    news.innerHTML  =   `<div class="card">
                            <img src="`+ newsIn.image +`" class="card-img-top" alt="image">
                            <div class="card-body">
                                <p class="card-text" style="color: black">` + newsIn.body + `</p>
                            </div>
                        </div>`
    news.classList.add("col-lg-4", "col-md-6", "col-sm-12", "news");
    row[0].insertBefore(news, row[0].childNodes[row[0].childNodes.length - 1]);
}

function isOnline() {
    return window.navigator.onLine;
}

function getStorageItems(key) {
    return JSON.parse(localStorage[key]);
}
