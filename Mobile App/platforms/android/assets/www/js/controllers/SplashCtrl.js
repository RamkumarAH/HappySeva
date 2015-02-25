'use strict';
angular.module('happyseaApp').controller('SplashCtrl', function ($scope, $state) {
    setTimeout(function() {
       $state.go('intro');
    }, 5000)
});
