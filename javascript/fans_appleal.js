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
        var content = document.getElementsByClassName("content");
        var section = document.createElement("div");
        section.classList.add("section");

        var row = document.createElement("div");
        row.classList.add("row");

        var div1 = document.createElement("div");
        div1.classList.add("col-sm-2");
        var p = document.createElement("p");
        p.classList.add("border");
        p.classList.add("border-light");
        p.classList.add("text-center");
        var br1 = document.createElement("br");
        var br2 = document.createElement("br");
        var text11 = document.createTextNode(name);
        var text12 = document.createTextNode(time);
        var text13 = document.createTextNode(fullDate);
        p.appendChild(text11);
        p.appendChild(br1);
        p.appendChild(text12);
        p.appendChild(br2);
        p.appendChild(text13);
        div1.appendChild(p);

        var div2 = document.createElement("div");
        div2.classList.add("col-sm-1");

        var div3 = document.createElement("div");
        div3.classList.add("col-sm-9");
        div3.classList.add("border");
        div3.classList.add("border-light");
        var text3 = document.createTextNode(appealText);
        div3.appendChild(text3);

        row.appendChild(div1);
        row.appendChild(div2);
        row.appendChild(div3);

        section.appendChild(row);

        content[0].insertBefore(section, content[0].childNodes[content[0].childNodes.length - 2]);

        var hr = document.createElement("HR");
        hr.classList.add("hor-line");
        content[0].insertBefore(hr, content[0].childNodes[content[0].childNodes.length - 2]);

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