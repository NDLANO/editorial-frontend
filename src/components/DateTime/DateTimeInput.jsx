import { Component } from 'react';
import PropTypes from 'prop-types';
import Flatpickr from 'flatpickr';
import { Calendar } from '@ndla/icons/editor';
import { Norwegian } from 'flatpickr/dist/l10n/no';
import { english } from 'flatpickr/dist/l10n/default';
import styled from '@emotion/styled';
import { colors } from '@ndla/core';
import NyNorsk from './NyNorsk';

const FORMAT_PATTERN = 'd/m/Y';

const locales = {
  nb: Norwegian,
  en: english,
  nn: NyNorsk,
};

const StyledCalendarIcon = styled(Calendar)`
  margin-left: -1.7rem;
  margin-top: -2px;
  height: 100%;
  width: 25px;
  fill: ${colors.brand.tertiary};
  pointer-events: none;
`;

const StyledDateTimeInput = styled.div`
  width: 100%;
`;

class DateTimeInput extends Component {
  constructor(props) {
    super(props);
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
    const { value, onChange, name } = this.props;
    const selectedDateValue = selectedDates[0] || null;
    if (selectedDateValue && selectedDateValue !== value) {
      selectedDateValue.setHours(12);
      onChange({
        target: {
          name,
          value:
            selectedDateValue
              .toISOString()
              .split('.')
              .shift() + 'Z',
          type: 'DateTime',
        },
      });
    }
  }

  getOptions() {
    const { time_24hr, enableTime, dateFormat, locale } = this.props;

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
    const { className, value, onChange, name, placeholder } = this.props;
    return (
      <StyledDateTimeInput>
        <input
          className={className || ''}
          onChange={onChange}
          value={value}
          name={name}
          placeholder={placeholder}
          ref={node => {
            this.node = node;
          }}
        />
        <StyledCalendarIcon />
      </StyledDateTimeInput>
    );
  }
}

DateTimeInput.propTypes = {
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  locale: PropTypes.string.isRequired,
  className: PropTypes.string,
  name: PropTypes.string.isRequired,
  time_24hr: PropTypes.bool,
  enableTime: PropTypes.bool,
  dateFormat: PropTypes.string,
};

DateTimeInput.defaultProps = {
  time_24hr: true,
  enableTime: false,
  dateFormat: FORMAT_PATTERN,
};

export default DateTimeInput;
