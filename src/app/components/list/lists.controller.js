(function () {
  'use strict';

  angular
    .module('app.list')
    .controller('ListsCtrl', ListsCtrl);

  ListsCtrl.$inject = ['$rootScope', '$scope', '$routeParams', '$location', '$q', '$localForage', 'gettextCatalog', 'hrinfoService', 'alertService', 'ListDataService', 'SearchService'];

  function ListsCtrl($rootScope, $scope, $routeParams, $location, $q, $localForage, gettextCatalog, hrinfoService, alertService, ListDataService, SearchService) {
    $scope.request = {};
    $scope.totalItems = 0;
    $scope.itemsPerPage = 50;
    $scope.currentPage = 1;
    $scope.request.limit = $scope.itemsPerPage;
    $scope.request.offset = 0;
    $scope.request.sort = 'name';
    $scope.listsLoaded = false;
    $scope.selectedFilters = {};
    $scope.listFilters = {};
    if ($routeParams.q) {
      $scope.listFilters.name = $routeParams.q;
      $scope.request.name = $routeParams.q;
    }
    if ($routeParams.type) {
        $scope.selectedFilters.type = $routeParams.type;
        $scope.listFilters.type = $routeParams.type;
        $scope.request.type= $routeParams.type;
      }
    
    var currentSortOrder = $scope.request.name;
    ListDataService.setRequest($scope.request);

    $scope.listTypes = ListDataService.listTypes;

    $scope.sortBy = [
      {
        label: 'name',
        name: 'Name'
      },
      {
        label: 'type',
        name: 'Type'
      }
    ];

    function formatTypes (lists) {
      var listType;

      angular.forEach(lists, function (list) {
        ListDataService.setListTypeLabel(list);
      });
    }

    var queryCallback = function (lists, headers) {
      $scope.totalItems = headers()["x-total-count"];
      formatTypes(lists);
      $scope.listsLoaded = true;
    };

    ListDataService.subscribe($scope, function () {
      $scope.currentPage = 1;
      $scope.pageChanged();
    });

    ListDataService.queryLists($scope.request, function (lists, number) {
      $scope.lists = lists;
      $scope.totalItems = number;
      formatTypes($scope.lists);
      $scope.listsLoaded = true;
    });

    $rootScope.$on('sidebar-closed', function () {
      $scope.selectedFilters = angular.copy($scope.listFilters);
      $scope.request.sort = currentSortOrder;
    });

    $scope.setLimit = function (limit) {
      $scope.itemsPerPage = limit;
      $scope.request.limit = limit;
      $scope.pageChanged();
    };

    $scope.resetFilters = function () {
      ListDataService.setFilters({});
      $scope.listFilters = {};
      $scope.selectedFilters = {};
      $scope.currentPage = 1;
      $location.search('type', null);
      $location.search('q', null);
      $scope.pageChanged();
    };

    $scope.pageChanged = function () {
      currentSortOrder = $scope.request.sort;
      $scope.request.offset = ($scope.currentPage - 1) * $scope.itemsPerPage;
      ListDataService.setRequest($scope.request);
      ListDataService.filter(queryCallback);
      $scope.lists = ListDataService.getLists();
    };

    $scope.filter = function() {
      $scope.listsLoaded = false;
      $scope.listFilters = angular.copy($scope.selectedFilters);
      if ($routeParams.q) {
        $scope.listFilters.name = $routeParams.q;
      }
      ListDataService.setFilters($scope.listFilters);
      $scope.currentPage = 1;
      $scope.pageChanged();
    };

    $scope.saveSearch = function (searchList) {
      if (!$scope.searchTerm) {
        return;
      }
      SearchService.saveSearch($scope.currentUser, searchList, 'list', function (user) {
        $scope.setCurrentUser(user);
      });
    };
  }
})();
