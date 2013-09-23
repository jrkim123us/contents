'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
// define(['app'],)
angular.module('login.services', []).
  value('version', '0.1');
