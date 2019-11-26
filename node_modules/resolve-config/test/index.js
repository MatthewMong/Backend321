var a = require('assert');
var f = require('../');



describe('resolve-config', function(){
  var c1;

  beforeEach(function(){
    c1 = {
      a: {
        aa: 1
      },
      b: {
        bb: 2
      }
    };
  });

  it('merges only confs with whose keys match the given env', function(){
    a.deepEqual(f('a', c1), c1.a);
  });

  it('supports an "all" env that is used for all envs', function(){
    c1.all = { foo: 'bar' };
    var result = f('a', c1);
    a.equal(result.aa, c1.a.aa);
    a.equal(result.foo, c1.all.foo);
  });

  it('other envs take precedence over "all"', function(){
    c1.all = { aa: 'haha' };
    var c2 = {
      'all': {
        aa: 'haha'
      },
      a: {
        aa: 1
      }
    };

    a.equal(f('a', c1).aa, 1);
    a.equal(f('a', c2).aa, 1);
  });
});
