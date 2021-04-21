import { Node, Element, Descendant } from 'new-slate';
import { jsx } from 'new-slate-hyperscript';

const TYPE_SECTION = 'section';

export interface SectionElement {
  type: 'section';
  children: Descendant[];
}

export const blockSerializer = {
  deserialize(el: HTMLElement, children: Element[]) {
    const tag = el.tagName.toLowerCase();
    if (tag === 'section') {
      return jsx('element', { type: TYPE_SECTION }, children);
    }
    if (tag === 'body') {
      return jsx('fragment', {}, children);
    }
    return;
  },
  serialize(node: Element, children: any) {
    if (!Node.isNode(node)) return;
    if (node.type === 'section') {
      return `<section>${children}</section>`;
    }
  },
};
