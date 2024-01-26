/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import nock from "nock";
import { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import { render } from "@testing-library/react";
import { taxonomyApi } from "../../../config";
import IntlWrapper from "../../../util/__tests__/IntlWrapper";
import { MastheadSearchForm } from "../components/MastheadSearchForm";

const noop = () => {};

const wrapper = (component: ReactNode) => (
  <MemoryRouter>
    <IntlWrapper>{component}</IntlWrapper>
  </MemoryRouter>
);

test.skip("MastheadSearchForm redirects on ndla url paste with id at the end", () => {
  const historyMock = {
    push: vi.fn(),
  };

  const { container } = render(
    wrapper(
      <MastheadSearchForm query="" onSearchQuerySubmit={noop} onChange={noop} setQuery={noop} setMenuOpen={noop} />,
    ),
  );
  expect(container).toMatchSnapshot();
  setTimeout(() => {
    expect(historyMock.push).toBeCalledTimes(1);
    expect(historyMock.push).toBeCalledWith("/subject-matter/learning-resource/3333/edit/nb");
  });
});

test.skip("MastheadSearchForm redirects on ndla url paste with taxonomy id at the end", () => {
  const historyMock = {
    push: vi.fn(),
  };

  nock("http://ndla-api")
    .get(`${taxonomyApi}/topics/urn:topic:1:179373/?language=nb`)
    .reply(200, { contentUri: "urn:content:4232" });

  const { container } = render(
    wrapper(
      <MastheadSearchForm
        query="https://ndla-frontend.test.api.ndla.no/article/urn:subject:100/urn:topic:1:179373"
        onChange={noop}
        onSearchQuerySubmit={noop}
        setMenuOpen={noop}
        setQuery={noop}
      />,
    ),
  );
  expect(container).toMatchSnapshot();
  setTimeout(() => {
    expect(historyMock.push).toBeCalledTimes(1);
    expect(historyMock.push).toBeCalledWith("/subject-matter/topic-article/4232/edit/nb");
  });
});

test.skip("MastheadSearchForm redirects on old ndla url paste with new id", () => {
  const historyMock = {
    push: vi.fn(),
  };

  nock("http://ndla-api").get("/draft-api/v1/drafts/external_id/4737").reply(200, { id: "123" });

  const { container } = render(
    wrapper(
      <MastheadSearchForm
        query="https://ndla.no/nb/node/4737?fag=36"
        onChange={noop}
        onSearchQuerySubmit={noop}
        setMenuOpen={noop}
        setQuery={noop}
      />,
    ),
  );
  expect(container).toMatchSnapshot();
  setTimeout(() => {
    expect(historyMock.push).toBeCalledTimes(1);
    expect(historyMock.push).nthCalledWith(0, "/subject-matter/learning-resource/123/edit/nb");
  });
});

test.skip("MastheadSearchForm invalid id at the end of the url", () => {
  const historyMock = {
    push: vi.fn(),
  };

  const { container } = render(
    wrapper(
      <MastheadSearchForm
        onChange={noop}
        query="https://ndla-frontend.test.api.ndla.no/article/urn:subject:100/urn:topic:1:179373/urn:resource:1:16838"
        onSearchQuerySubmit={noop}
        setMenuOpen={noop}
        setQuery={noop}
      />,
    ),
  );
  expect(container).toMatchSnapshot();
  setTimeout(() => {
    expect(historyMock.push).not.toBeCalledTimes(1);
  });
});

test.skip("MastheadSearchForm redirects on ndla node id pasted", () => {
  const historyMock = {
    push: vi.fn(),
  };
  nock("http://ndla-api").get("/draft-api/v1/drafts/external_id/4737").reply(200, { id: "123" });

  const { container } = render(
    wrapper(
      <MastheadSearchForm
        query="#4737"
        onChange={noop}
        onSearchQuerySubmit={noop}
        setMenuOpen={noop}
        setQuery={noop}
      />,
    ),
  );
  expect(container).toMatchSnapshot();
  setTimeout(() => {
    expect(historyMock.push).toBeCalledTimes(1);
    expect(historyMock.push).toBeCalledWith("/subject-matter/learning-resource/123/edit/nb");
  });
});
