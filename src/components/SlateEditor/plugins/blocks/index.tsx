import { Node, Element, Descendant } from 'new-slate';
import { jsx } from 'new-slate-hyperscript';
import { SlateSerializer } from '../../interfaces';

const TYPE_SECTION = 'section';

export interface SectionElement {
  type: 'section';
  children: Descendant[];
}

export const blockSerializer: SlateSerializer = {
  deserialize(el: HTMLElement, children: (Descendant[] | Descendant | null)[]) {
    const tag = el.tagName.toLowerCase();
    if (tag === 'section') {
      return jsx('element', { type: TYPE_SECTION }, children);
    }
    if (tag === 'body') {
      return jsx('fragment', {}, children);
    }
    return;
  },
  serialize(node: Element, children: string) {
    if (!Node.isNode(node)) return;
    if (node.type === 'section') {
      return `<section>${children}</section>`;
    }
  },
};
