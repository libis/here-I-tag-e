angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [];
  $scope.clientId = "clientId-123";
  var sendPosition = function(position){
    p = JSON.stringify([position.coords.latitude, position.coords.longitude]);
    message = new Paho.MQTT.Message(p);
    message.destinationName = "/heritage/PING";
    mqttClient.send(message);
  };


  var mqttClient = new Paho.MQTT.Client("88.198.207.11", 10001, $scope.clientId);

  mqttClient.onConnectionLost =  function(responseObject) {
    if (responseObject.errorCode !== 0) {
      console.log("onConnectionLost:" + responseObject.errorMessage);
      console.log("Reconnecting... [" + new Date() + "]");
      mqttClient.connect({
        userName:'heritage',
        password: 'Nc7gmYGx',
        onSuccess: function() {
          mqttClient.subscribe("/heritage/DATA");
          navigator.geolocation.getCurrentPosition(sendPosition);
        }
      });
    }
  };

  mqttClient.onMessageArrived = function(message) {
    $scope.$apply(function() {
      $scope.playlists = JSON.parse(message.payloadString);
    });
  };

  mqttClient.connect({
    userName:'heritage',
    password: 'Nc7gmYGx',

    onSuccess: function() {
      mqttClient.subscribe("/heritage/DATA");
      navigator.geolocation.getCurrentPosition(sendPosition);
    }
  });



})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})

.controller('MapController', function($scope, $ionicLoading) {

    google.maps.event.addDomListener(window, 'load', function() {
        var myLatlng = new google.maps.LatLng(37.3000, -120.4833);

        var mapOptions = {
            center: myLatlng,
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        var map = new google.maps.Map(document.getElementById("map"), mapOptions);

        navigator.geolocation.getCurrentPosition(function(pos) {
            map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
            var myLocation = new google.maps.Marker({
                position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
                map: map,
                title: "My Location"
            });
        });

        $scope.map = map;
    });

});
