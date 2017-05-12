export default function ifAuthenticated(authenticated, cb) {
  console.log('ifAuthenticated authenticated', authenticated);
  return (...args) => {
    if (authenticated) {
      return cb ? cb(...args) : undefined;
    }
    return undefined;
  };
}
