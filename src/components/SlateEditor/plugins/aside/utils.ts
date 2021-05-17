export const getAsideType = (el: HTMLElement): { type: string } => {
  const asideType = el.attributes.getNamedItem('data-type')?.value;
  return {
    type: asideType ?? 'rightAside',
  };
};
