'use strict';
angular.module('happyseaApp').controller('LoginCtrl', function ($scope, $state) {
    // Our initial right buttons
    var rightButtons = [
        {
            content: '',
            type: 'button button-icon icon ion-navicon',
            tap: function(e) {
                // Go to the next slide on tap
                $state.go('home');
            }
        }
    ];

    // Our initial left buttons
    var leftButtons = [
        {
            content: '',
            type: 'button button-icon icon ion-ios7-locked',
            tap: function(e) {
                // Start the app on tap

            }
        }
    ];

    // Bind the left and right buttons to the scope
    $scope.leftButtons = leftButtons;
    $scope.rightButtons = rightButtons;

     $scope.tryLogin = function(){
        console.log('test login');
        $state.go('menu.home');
    }

})
    .controller('MainCtrl', ['$scope','$state', function($scope, $state) {
        //alert($state.current.name);
        //$scope.leftButton = "ion-home";
        if($state.current.name == 'menu.home'){
            $scope.leftButton = "ion-home";
        }

        // do something
    }]);