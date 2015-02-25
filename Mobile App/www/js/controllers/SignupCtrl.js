'use strict';
angular.module('happyseaApp').controller('SignupCtrl', function ($scope, $state) {
    // Our initial right buttons
    var rightButtons = [
        {
            content: '',
            type: 'button button-icon icon ion-navicon',
            tap: function(e) {
                // Go to the next slide on tap

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
});