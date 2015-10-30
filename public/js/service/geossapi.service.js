(function() {

  'use strict';

  angular
    .module('GeoportalCl')
    .factory('GeossAPI', GeossAPI);

  GeossAPI.$inject = [];

  function GeossAPI() {
    var GeossAPI = {
      api: GIAPI.DAB('http://api.eurogeoss-broker.eu/dab'),
      search: search,
      options: { pageSize: 10 }
    };

    return GeossAPI;

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
         
         "when": {
             "from": query.fromDate.format('yyyy-mm-dd'),
             "to": query.toDate.format('yyyy-mm-dd')
         },
         "source": "UUID-e101622c-6ae1-4b68-bfea-8acf067e31dd,idechile",
         "what": _.pluck(query.disasterType, 'key').join(' OR ')
      };
      this.api.discover(handler, constraints, this.options, null);
    }
  }

})();
