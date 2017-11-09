
const SECTION_TAG = "section";


const unwrapHtmlSection = (node) => {
  const children = node.children;
  const parent = node.parentNode;
  for (let i = 0; i < children.length; i += 1) {
    parent.appendChild(children[i]);
  }
}

const domOperations = (html) => {
  const node = document.createElement("div");
  node.insertAdjacentHTML( 'beforeend', html );
  const sections = node.getElementsByTagName(SECTION_TAG);
  const nodesToRemove = [];
  for (let i = 0; i < sections.length; i += 1) {
    const section = sections[i];
    if (section.parentNode.tagName.toLowerCase() === SECTION_TAG) {
      unwrapHtmlSection(section);
      nodesToRemove.push(section);
    }
  }
  nodesToRemove.map((remove) => remove.remove());
  const convertedHTML = node.innerHTML;
  node.remove();
  return convertedHTML;
}

export const htmlCleaner = (html) => {
  const newHTML = domOperations(html)
  return newHTML
    .split('</section>')
    .filter(section => section.length > 0)
    .map(section => `${section}</section>`);
}

export default htmlCleaner;
