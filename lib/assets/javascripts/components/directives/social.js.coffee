angular.module('Components').
  service('Sharing', ['$window', ($window) ->
    facebook: (title, url, message, image) ->
      @_share('http://www.facebook.com/sharer.php?s=100&' +
        "p[title]=#{encodeURIComponent title}&" +
        "p[summary]=#{encodeURIComponent message}&" +
        "p[url]=#{encodeURIComponent url}&" +
        "p[images][0]=#{encodeURIComponent image}"
      )
    twitter: (title, url, message, image) ->
      @_share("http://twitter.com/intent/tweet?text=#{encodeURIComponent message}&url=#{encodeURIComponent url}")
    vkontakte: (title, url, message, image) ->
      @_share('http://vkontakte.ru/share.php?noparse=true&' +
        "url=#{encodeURIComponent url}&" +
        "title=#{encodeURIComponent message}&" +
        "description=#{encodeURIComponent message}&" +
        "image=#{encodeURIComponent image}"
      )
    google_oauth2: (title, url, message, image) ->
      @_share("https://plus.google.com/share?url=#{encodeURIComponent url}")
    _share: (url) ->
      $window.open url, 'Sharing', 'width=740,height=440'
  ]).
  directive 'social', ['Sharing', (Sharing) ->
    restrict: 'E'
    replace: true
    scope:
      provider: '@'
      message: '@'
      url: '@'
      title: '@'
      image: '@'
      callback: '&'
      visible: '='
    template:
      '<div class="tooltip-content__auth-button tooltip-content__auth-button-{{provider}}" ng-show="visible">
        <div class="tooltip-content__auth-button-img"></div>
      </div>'
    link: (scope, element, attrs) ->
      element.bind 'click', ->
        sharing_window = Sharing[scope.provider](scope.title, scope.url, scope.message, scope.image)
        intervalId = setInterval (->
          if sharing_window.closed
            clearInterval intervalId
            scope.callback()
        ), 500
  ]
