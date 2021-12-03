import { act, fireEvent, render } from '@testing-library/react';
import { Component } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { MessagesFunctions, MessagesProvider } from '../MessagesProvider';
import withMessages from '../withMessages';

interface BaseProps {}
type Props = BaseProps & MessagesFunctions;

class TestComponent extends Component<Props> {
  render() {
    const { messages, createMessage } = this.props;
    return (
      <>
        <button onClick={() => createMessage({ message: 'test' })}>Click</button>
        {messages.map(m => (
          <div key={m.id}>{m.message}</div>
        ))}
      </>
    );
  }
}

const TestComponentWithMessages = withMessages(TestComponent);

describe('withMessages', () => {
  it('correctly injects and updates messages state', async () => {
    const { container, findByText } = render(
      <MemoryRouter>
        <MessagesProvider>
          <TestComponentWithMessages />
        </MessagesProvider>
      </MemoryRouter>,
    );

    expect(container).toMatchSnapshot();
    const btn = await findByText('Click');
    act(() => {
      fireEvent.click(btn);
    });
    expect(container).toMatchSnapshot();
  });
});
