angular.module('happyseaApp').controller('HomeCtrl', function ($scope, $state, $ionicSideMenuDelegate) {
    // Our initial right buttons
    $scope.leftButton = "ion-home";//'<button class="button button-icon icon ion-home"></button>';
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
            type: 'button button-icon icon ion-home',
            tap: function(e) {
                // Start the app on tap

            }
        }
    ];

    // Bind the left and right buttons to the scope
    $scope.leftButtons = leftButtons;
    $scope.rightButtons = rightButtons;


});