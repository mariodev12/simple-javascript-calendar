'use strict';

var Auth = (function () {
  const APP_ID = '';
  const JS_KEY = '';

  Parse.initialize(APP_ID,JS_KEY);

  var login = function(){
    var form = document.getElementById('form-login');

    Parse.User.logIn(form.username.value,form.password.value, {
      success: function(user){
        form.submit();
        console.log('Wellcome '+user);
      },
      error: function(user, error){
        console.log('not match');
      }
    });
  };

  var register = function(){
    //event.preventDefault();
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
      },
      error: function(user, eror){
        console.log("error while signing up");
      }
    });
  };
  return {
    register: register,
    login: login
  };
  //$('form-register').submit(false);
})(window);
