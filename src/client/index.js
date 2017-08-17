var receiver;
$(document).ready(function() {
    $('.message').hide();
    $('.clickit').on('click', function() {
        console.log('clicking');
       $.post('http://localhost:8080/api/send', {
           message: $('#textinput').val(),
           receiver: receiver
       }, function(data, status) {
           $('#textinput').val('');
          console.log(status);
          console.log(data);
       });
    });

  var socket = io();
  $('.start-chat').on('click', function() {
      console.log('naming');
      $('.message').show();
      $('.setup').hide();
     socket.emit('setPersonalRoom', {
         room: document.getElementById('nameinput').value,
         queue: document.getElementById('receivernameinput').value
     });
     receiver = document.getElementById('receivernameinput').value;
  });

  socket.on('sendToPersonalRoom', function(data) {
      $('.server-messages').html('').html(data);
  });

    socket.on('receiveUserMessage', function(data) {
        var $userMessages = $('.user-messages');
        $userMessages.html($userMessages.html() + '<br><div>' + data + '</div>');
    });
});