import onEnter from './onEnter';

const KEY_ENTER = 'Enter';

/**
 * User is pressing a key in the editor
 */
function onKeyDown(opts, event, editor, next) {
  // Build arguments list
  const args = [opts, event, editor, next];

  switch (event.key) {
    case KEY_ENTER:
      return onEnter(...args);
    default:
      return next();
  }
}

export default onKeyDown;
