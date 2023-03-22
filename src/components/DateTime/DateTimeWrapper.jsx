import { Component } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import Flatpickr from 'flatpickr';
import { Norwegian } from 'flatpickr/dist/l10n/no';
import { english } from 'flatpickr/dist/l10n/default';
import NyNorsk from './NyNorsk';

const FORMAT_PATTERN = 'd/m/Y';

const locales = {
  nb: Norwegian,
  en: english,
  nn: NyNorsk,
};

class DateTimeWrapper extends Component {
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
    const { value, onChange } = this.props;
    const selectedDateValue = selectedDates[0] || null;
    if (selectedDateValue && selectedDateValue !== value) {
      selectedDateValue.setHours(12);
      onChange(selectedDateValue.toISOString().split('.').shift() + 'Z');
    }
  }

  getOptions() {
    const { time_24hr, enableTime, dateFormat, i18n } = this.props;
    const locale = i18n.language;

    const options = {
      time_24hr,
      enableTime,
      dateFormat,
      locale: locales[locale],
    };
    options.onChange = [this.onChange];
    return options;
  }

  setValue() {
    const { value } = this.props;
    if (value) {
      this.flatpickr.setDate(new Date(value), false);
    }
  }

  render() {
    const { className, value, onChange, name, placeholder, children } = this.props;
    return (
      <span
        className={className || ''}
        onChange={onChange}
        value={value}
        name={name}
        placeholder={placeholder}
        ref={(node) => {
          this.node = node;
        }}
      >
        {children}
      </span>
    );
  }
}

DateTimeWrapper.propTypes = {
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  i18n: PropTypes.shape({
    language: PropTypes.string.isRequired,
  }).isRequired,
  className: PropTypes.string,
  name: PropTypes.string.isRequired,
  time_24hr: PropTypes.bool,
  enableTime: PropTypes.bool,
  dateFormat: PropTypes.string,
};

DateTimeWrapper.defaultProps = {
  time_24hr: true,
  enableTime: false,
  dateFormat: FORMAT_PATTERN,
};

export default withTranslation()(DateTimeWrapper);
