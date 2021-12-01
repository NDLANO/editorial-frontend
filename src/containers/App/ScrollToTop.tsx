import { Component } from 'react';

class ScrollToTop extends Component {
  componentDidUpdate() {
    window.scrollTo(0, 0);
  }

  render() {
    return null;
  }
}

export default ScrollToTop;
