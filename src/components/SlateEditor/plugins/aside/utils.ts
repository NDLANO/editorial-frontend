import { jsx } from 'slate-hyperscript';
import { AsideElement, TYPE_ASIDE } from '.';

export const defaultAsideBlock = (data?: AsideElement['data']) =>
  jsx('element', { type: TYPE_ASIDE, data: { ...data } }, [{ text: '' }]);

export const getAsideType = (el: HTMLElement): { type: string } => {
  const asideType = el.attributes.getNamedItem('data-type')?.value;
  return {
    type: asideType ?? 'rightAside',
  };
};
