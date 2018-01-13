'use strict';

/**
 * @ngdoc overview
 * @name codelabApp
 * @description
 * # codelabApp
 *
 * Main module of the application.
 */
angular
  .module('codelabApp', ['ui.router', 'wl.ng.component'])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .state('mytodo', {
        url: '/mytodo',
        templateUrl: 'views/mytodo.html',
        controller: 'MytodoCtrl',
        controllerAs: 'mytodo'
      })
      .state('component', {
        url: '/component',
        templateUrl: 'views/component.html',
        controller: 'ComponentCtrl',
        controllerAs: 'component'
      })
      .state('about', {
        url: '/about',
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .state('contact', {
        url: '/contact',
        templateUrl: 'views/contact.html',
        controller: 'ContactCtrl',
        controllerAs: 'contact'
      });
    $urlRouterProvider.otherwise('/home');
  });
