/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import converter from '../articleContentConverter';

const contentHTML = `
  <section>
    <h2>Lorem</h2>
    <p>
      Lorem <strong>ipsum dolor sit amet</strong>, consectetur <u>adipiscing</u> elit,
      sed do eiusmod tempor incididunt ut labore et <em>dolore magna aliqua</em>. Ut enim ad minim veniam,
      quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
    </p>
    <blockquote>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. </blockquote>
    <h3>Ipsum</h3>
    <ul>
      <li>Lorem ipsum </li>
      <li>Dolor sit amet</li>
      <li>Consectetur adipiscing</li>
    </ul>
  </section>
`;

test('articleContentConverter convert to and from editorState', () => {
  const editorState = converter.toEditorState(contentHTML);
  const html = converter.toHtml(editorState);
  expect(html).toMatchSnapshot();
});
