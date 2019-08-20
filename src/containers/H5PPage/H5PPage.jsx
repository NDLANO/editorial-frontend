import React from 'react';
import config from '../../config';
import H5PElement from '../../components/H5PElement';

const H5PPage = props => {
  return <H5PElement h5pApiUrl={`${config.h5pApiUrl}/select`} />;
};

H5PPage.propTypes = {};

export default H5PPage;
