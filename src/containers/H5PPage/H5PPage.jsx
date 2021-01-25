import React from 'react';
import config from '../../config';
import { LocaleContext } from '../App/App';
import H5PElement from '../../components/H5PElement';

const H5PPage = props => {
  return (
    <LocaleContext.Consumer>
      {locale => (
        <H5PElement h5pApiUrl={`${config.h5pApiUrl}/select`} onSelect={() => {}} locale={locale} />
      )}
    </LocaleContext.Consumer>
  );
};

H5PPage.propTypes = {};

export default H5PPage;
