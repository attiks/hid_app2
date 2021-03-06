'use strict';

var app = angular.module('hidApp', [
    'ngRoute',
    'ngResource',
    'xeditable',
    'ui.bootstrap',
    'angular-md5',
    'ui.select',
    'lr.upload',
    'ngPassword',
    'ngMessages',
    'gettext',
    'bcPhoneNumber',
    'angularMoment',
    'ngTouch',
    'LocalForageModule',
    'ngFileSaver',
    'angular-clipboard',
    'vcRecaptcha',
    'angular-jwt',
    'app.start',
    'app.dashboard',
    'app.list',
    'app.client',
    'app.duplicate',
    'app.service',
    'app.auth',
    'app.common',
    'app.user',
    'app.checkin',
    'app.search',
    'app.notifications',
    'app.sidebar',
    'app.outlook',
    'app.operations',
    'app.trustedDomain'
  ])
  .run(configureOffline)
  .run(configureAuthCheck)
  .run(configureLanguages)
  .run(configureAccessibility)
  .run(configureAnalytics)
  .config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
      $routeProvider.
        when('/', {
          templateUrl: 'app/components/auth/login.html',
          controller: 'AuthController',
          title: 'Log in'
        }).
        when('/landing', {
          templateUrl: 'app/components/landing/landing.html',
          controller: 'LandingController',
          authenticate: true,
          title: 'Welcome'
        }).
        when('/dashboard', {
          templateUrl: 'app/components/dashboard/dashboard.html',
          controller: 'DashboardController',
          authenticate: true,
          title: 'Dashboard'
        }).
        when('/settings', {
          templateUrl: 'app/components/user/preferences.html',
          controller: 'UserPrefsController',
          authenticate: true,
          title: 'Settings'
        }).
        when('/settings/:userId', {
          templateUrl: 'app/components/user/preferences.html',
          controller: 'UserController',
          authenticate: true,
          title: 'Settings'
        }).
        when('/users', {
          templateUrl: 'app/components/user/users-page.html',
          controller: 'UsersPageController',
          authenticate: true,
          title: 'Users'
        }).
        when('/users/new', {
          templateUrl: 'app/components/user/new-user-page.html',
          controller: 'UserNewController',
          authenticate: true,
          title: 'New user'
        }).
        when('/users/:userId', {
          templateUrl: 'app/components/user/user.html',
          controller: 'UserController',
          authenticate: true
        }).
        when('/users/:userId/:edit', {
          templateUrl: 'app/components/user/user.html',
          controller: 'UserController',
          authenticate: true,
          title: 'User profile'
        }).
        when('/checkin', {
          templateUrl: 'app/components/checkin/checkin.html',
          controller: 'CheckinController',
          authenticate: true,
          title: 'Check-in'
        }).
        when('/checkout', {
          templateUrl: 'app/components/checkin/checkout-page.html',
          authenticate: true,
          title: 'Check out'
        }).
        when('/checkin/:userId', {
          templateUrl: 'app/components/checkin/checkin.html',
          controller: 'CheckinController',
          authenticate: true,
          title: 'Check-in'
        }).

        when('/kiosk', {
          templateUrl: 'app/components/user/kiosk.html',
          controller: 'KioskController',
          authenticate: true,
          title: 'Kiosk'
        }).
        when('/lists', {
          templateUrl: 'app/components/list/lists.html',
          controller: 'ListsController',
          authenticate: true,
          title: 'Lists'
        }).
        when('/lists/new', {
          templateUrl: 'app/components/list/new-list.html',
          controller: 'ListEditController',
          authenticate: true,
          title: 'New list'
        }).
        when('/lists/:list', {
          templateUrl: 'app/components/list/list.html',
          controller: 'ListController',
          authenticate: true,
          title: 'List',
          reloadOnSearch: false
        }).
        when('/lists/:list/edit', {
          templateUrl: 'app/components/list/new-list.html',
          controller: 'ListEditController',
          authenticate: true,
          title: 'Edit list'
        }).
        when('/clients/new', {
          templateUrl: 'app/components/client/new-client.html',
          controller: 'ClientController',
          authenticate: true,
          adminOnly: true,
          title: 'New client'
        }).
        when('/clients', {
          templateUrl: 'app/components/client/clients.html',
          controller: 'ClientsController',
          authenticate: true,
          adminOnly: true,
          title: 'Clients'
        }).
        when('/clients/:clientId', {
          templateUrl: 'app/components/client/client.html',
          controller: 'ClientController',
          authenticate: true,
          adminOnly: true,
          title: 'Client'
        }).
        when('/clients/:clientId/edit', {
          templateUrl: 'app/components/client/new-client.html',
          controller: 'ClientController',
          authenticate: true,
          adminOnly: true,
          title: 'Edit client'
        }).
        when('/trustedDomains', {
          templateUrl: 'app/components/trustedDomain/trustedDomains.html',
          controller: 'TrustedDomainsController',
          authenticate: true,
          adminOnly: true,
          title: 'Trusted Domains'
        }).
        when('/duplicates', {
          templateUrl: 'app/components/duplicate/duplicates.html',
          controller: 'DuplicatesController',
          authenticate: true,
          adminOnly: true,
          title: 'Duplicates'
        }).
        when('/services/new', {
          templateUrl: 'app/components/service/new-service.html',
          controller: 'ServiceEditController',
          authenticate: true,
          adminOrManagerOnly: true,
          title: 'New service'
        }).
        when('/services', {
          templateUrl: 'app/components/service/services-page.html',
          controller: 'ServicesPageController',
          authenticate: true,
          adminOrManagerOnly: true,
          title: 'Services'
        }).
        when('/services/suggestions/:userId', {
          templateUrl: 'app/components/service/suggestions.html',
          controller: 'SuggestionsController',
          authenticate: true,
          adminOnly: false,
          title: 'Suggestions'
        }).
        when('/services/suggestions', {
          templateUrl: 'app/components/service/suggestions.html',
          controller: 'SuggestionsController',
          authenticate: true,
          adminOnly: false,
          title: 'Suggestions'
        }).
        when('/services/:serviceId', {
          templateUrl: 'app/components/service/service.html',
          controller: 'ServiceController',
          authenticate: true,
          adminOnly: false,
          title: 'Service'
        }).
        when('/services/:serviceId/edit', {
          templateUrl: 'app/components/service/new-service.html',
          controller: 'ServiceEditController',
          authenticate: true,
          adminOnly: false,
          title: 'Edit service'
        }).
        when('/register', {
          templateUrl: 'app/components/auth/register.html',
          controller: 'UserNewController',
          title: 'Register'
        })
        .when('/password_reset', {
          templateUrl: 'app/components/auth/password_reset.html',
          controller: 'ResetPasswordController',
          title: 'Reset password'
        })
        .when('/reset_password', {
          templateUrl: 'app/components/auth/reset_password.html',
          controller: 'ResetPasswordController',
          title: 'Reset password'
        })
        .when('/verify', {
          template: '',
          controller: 'VerifyController'
        })
        .when('/logout', {
          template: '',
          controller: 'AuthController',
          authenticate: true
        })
        .when('/search', {
          templateUrl: 'app/components/search/search-results.html',
          controller: 'SearchController',
          authenticate: true,
          title: 'Search results',
          reloadOnSearch: false
        })
        .when('/notifications', {
          templateUrl: 'app/components/notifications/notifications.html',
          controller: 'NotificationsController',
          authenticate: true,
          title: 'Notifications'
        })
        .when('/start', {
          templateUrl: 'app/components/start/start.html',
          controller: 'StartController',
          authenticate: true,
          title: 'Getting started'
        })
        .when('/tutorial', {
          templateUrl: 'app/components/start/tutorial.html',
          controller: 'TutorialController',
          authenticate: true,
          title: 'Tutorial'
        })
        .when('/outlook', {
          template: '',
          controller: 'OutlookController',
          authenticate: true
        })
        .when('/main/:operationUrl', {
          templateUrl: 'app/components/operations/operation.html',
          controller: 'OperationViewController',
          authenticate: true,
          title: 'Operation'
        })
        .when('/operations', {
          templateUrl: 'app/components/operations/operations.html',
          controller: 'OperationsController',
          authenticate: true,
          title: 'Operations'
        })
        .when('/operations/new', {
          templateUrl: 'app/components/operations/new-operation.html',
          controller: 'OperationController',
          authenticate: true,
          title: 'New operation'
        })
        .when('/operations/:operationId', {
          templateUrl: 'app/components/operations/new-operation.html',
          controller: 'OperationController',
          authenticate: true,
          title: 'New operation'
        })
        .otherwise({
          redirectTo: '/'
        });
      // use the HTML5 History API
      $locationProvider.html5Mode(true);
    }
  ])
  .config(["$httpProvider", function ($httpProvider) {
    $httpProvider.defaults.transformResponse.push(function(responseData){
      var regexIso8601 = /^(\d{4}|\+\d{6})(?:-(\d{2})(?:-(\d{2})(?:T(\d{2}):(\d{2}):(\d{2})\.(\d{1,})(Z|([\-+])(\d{2}):(\d{2}))?)?)?)?$/;
      var convertDateStringsToDates = function (input) {
        // Ignore things that aren't objects.
        if (typeof input !== "object") return input;

        for (var key in input) {
          if (!input.hasOwnProperty(key)) continue;

          var value = input[key];
          var match;
          // Check for string properties which look like dates.
          if (typeof value === "string" && (match = value.match(regexIso8601))) {
            var milliseconds = Date.parse(match[0]);
            if (!isNaN(milliseconds)) {
              input[key] = new Date(milliseconds);
            }
          } else if (typeof value === "object") {
            // Recurse into object
            convertDateStringsToDates(value);
          }
        }
      };
      convertDateStringsToDates(responseData);
      return responseData;
    });
    $httpProvider.interceptors.push('APIInterceptor');
  }])
  .config(function ($provide) {
    $provide.decorator('$exceptionHandler',
      function provideDecorator($delegate, $injector, $log) {
        return function (exception, cause) {
          if (newrelic && newrelic.noticeError) {
            var errorMessage = cause;
            if (exception.data && exception.data.error) {
              errorMessage += ' - ' + exception.data.error;
              if (exception.data.message) {
                errorMessage += ' - ' + exception.data.message;
              }
            }
            try {
              newrelic.noticeError(errorMessage);
            } catch (newRelicError) {
              $log.error( newRelicError );
            }
          }
          $delegate(exception, cause);
        };
      }
    );
  })
  .config(['$localForageProvider', function ($localForageProvider) {
    $localForageProvider.config({
        name        : 'users', // name of the database and prefix for your data, it is "lf" by default
        storeName   : 'users', // name of the table
    });
  }])
  // Add data as part of the whitelist
  .config(['$compileProvider', function ($compileProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|data):/);
  }])
  .run(configureLocalForage)
  .run(configureEditableOptions);


