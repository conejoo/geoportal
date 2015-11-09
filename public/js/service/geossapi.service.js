(function() {

  'use strict';

  angular
    .module('GeoportalCl')
    .factory('GeossAPI', GeossAPI);

  GeossAPI.$inject = [];

  function GeossAPI() {
    var GeossAPI = {
      api: GIAPI.DAB('http://production.geodab.eu/gi-cat-StP/'),
      search: search,
      sources: sources,
      options: { pageSize: 10 }
    };

    return GeossAPI;

    function sources() {
      this.api.sources(function (result) {
        debugger
      });
    }

    function search(query, handler) {
      console.log(query);
      var ne = query.area.mapBox.latLngBounds.getNorthEast();
      var sw = query.area.mapBox.latLngBounds.getSouthWest();
      var constraints = {
        "where": {
            "south": sw.lat(),
            "west": sw.lng(),
            "north": ne.lat(),
            "east": ne.lng()
         },
         "source": "idechile",
         "what": _.pluck(query.disasterType, 'key').join(' OR ')
      };
      if (query.fromDate || query.toDate) {
        constraints.when = {};
        if (query.fromDate)
          constraints.when.from = query.fromDate.format('yyyy-mm-dd');
        if (query.toDate)
          constraints.when.to = query.toDate.format('yyyy-mm-dd');
      }
      if (query.magtMl && constraints.what.indexOf('earthquake') != -1)
        constraints.kvp = [{"key" : "magt", "value" : "ml"}];
      this.api.discover(handler, constraints, this.options, null);
    }
  }

})();
