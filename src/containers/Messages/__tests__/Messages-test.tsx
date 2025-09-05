/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createMemoryRouter, RouterProvider } from "react-router";
import { findByTestId, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { uuid } from "@ndla/util";
import IntlWrapper from "../../../util/__tests__/IntlWrapper";
import Messages from "../Messages";
import { MessagesProvider } from "../MessagesProvider";
import { MessageType } from "../types";

const router = createMemoryRouter([{ path: "*", element: <Messages /> }]);

beforeEach(() => {
  const reload = vi.fn();

  vi.spyOn(window, "location", "get").mockImplementation(() => ({ reload }) as unknown as Location);
});

const wrapper = (messages: MessageType[]) => (
  <IntlWrapper>
    <MessagesProvider initialValues={messages}>
      <RouterProvider router={router} />
    </MessagesProvider>
  </IntlWrapper>
);

describe("Messages", () => {
  test("A single message renders correctly", () => {
    const messages: MessageType[] = [{ id: uuid(), message: "Testmessage" }];
    const { baseElement } = render(wrapper(messages));

    expect(baseElement).toMatchSnapshot();
  });

  test("Several messages renders correctly", () => {
    const messages: MessageType[] = [
      { id: uuid(), message: "Testmessage" },
      { id: uuid(), message: "Testmessage2" },
    ];
    const { baseElement } = render(wrapper(messages));
    expect(baseElement).toMatchSnapshot();
  });

  test("A message is removed if the modal is closed", async () => {
    const messages: MessageType[] = [{ id: uuid(), message: "Testmessage", timeToLive: 10000 }];
    const { baseElement, queryByRole } = render(wrapper(messages));
    const portal = baseElement.querySelector('div[role="dialog"]') as HTMLElement;
    expect(baseElement).toMatchSnapshot();
    const closeButton = await findByTestId(portal, "closeAlert");
    await userEvent.click(closeButton);
    expect(queryByRole("dialog")).not.toBeInTheDocument();
    expect(baseElement.innerHTML).toMatchSnapshot();
  });

  it("auth0 messages provides a cancel button", async () => {
    const messages: MessageType[] = [{ id: uuid(), message: "Testmessage", timeToLive: 10000, type: "auth0" }];
    const { baseElement, findByText, queryByRole } = render(wrapper(messages));
    expect(baseElement).toMatchSnapshot();
    const cancelButton = await findByText("Avbryt");
    await userEvent.click(cancelButton);
    expect(queryByRole("dialog")).not.toBeInTheDocument();
    expect(baseElement.innerHTML).toMatchSnapshot();
  });

  it("auth0 messages allows the user to log in again", async () => {
    const messages: MessageType[] = [{ id: uuid(), message: "Testmessage", timeToLive: 10000, type: "auth0" }];

    const { findByText } = render(wrapper(messages));
    const loginButton = await findByText("Logg inn på nytt");
    await userEvent.click(loginButton);
    expect(`${router.state.location.pathname}${router.state.location.search}`).toEqual(
      "/logout/session?returnToLogin=true",
    );
  });
});
