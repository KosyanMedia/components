angular.module('Components').service('TinyDB', ['LocalStorage', function(LocalStorage){
  return {
    push: function(key, object, limit){

      limit = limit || 10;

      var table = LocalStorage.get(key);

      if(table && !angular.isArray(table)){
        console.error('Can not push to non-array structure');
        return false;
      }

      var fusions = [+angular.isArray(table), +angular.isArray(object)].join('');

      switch(fusions){
        case '11': {
          angular.forEach(object, function(item){
            table.push(item);
          });
        }
        break;

        case '01': {
          table = object;
        }
        break;

        case '10': {
          table.push(object);
        }
        break;

        case '00': {
          table = [object];
        }
        break;
      }

      if(table.length > limit){
        table = table.splice(table.length - limit);
      }
      LocalStorage.set(key, table);
    },
    get: function(key, limit){
      var table = LocalStorage.get(key);
      if(!table){
        console.error('Table ' + key + ' does not exist');
        return false;
      }
      return table.slice(table.length - limit);
    },
    drop: function(key){
      LocalStorage.set(key, []);
    }
  };
}]);
