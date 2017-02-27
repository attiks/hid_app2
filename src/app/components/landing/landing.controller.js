(function () {
  'use strict';

  angular
    .module('app.dashboard')
    .controller('LandingCtrl', LandingCtrl);

  LandingCtrl.$inject = ['$scope', 'notificationsService', 'SearchService'];

  function LandingCtrl($scope, notificationsService, SearchService) {
    $scope.notifications = notificationsService;

    $scope.recentUserSearches = [];
    $scope.recentListSearches = [];
    $scope.recentOperationSearches = [];

    if ($scope.currentUser.appMetadata && $scope.currentUser.appMetadata.hid && $scope.currentUser.appMetadata.hid.recentSearches) {

      if ($scope.currentUser.appMetadata.hid.recentSearches.user) {
        $scope.recentUserSearches = $scope.currentUser.appMetadata.hid.recentSearches.user
      }

      if ($scope.currentUser.appMetadata.hid.recentSearches.list) {
        $scope.recentListSearches = $scope.currentUser.appMetadata.hid.recentSearches.list
      }

      if ($scope.currentUser.appMetadata.hid.recentSearches.operation) {
        $scope.recentOperationSearches = $scope.currentUser.appMetadata.hid.recentSearches.operation;
        console.log($scope.recentOperationSearches, $scope.currentUser.appMetadata.hid.recentSearches.operation)
      }

    }

    $scope.saveSearch = function (searchResult, type) {
      SearchService.saveSearch($scope.currentUser, searchResult, type, function (user) {
        $scope.setCurrentUser(user);
      });
    };
  }
})();
