/*(function(){
  if (!window.CONFIG) window.CONFIG = {};

   window.CONFIG.docs =  {
    templateDirectory: '/views/',
    baseEndpoint: '',
    apiNamespace: '/api/v1',
    getApiNamespace: function(){
      return this.baseEndpoint + this.apiNamespace;
    },
    mountPoint: '',
    appVersion: 1,
    viewUrlPrefix: '/views/',
    templateFileSuffix: '.html',
    prepareViewTemplateUrl: function(url){
      return this.viewUrlPrefix + url + this.templateFileSuffix;
    },
    routing: {
      html5Mode : true,
      prefix: ''
    },
    authToken: ''
  };
})();*/

angular.module('docs.Config', [])
    .constant('docsConfigConstant', {
        templateDirectory: '/views/',
        baseEndpoint: '',
        apiNamespace: '/api/v1',
        getApiNamespace: function(){
            return this.baseEndpoint + this.apiNamespace;
        },
        mountPoint: '',
        appVersion: 1,
        viewUrlPrefix: '/dist/views/',
        templateFileSuffix: '.html',
        prepareViewTemplateUrl: function(url){
            return this.viewUrlPrefix + url + this.templateFileSuffix;
        },
        routing: {
            html5Mode : true,
            prefix: ''
        },
        authToken: ''
    });
