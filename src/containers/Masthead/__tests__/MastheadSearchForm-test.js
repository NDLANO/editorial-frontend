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
    preventDefault: () => {},
  };
  tree.props.onSubmit(e);
  expect(component.toJSON()).toMatchSnapshot();
  setTimeout(() => {
    expect(historyMock.push.calledOnce).toBe(true);
    expect(historyMock.push.calledWith('/learning-resource/3333/edit/nb')).toBe(
      true,
    );
  }, global.DEFAULT_TIMEOUT);
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
      query="https://ndla-frontend.test.api.ndla.no/article/urn:subject:100/urn:topic:1:179373"
      searching={false}
      locale="nb"
      onSearchQuerySubmit={noop}
      t={() => ''}
      history={historyMock}
    />,
  );
  const tree = component.toJSON();
  const e = {
    preventDefault: () => {},
  };
  tree.props.onSubmit(e);
  expect(component.toJSON()).toMatchSnapshot();
  return new Promise(resolve => {
    setTimeout(() => {
      expect(historyMock.push.calledOnce).toBe(true);
      expect(historyMock.push.calledWith('/topic-article/4232/edit/nb')).toBe(
        true,
      );
      resolve();
    }, global.DEFAULT_TIMEOUT);
  });
});

test('MastheadSearchForm redirects on old ndla url paste with new id', () => {
  const historyMock = {
    push: sinon.spy(),
  };

  nock('http://ndla-api')
    .get('/draft-api/v1/drafts/external_id/4737')
    .reply(200, { id: '123' });

  const component = renderer.create(
    <MastheadSearchForm
      show
      query="https://ndla.no/nb/node/4737?fag=36"
      searching={false}
      locale="nb"
      onSearchQuerySubmit={noop}
      t={() => ''}
      history={historyMock}
    />,
  );
  const tree = component.toJSON();
  const e = {
    preventDefault: () => {},
  };
  tree.props.onSubmit(e);
  expect(component.toJSON()).toMatchSnapshot();
  return new Promise(resolve => {
    setTimeout(() => {
      expect(historyMock.push.calledOnce).toBe(true);
      expect(historyMock.push.getCall(0).args[0]).toBe(
        '/learning-resource/123/edit/nb',
      );
      resolve();
    }, global.DEFAULT_TIMEOUT);
  });
});

test('MastheadSearchForm invalid id at the end of the url', () => {
  const historyMock = {
    push: sinon.spy(),
  };

  const component = renderer.create(
    <MastheadSearchForm
      show
      query="https://ndla-frontend.test.api.ndla.no/article/urn:subject:100/urn:topic:1:179373/urn:resource:1:16838"
      searching={false}
      onSearchQuerySubmit={noop}
      t={() => ''}
      locale="nb"
      history={historyMock}
    />,
  );
  const tree = component.toJSON();
  const e = {
    preventDefault: () => {},
  };
  tree.props.onSubmit(e);
  expect(component.toJSON()).toMatchSnapshot();
  setTimeout(() => {
    expect(historyMock.push.calledOnce).toBe(false);
  }, global.DEFAULT_TIMEOUT);
});

test('MastheadSearchForm redirects on ndla node id pasted', () => {
  const historyMock = {
    push: sinon.spy(),
  };
  nock('http://ndla-api')
    .get('/draft-api/v1/drafts/external_id/4737')
    .reply(200, { id: '123' });

  const component = renderer.create(
    <MastheadSearchForm
      show
      query="#4737"
      searching={false}
      locale="nb"
      onSearchQuerySubmit={noop}
      t={() => ''}
      history={historyMock}
    />,
  );
  const tree = component.toJSON();
  const e = {
    preventDefault: () => {},
  };
  tree.props.onSubmit(e);
  expect(component.toJSON()).toMatchSnapshot();
  return new Promise(resolve => {
    setTimeout(() => {
      expect(historyMock.push.calledOnce).toBe(true);
      expect(
        historyMock.push.calledWith('/learning-resource/123/edit/nb'),
      ).toBe(true);
      resolve();
    }, global.DEFAULT_TIMEOUT);
  });
});
