angular.module('happyseaApp').controller('IntroCtrl', function($scope, $state) {
   $scope.leftButton = "Skip";
    $scope.leftButtons = function (){
        $state.go('login');
    }

})