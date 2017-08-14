$(document).ready(function() {
    $('.clickit').on('click', function() {
        console.log('clicking');
       $.post('http://localhost:8080/api/send', {message: $('#textinput').val()}, function(data, status) {
          console.log(status);
          console.log(data);
       });
    });
});