(function() {

  'use strict';

  angular
    .module('GeoportalCl')
    .directive('burgerMenu', function() {
      return {
        restrict: 'E',
        scope: false,
        controller: BurgerMenu,
        templateUrl: '/templates/burger-menu.html'
      };
    });
  BurgerMenu.$inject = ['$scope'];

  function BurgerMenu($scope) {
    $scope.menu_state = { open: false };
  }
})();
