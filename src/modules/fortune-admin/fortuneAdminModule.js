
  //Fix grunt addtemplates task if you change this line
  angular.module('fortuneAdmin', [
        'sharedElements',
        'fortuneAdmin.Controllers',
        'fortuneAdmin.Filters',
        'fortuneAdmin.Directives',
        'fortuneAdmin.Services',
        'fortuneAdmin.Uml'
    ])
    .provider('fortuneAdmin', function(){
      var lookup = {};
      var otherwiseLookup = null;

      var ROUTER = {
        when: function(key, url, params) {
          lookup[key] = {
            url : url,
            params : params
          };
        },

        install: function($routeProvider) {
          for(var key in lookup) {
            var route = lookup[key];
            var url = route['url'];
            var params = route['params'];
            $routeProvider.when(url, params);
          }
          if(otherwiseLookup) {
            $routeProvider.otherwise(otherwiseLookup);
          }
        }
      };

      var config = window.CONFIG.fortuneAdmin;
      var provider = {
        _strictFilters: null,
        setStrictFiltering: function(map){
          this._strictFilters = map;
        },
        setApiHost: function(host){
            config.baseEndpoint = host;
        },
        setApiNamespace: function(namespace){
            config.apiNamespace = namespace;
        },
        html5Mode: function(use, prefix){
            config.routing.html5Mode = !!use;
            config.routing.urlPrefix = prefix || '';
        },
        enableNavbar: function(){
            config.enableNavbar = true;
        },
        mountTo: function($routeProvider, mountPoint){

          ROUTER.when('uml_diagram', mountPoint + '/uml', {
            templateUrl : config.prepareViewTemplateUrl('uml'),
            controller: 'UmlCtrl as UmlCtrl'
          });

          //Resolve necessary data here to simplify controller
          ROUTER.when('resource', mountPoint + '/:name', {
            //templateUrl: config.prepareViewTemplateUrl('fortune-admin', 'resources'),
            templateUrl: config.prepareViewTemplateUrl('resources'),
            controller: 'ResourcesCtrl as ResourcesCtrl',
            resolve: {
              resources: ['$q', '$http', function($q, $http){
                var d = $q.defer();
                $http.get(config.baseEndpoint + '/resources').success(function(data){
                  d.resolve(data.resources);
                });
                return d.promise;
              }],
              data: ['$q', '$http', '$route', function($q, $http, $route){
                var resourceName = $route.current.params.name;
                var d = $q.defer();
                $http.get(config.getApiNamespace() + '/' + resourceName, {
                  params: {
                    limit: 20
                  }
                })
                  .success(function (data) {
                    d.resolve(data);
                  });
                return d.promise;
              }]
            }
          });

          ROUTER.when('subresource', mountPoint + '/:parent/:id/:name/refby/:inverse', {
            templateUrl: config.prepareViewTemplateUrl('resources'),
            controller: 'ResourcesCtrl as ResourcesCtrl',
            resolve: {
              resources: ['$q', '$http', function($q, $http){
                var d = $q.defer();
                $http.get(config.baseEndpoint + '/resources').success(function(data){
                  d.resolve(data.resources);
                });
                return d.promise;
              }],
              data: ['$q', '$http', '$route', function($q, $http, $route){
                var d = $q.defer();
                var inverse = $route.current.params.inverse;
                var parentId = $route.current.params.id;
                var childResource = $route.current.params.name;
                var query = {};
                query['filter[' + inverse + ']'] = parentId;
                query.limit = 20;
                $http.get(config.getApiNamespace() + '/' + childResource, {params: query})
                  .success(function (data) {
                    d.resolve(data);
                  });
                return d.promise;
              }]
            }
          });

          ROUTER.install($routeProvider);
        },

        $get: function(){
          return {
            getRoute: function(key) {
              return lookup[key];
            },

            replaceUrlParams: function(url, params) {
              for(var k in params) {
                var v = params[k];
                url = url.replace(':'+k,v);
              }
              return url;
            },

            routeDefined: function(key) {
              return !! this.getRoute(key);
            },

            routePath: function(key, args) {
              var url = this.getRoute(key);
              url = url ? url.url : null;
              if(url && args) {
                url = this.replaceUrlParams(url, args);
              }
              return config.routing.html5Mode ? url : '/#' + config.routing.urlPrefix + url;
            },
            setApiHost: function(host){
                config.baseEndpoint = host;
            },
            setApiNamespace: function(namespace){
                config.apiNamespace = namespace;
            },
            setAuthToken: function(token){
                config.authToken = token;
            },
            getStrictFilters: function(){
              return angular.copy(provider._strictFilters);
            }
          }
        }
      };

      return provider;
    })
    .run(['$rootScope', '$location', 'fortuneAdmin', 'editableOptions',
      function($rootScope, $location, fortuneAdmin, editableOptions) {
      var prefix = '';

      $rootScope.fortuneAdminRoute = function(url, args) {
        return prefix + fortuneAdmin.routePath(url, args);
      };
      CONFIG.fortuneAdmin.route = function(url, args) {
        return prefix + fortuneAdmin.routePath(url, args);
      };
      $rootScope.navbarEnabled = !!CONFIG.fortuneAdmin.enableNavbar;

      // bootstrap3 theme. Can be also 'bs2', 'default'
      editableOptions.theme = 'bs3';
    }]);
