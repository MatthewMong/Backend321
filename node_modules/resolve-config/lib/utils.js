'use strict';



exports.trim = function trim(str){
  return str.trim();
};

exports.contains = function contains(arr, item){
  return !!~arr.indexOf(item);
};