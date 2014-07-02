angular.module('Components').service('Cookies', function(){
  var repl_re = _.memoize(function(key){
    return new RegExp("(?:^|.*;\\s*)" +
      escape(key).replace(/[\-\.\+\*]/g, "\\$&") +
      "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*")
  });
  var has_re = _.memoize(function(key){
    return new RegExp("(?:^|;\\s*)" +
      escape(key).replace(/[\-\.\+\*]/g, "\\$&") +
      "\\s*\\=");
  });
  var forbidden_re = /^(?:expires|max\-age|path|domain|secure)$/;

  return {
    get: function (key) {
      if(!key || !this.has(key)){
        return null;
      }
      return unescape(document.cookie.replace(repl_re(key), "$1"));
    },
    set: function (key, value, end, path, domain, secure) {
      if(!key || forbidden_re.test(key)){
        return;
      }
      var expires = "";
      if(end){
        switch (typeof end) {
          case "number":
            expires = "; max-age=" + end;
            break;
          case "string":
            if(end == 'unlimited'){
              expires = "; expires=" + 'Fri, 10 Jul 2038 13:05:42 UTC';
            } else {
              expires = "; expires=" + end;
            }
            break;
          case "object":
            if(end.hasOwnProperty("toGMTString")){
              expires = "; expires=" + end.toGMTString();
            };
            break;
        }
      }
      document.cookie = escape(key) + "=" + escape(value) + expires +
        (domain ? "; domain=" + domain : "") +
        (path ? "; path=" + path : "") +
        (secure ? "; secure" : "");
    },
    remove: function (key) {
      if (!key || !this.has(key)){
        return;
      }
      var expire_date = new Date();
      expire_date.setDate(expire_date.getDate() - 1);
      document.cookie = escape(key) + "=; expires=" +
      expire_date.toGMTString() + "; path=/";
    },
    has: function(key){
      return has_re(key).test(document.cookie);
    },
    object: function(key) {
      if (!key || !this.has(key)){
        return;
      }
      var item = this.get(key);
      return new Function("return " + unescape(item.replace(/\+/g, " ")))();
    }
  };
});

