import onEnter from './onEnter';
import onBackspace from './onBackspace';

const KEY_ENTER = 'Enter';
const KEY_BACKSPACE = 'Backspace';

/**
 * User is pressing a key in the editor
 */
function onKeyDown(opts, event, change, editor) {
  // Build arguments list
  const args = [opts, event, change, editor];

  switch (event.key) {
    case KEY_ENTER:
      return onEnter(...args);
    case KEY_BACKSPACE:
      return onBackspace(...args);
    default:
      return undefined;
  }
}

export default onKeyDown;
