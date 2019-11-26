var merge = require('deep-extend');
var utils = require('./lib/utils');



// resolve_configs :: String, { <ENV>: {} } -> {}
function resolve_configs(env, confs){
  return merge_confs(filter_confs(env, confs));
}



// merge_confs :: [{}] -> {}
function merge_confs(confs){
  var merged = {};
  for (var i = 0; i < confs.length; i++) {
    merged = merge(merged, confs[i]);
  }
  return merged;
}



// filter_confs :: String, { <ENV>: {} } -> {}
function filter_confs(env, confs){
  function parse_key(key){
    return key.split(',').map(utils.trim);
  }

  // for each conf in confs
  // if given env is found in
  // respective conf's env then
  // retain it [the conf].
  var matches = [];
  var defaults = [];

  for (var conf_env in confs) {
    if (!confs.hasOwnProperty(conf_env)) continue;

    var conf_envs = parse_key(conf_env);
    if (~conf_envs.indexOf(env)) {
      matches.push(confs[conf_env]);
    } else if (~conf_envs.indexOf('all')) {
      defaults.push(confs[conf_env]);
    }
  }

  var picks = defaults.concat(matches);

  return picks;
}



module.exports = resolve_configs;
