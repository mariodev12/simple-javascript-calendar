'use strict';

var Auth = (function () {
  Parse.initialize('app id','javascript key');

  var register = function(e){
    var user = new Parse.User();

    var form = document.getElementById('form-register');

    var nameRegister = form.username.value;
    var emailRegister = form.email.value;
    //var passwordRegister = //register.password.value;
    var password2Register = form.password2.value;

    user.set("username", nameRegister);
    user.set("email", emailRegister);
    user.set("password", password2Register);

    user.signUp(null, {
      success: function(user){
        form.submit();
        console.log("Signed up user");
      },
      error: function(user, eror){
        console.log("error while signing up");
      }
    });
  };
  return {
    register: register
  };

})(window);
Auth.register(function(e){
  e.preventDefault();
});