// Load config
var env = {};
if (window) {
  angular.copy(window.__env, env); // eslint-disable-line angular/window-service
}
app.constant('config', env) // eslint-disable-line angular/file-name,angular/module-getter


//
// Configure Offlinejs
//
// TODO: do the offline checks on something other than favicon
//
function configureOffline($rootScope) {
  Offline.options = {
    checkOnLoad: true,
    interceptRequests: true,
    reconnect: false,
    requests: false // record ajax requests and re-send on connection restore
  };

  $rootScope.isOnline = Offline.state == 'up';
  Offline.on('up', function() {
    $rootScope.isOnline = true;
    $rootScope.$digest();
  });
  Offline.on('down', function() {
    $rootScope.isOnline = false;
    $rootScope.$digest();
  });
}


//
// Check Authentication
//
function configureAuthCheck($rootScope, $window, $location, AuthService, alertService) {
  $rootScope.isAuthenticated = false;
  $rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute){
    var user = JSON.parse($window.localStorage.getItem('currentUser'));
    var isAuthenticated;
    AuthService.isAuthenticated(function (resp) {
      isAuthenticated = resp;

      if (nextRoute && nextRoute.authenticate && !isAuthenticated){
        // User isn’t authenticated
        var oldPath = $location.path();
        $location.search('redirect', oldPath);
        $location.path('/');
        event.preventDefault();
        return;
      }

      if (nextRoute && nextRoute.authenticate && nextRoute.adminOrManagerOnly) {
        if (!user.is_admin && !user.isManager) {
          $location.path('/');
          event.preventDefault();
        }
      }

      if (nextRoute && nextRoute.authenticate && nextRoute.adminOnly) {
        if (!user.is_admin) {
          $location.path('/');
          event.preventDefault();
        }
      }
      $rootScope.isAuthenticated = isAuthenticated;
    });
  });
}

