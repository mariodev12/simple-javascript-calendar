var Auth = (function () {
  'use strict';
  var APP_ID = 'uNFkqgoDasm43ma51cTh5L5JcuqTAYlctnHkqUJr';
  var JS_KEY = 'onSewKeMhTffol3MkvlazzXpLQNpJqgLSWtfOcNh';

  Parse.initialize(APP_ID,JS_KEY);

  var currentUser = function(){
    var currentUser = Parse.User.current();
    if(currentUser){
      currentUser.fetch().then(function(fetchedUser){
        var name = fetchedUser.getUsername();
        $('.logo ul').append('<li onclick="Parse.User.logOut();">'+name+'<li>');
      });
    }
  };
  var login = function(event){
    event.preventDefault();
    var form = document.getElementById('form-login');
    var username = form.username.value;
    var password = form.password.value;
    Parse.User.logIn(username,password, {
      success: function(user){
        form.submit();
        window.location.href = "index.html";
        console.log('Wellcome '+user);
      },
      error: function(user, error){
        console.log('not match');
      }
    });
  };

  var register = function(event){
    event.preventDefault();
    var user = new Parse.User();
    var form = document.getElementById('form-register');

    var nameRegister = form.username.value;
    var emailRegister = form.email.value;
    var password2Register = form.password2.value;

    user.set("username", nameRegister);
    user.set("email", emailRegister);
    user.set("password", password2Register);

    user.signUp(null, {
      success: function(user){
        console.log("Signed up user");
        form.submit();
        window.location.href = "index.html";
        Auth.currentUser();
      },
      error: function(user, eror){
        console.log("error while signing up");
      }
    });
  };
  return {
    register: register,
    login: login,
    currentUser: currentUser

  };
})(window);
Auth.currentUser();
