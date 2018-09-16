export default function extend(Vue) {
  Object.defineProperty(Vue.prototype, "$rbac", {
    get() {
      return this._rbac;
    }
  });

  Vue.prototype.$can = function(rule) {
    const rbac = this.$rbac;
    return rbac._can(rule, rbac._getRules());
  };
}
