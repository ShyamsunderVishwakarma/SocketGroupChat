
var app = angular.module('myApp', []);

/* Services */
app.factory('socket', function ($rootScope) {
  
  var socket = io.connect();
  
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };

});


/* Controllers */
app.controller('AppCtrl', function ($scope,socket) {
  console.log("controller added",$scope)
        
  $scope.users = [];
  $scope.currentUser = '';
  $scope.liveusercount = 0;
  socket.on('connect', function () { });

  socket.on('updatechat', function (username, data,liveusercount) {
   	  $scope.liveusercount=liveusercount;
      var user = {};
      user.username = username;
      user.message = data;
      $scope.users.push(user);
   });

   $scope.createUser = function (data) {
      $scope.currentUser = data.username;
      socket.emit('adduser', data);
   }

   $scope.sendMessage = function(data){
     socket.emit('sendchat',data);
   }

});


