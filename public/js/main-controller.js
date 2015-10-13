(function() {

  'use strict';

  angular
    .module('GeoportalCl')
    .controller('MainController', MainController);

  MainController.$inject = ['$scope', 'uiGmapGoogleMapApi', 'GeossAPI'];

  function MainController($scope, uiGmapGoogleMapApi, GeossAPI) {
    $scope.change_language = function(lang, obj) {
      $translate.use(lang);
    };
    uiGmapGoogleMapApi.then(function (){
      $scope.areas = [
        { label: 'Chile', coords: {},
          mapBox: {
            bounds: new google.maps.LatLngBounds(
              new google.maps.LatLng(-55.902, -109.446),
              new google.maps.LatLng(-17.505,-66.421)),
            color: '#FFF'
          }
        },
        { label: 'Zona norte', coords: {}, group: 'Zonas',
          mapBox: {
            bounds: new google.maps.LatLngBounds(
              new google.maps.LatLng(-20.902, -109.446),
              new google.maps.LatLng(-17.505,-66.421)),
            color: '#F00'
          }
        },
        { label: 'Zona central', coords: {}, group: 'Zonas',
          mapBox: {
            bounds: new google.maps.LatLngBounds(
              new google.maps.LatLng(-30.902, -109.446),
              new google.maps.LatLng(-20.505,-66.421)),
            color: '#FF0'
          }
        },
        { label: 'Zona sur', coords: {}, group: 'Zonas',
          mapBox: {
            bounds: new google.maps.LatLngBounds(
              new google.maps.LatLng(-45.902, -109.446),
              new google.maps.LatLng(-30.505,-66.421)),
            color: '#0F0'
          }
        },
        { label: 'Zona austral', coords: {}, group: 'Zonas',
          mapBox: {
            bounds: new google.maps.LatLngBounds(
              new google.maps.LatLng(-55.902, -109.446),
              new google.maps.LatLng(-45.505,-66.421)),
            color: '#00F'
          }
        },
        { label: 'Villarica', coords: {}, group: 'Lugar',
          mapBox: {
            bounds: new google.maps.LatLngBounds(
              new google.maps.LatLng(-46.902, -109.446),
              new google.maps.LatLng(-45.505,-66.421)),
            color: '#0FF'
          }
        },
        { label: 'Illapel', coords: {}, group: 'Lugar',
          mapBox: {
            bounds: new google.maps.LatLngBounds(
              new google.maps.LatLng(-35.902, -109.446),
              new google.maps.LatLng(-34.505,-66.421)),
            color: '#AAF'
          }
        },
        { label: 'Calbuco', coords: {}, group: 'Lugar',
          mapBox: {
            bounds: new google.maps.LatLngBounds(
              new google.maps.LatLng(-24.902, -109.446),
              new google.maps.LatLng(-23.505,-66.421)),
            color: '#250'
          }
        }
      ];
      $scope.queryFilters = {
        area: $scope.areas[0],
        disasterType: $scope.disasterTypes[0],
        fromDate: new Date(new Date().getTime() - 24*1000*3600),
        toDate: new Date()
      };
    });
    $scope.disasterTypes = [
      { label: 'Earthquake', key: 'earthquake' },
      { label: 'Fire', key: 'fire' },
      { label: 'Flood', key: 'flood' }
    ];
    $scope.map = { center: { latitude: -38.450680, longitude: -70.570724 }, zoom: 3 };
    
    $scope.results = [];
    // API
    var handler = function(result) {
      $scope.results = [];
      if (result[0]) {
        $scope.paginator = result[0];
        // retrieves the result set
        var resultSet = $scope.paginator.resultSet();
        $scope.totalResults = resultSet.size;
      }
      // prints the result set
      // retrieves the current paginator page (the first of the result set)    
      var page = $scope.paginator.page();
      // $scope.resultsPages.push(paginator.page());
      // var nextPage = paginator.next();
      // while(nextPage) {
      //   $scope.resultsPages.push(nextPage);
      //   nextPage = paginator.next();
      // }
      // iterates on page nodes
      while(page.hasNext()){
          // retrieves the next node of the current page
          var node = page.next();
          // retrieves the current node report 
          var report = node.report();
          $scope.results.push(report);
      }
      $scope.loading = false;
      $scope.force_show_pagination = false;
      $scope.$apply();
    };
    $scope.search = function() {
      $scope.loading = true;
      $scope.totalResults = 0;
      $scope.bigCurrentPage = 1;
      GeossAPI.search($scope.queryFilters, handler);
    };
    $scope.pageChange = function (bigCurrentPage) {
      if (bigCurrentPage && $scope.paginator) {
        $scope.loading = true;
        $scope.force_show_pagination = true;
        $scope.paginator.skip(handler, bigCurrentPage, true);
      }
    };
  }

})();
