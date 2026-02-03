/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { renderHook } from "@testing-library/react";
import { ElementType, ReactNode } from "react";
import { MemoryRouter } from "react-router";
import { getSessionStateFromCookie, SessionProvider, useSession } from "../SessionProvider";

const navigateMock = vi.fn();
vi.mock("react-router", async (original) => {
  const actual: object = await original(); // get actual module
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

const accessToken =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImtpZCI6Ik9FSTFNVVU0T0RrNU56TTVNekkyTXpaRE9EazFOMFl3UXpkRE1EUXlPRFZDUXpRM1FUSTBNQSJ9.eyJodHRwczovL25kbGEubm8vbmRsYV9pZCI6Im1ObXJ1N1lvU0lqUGVwT3JrTjRNTWhsVSIsImh0dHBzOi8vbmRsYS5uby91c2VyX25hbWUiOiJUZXN0IHVzZXIiLCJodHRwczovL25kbGEubm8vY2xpZW50X2lkIjoiSks0Uk8zVTciLCJpc3MiOiJodHRwczovL25kbGEuZXUuYXV0aDAuY29tLyIsInN1YiI6Imdvb2dsZS1vYXV0aDJ8MTIzNDIzNDIzMTMyMTM1NjEyMyIsImF1ZCI6Im5kbGFfc3lzdGVtIiwiaWF0IjoxNTA5OTcwMDI3LCJleHAiOjE1MDk5NzcyMjcsImF6cCI6IldVMEtyNENEa3JNMHVMOXhZZUZWNGNsOUdhMXZCM0pZIiwic2NvcGUiOiJzb21lOnBlcm1pc3Npb24iLCJwZXJtaXNzaW9ucyI6WyJzb21lOnBlcm1pc3Npb24iXX0.n7YdEm0FypAz8NdEDLcVyDFXHnNG_Zo7T7RNt7WRAa4";

interface Props {
  initialValue?: any;
}

const createWrapper = (Wrapper: ElementType, props: Props) => {
  return ({ children }: { children?: ReactNode }) => (
    <MemoryRouter>
      <Wrapper {...props}>{children}</Wrapper>
    </MemoryRouter>
  );
};

describe("getSessionStateFromCookie", () => {
  it("returns a default initial state if token is not available in cookie", () => {
    expect(getSessionStateFromCookie(undefined)).toMatchSnapshot();
  });

  it("returns a decoded access token if everything is ok", () => {
    const nextState = getSessionStateFromCookie(accessToken);

    expect(nextState).toMatchSnapshot();
  });
});

describe("useSession", () => {
  test("returns initial state when called without initial values", () => {
    const { result } = renderHook(() => useSession(), {
      wrapper: createWrapper(SessionProvider, {}),
    });
    expect(result.current).toMatchSnapshot();
  });

  test("returns initial state when called with initial values", () => {
    const { result } = renderHook(() => useSession(), {
      wrapper: createWrapper(SessionProvider, {
        initialValue: getSessionStateFromCookie(accessToken),
      }),
    });

    expect(result.current).toMatchSnapshot();
  });
});
