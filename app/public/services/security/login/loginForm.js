define(['angular', 'config'], function (angular, config) {
    'use strict';

    var errors = config.errors;

    angular.module('security.login.form', [])

    // The LoginFormController provides the behaviour behind a reusable form to allow users to authenticate.
    // This controller and its template (login/form.tpl.html) are used in a modal dialog box by the security service.
    .controller('loginForm', ['$scope', 'security', function($scope, security) {
      // The model for this form
      $scope.user = {};

      // Any error message from failing to login
      $scope.authError = null;

      // The reason that we are being asked to login - for instance because we tried to access something to which we are not authorized
      // We could do something diffent for each reason here but to keep it simple...
      $scope.authReason = null;
      if ( security.getLoginReason() ) {
        $scope.authReason = ( security.isAuthenticated() ) ?
            errors.notAuthorized :
            errors.notAuthenticated;
//          localizedMessages.get('login.reason.notAuthorized') :
//          localizedMessages.get('login.reason.notAuthenticated');
      }

      // Attempt to authenticate the user specified in the form's model
      $scope.login = function() {
        // Clear any previous security errors
        $scope.authError = null;

        // Try to login
          console.log("$scope.login: ", $scope.user);
        security.login($scope.user.email, $scope.user.password).then(function(loggedIn) {
          if ( !loggedIn ) {
            // If we get here then the login failed due to bad credentials
            $scope.authError = errors.invalidCredentials; //localizedMessages.get('login.error.invalidCredentials');
          }
        }, function(error) {
          // If we get here then there was a problem with the login request to the server
          $scope.authError = errors.serverError.replace("{{exception}}", error.data);
        });
      };

      $scope.clearForm = function() {
        $scope.user = {};
      };

      $scope.cancelLogin = function() {
        security.cancelLogin();
      };
    }]);
});