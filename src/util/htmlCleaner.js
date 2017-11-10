// import React from 'react';
// import Html from 'slate-html-serializer';

const htmlCleaner = html => {
  const node = document.createElement('div');
  node.insertAdjacentHTML('beforeend', html);
  const sections = [];
  for (let i = 0; i < node.children.length; i += 1) {
    sections.push(node.children[i].outerHTML)
  }
  node.remove();
  return sections;
};

export default htmlCleaner;
