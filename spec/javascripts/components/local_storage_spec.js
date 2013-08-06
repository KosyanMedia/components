describe('Service: LocalStorage', function(){
  var local_storage;

  beforeEach(module('Components'));
  beforeEach(inject(function($injector) {
    local_storage = $injector.get('LocalStorage');
  }));

  it('correctly saves',function(){
    local_storage.set('test', {foo: 'bar'});
    expect(local_storage.get("test")).toEqual({foo: 'bar'});
  });

  it('return false if key does NOT exist',function(){
    expect(local_storage.get("foo")).toBeFalsy();
  });

  it('correctly clears storage',function(){
    local_storage.set('test', {foo: 'bar'});
    expect(local_storage.get("test")).toEqual({foo: 'bar'});
    local_storage.clear();
    expect(local_storage.get("test")).toBeFalsy();
  });
});
