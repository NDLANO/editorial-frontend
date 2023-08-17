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
      findPath: (_editor: any, _element: any) => {
        return [0, 0, 0];
      },
    },
  };
});

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  cleanup();
  jest.useRealTimers();
});

const relatedElement: Descendant = {
  type: TYPE_RELATED,
  data: [],
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
        <Slate editor={editor} initialValue={[element]} onChange={() => {}}>
          <Editable />
        </Slate>
        {/* @ts-ignore */}
        <RelatedArticleBox editor={editor} element={relatedElement} onRemoveClick={() => {}}>
          <></>
        </RelatedArticleBox>
      </div>
    </IntlWrapper>,
  );
};
jest.useFakeTimers();

test('it goes in and out of edit mode', async () => {
  nock('http://ndla-api')
    .get('/search-api/v1/search/editorial/?context-types=standard%2C%20topic-article&page=1&query=')
    .reply(200, { results: [] });
  const { getByTestId, container, findByTestId, findByText, findAllByRole, findByDisplayValue } =
    wrapper();

  act(() => {
    jest.runAllTimers();
  });

  await act(async () => {
    const el = await findByText('Legg til ekstern artikkel');
    fireEvent.mouseDown(el);
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

  await act(async () => {
    const el = await findByText('Lagre');
    fireEvent.click(el);
  });

  await findAllByRole('link', { name: 'Verdens gang' });

  expect(container.firstChild).toMatchSnapshot();
});
