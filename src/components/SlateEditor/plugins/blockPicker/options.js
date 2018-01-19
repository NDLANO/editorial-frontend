const defaultOptions = {
  allowedPickAreas: [
    'paragraph',
    'heading-one',
    'heading-two',
    'heading-three',
  ],
  illegalAreas: [
    'quote',
    'list-item',
    'numbered-list',
    'aside',
    'bodybox',
    'details',
  ],
};

const options = opts => ({
  allowedPickAreas: opts.allowedPickAreas || defaultOptions.allowedPickAreas,
  illegalAreas: opts.illegalAreas || defaultOptions.illegalAreas,
});

export default options;
