// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers','ion-autocomplete'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.factory('PlaylistsService', function() {
  var playlists=[];    
  var sendPosition = function(position){
    p = JSON.stringify([position.coords.latitude, position.coords.longitude]);
    message = new Paho.MQTT.Message(p);
    message.destinationName = "/heritage/PING";
    mqttClient.send(message);
  };

  var mqttClient = new Paho.MQTT.Client("88.198.207.11", 10001, "clientId-123457");

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
    
      console.log(message);  
      playlists = JSON.parse(message.payloadString);
      $test = JSON.parse(message.payloadString);
    
  };

  mqttClient.connect({
    userName:'heritage',
    password: 'Nc7gmYGx',

    onSuccess: function() {
      mqttClient.subscribe("/heritage/DATA");
      navigator.geolocation.getCurrentPosition(sendPosition);
    }
  });

  return {
    playlists: playlists,
    getPlaylists: function(index) {
      return playlists[index]
    }
  }
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })

  .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html'
        }
      }
    })
    .state('app.playlists', {
      url: '/playlists',
      views: {
        'menuContent': {
          templateUrl: 'templates/playlists.html',
          controller: 'PlaylistsCtrl'
        }
      }
    })  

    .state('app.playlists.detail', {
        url: '/playlists/:playlist',
        views: {
            'menuContent': {
              templateUrl: 'templates/playlist.html',
              controller: 'PlaylistCtrl'
            }
        },
        resolve: {
            playlist: function($stateParams, PlaylistsService) {
            return PlaylistsService.getPlaylist($stateParams.playlist)
            }
        }
    });
/*
  .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  });*/
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/playlists');
});
