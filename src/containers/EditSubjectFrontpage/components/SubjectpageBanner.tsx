import React, {FC, Fragment, useEffect, useState} from "react";
import {TranslateType} from "../../../interfaces";
import { injectT } from '@ndla/i18n';
import { FieldHeader } from '@ndla/forms';
import Modal, { ModalHeader, ModalBody, ModalCloseButton } from '@ndla/modal';
import * as api from '../../../modules/image/imageApi';
import {FieldProps, FormikHelpers, FormikValues} from "formik";
import { connect } from 'react-redux';
import ImageSearchAndUploader from '../../../components/ImageSearchAndUploader';
import {
    getUploadedImage,
    getSaving as getSavingImage,
    actions as imageActions,
} from '../../../modules/image/image';
import { getLocale } from '../../../modules/locale/locale';
import {colors} from "@ndla/core";
import Button from '@ndla/button';
import {css} from "@emotion/core";
import { convertFieldWithFallback } from '../../../util/convertFieldWithFallback';
import MetaInformation from '../../../components/MetaInformation';
import { Image } from '../../../interfaces';

const metaImageButtonStyle = css`
  display: block;
  margin: 1%;
  min-width: 7.5rem;
`;

const metaImageDeleteButtonStyle = css`
  display: block;
  margin: 1%;
  min-width: 7.5rem;
  min-height: 2.1rem;
  background-color: #ba292e;
  border: #ba292e;
  :hover {
    background-color: #8f2024;
    border: 0;
  }
  :focus {
    background-color: #8f2024;
    border: 0;
  }
`;

interface Props {
    t: TranslateType;
    field: FieldProps<Image>['field'];
    form: {
        setFieldTouched: FormikHelpers<FormikValues>['setFieldTouched'];
    }
    bannerId: string;
    locale: string;
    isSavingImage: boolean;
}

const mapStateToProps = (state: { locale: string }) => ({
    locale: getLocale(state),
    isSavingImage: getSavingImage(state),
    uploadedImage: getUploadedImage(state),
})

const mapDispatchToProps = {
    clearUploadedImage: imageActions.clearUploadedImage,
};

const SubjectpageBanner: FC<Props> = ({t, field, form, bannerId, locale, isSavingImage}) => {
    const [showImageSelect, setShowImageSelect] = useState(false);
    const [image, setImage] = useState<Image>();

    useEffect(() => {
        onImageFetch();
    }, [])

    const onImageFetch = async () => {
        if (bannerId) {
            const fetchedImage = await api.fetchImage(bannerId, locale);
            setImage(fetchedImage);
        }
    }

    const onImageChange = (image: Image) => {
        onImageSelectClose();
        setImage(image);
        updateFormik(field, image);
    }

    const updateFormik = (formikField: Props['field'], value: Image | undefined) => {
        form.setFieldTouched(formikField.name, true, false);
        formikField.onChange({
            target: {
                name: formikField.name,
                value: value || null,
            },
        });
    };

    const onImageRemove = () => {
        onImageSelectClose();
        setImage(undefined);
        updateFormik(field, undefined);
    }

    const onImageSelectClose = () => {
        form.setFieldTouched(field.name, true, false);
    }

    const onImageSelectOpen = () => {
        setShowImageSelect(true);
    }

    const fetchImage = (id: string) => api.fetchImage(id, locale);
    const imageAction = (
        <Button css={metaImageButtonStyle} onClick={onImageSelectOpen}>
            {t('subjectpageForm.changeBanner')}
        </Button>
    );
    const metaInformationTranslations = {
        title: t('form.metaImage.imageTitle'),
        copyright: t('form.metaImage.copyright'),
    };

    return (
        <>
        <FieldHeader title={t('subjectpageForm.mobileBanner')}/>
            <Modal
                controllable
                isOpen={showImageSelect}
                onClose={onImageSelectClose}
                size="large"
                backgroundColor="white"
                minHeight="90vh">
                {() => (
                    <Fragment>
                        <ModalHeader>
                            <ModalCloseButton
                                title={t('dialog.close')}
                                onClick={onImageSelectClose}
                            />
                        </ModalHeader>
                        <ModalBody>
                            <ImageSearchAndUploader
                                onImageSelect={onImageChange}
                                locale={locale}
                                isSavingImage={isSavingImage}
                                closeModal={onImageSelectClose}
                                fetchImage={fetchImage}
                                searchImages={api.searchImages}
                                onError={api.onError}
                            />
                        </ModalBody>
                    </Fragment>
                )}
            </Modal>
            {image ? (
                <>
                <img
                    src={image.imageUrl}
                    alt={convertFieldWithFallback(image, 'alt', 'banner')}
                    style={{width: 1500, background: colors.brand.primary}}/>
                <MetaInformation
                    title={convertFieldWithFallback(image, 'title', '')}
                    action={imageAction}
                    translations={metaInformationTranslations}
                />
                </>
            ) : (
                <Button onClick={onImageSelectOpen}>
                    {t('subjectpageForm.addBanner')}
                </Button>
            )}
        </>
    )
};

export default connect(mapStateToProps, mapDispatchToProps)(injectT(SubjectpageBanner));