import React from 'react';
import PropTypes from 'prop-types';
import Flatpickr from 'flatpickr';
import { no, en } from 'flatpickr/dist/l10n';
import { Calendar } from 'ndla-icons/editor';
import NyNorsk from './NyNorsk';

const FORMAT_PATTERN = 'Y-m-d';

const locales = {
  nb: no,
  en,
  nn: NyNorsk,
};

class DateTimeInput extends React.Component {
  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
    this.getOptions = this.getOptions.bind(this);
  }
  componentDidMount() {
    const options = this.getOptions();
    this.flatpickr = new Flatpickr(this.node, options);
    this.setValue(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.setValue(nextProps);

    const options = this.getOptions(nextProps);
    this.flatpickr.set(options);
  }

  componentWillUnmount() {
    this.flatpickr.destroy();
  }

  // Flatpickr passes an array, even for single value inputs
  onChange(selectedDates, dateStr) {
    const value = selectedDates[0] || null;
    // Handles an issue where we got in an eternal loop if value was null
    // because the setting of options in componentWillReceiveProps would trigger
    // onChange
    if (value !== this.props.value) {
      this.props.onChange(`${dateStr}T00:00:00Z`);
    }
  }

  // Add our own onChange handler as a hook
  getOptions() {
    // const { options } = props;
    const options = {
      time_24hr: true,
      enableTime: false,
      dateFormat: FORMAT_PATTERN,
      altInput: true,
      locale: locales[this.props.locale],
      defaultHour: 0,
      defaultMinute: 0,
    };
    // The hook handlers apparently needs be set as an array...?
    options.onChange = [this.onChange];
    return options;
  }

  setValue(props) {
    if ('value' in props) {
      // The second parameter here makes sure we don't trigger the onChange
      this.flatpickr.setDate(props.value, false);
    }
  }

  render() {
    // Important we don't pass value and onChange here. Handled in lifecycle methods
    const { className, value, onChange, ...props } = this.props;
    // Cheekily add the CSS needed to render Flatpickr
    // Have to update the css link everytime we upgrade Flatpickr though :/
    return (
      <span>
        <input
          className={className || ''}
          {...props}
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
  value: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default DateTimeInput;
