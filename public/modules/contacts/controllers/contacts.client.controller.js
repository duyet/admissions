'use strict';

// Contacts controller
angular.module('contacts').controller('ContactsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Contacts',
	function($scope, $stateParams, $location, Authentication, Contacts) {
		$scope.authentication = Authentication;
		$scope.thankYouMessage = false;

		// Create new Contact
		$scope.create = function() {
			if (!this.name) return $scope.error = "Bạn vui lòng điền tên để liên hệ.";
			if (!this.email) return $scope.error = "Bạn vui lòng điền email để liên hệ.";
			if (!this.message) return $scope.error = "Bạn vui lòng điền tin nhắn liên hệ";

			// Create new Contact object
			$scope.error = false;
			var contact = new Contacts ({
				name: this.name,
				email: this.email,
				school_code: this.school_code,
				student_id: this.student_id,
				message: this.message,
			});

			// Redirect after save
			contact.$save(function(response) {
				$scope.thankYouMessage = true;
				$scope.error = false;

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Contact
		$scope.remove = function(contact) {
			if ( contact ) { 
				contact.$remove();

				for (var i in $scope.contacts) {
					if ($scope.contacts [i] === contact) {
						$scope.contacts.splice(i, 1);
					}
				}
			} else {
				$scope.contact.$remove(function() {
				//	$location.path('contacts');
				});
			}
		};

		// Update existing Contact
		$scope.update = function() {
			var contact = $scope.contact;

			contact.$update(function() {
				$location.path('contacts/' + contact._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Seen contact 
		$scope.seen = function(contact) {
			contact.seen = !contact.seen;
		}

		// Find a list of Contacts
		$scope.find = function() {
			$scope.contacts = Contacts.query();
		};

		// Find existing Contact
		$scope.findOne = function() {
			$scope.contact = Contacts.get({ 
				contactId: $stateParams.contactId
			});
		};
	}
]);