//
// Configure Languages
//
function configureLanguages(gettextCatalog, $window) {
  var lang = $window.navigator.language || $window.navigator.userLanguage;
  if (lang != 'fr' && lang != 'en') {
    gettextCatalog.setCurrentLanguage('en');
  }
  else {
    gettextCatalog.setCurrentLanguage(lang);
  }
}

//
// Accessibility features
//
// Focus h1 on route change, page titles
//
function configureAccessibility($rootScope, $document) {
  var hasPrevious = false;
  var siteTitle = ' | Humanitarian ID';

  $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
    hasPrevious = previous ? true : false;
    $rootScope.title = current.$$route.title + siteTitle;
  });

  $rootScope.$on('$viewContentLoaded', function () {
    if (hasPrevious) {
      var h1 = $document[0].querySelector('h1');
      if (h1) {
        h1.setAttribute('tabIndex', -1);
        h1.focus();
      }
    }
  });
}

//
// Configure GA
//
function configureAnalytics($rootScope, $window, $location, config) {
  if ($window.ga) {
    $window.ga('create', config.gaTrackingId, 'auto');
    $rootScope.$on('$routeChangeSuccess', function () {
      $window.ga('send', 'pageview', { page: $location.url() });
    });
  }
}

//
// Configure localForage
//
function configureLocalForage($localForage) {
  $localForage.createInstance({
    name: 'lists',
    storeName: 'lists'
  });
  $localForage.createInstance({
    name: 'cacheInfo',
    storeName: 'cacheInfo'
  });
}

//
// Configure editableOptions
//
function configureEditableOptions(editableOptions) {
  editableOptions.theme = 'bs3';
}
