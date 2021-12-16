/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from 'react';
import { act, renderHook } from '@testing-library/react-hooks';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { getSessionStateFromLocalStorage, SessionProvider, useSession } from '../SessionProvider';

const accessToken =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ik9FSTFNVVU0T0RrNU56TTVNekkyTXpaRE9EazFOMFl3UXpkRE1EUXlPRFZDUXpRM1FUSTBNQSJ9.eyJodHRwczovL25kbGEubm8vbmRsYV9pZCI6Im1ObXJ1N1lvU0lqUGVwT3JrTjRNTWhsVSIsImh0dHBzOi8vbmRsYS5uby91c2VyX25hbWUiOiJSdW5lIFN0b3Jsw7hwYSIsImh0dHBzOi8vbmRsYS5uby9jbGllbnRfaWQiOiJXVTBLcjRDRGtyTTB1TDl4WWVGVjRjbDlHYTF2QjNKWSIsImlzcyI6Imh0dHBzOi8vbmRsYS5ldS5hdXRoMC5jb20vIiwic3ViIjoiZ29vZ2xlLW9hdXRoMnwxMDM2OTA4Njg0ODM2ODgzNzU1MzIiLCJhdWQiOiJuZGxhX3N5c3RlbSIsImlhdCI6MTUwOTk3MDAyNywiZXhwIjoxNTA5OTc3MjI3LCJhenAiOiJXVTBLcjRDRGtyTTB1TDl4WWVGVjRjbDlHYTF2QjNKWSIsInNjb3BlIjoiIn0.suhXIGs7ILtdst0NEDOPeuelfG_JZeOXlwlFTXZEgjwBCnI26e4TfrVSluCttbSuE1BJ6FuXKCtO-CjpJD6zCGj9Z00vytiWLfLq7fMYyHDfipPjUMP05H-j5TQVToTE1wLFVKLco3W9yYBWSWCBzv6GLRWWZiuzyXPyUtF2oLv30e7yAeZBA8JK10sl0DfPKrC4B1eSxrTFtvkZ3WnxeDQpvzbvZ1tHQtnF6hoarC7h9qIJFI1W95h88Mq20Ci-5k8RMILRYc1u5H5XW-RAegxI2H0EhWpCo5T4Iglwc2mUTSuetHqnbgPrxapKohcAL_b3_Nkb49CacajRt9TrQQ';

afterEach(() => {
  localStorage.clear();
});

const history = createMemoryHistory();

const baseWrapper = ({ children, initialValues }: { children?: ReactNode; initialValues: any }) => (
  <Router location={history.location} navigator={history}>
    <SessionProvider initialValue={initialValues}>{children}</SessionProvider>
  </Router>
);

describe('getSessionStateFromLocalStorage', () => {
  it('returns a default initial state if token is not available in localStorage', () => {
    localStorage.removeItem('access_token');
    expect(getSessionStateFromLocalStorage()).toMatchSnapshot();
  });

  it('returns a default initial state if accessToken is not personal', () => {
    localStorage.setItem('access_token', accessToken);
    localStorage.removeItem('access_token_personal');
    expect(getSessionStateFromLocalStorage()).toMatchSnapshot();
  });

  it('returns a decoded access token if everything is ok', () => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('access_token_personal', 'true');
    const nextState = getSessionStateFromLocalStorage();

    expect(nextState).toMatchSnapshot();
  });
});

describe('useSession', () => {
  test('correctly sets access token and access_token_personal on successful login', async () => {
    const replaceSpy = jest.spyOn(history, 'replace');
    const expected = { hash: '', pathname: '/', search: '' };
    const { result } = renderHook(() => useSession(), { wrapper: baseWrapper });
    act(() => {
      result.current.login(accessToken);
    });
    expect(replaceSpy).toHaveBeenCalledTimes(1);
    expect(replaceSpy).toHaveBeenCalledWith(expected, undefined);
    expect(localStorage.getItem('access_token')).toEqual(accessToken);
    expect(localStorage.getItem('access_token_personal')).toEqual('true');
  });

  test('returns initial state when called without initial values', () => {
    const { result } = renderHook(() => useSession(), { wrapper: baseWrapper });
    expect(result.current).toMatchSnapshot();
  });

  test('returns initial state when called with initial values', () => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('access_token_personal', 'true');
    const { result } = renderHook(() => useSession(), {
      wrapper: baseWrapper,
      initialProps: {
        initialValues: getSessionStateFromLocalStorage(),
      },
    });

    expect(result.current).toMatchSnapshot();
  });

  test('nulls all values when logout is called', () => {
    const { result } = renderHook(() => useSession(), { wrapper: baseWrapper });
    act(() => {
      result.current.login(accessToken);
    });
    expect(result.current).toMatchSnapshot();
    act(() => {
      result.current.logout(true);
    });
    expect(localStorage.getItem('access_token')).toBe(null);
    expect(localStorage.getItem('access_token_expires_at')).toBe(null);
    expect(localStorage.getItem('access_token_personal')).toBe(null);
    expect(result.current).toMatchSnapshot();
  });
});
