import React, { useEffect, useState } from 'react';
import config from '../../config';
import { LocaleContext } from '../App/App';
import H5PElement from '../../components/H5PElement';
import { HistoryShape } from '../../shapes';

const H5PPage = props => {
  const [height, setHeight] = useState(800);

  useEffect(() => {
    if (typeof window !== undefined) {
      setHeight(window.innerHeight - 85);
    }
  }, []);

  return (
    <LocaleContext.Consumer>
      {locale => (
        <H5PElement
          canReturnResources={false}
          h5pApiUrl={`${config.h5pApiUrl}/select`}
          onSelect={() => {}}
          onClose={() => {
            props.history.goBack();
          }}
          locale={locale}
          height={height}
        />
      )}
    </LocaleContext.Consumer>
  );
};

H5PPage.propTypes = {
  history: HistoryShape,
};

export default H5PPage;
