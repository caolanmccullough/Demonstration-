$("#button1").click(function(){
    $.get("mongodb://localhost/iphone", function(data, status){
        alert("Name: " + user.namae + "email " + user.email);
    });
});