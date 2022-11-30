/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import nock from 'nock';
import { createEditor, Descendant } from 'slate';
import { withReact, Slate, Editable } from 'slate-react';
import { withHistory } from 'slate-history';
import { render, fireEvent, cleanup, act } from '@testing-library/react';
import RelatedArticleBox from '../RelatedArticleBox';
import IntlWrapper from '../../../../../util/__tests__/IntlWrapper';
import { TYPE_RELATED } from '../types';
import { TYPE_SECTION } from '../../section/types';

jest.mock('slate-react', () => {
  const slatereact = jest.requireActual('slate-react');
  return {
    ...slatereact,
    ReactEditor: {
      ...slatereact.ReactEditor,
      findPath: (editor, element) => {
        return [0, 0, 0];
      },
    },
  };
});

afterEach(cleanup);

const relatedElement: Descendant = {
  type: TYPE_RELATED,
  data: {},
  children: [
    {
      text: '',
    },
  ],
};

const element: Descendant = {
  type: TYPE_SECTION,
  children: [relatedElement],
};

const wrapper = () => {
  const editor = withHistory(withReact(createEditor()));

  return render(
    <IntlWrapper>
      <div>
        <Slate editor={editor} value={[element]} onChange={() => {}}>
          <Editable />
        </Slate>
        {/* @ts-ignore */}
        <RelatedArticleBox
          editor={editor}
          locale="nb"
          element={relatedElement}
          onRemoveClick={() => {}}>
          <></>
        </RelatedArticleBox>
      </div>
    </IntlWrapper>,
  );
};

test('it goes in and out of edit mode', async () => {
  nock('http://ndla-api')
    .get('/search-api/v1/search/editorial/?context-types=standard%2C%20topic-article&page=1&query=')
    .reply(200, { results: [] });
  const {
    getByTestId,
    container,
    findByTestId,
    findByText,
    findAllByRole,
    findByDisplayValue,
  } = wrapper();
  await findByText('Dra artikkel for å endre rekkefølge');

  act(() => {
    fireEvent.click(getByTestId('showAddExternal'));
  });

  await findByTestId('addExternalTitleInput');

  expect(container.firstChild).toMatchSnapshot();

  const input = getByTestId('addExternalUrlInput');
  const inputTitle = getByTestId('addExternalTitleInput');
  act(() => {
    fireEvent.change(input, { target: { value: 'https://www.vg.no' } });
  });

  await findByDisplayValue('https://www.vg.no');

  act(() => {
    fireEvent.change(inputTitle, { target: { value: 'Verdens gang' } });
  });
  await findByDisplayValue('Verdens gang');

  act(() => {
    fireEvent.click(getByTestId('taxonomyLightboxButton'));
  });

  await findAllByRole('link', { name: 'Verdens gang' });

  expect(container.firstChild).toMatchSnapshot();
});
