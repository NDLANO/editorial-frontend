import { Node, Descendant } from 'new-slate';

export const Plain = {
  serialize: (nodes: Descendant[]) => {
    return nodes.map(n => Node.string(n)).join('\n');
  },
  deserialize: (text: string) => {
    return text.split('\n').map(t => ({
      type: 'paragraph',
      children: [{ text: t }],
    }));
  },
};
