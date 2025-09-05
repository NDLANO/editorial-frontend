/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ElementType, ReactNode } from "react";
import { MemoryRouter } from "react-router";
import { act, renderHook } from "@testing-library/react";
import { getSessionStateFromLocalStorage, SessionProvider, useSession } from "../SessionProvider";

const navigateMock = vi.fn();
vi.mock("react-router", async (original) => {
  const actual: object = await original(); // get actual module
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

const authResult = {
  accessToken:
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImtpZCI6Ik9FSTFNVVU0T0RrNU56TTVNekkyTXpaRE9EazFOMFl3UXpkRE1EUXlPRFZDUXpRM1FUSTBNQSJ9.eyJodHRwczovL25kbGEubm8vbmRsYV9pZCI6Im1ObXJ1N1lvU0lqUGVwT3JrTjRNTWhsVSIsImh0dHBzOi8vbmRsYS5uby91c2VyX25hbWUiOiJUZXN0IHVzZXIiLCJodHRwczovL25kbGEubm8vY2xpZW50X2lkIjoiSks0Uk8zVTciLCJpc3MiOiJodHRwczovL25kbGEuZXUuYXV0aDAuY29tLyIsInN1YiI6Imdvb2dsZS1vYXV0aDJ8MTIzNDIzNDIzMTMyMTM1NjEyMyIsImF1ZCI6Im5kbGFfc3lzdGVtIiwiaWF0IjoxNTA5OTcwMDI3LCJleHAiOjE1MDk5NzcyMjcsImF6cCI6IldVMEtyNENEa3JNMHVMOXhZZUZWNGNsOUdhMXZCM0pZIiwic2NvcGUiOiJzb21lOnBlcm1pc3Npb24iLCJwZXJtaXNzaW9ucyI6WyJzb21lOnBlcm1pc3Npb24iXX0.n7YdEm0FypAz8NdEDLcVyDFXHnNG_Zo7T7RNt7WRAa4",
};

afterEach(() => {
  localStorage.clear();
});

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

describe("getSessionStateFromLocalStorage", () => {
  it("returns a default initial state if token is not available in localStorage", () => {
    localStorage.removeItem("access_token");
    expect(getSessionStateFromLocalStorage()).toMatchSnapshot();
  });

  it("returns a default initial state if accessToken is not personal", () => {
    localStorage.setItem("access_token", authResult.accessToken);
    localStorage.removeItem("access_token_personal");
    expect(getSessionStateFromLocalStorage()).toMatchSnapshot();
  });

  it("returns a decoded access token if everything is ok", () => {
    localStorage.setItem("access_token", authResult.accessToken);
    localStorage.setItem("access_token_personal", "true");
    const nextState = getSessionStateFromLocalStorage();

    expect(nextState).toMatchSnapshot();
  });
});

describe("useSession", () => {
  afterEach(() => {
    navigateMock.mockClear();
  });

  afterAll(() => {
    vi.clearAllMocks();
  });
  test("correctly sets access token and access_token_personal on successful login", async () => {
    const { result } = renderHook(() => useSession(), {
      wrapper: createWrapper(SessionProvider, {}),
    });
    act(() => {
      result.current.login(authResult);
    });
    expect(navigateMock).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenCalledWith("/", { replace: true });
    expect(localStorage.getItem("access_token")).toEqual(authResult.accessToken);
    expect(localStorage.getItem("access_token_personal")).toEqual("true");
  });

  test("returns initial state when called without initial values", () => {
    const { result } = renderHook(() => useSession(), {
      wrapper: createWrapper(SessionProvider, {}),
    });
    expect(result.current).toMatchSnapshot();
  });

  test("returns initial state when called with initial values", () => {
    localStorage.setItem("access_token", authResult.accessToken);
    localStorage.setItem("access_token_personal", "true");
    const { result } = renderHook(() => useSession(), {
      wrapper: createWrapper(SessionProvider, {
        initialValue: getSessionStateFromLocalStorage(),
      }),
    });

    expect(result.current).toMatchSnapshot();
  });

  test("nulls all values when logout is called", () => {
    const { result } = renderHook(() => useSession(), {
      wrapper: createWrapper(SessionProvider, {}),
    });
    act(() => {
      result.current.login(authResult);
    });
    expect(result.current).toMatchSnapshot();
    act(() => {
      result.current.logout(true);
    });
    expect(localStorage.getItem("access_token")).toBe(null);
    expect(localStorage.getItem("access_token_expires_at")).toBe(null);
    expect(localStorage.getItem("access_token_personal")).toBe(null);
    expect(result.current).toMatchSnapshot();
  });
});
