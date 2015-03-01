'use strict';

angular.module('happysevaApp.services',[])
    .service('auth', function (API_URL, $http, authToken, $state, $window, $q) {
        function authSuccessful(res) {
            authToken.setToken(res.token);
            $state.go('main');
        }
        this.login = function (email, password) {
            return $http.post(API_URL + 'login', {
                email: email,
                password: password
            }).success(authSuccessful);
        };
        this.register = function (email, password) {
            return $http.post(API_URL + 'register', {
                email: email,
                password: password
            }).success(authSuccessful);
        };

    })
    .service('mainService', function (API_URL, $state){
        var ServiceList= '[{"Category": "Home","Services": ["Cleaning","Nanny","Plumber","Gardenning","Electrician","Carpenter","Mason","Repairs","Cooks","Maid","Furnishing","Tailoring","Driver","Laundry & Ironing","Painting","Pest Control"]},{"Category": "Office","Services": ["Office Supplies","Office Maintenance","Office Accounting","Office Secretarial","Courier - Last Mile","Office Furnishing"]},{"Category": "Security","Services": ["Child Security (school group)","Women Security (office group)","Home Security","Guard Services","Office Security","Firedorm","Online Security (specailized)"]},{"Category": "Citizen","Services": ["Bangalore One","Companion Services","E-Governance","Saloon Services","e-facilitation"]},{"Category": "Medical","Services": ["Ambulance","Diagnostics","Clinical Services","Pharma/Chemists","Ayurveda"]},{"Category": "Recreation","Services": ["Sports","Library","Gym","Yoga","Arts","Events","Kids"]}]';
        function ListSuccessful(res) {


        }
        this.category ='';
        this.currentServiceName ='';
        this.setCategory = function(cat){
            this.category =cat;

        }
        this.setServiceName = function(name){
            this.currentServiceName =name;
            console.log(this.currentServiceName);
        }
        this.subServices = function (category){
            /*return $http.post(API_URL+'subservices',{
                category:category
            }).success(ListSuccessful);*/
            var DataList =JSON.parse(ServiceList)
           // console.log(DataList);
           // console.log(category);
            for(var i=0;i<DataList.length;i++){
                if(DataList[i].Category == category){
                 //  console.log(DataList[i].Services);
                   return DataList[i].Services;
                }
            }

        }
    });
