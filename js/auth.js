var Auth = (function () {
  'use strict';
  var ref = new Firebase("https://tvshow.firebaseio.com/users");

  var currentUser = function(){
    var authData = ref.getAuth();
    if (authData) {
      console.log("Authenticated user with uid:", authData.uid);
    }
  };
  var login = function(event){
    event.preventDefault();
    var form = document.getElementById('auth-register');

    var emailRegister = form.email.value;
    var passwordRegister = form.password.value;

    ref.authWithPassword({
      email    : emailRegister,
      password : passwordRegister,

      success: function(user){
        console.log("Logged In user");
        form.submit();
      },
      error: function(user, eror){
        console.log("error while logging in");
      }
    });
  };
  var register = function(event){
    event.preventDefault();
    var form = document.getElementById('auth');

    var emailRegister = form.email.value;
    var passwordRegister = form.password.value;

    ref.createUser({
      email    : emailRegister,
      password : passwordRegister, success: function(user){
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
    login: login,
    currentUser: currentUser

  };
})(window);
Auth.currentUser();
