import { Record } from 'immutable';

const DEFAULTS = {
  type: 'blockquote',
  typeDefault: 'paragraph',
};

/**
 * The plugin options container
 */
class Options extends Record(DEFAULTS) {}

export default Options;
