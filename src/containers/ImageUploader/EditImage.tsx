/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withTranslation, WithTranslation } from 'react-i18next';

import { RouteComponentProps } from 'react-router';
import ImageForm from './components/ImageForm';
import { actions, FlatReduxImage, getImage } from '../../modules/image/image';
import { UpdatedImageMetadata } from '../../modules/image/imageApiInterfaces';
import { ReduxState } from '../../interfaces';
import withLicenses from '../Licenses/withLicenses';
import { LicenseFunctions } from '../Licenses/LicensesProvider';

interface ImageType extends UpdatedImageMetadata {
  revision?: number;
  imageFile?: string | Blob;
}

interface DispatchTypes {
  fetchImage: (imageInfo: { id: string; language?: string }) => void;
  updateImage: (imageInfo: {
    image: ImageType;
    file: string | Blob;
    history: RouteComponentProps['history'];
    editingArticle?: boolean;
  }) => void;
}

interface ReduxProps {
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
  fetchImage: actions.fetchImage,
  updateImage: actions.updateImage,
};

const mapStateToProps = (state: ReduxState, props: BaseProps): ReduxProps => {
  const { imageId } = props;
  const getImageSelector = getImage(imageId!, true);
  return {
    image: getImageSelector(state),
  };
};

const reduxConnector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof reduxConnector>;

interface Props extends BaseProps, RouteComponentProps, PropsFromRedux, WithTranslation {}

class EditImage extends Component<Props & LicenseFunctions> {
  componentDidMount() {
    const { imageId, fetchImage, imageLanguage } = this.props;
    if (imageId) {
      fetchImage({ id: imageId, language: imageLanguage });
    }
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
      licenses,
      ...rest
    } = this.props;

    return (
      <ImageForm
        isLoading={false}
        image={imageData || { language: this.props.i18n.language }}
        onUpdate={(image: UpdatedImageMetadata, file: string | Blob) => {
          updateImage({ image, file, history, editingArticle });
        }}
        closeModal={closeModal}
        isNewlyCreated={isNewlyCreated}
        licenses={licenses}
        {...rest}
      />
    );
  }
}

export default reduxConnector(withTranslation()(withRouter(withLicenses(EditImage))));
