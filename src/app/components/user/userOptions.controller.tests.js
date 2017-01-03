(function() {
  'use strict';

  describe('User options controller', function () {

    var scope, mockAlertService, mockList, mockListDataService, mockUibModal, mockUser, mockUserCheckInService, mockUserDataService, modalResult, unVerifiedUser, verifiedUser;

    var user = {
      _id: 'user-id',
      lists: [
      ]
    };
    var listToRemove = {
      _id: 'list-id-1',
      type: 'list'
    }
    var list1 = {
      _id: 'checkin-id-1',
      list: listToRemove
    };
    var list2 = {
      _id: 'checkin-id-2',
      list: {
        _id: 'list-id-2',
        type: 'list',
      }
    };
    var list3 = {
      _id: 'checkin-id-3',
      list: {
        _id: 'list-id-3',
        type: 'list',
      }
    };

    var ownedLists = [list1, list2];
    var ownedAndManagedLists = [list1, list2, list3];
    
    beforeEach(function() {
      mockUser = {};
      module('app.user', function ($provide) {
        $provide.value('User', mockUser);
      });

      modalResult = {
        then: function(callback) {}
      };

      mockUibModal = {
        open: function() {}
      }; 
 
      spyOn(mockUibModal, 'open').and.returnValue({result: modalResult });

      mockAlertService = {};
      module('app.common', function($provide) {
        $provide.value('alertService', mockAlertService);
      });

      mockList = {};
      mockListDataService = {};
      module('app.list', function($provide) {
        $provide.value('List', mockList);
        $provide.value('ListDataService', mockListDataService);
      });

      mockUserCheckInService = {};
      mockUserDataService = {};
      module('app.user', function($provide) {
        $provide.value('UserCheckInService', mockUserCheckInService);
        $provide.value('UserDataService', mockUserDataService);
      });

      inject(function($rootScope, $q, $injector) {
        scope = $rootScope.$new();

        mockAlertService.add = function () {}
        mockUserCheckInService.delete = function () {}
        mockList.query = function () {};
        mockListDataService.getManagedAndOwnedLists = function () {}
        
        verifiedUser = $injector.get('User');
        verifiedUser._id = 'user-id';
        verifiedUser.verified = true;
        verifiedUser.$update = function () {
          return;
        };
        verifiedUser.$delete = function () {
          return;
        };

        unVerifiedUser = $injector.get('User');
        unVerifiedUser._id = 'user-id-2';
        unVerifiedUser.verified = false;
        unVerifiedUser.$update = function () {
          return;
        };

        spyOn(verifiedUser, '$update').and.callFake(function () {});
        spyOn(verifiedUser, '$delete').and.callFake(function () {});
        spyOn(mockAlertService, 'add').and.callFake(function (argument1, argument2, arg3, callback) {
            callback([argument1, argument2, arg3]);
        });

        spyOn(mockUserCheckInService, 'delete').and.callThrough();
        spyOn(mockListDataService, 'getManagedAndOwnedLists').and.callFake(function({}, callback) {
          callback(ownedAndManagedLists);
        });
        spyOn(mockList, 'query').and.callFake(function({}, callback) {
          callback(ownedLists);
        });
      });

    });

    function controllerSetup () {
      beforeEach (function () {
        inject(function($controller) {

          $controller('UserOptionsCtrl', {
            $scope: scope,
            $uibModal: mockUibModal
          });

          scope.$digest();
        });
      });
    }

    describe('Remove user from the list', function () {
      controllerSetup();

      beforeEach(function () {
        user.lists.push(list1);
        user.lists.push(list2);
        scope.removeFromList(user, listToRemove);
      });

      it('should ask the user to confirm they want the removal', function () {
        expect(mockAlertService.add).toHaveBeenCalledWith('warning', 'Are you sure?', true, jasmine.any(Function));
      });

      it('should call check the user out of the list', function () {
        var deleteParams = {userId: 'user-id', listType: 'lists', checkInId: 'checkin-id-1'};
        expect(mockUserCheckInService.delete).toHaveBeenCalledWith(deleteParams, {}, jasmine.any(Function));
      });

    });

    describe('Verifying / unverifying users', function () {
      controllerSetup();

      it('should verify the user', function () { 
        scope.verifyUser(unVerifiedUser);

        expect(unVerifiedUser.verified).toBe(true);
        expect(mockUser.$update).toHaveBeenCalled();
      });

      it('should un-verify the user', function () { 
        scope.verifyUser(verifiedUser);

        expect(verifiedUser.verified).toBe(true);
        expect(mockUser.$update).toHaveBeenCalled();
      });
    });
    

    describe('Deleting a user', function () {
      controllerSetup();

      beforeEach(function () {
        scope.deleteUser(verifiedUser);
      });

      it('should ask the user to confirm they want to delete', function () {
        expect(mockAlertService.add).toHaveBeenCalledWith('danger', 'Are you sure you want to do this? This user will not be able to access Humanitarian ID anymore.', true, jasmine.any(Function));
      });

      it('should delete the user', function () {
        expect(mockUser.$delete).toHaveBeenCalled();
      });
    });
    
    describe('Checking user into lists', function () {
      controllerSetup();

      describe('As an admin', function () {
        beforeEach(function () {
          scope.openCheckInModal({}, true)
        });

        it('should open the modal', function () {
          expect(mockUibModal.open).toHaveBeenCalled();
        });

        describe('Getting available lists', function () {
          beforeEach(function () {
            scope.currentUser = {
              _id: 124
            };
            scope.getAvailableLists(true)
          });

          it('should get lists you own and manage', function () {
            expect(mockListDataService.getManagedAndOwnedLists).toHaveBeenCalledWith({_id: 124}, jasmine.any(Function));
          });

          it('should combine the managed and owned lists and remove any duplicates', function () {
            expect(scope.availableLists).toEqual(ownedAndManagedLists);
          });

        });
        
      });

      describe('As a normal user', function () {
        
        describe('Getting available lists', function () {
          beforeEach(function () {
            scope.currentUser = {
              _id: 124
            };
            scope.getAvailableLists(false)
          });

          it('should get lists you own', function () {
            expect(mockList.query).toHaveBeenCalledWith({'owner': 124}, jasmine.any(Function));
          });

          it('should not get lists you manage', function () {
            expect(mockListDataService.getManagedAndOwnedLists).not.toHaveBeenCalled();
          });

          it('should add the owned lists to scope', function () {
            expect(scope.availableLists).toEqual(ownedLists);
          });

        });
        
      });

    });

  });
})();

