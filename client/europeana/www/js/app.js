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

  .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/playlists');
})
  .factory('mqttService', ["$rootScope", 'settings', function($rootScope, settings) {
    var service = {
      mqtt:null,
      setup: function(clientId, scope){
        var that = this;
        //this.mqtt = new Paho.MQTT.Client(settings.mqtt.adres, settings.mqtt.port, clientId);
        this.mqtt = new Paho.MQTT.Client(settings.mqtt.adress, settings.mqtt.port, clientId);
        this.mqtt.onConnectionLost =  function(responseObject) {
          if (responseObject.errorCode !== 0) {
            console.log("onConnectionLost:" + responseObject.errorMessage);
            console.log("Reconnecting... [" + new Date() + "]");
            that.mqtt.connect({
              userName:'heritage',
              password: 'Nc7gmYGx',
              onSuccess: function() {
                that.mqtt.subscribe("/heritage/DATA");
                navigator.geolocation.getCurrentPosition(that.sendPosition);
              }
            });
          }
        };

        this.mqtt.onMessageArrived = function(message) {
          $rootScope.$apply(function() {
            that.playLists = JSON.parse(message.payloadString);
            scope.playlists = that.playLists;
          });
          console.log(message.payloadString);
        };

        this.mqtt.connect({
          userName:'heritage',
          password: 'Nc7gmYGx',

          onSuccess: function() {
            that.mqtt.subscribe("/heritage/DATA");
            navigator.geolocation.getCurrentPosition(that.sendPosition);
          }
        });

      },
      playLists:[],
      sendPosition: function(position){
        p = JSON.stringify([50.878092, 4.699323]);
        //p = JSON.stringify([position.coords.latitude, position.coords.longitude]);
        message = new Paho.MQTT.Message(p);
        message.destinationName = "/heritage/PING";
        service.mqtt.send(message);
      }
    };

    return service;
  }])

  .constant('settings', {
    'mqtt': {'adress': '88.198.207.11', 'port':10001}
  });
