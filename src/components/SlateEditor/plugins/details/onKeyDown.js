import onBackspace from './onBackspace';
import onDelete from './onDelete';

const KEY_BACKSPACE = 'Backspace';
const KEY_DELETE = 'Delete';

function onKeyDown(event, editor, next) {
  // Build arguments list
  const args = [event, editor, next];

  switch (event.key) {
    case KEY_BACKSPACE:
      return onBackspace(...args);
    case KEY_DELETE:
      return onDelete(...args);
    default:
      return next();
  }
}

export default onKeyDown;
