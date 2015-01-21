clearForms = function() {
  for(var form in forms) {
    var form = forms[form]
    $(form).fadeOut();
  }
}

// Form appearance control
var forms = {
  loginForm: '#login-form-section',
  registrationFormSection: '#registration-form-section'
}

var Session = function() {
  this.stopPropagation = function(form) {
    form.click(function(e) {
      e.stopPropagation();
    })
  }
  this.eventListener = function(clickSelector, listenFor, formSection) {
    clickSelector.on('click', listenFor, function(e) {
      e.preventDefault();
      e.stopPropagation();
      var opened = $(this).data('opened');
      if (opened) {
        clearForms();
      } else {
        clearForms();
        $(formSection).fadeIn();
      }
      $(this).data('opened', !opened);
    })
  }
  this.headerTemplate = function (selector) {
    _.template(selector.html());
  }
  this.loginTemplate = function (selector) {
    _.template(selector.html());
  }
}

$(document).ready(function (){

  var session = new Session;

  session.stopPropagation($('#login-form-section'))
  session.stopPropagation($('#registration-form-section'))
  session.eventListener($('#session'), '#login-link', '#login-form-section')
  session.eventListener($('#session'), '#register-link', '#registration-form-section')
  $('.disaffirm').click(function (e) { e.preventDefault(); clearForms(); })
  $('html').click(function(e) { clearForms(); })

  // Ajax session control
  $('#session-forms').on('submit', '#login-form', function(e) {
    e.preventDefault();
    var request = $.ajax({
      url: "/login",
      method: "post",
      dataType: "json",
      data: $('#login-form').serialize()
    })

    request.done(function(response) {
      var sessionData = {
        loggedInUserId: response.id,
        loggedInUserName: response.username,
        loggedInUserEmail: response.email
      }

      $('welcomeAnchor').append(response.username)
      $('#login-form-section').fadeOut();
      $('#session').html(session.headerTemplate($('#session-template'))(sessionData));
    });
  });
  $('#session').on('click', '#do-logout', function(e) {
    e.preventDefault();
    var request = $.ajax({
        url: '/logout',
        type: 'post',
        success: function(result) {
          $('#session').html(session.loginTemplate($('#session-login-template')));
        }
    });
  });
})
