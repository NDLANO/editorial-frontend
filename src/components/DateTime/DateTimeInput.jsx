import React from 'react';
import PropTypes from 'prop-types';
import Flatpickr from 'flatpickr';
import { Calendar } from 'ndla-icons/editor';
import { Norwegian } from 'flatpickr/dist/l10n/no';
import { english } from 'flatpickr/dist/l10n/default';

import NyNorsk from './NyNorsk';

const FORMAT_PATTERN = 'Y-m-d';

const locales = {
  nb: Norwegian,
  en: english,
  nn: NyNorsk,
};

class DateTimeInput extends React.Component {
  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
    this.getOptions = this.getOptions.bind(this);
  }

  componentDidMount() {
    this.flatpickr = new Flatpickr(this.node, this.getOptions());
    this.setValue();
  }

  componentDidUpdate() {
    this.setValue();
  }

  componentWillUnmount() {
    this.flatpickr.destroy();
  }

  onChange(selectedDates) {
    const value = selectedDates[0] || null;
    if (value && value !== this.props.value) {
      value.setHours(12);
      this.props.onChange(value);
    }
  }

  getOptions() {
    const options = {
      time_24hr: true,
      enableTime: false,
      dateFormat: FORMAT_PATTERN,
      altInput: true,
      locale: locales[this.props.locale],
    };
    options.onChange = [this.onChange];
    return options;
  }

  setValue() {
    const { value } = this.props;
    if (value) {
      this.flatpickr.setDate(value, false);
    }
  }

  render() {
    const { className, value, onChange, ...rest } = this.props;
    return (
      <span>
        <input
          className={className || ''}
          {...rest}
          ref={node => {
            this.node = node;
          }}
        />
        <Calendar />
      </span>
    );
  }
}

DateTimeInput.propTypes = {
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.instanceOf(Date),
  locale: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default DateTimeInput;
