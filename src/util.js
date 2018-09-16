export function warn(msg, err) {
  if (typeof console !== 'undefined') {
    console.warn('[vue-rbac] ' + msg);

    if (err) {
      console.warn(err);
    }
  }
}
