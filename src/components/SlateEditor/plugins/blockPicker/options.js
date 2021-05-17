const defaultOptions = {
  allowedPickAreas: ['paragraph', 'heading'],
  illegalAreas: ['quote', 'list-item', 'numbered-list', 'table'],
};

const options = opts => ({
  allowedPickAreas: opts.allowedPickAreas || defaultOptions.allowedPickAreas,
  illegalAreas: opts.illegalAreas || defaultOptions.illegalAreas,
  actionsToShowInAreas: opts.actionsToShowInAreas || undefined,
});

export default options;
