import { install, Vue } from './install';
import { checkPermission } from './checker';

export const checkPermission;

export class Permission {
  constructor(permission) {
    this.current = permission;
  }

  or(permission) {
    this.current += this.current === '' ? permission : `||${permission}`;
    return this;
  }

  and(permission) {
    this.current += this.current === '' ? permission : `&&${permission}`;
    return this;
  }

  generate() {
    const splitOrs = this.current.split('||');
    return splitOrs.map(o => o.split('&&'));
  }
}

export default class VueRbac {
  constructor(options) {
    if (!Vue && typeof window !== 'undefined' && window.Vue) {
      install(window.Vue);
    }

    const current =
      options.default === undefined
        ? ['public']
        : Array.isArray(options.default)
          ? options.default
          : [options.default];
    const rules = options.rules || {};

    this._vm = null;
    this._dataListeners = [];

    this._initVM({
      current,
      rules
    });
  }

  _initVM(data) {
    const silent = Vue.config.silent;
    Vue.config.silent = true;
    this._vm = new Vue({ data });
    Vue.config.silent = silent;
  }

  subscribeDataChanging(vm) {
    this._dataListeners.push(vm);
  }

  unsubscribeDataChanging(vm) {
    remove(this._dataListeners, vm);
  }

  watchRbacData() {
    const self = this;
    return this._vm.$watch(
      '$data',
      () => {
        let i = self._dataListeners.length;
        while (i--) {
          Vue.nextTick(() => {
            self._dataListeners[i] && self._dataListeners[i].$forceUpdate();
          });
        }
      },
      { deep: true }
    );
  }

  get current() {
    return this._vm.current;
  }
  set current(rule) {
    this._vm.$set(this._vm, 'current', Array.isArray(rule) ? rule : [rule]);
  }

  _getRules() {
    return this._vm.rules;
  }

  _can(rule, rules) {
    if (rule in rules) {
      return checkPermission(this.current, rules[rule]);
    }

    return false;
  }
}

VueRbac.install = install;
