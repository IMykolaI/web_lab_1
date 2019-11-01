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
        document.getElementById("news-image").setAttribute("src", "images/image-placeholder.jpg");
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
