'use strict';

var glob = require('glob');
var sutil = require('spun-util');
var errors = sutil.errors;
var path = require('path');
var resolve = path.resolve;
var basename = path.basename;
var dirname = path.dirname;

describe('run', function(){
  var run = require('../lib/run');
  var argv = {workerCount: 5};
  var strategyProvider = {};

  describe('during parsing', function(){
    glob
    .sync('./acceptance/parsing/passing/*.spun', {cwd: __dirname})
    .map(toAbsolutePath(__dirname))
    .forEach(function(test){
      it('should allow ' + basename(test.relative, '.spun'), function(done){
        run(argv, [test.absolute], strategyProvider, function(err){
          if(err){
            console.log(err.message);
          }
          done(err);
        });
      });
    });

    glob
    .sync('./acceptance/parsing/failing/*.spun', {cwd: __dirname})
    .map(toAbsolutePath(__dirname))
    .forEach(function(test){
      var absoluePath = test.absolute;
      var errorPath = resolve(dirname(absoluePath), basename(absoluePath, '.spun') + '.js');
      var error = require(errorPath);

      it('should not allow ' + basename(test.relative, '.spun'), function(done){
        run(argv, [absoluePath], strategyProvider, function(err){
          if(!err)return done(new Error('Expected to see an error!'));
          err.should.be.an.instanceOf(error);
          done();
        });
      });
    });
  });
});

function toAbsolutePath(base){
  return function(path){
    return {
      base: base,
      relative: path,
      absolute: resolve(base, path)
    };
  };
}
