import { fireEvent, getByText, render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Router } from 'react-router-dom';
import { SessionProps, SessionProvider } from '../SessionProvider';
import withSession from '../withSession';

interface BaseProps {}

type Props = BaseProps & SessionProps;

const accessToken =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ik9FSTFNVVU0T0RrNU56TTVNekkyTXpaRE9EazFOMFl3UXpkRE1EUXlPRFZDUXpRM1FUSTBNQSJ9.eyJodHRwczovL25kbGEubm8vbmRsYV9pZCI6Im1ObXJ1N1lvU0lqUGVwT3JrTjRNTWhsVSIsImh0dHBzOi8vbmRsYS5uby91c2VyX25hbWUiOiJSdW5lIFN0b3Jsw7hwYSIsImh0dHBzOi8vbmRsYS5uby9jbGllbnRfaWQiOiJXVTBLcjRDRGtyTTB1TDl4WWVGVjRjbDlHYTF2QjNKWSIsImlzcyI6Imh0dHBzOi8vbmRsYS5ldS5hdXRoMC5jb20vIiwic3ViIjoiZ29vZ2xlLW9hdXRoMnwxMDM2OTA4Njg0ODM2ODgzNzU1MzIiLCJhdWQiOiJuZGxhX3N5c3RlbSIsImlhdCI6MTUwOTk3MDAyNywiZXhwIjoxNTA5OTc3MjI3LCJhenAiOiJXVTBLcjRDRGtyTTB1TDl4WWVGVjRjbDlHYTF2QjNKWSIsInNjb3BlIjoiIn0.suhXIGs7ILtdst0NEDOPeuelfG_JZeOXlwlFTXZEgjwBCnI26e4TfrVSluCttbSuE1BJ6FuXKCtO-CjpJD6zCGj9Z00vytiWLfLq7fMYyHDfipPjUMP05H-j5TQVToTE1wLFVKLco3W9yYBWSWCBzv6GLRWWZiuzyXPyUtF2oLv30e7yAeZBA8JK10sl0DfPKrC4B1eSxrTFtvkZ3WnxeDQpvzbvZ1tHQtnF6hoarC7h9qIJFI1W95h88Mq20Ci-5k8RMILRYc1u5H5XW-RAegxI2H0EhWpCo5T4Iglwc2mUTSuetHqnbgPrxapKohcAL_b3_Nkb49CacajRt9TrQQ';

class TestComponent extends React.Component<Props> {
  render() {
    const { userName, login } = this.props;

    return (
      <>
        <button onClick={() => login(accessToken)}>Click</button>
        <p>{userName ?? 'test'}</p>
      </>
    );
  }
}

const TestComponentWithSession = withSession(TestComponent);

describe('withSession', () => {
  it('correctly injects and updates session state', async () => {
    const history = createMemoryHistory();
    const { container } = render(
      <Router history={history}>
        <SessionProvider>
          <TestComponentWithSession />
        </SessionProvider>
      </Router>,
    );
    expect(container).toMatchSnapshot();
    fireEvent.click(getByText(container, 'Click'));
    expect(container).toMatchSnapshot();
  });
});
