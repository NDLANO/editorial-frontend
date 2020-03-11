import escapeHtml from 'escape-html';
import { Element, Node, Text } from 'slate';

const serializeNodeToPlain = (nodes: Node[]): string => {
  return nodes.map(n => Node.string(n)).join('\n');
}

const deserializePlain = (plain: string): Node[] => {
  return plain.split('\n').map(s => {return {type: 'line', text: s}})
}

// TODO: Make sure this contains and serializes all node types.
const serializeNodeToHtml = (node: Node): string => {
  if (Text.isText(node)) {
    return escapeHtml(node.text)
  }

  const children = node.children.map(n => serializeNodeToHtml(n)).join('')

  switch (node.type) {
    case 'quote':
      return `<blockquote><p>${children}</p></blockquote>`
    case 'paragraph':
      return `<p>${children}</p>`
    case 'link':
      return `<a href="${escapeHtml(node.url)}">${children}</a>`
    default:
      return children
  }
}

interface Rule {
  deserialize: (el: Element) => any;
  serialize: (obj: Node, children: Node[]) => any;
}

export const Html = (rule: Rule) => {

}