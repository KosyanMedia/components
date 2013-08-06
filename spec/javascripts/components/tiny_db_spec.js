describe('Service: TinyDB', function(){
  var tiny_db, local_storage;

  beforeEach(module('Components'));
  beforeEach(inject(function($injector) {
    tiny_db = $injector.get('TinyDB');
    local_storage = $injector.get('LocalStorage');
  }));

  it('exists', function(){
    expect(tiny_db).not.toBe(null);
  });

  it('correctly pushes if key does NOT exists',function(){
    expect(tiny_db.get('test')).toBeFalsy();
    tiny_db.push('test', {foo: 'bar'});
    expect(tiny_db.get('test')).toEqual([{foo: 'bar'}]);
  });

  it('correctly drops table', function(){
    tiny_db.push('test', {foo: 'bar'});
    expect(tiny_db.get('test')).toEqual([{foo: 'bar'}]);
    tiny_db.drop('test');
    expect(tiny_db.get('test')).toEqual([]);
  });

  describe('limits', function(){
    beforeEach(function() {
      var mocked_data = [
        {item: 'test1'},
        {item: 'test2'},
        {item: 'test3'},
        {item: 'test4'}
      ];
      tiny_db.push('fake_table', mocked_data);
    });

    it('correctly pushes with limit', function(){
      tiny_db.push('fake_table', {item: 'test5'}, 4);
      expect(tiny_db.get('fake_table')).toEqual([
        {item: 'test2'},
        {item: 'test3'},
        {item: 'test4'},
        {item: 'test5'}
      ]);
    });

    it('correctly gets with limit', function(){
      expect(tiny_db.get('fake_table', 2)).toEqual([
        {item: 'test3'},
        {item: 'test4'}
      ]);
    });
  });

  afterEach(function(){
    local_storage.clear();
  });
});
