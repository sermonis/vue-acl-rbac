import mixin from './mixin';
import extend from './extend';

export let Vue;

export function install(_Vue) {
  Vue = _Vue;

  install.installed = true;

  extend(Vue);
  Vue.mixin(mixin);

  const strats = Vue.config.optionMergeStrategies;
  strats.rbac = function(parentVal, childVal) {
    return childVal === undefined ? parentVal : childVal;
  };
}
