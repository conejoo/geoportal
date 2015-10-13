var app = angular.module('GeoportalCl', [
  'ui.bootstrap',
  'ui.bootstrap.pagination',
  'ngSanitize',
  'pascalprecht.translate',
  'uiGmapgoogle-maps'
]);

app.config(['$translateProvider', function ($translateProvider) {
  $translateProvider.useStaticFilesLoader({
    prefix: '/translate/',
    suffix: '.json'
  });

  $translateProvider.preferredLanguage('es');
  $translateProvider.useSanitizeValueStrategy('escaped');
}]);

app.config(function (uiGmapGoogleMapApiProvider) {
  uiGmapGoogleMapApiProvider.configure({
    //    key: 'your api key',
    v: '3.20', //defaults to latest 3.X anyhow
    libraries: 'weather,geometry,visualization'
  });
})