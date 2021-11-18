import { render } from '@testing-library/react';
import React from 'react';
import nock from 'nock';
import { LicenseFunctions, LicensesProvider } from '../LicensesProvider';
import withLicenses from '../withLicenses';
import mockLicenses from './mockLicenses';

interface Props {}

class TestComponent extends React.Component<Props & LicenseFunctions> {
  render() {
    const { licenses } = this.props;

    return <p>{licenses.length}</p>;
  }
}

const TestCompWithLicenses = withLicenses(TestComponent);

describe('withLicenses', () => {
  it('properly injects and updates licenses', async () => {
    nock('http://ndla-api')
      .get('/draft-api/v1/drafts/licenses/')
      .reply(200, mockLicenses);
    const { findByText } = render(
      <LicensesProvider>
        <TestCompWithLicenses />
      </LicensesProvider>,
    );

    expect(await findByText('0')).toBeTruthy();
    expect(await findByText('15')).toBeTruthy();
  });
});
