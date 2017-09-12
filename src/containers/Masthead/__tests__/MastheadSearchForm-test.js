/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import nock from 'nock';
import React from 'react';
import renderer from 'react-test-renderer';
import sinon from 'sinon';
import { MastheadSearchForm } from '../components/MastheadSearchForm';

const noop = () => {};

test('MastheadSearchForm redirects on ndla url paste with id at the end', () => {
  const historyMock = {
    push: sinon.spy(),
  };

  const component = renderer.create(
    <MastheadSearchForm
      show
      query=""
      searching={false}
      onSearchQuerySubmit={noop}
      t={() => ''}
      locale="nb"
      history={historyMock}
    />,
  );
  const tree = component.toJSON();
  const e = {
    target: {
      value:
        'https://ndla-frontend.test.api.ndla.no/article/urn:subject:100/urn:topic:1:179373/urn:resource:1:168387/3333',
    },
  };
  tree.children[0].props.onChange(e);
  expect(component.toJSON()).toMatchSnapshot();
  expect(historyMock.push.calledOnce).toBe(true);
  expect(historyMock.push.calledWith('/learning-resource/3333/edit')).toBe(
    true,
  );
});

test('MastheadSearchForm redirects on ndla url paste with taxonomy id at the end', () => {
  const historyMock = {
    push: sinon.spy(),
  };

  nock('http://ndla-api')
    .get('/taxonomy/v1/topics/urn:topic:1:179373/?language=nb')
    .reply(200, { contentUri: 'urn:content:4232' });

  const component = renderer.create(
    <MastheadSearchForm
      show
      query=""
      searching={false}
      locale="nb"
      onSearchQuerySubmit={noop}
      t={() => ''}
      history={historyMock}
    />,
  );
  const tree = component.toJSON();
  const e = {
    target: {
      value:
        'https://ndla-frontend.test.api.ndla.no/article/urn:subject:100/urn:topic:1:179373',
    },
  };

  tree.children[0].props.onChange(e);
  expect(component.toJSON()).toMatchSnapshot();
  return new Promise(resolve => {
    setTimeout(() => {
      expect(historyMock.push.calledOnce).toBe(true);
      expect(historyMock.push.calledWith('/topic-article/4232/edit')).toBe(
        true,
      );
      resolve();
    }, 100);
  });
});
