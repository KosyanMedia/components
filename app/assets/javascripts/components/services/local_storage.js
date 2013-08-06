angular.module('Components').service('LocalStorage', function(){
  return {
    set: function(key, data){
      try{
        var string = angular.toJson(data);
        localStorage.setItem(key, string);
      } catch(e){
        throw new Error('Can not save to local_storage with key: ' + key + ' and data: ' + data +
          '. Error: ' + e);
      }
    },
    get: function(key){
      var string = localStorage.getItem(key);
      if(!string){
        return false;
      }
      return angular.fromJson(string);
    },
    clear: function(){
      localStorage.clear();
    }
  };
});
