'use strict';
var app_access = angular.module('app.access', ['ui.bootstrap'])
    .config(
        ['$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
            function ($controllerProvider, $compileProvider, $filterProvider, $provide) {
                // lazy controller, directive and service
                app_access.controller = $controllerProvider.register;
                app_access.directive = $compileProvider.directive;
                app_access.filter = $filterProvider.register;
                app_access.factory = $provide.factory;
                app_access.service = $provide.service;
                app_access.constant = $provide.constant;
                app_access.value = $provide.value;
            }
        ]
    );