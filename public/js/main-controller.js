(function() {

  'use strict';

  angular
    .module('GeoportalCl')
    .controller('MainController', MainController);

  function MainController($scope, $http, $translate, $cookies, uiGmapGoogleMapApi, uiGmapIsReady, GeossAPI) {
    $scope.pristine = true;
    $scope.change_language = function(lang) {
      $translate.use(lang);
      $cookies.put('lang', lang);
      $scope.currentLang = lang;
    };
    $scope.resultCounter = 0;
    if ($cookies.get('lang'))
      $scope.change_language($cookies.get('lang'));

    $scope.regionsPromise = $http.get('db/areas.json').success(function (data) {
      $scope.areas = data.areas;
    });
    uiGmapIsReady.promise(1).then(function(instances) {
      instances.forEach(function(inst) {
        $scope.gmapInstance = inst.map;
        window.mmap = inst.map;
        $scope.mapHeight = $(inst.map.getDiv()).height() + 20;
      });
    });
    uiGmapGoogleMapApi.then(function () {
      $scope.regionsPromise.then(function () {
        _.forEach($scope.areas, function (area) {
          area.mapBox.latLngBounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(-area.mapBox.bounds.s, -area.mapBox.bounds.w),
            new google.maps.LatLng(-area.mapBox.bounds.n, -area.mapBox.bounds.e)
          );
        });
        $scope.queryFilters = {
          area: $scope.areas[0],
          disasterType: [$scope.disasterTypes[0]],
          fromDate: new Date(new Date().getTime() - 24*1000*3600),
          toDate: new Date()
        };
      });
    });
    $scope.disasterTypes = [
      { label: 'Earthquake', key: 'earthquake OR quakes OR seism OR tremor' },
      { label: 'Fire', key: 'wildfire OR fire' },
      { label: 'Flood', key: 'flood OR flooding or tsunamis' },
      { label: 'Volcanoe', key: 'volcanoe OR volcanic OR eruption' }
    ];
    $scope.map = {
      center: { latitude: -38.450680, longitude: -70.570724 },
      zoom: 3,
      options: {
        scaleControl: true,
        mapTypeId: "hybrid"
      }
    };
    
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
          report.uniqueId = $scope.resultCounter++;
          if (report.where && report.where[0])
            report.latlng = {
              longitude: (report.where[0].east + report.where[0].east)/2.0,
              latitude: (report.where[0].north + report.where[0].south)/2.0
            }
          if (report.when && report.when[0])
            report.whenText = new Date(report.when[0].start).toString()// .format("ddd mmm dd yyyy, hh:MM");
          var match = report.title.match(/magnitude ([\d\.]*) \(magnitude type ([A-Z]*)\)/);
          if (match && match.length == 3) {
            report.magnitude = match[1] + " " + match[2];
          }
          report.markerOptions = {
            title: report.title,
            opacity: 1.0,
            icon: '/images/red-circle.png'
          };
          console.log(report);
      }
      $scope.loading = false;
      $scope.force_show_pagination = false;
      $scope.$apply();
    };
    $scope.search = function() {
      $scope.pristine = false;
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
    $scope.areaChanged = function () {
      //$scope.gmapInstance
      if ($scope.gmapInstance) {
        $scope.gmapInstance.setZoom($scope.queryFilters.area.mapZoom || 3);
        $scope.gmapInstance.panTo($scope.queryFilters.area.mapBox.latLngBounds.getCenter());
      }
      console.log($scope.queryFilters.area);
    };
    $scope.selectResult = function (result) {
      _.forEach($scope.results, function (result_) {
        result_.selected = false;
        result_.markerOptions.opacity = 0.7;
        result_.markerOptions.icon = 'images/red-circle.png';
        //result_.markerOptions.animation = null;
      });
      result.selected = true;
      result.markerOptions.opacity = 1.0;
      //result.markerOptions.animation = google.maps.Animation.BOUNCE;
      result.markerOptions.icon = 'images/blue-circle.png';
    };
    $scope.datepickerStatus = { fromOpen: false, toOpen: false };
    $scope.dateOptions = {
      formatYear: 'yyyy',
      startingDay: 1,
      showButtonBar: false
    };
    $scope.mapTopDistance = 0;
    $scope.scrolling = function (event) {
      if (event.y > 150) {
        $scope.mapContainerFollow = 'follow';
        $scope.mapTopDistance = Math.max(120 - (event.scrollHeight - event.y), 0);
      }
      else {
        $scope.mapContainerFollow = '';
        $scope.mapTopDistance = 0;
      }
    }
  }

})();
