import VueRbac from './index';
import { warn } from './util';

export default {
  beforeCreate() {
    const options = this.$options;
    options.rbac = options.rbac || (options.__rbac ? {} : null);

    if (options.rbac) {
      if (options.rbac instanceof VueRbac) {
        this._rbac = options.rbac;
        this._rbac.subscribeDataChanging(this);
        this._rbacWatcher = this._rbac.watchRbacData();
        this._subscribing = true;
      } else {
        if (process.env.NODE_ENV !== 'production') {
          warn(`Cannot be interpreted 'rbac' option.`);
        }
      }
    } else if (
      this.$root &&
      this.$root.$rbac &&
      this.$root.$rbac instanceof VueRbac
    ) {
      this._rbac = this.$root.$rbac;
      this._rbac.subscribeDataChanging(this);
      this._subscribing = true;
    } else if (
      options.parent &&
      options.parent.$rbac &&
      options.parent.$rbac instanceof VueRbac
    ) {
      this._rbac = options.parent.$rbac;
      this._rbac.subscribeDataChanging(this);
      this._subscribing = true;
    }
  },

  beforeDestroy() {
    if (!this._rbac) {
      return;
    }

    if (this._subscribing) {
      this._rbac.unsubscribeDataChanging(this);
      delete this._subscribing;
    }

    if (this._rbacWatcher) {
      this._rbacWatcher();
      delete this._rbacWatcher;
    }

    this._rbac = null;
  }
};
