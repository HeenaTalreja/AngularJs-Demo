var testApp = angular.module('testApp', ['ngRoute']);

testApp.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl : 'view/home.html',
            controller  : 'HomeController'
        })
        .when('/postDetails', {
            templateUrl : 'view/comments.html',
            controller  : 'CommentsController'
        })
        .when('/userDetails', {
            templateUrl : 'view/user.html',
            controller  : 'UserDetailsController'
        });
});
  var getUsers = function(orgId){
      return $http.get($rootScope.baseUrl + '/rest/admin/users/byorg/' + orgId, config).then(function(res){
        return res;
      },function(error){
        console.log(error);
        return error;
      });
    };
testApp.service('RestService',function($http){
	  this.getPosts = function () {
        return $http({
        method : "GET",
        url : "https://jsonplaceholder.typicode.com/posts"
		}).then(function mySuccess(response) {
			return response.data;
		}, function myError(response) {
			return response.statusText;
		});
    };
	this.getUserDetails = function () {
        return $http({
        method : "GET",
        url : "https://jsonplaceholder.typicode.com/users"
		}).then(function mySuccess(response) {
			return response.data;
		}, function myError(response) {
			return response.statusText;
		});
    };
	this.getPostComments =function(postId){
		return $http({
		method : "GET",
		url : "https://jsonplaceholder.typicode.com/posts/"+postId+"/comments"
		}).then(function mySuccess(response) {
			return response.data;
		}, function myError(response) {
			return response.statusText;
		});	
	};	
	
});
	
testApp.controller('HomeController' , function ($scope,RestService,$location,$rootScope) {
   $scope.home = "This is the homepage";
   $scope.posts=[];
   RestService.getPosts().then(function(res){
		$scope.posts= res;
   } )  
   
	  RestService.getUserDetails().then(function(res){
		$scope.users= res;
		for(var i in $scope.posts){
		for(var j in $scope.users){
			if($scope.posts[i].userId == $scope.users[j].id){
				
				$scope.posts[i].userName = '@';
				$scope.posts[i].userName += $scope.users[j].username + ' ' + $scope.users[j].name;
				break;
			}	
		}
		}
   } )  
   	
   $scope.getComments = function(post){
	   $rootScope.postOfComment = post;
	   $location.path('/postDetails');
   } 
	$scope.getUserDetails =function(userId){
		$rootScope.userIdforSelectedUser= userId;
		$location.path('/userDetails');
	}	
});
testApp.controller('CommentsController' , function ($scope,RestService,$rootScope) {
   
   $scope.comments=[];
   postId = $rootScope.postOfComment.id;
   RestService.getPostComments(postId).then(function(res){
		$scope.comments= res;
   } )  
   
	
});
testApp.controller('UserDetailsController' , function ($scope,RestService,$rootScope) {
   
   $scope.userDetails=[];
   RestService.getUserDetails().then(function(res){
		$scope.userDetails= res;
		for(var j in $scope.userDetails){
			if($scope.userDetails[j].id == $rootScope.userIdforSelectedUser){
				$scope.users = $scope.userDetails[j];
				break;
			}	
		}
   } )  
   
	
});


testApp.filter('cut', function () {
        return function (value, wordwise, max, tail) {
            if (!value) return '';

            max = parseInt(max, 10);
            if (!max) return value;
            if (value.length <= max) return value;

            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace !== -1) {
                  //Also remove . and , so its gives a cleaner result.
                  if (value.charAt(lastspace-1) === '.' || value.charAt(lastspace-1) === ',') {
                    lastspace = lastspace - 1;
                  }
                  value = value.substr(0, lastspace);
                }
            }

            return value + (tail || ' …');
        };
    });