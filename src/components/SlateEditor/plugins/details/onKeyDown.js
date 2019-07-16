import onBackspace from './onBackspace';

const KEY_BACKSPACE = 'Backspace';

function onKeyDown(event, editor, next) {
  // Build arguments list
  const args = [event, editor, next];

  switch (event.key) {
    case KEY_BACKSPACE:
      return onBackspace(...args);
    default:
      return next();
  }
}

export default onKeyDown;
