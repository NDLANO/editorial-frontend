/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { RouteComponentProps } from 'react-router';
import { actions as licenseActions, getAllLicenses } from '../../modules/license/license';
import ImageForm from './components/ImageForm';
import { actions, FlatReduxImage, getImage } from '../../modules/image/image';
import { UpdatedImageMetadata } from '../../modules/image/imageApiInterfaces';
import { License, ReduxState } from '../../interfaces';
import { LocaleContext } from '../App/App';

interface ImageType extends UpdatedImageMetadata {
  revision?: number;
  imageFile?: string | Blob;
}

interface DispatchTypes {
  fetchLicenses: () => void;
  fetchImage: (imageInfo: { id: string; language?: string }) => void;
  updateImage: (imageInfo: {
    image: ImageType;
    file: string | Blob;
    history: RouteComponentProps['history'];
    editingArticle?: boolean;
  }) => void;
}

interface ReduxProps {
  licenses: License[];
  image?: FlatReduxImage;
}

interface BaseProps {
  imageId?: string;
  closeModal?: () => void;
  imageLanguage?: string;
  isSaving?: boolean;
  inModal?: boolean;
  editingArticle?: boolean;
  isNewlyCreated?: boolean;
}

const mapDispatchToProps: DispatchTypes = {
  fetchLicenses: licenseActions.fetchLicenses,
  fetchImage: actions.fetchImage,
  updateImage: actions.updateImage,
};

const mapStateToProps = (state: ReduxState, props: BaseProps): ReduxProps => {
  const { imageId } = props;
  const getImageSelector = getImage(imageId!, true);
  return {
    licenses: getAllLicenses(state),
    image: getImageSelector(state),
  };
};

const reduxConnector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof reduxConnector>;

interface Props extends BaseProps, RouteComponentProps, PropsFromRedux {}

class EditImage extends Component<Props> {
  componentDidMount() {
    const { imageId, fetchImage, imageLanguage, fetchLicenses } = this.props;
    if (imageId) {
      fetchImage({ id: imageId, language: imageLanguage });
    }
    fetchLicenses();
  }

  componentDidUpdate(prevProps: Props) {
    const { imageId: prevImageId } = prevProps;
    const { imageId, fetchImage, imageLanguage, image } = this.props;

    if (
      imageId &&
      imageLanguage &&
      ((image && image.language !== imageLanguage) || imageId !== prevImageId)
    ) {
      fetchImage({ id: imageId, language: imageLanguage });
    }
  }

  render() {
    const {
      history,
      image: imageData,
      updateImage,
      editingArticle,
      closeModal,
      isNewlyCreated,
      ...rest
    } = this.props;

    return (
      <LocaleContext.Consumer>
        {locale => (
          <ImageForm
            isLoading={imageData === undefined}
            image={imageData || { language: locale }}
            onUpdate={(image: UpdatedImageMetadata, file: string | Blob) => {
              updateImage({ image, file, history, editingArticle });
            }}
            closeModal={closeModal}
            isNewlyCreated={isNewlyCreated}
            {...rest}
          />
        )}
      </LocaleContext.Consumer>
    );
  }
}

export default reduxConnector(withRouter(EditImage));
