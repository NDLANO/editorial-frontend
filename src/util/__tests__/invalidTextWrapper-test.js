import Html from 'slate-html-serializer';
import { textWrapper } from '../invalidTextWrapper';

// make two test strings, one valid and one invalid in slate parser
const contentHTML = `<body><section><h2>Lorem ipsum</h2><aside><div><em>BLABLA</em></div></aside></section></body>`;
const contentHTMLWithSections = `<section><h2>Section 1</h2><aside>HEIHEI <div><em>BLABLA</em></div></aside></section><section><h2>Section 2</h2></section><section><h2>Section 3</h2></section>`;

const serializer = new Html();
const originalSerializer = new Html();
serializer.parseHtml = textWrapper(originalSerializer);

test('does not change valid input', () => {
  const newTree = serializer.parseHtml(contentHTML);
  expect(newTree).toEqual(originalSerializer.parseHtml(contentHTML));
});

test('wrappes invalid text input', () => {
  const newTree = serializer.parseHtml(contentHTMLWithSections);
  const treeWalker = document.createTreeWalker(
    newTree,
    NodeFilter.SHOW_ELEMENT,
    {
      acceptNode: node =>
        node.nodeName && node.nodeName.toLowerCase() === 'aside'
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_SKIP,
    },
  );
  while (treeWalker.nextNode()) {
    const childNodes = Array.from(treeWalker.currentNode.childNodes);
    expect(childNodes.includes(n => n.nodeName === '#text')).toBe(false);
  }
});
