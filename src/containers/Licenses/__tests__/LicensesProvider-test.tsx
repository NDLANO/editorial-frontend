import nock from 'nock';
import { render } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import React, { ReactNode } from 'react';
import { LicensesProvider, useLicenses } from '../LicensesProvider';
import mockLicenses from './mockLicenses';

const wrapper = ({ children }: { children: ReactNode }) => (
  <LicensesProvider>{children}</LicensesProvider>
);

describe('LicensesProvider', () => {
  test('fetches data when useLicenses is called for the first time', async () => {
    nock('http://ndla-api')
      .get('/draft-api/v1/drafts/licenses/')
      .reply(200, mockLicenses);

    const { result, waitForNextUpdate } = renderHook(() => useLicenses(), { wrapper });
    expect(result.current.licensesLoading).toBe(true);
    await waitForNextUpdate();
    expect(result.current.licensesLoading).toBe(false);
    expect(result.current.licenses).toEqual(mockLicenses);
  });

  test('does not fetch data when useLicenses is called after the first time', async () => {
    const scope = nock('http://ndla-api')
      .get('/draft-api/v1/drafts/licenses/')
      .reply(200, mockLicenses);
    const { result, waitForNextUpdate, rerender } = renderHook(() => useLicenses(), { wrapper });
    await waitForNextUpdate();
    scope.done();
    rerender();
    expect(result.current.licenses).toEqual(mockLicenses);
  });

  const TestComponent = () => {
    const { licenses } = useLicenses();
    return <p>{licenses.length}</p>;
  };

  test('correctly returns licenses to the component that requires it', async () => {
    nock('http://ndla-api')
      .get('/draft-api/v1/drafts/licenses/')
      .reply(200, mockLicenses);

    const { findByText } = render(
      <LicensesProvider>
        <TestComponent />
      </LicensesProvider>,
    );

    expect(await findByText('0')).toBeTruthy();
    expect(await findByText('15')).toBeTruthy();
  });
});
