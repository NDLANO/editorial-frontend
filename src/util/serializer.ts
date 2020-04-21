import escapeHtml from 'escape-html';
import { Element, Node, Text } from 'slate';

export const serializeNodeToPlain = (nodes: Node[]): string => {
  return nodes.map(n => Node.string(n)).join('\n');
}

export const deserializePlain = (plain: string): Node[] => {
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

export interface Rule {
  deserialize?: (el: any, next: (children: ChildNode) => any) => any;
  serialize?: (obj: Element, children: Node[]) => any;
}

export const deserializeHtml = (input: any, rules: Rule[]) => {
  let html = input;
  console.log("Deserializing HTML")
  console.log(html);
  if (typeof html === 'string') {
    html = new DOMParser().parseFromString(input, 'text/html').body;
  }
  console.log(html);
  for (const rule of rules) {
    if (!rule.deserialize) {
      continue
    }
    const res = rule.deserialize(html, (children: ChildNode) => deserializeHtml(children, rules))
    if (res) console.log("Deserializing");
    if (res) console.log(res);
    if (res) return res;
  }

  console.log(`NO DESERIALIZING HAPPENING! ELEMENT \n ${html? html : ''}`)
}

export const serializeHtml = (node: Node, rules: Rule[]) => {
  for (const rule of rules) {
    if (!rule.serialize || !Element.isElement(node)) {
      continue
    }
    const res = rule.serialize(node, node.children)
    if (res) return res;
  }
}