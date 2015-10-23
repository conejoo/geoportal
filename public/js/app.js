var app = angular.module('GeoportalCl', [
  'ngCookies',
  'ui.bootstrap',
  'ui.bootstrap.pagination',
  'ui.bootstrap.datepicker',
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
    v: '3.21', //defaults to latest 3.X anyhow
    libraries: 'weather,geometry,visualization'
  });
})