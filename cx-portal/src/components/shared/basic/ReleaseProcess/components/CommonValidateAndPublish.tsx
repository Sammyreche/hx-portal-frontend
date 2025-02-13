/********************************************************************************
 * Copyright (c) 2021, 2023 Mercedes-Benz Group AG and BMW Group AG
 * Copyright (c) 2021, 2023 Contributors to the Eclipse Foundation
 *
 * See the NOTICE file(s) distributed with this work for additional
 * information regarding copyright ownership.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Apache License, Version 2.0 which is available at
 * https://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 ********************************************************************************/

import {
  Button,
  Card,
  Checkbox,
  IconButton,
  LanguageSwitch,
  LogoGrayData,
  PageNotifications,
  StaticTable,
  Typography,
  TableType,
  CircleProgress,
  CardHorizontal,
} from 'cx-portal-shared-components'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import { Grid, Divider, Box } from '@mui/material'
import { useForm } from 'react-hook-form'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { decrement, increment } from 'features/appManagement/slice'
import {
  ConsentStatusEnum,
  DocumentData,
  DocumentTypeId,
  rolesType,
} from 'features/appManagement/apiSlice'
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined'
import CommonService from 'services/CommonService'
import ReleaseStepHeader from '../components/ReleaseStepHeader'
import { DocumentTypeText } from 'features/apps/apiSlice'
import { download } from 'utils/downloadUtils'
import { AppStatusDataState, UseCaseType } from 'features/appManagement/types'
import { ServiceStatusDataState } from 'features/serviceManagement/types'
import { ReleaseProcessTypes } from 'features/serviceManagement/apiSlice'
import {
  serviceReleaseStepDecrement,
  serviceReleaseStepIncrement,
} from 'features/serviceManagement/slice'
import { useTranslation } from 'react-i18next'
import { uniqueId } from 'lodash'
import { PrivacyPolicyType } from 'features/adminBoard/adminBoardApiSlice'
import { Apartment, Person, LocationOn, Web, Info } from '@mui/icons-material'
import '../../../../pages/AppDetail/components/AppDetailPrivacy/AppDetailPrivacy.scss'
import 'components/styles/document.scss'

export interface DefaultValueType {
  images: Array<string>
  conformityDocumentsDescription: string
  documentsDescription: string
  providerTableData: TableType
  cxTestRuns: []
}
interface CommonValidateAndPublishType {
  stepperHeader: string
  stepperDescription: string
  statusData: AppStatusDataState | ServiceStatusDataState | undefined
  id: string
  fetchDocumentById: (obj: { appId: string; documentId: string }) => any
  showSubmitPage: (val: boolean) => void
  submitData: (id: string) => any
  validateAndPublishItemText?: string
  detailsText: string
  longDescriptionTitleEN: string
  longDescriptionTitleDE: string
  conformityDocument?: string
  documentsTitle: string
  providerInformation: string
  consentTitle: string
  cxTestRunsTitle?: string
  error: { title: string; message: string }
  helpText: string
  submitButton: string
  helpUrl: string
  values: DefaultValueType | any
  type: ReleaseProcessTypes.APP_RELEASE | ReleaseProcessTypes.SERVICE_RELEASE
  serviceTypes?: string
  rolesData?: rolesType[]
}

export default function CommonValidateAndPublish({
  stepperHeader,
  stepperDescription,
  statusData,
  id,
  fetchDocumentById,
  showSubmitPage,
  submitData,
  validateAndPublishItemText,
  detailsText,
  longDescriptionTitleEN,
  longDescriptionTitleDE,
  conformityDocument,
  documentsTitle,
  providerInformation,
  consentTitle,
  cxTestRunsTitle,
  error,
  helpText,
  submitButton,
  values,
  type,
  serviceTypes,
  rolesData,
  helpUrl,
}: CommonValidateAndPublishType) {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [validatePublishNotification, setValidatePublishNotification] =
    useState(false)
  const [cardImage, setCardImage] = useState('')
  const [multipleImages, setMultipleImages] = useState<any[]>([])
  const [defaultValues, setDefaultValues] = useState<DefaultValueType>()
  const [loading, setLoading] = useState<boolean>(false)
  const [cardLanguage, setCardLanguage] = useState<string>('en')

  const fetchImage = useCallback(
    async (documentId: string, documentType: string) => {
      try {
        const response = await fetchDocumentById({
          appId: id,
          documentId,
        }).unwrap()
        const file = response.data
        if (documentType === 'APP_LEADIMAGE') {
          return setCardImage(URL.createObjectURL(file))
        }
      } catch (error) {
        console.error(error, 'ERROR WHILE FETCHING IMAGE')
      }
    },
    [fetchDocumentById, id]
  )

  const {
    handleSubmit,
    formState: { isValid },
    reset,
  } = useForm({
    defaultValues: defaultValues,
    mode: 'onChange',
  })

  useEffect(() => {
    if (
      statusData?.documents?.APP_LEADIMAGE &&
      statusData?.documents?.APP_LEADIMAGE[0].documentId
    ) {
      fetchImage(
        statusData?.documents?.APP_LEADIMAGE[0].documentId,
        'APP_LEADIMAGE'
      )
    }
    if (
      statusData?.documents?.APP_IMAGE &&
      statusData?.documents?.APP_IMAGE[0].documentId
    ) {
      const newPromies = CommonService.fetchLeadPictures(
        statusData?.documents?.APP_IMAGE,
        id
      )
      Promise.all(newPromies).then((result) => {
        setMultipleImages(result.flat())
      })
    }
    setDefaultValues(values)
    reset(values)
  }, [statusData, values, fetchImage, reset, id])

  const handleDownloadFn = async (documentId: string, documentName: string) => {
    try {
      const response = await fetchDocumentById({
        appId: id,
        documentId,
      }).unwrap()

      const fileType = response.headers.get('content-type')
      const file = response.data

      return download(file, fileType, documentName)
    } catch (error) {
      console.error(error, 'ERROR WHILE FETCHING DOCUMENT')
    }
  }

  const onValidatePublishSubmit = async (data: any) => {
    setLoading(true)
    try {
      await submitData(id).unwrap()
      if (type === ReleaseProcessTypes.APP_RELEASE) {
        dispatch(increment())
      } else {
        dispatch(serviceReleaseStepIncrement())
      }
      showSubmitPage(true)
    } catch (error: unknown) {
      setValidatePublishNotification(true)
    }
    setLoading(false)
  }

  const getAppData = (item: string) => {
    if (item === 'language')
      return (
        statusData?.supportedLanguageCodes &&
        statusData?.supportedLanguageCodes.join(', ')
      )
    else if (item === 'useCase')
      return (
        statusData?.useCase &&
        statusData?.useCase?.map((item: UseCaseType) => item.label).join(', ')
      )
    else if (item === 'price') return statusData?.price
  }

  const renderPrivacy = (policy: string) => {
    switch (policy) {
      case PrivacyPolicyType.COMPANY_DATA:
        return <Apartment className="policy-icon" />
      case PrivacyPolicyType.USER_DATA:
        return <Person className="policy-icon" />
      case PrivacyPolicyType.LOCATION:
        return <LocationOn className="policy-icon" />
      case PrivacyPolicyType.BROWSER_HISTORY:
        return <Web className="policy-icon" />
      case PrivacyPolicyType.NONE:
        return <Info className="policy-icon" />
      default:
        return <Apartment className="policy-icon" />
    }
  }

  return (
    <div className="validate-and-publish">
      <ReleaseStepHeader
        title={stepperHeader}
        description={stepperDescription}
      />
      <div className="header-description">
        {type === ReleaseProcessTypes.APP_RELEASE && (
          <Grid container sx={{ mt: 0 }}>
            <Grid
              item
              className={'verify-app-release-card'}
              sx={{ ml: 0, mr: 0 }}
              md={4}
            >
              <Card
                image={{
                  src: cardImage || LogoGrayData,
                }}
                title={statusData?.title || ''}
                subtitle={statusData?.provider}
                description={
                  statusData?.descriptions?.filter(
                    (lang: { languageCode: string }) =>
                      lang.languageCode === cardLanguage
                  )[0]?.shortDescription
                }
                imageSize="normal"
                imageShape="square"
                variant="text-details"
                expandOnHover={false}
                filledBackground={true}
                buttonText={''}
              />
              <div style={{ margin: '35px auto -16px 65px' }}>
                <LanguageSwitch
                  current={cardLanguage}
                  languages={[{ key: 'de' }, { key: 'en' }]}
                  onChange={(lang) => setCardLanguage(lang)}
                />
              </div>
            </Grid>

            <Grid item sx={{ paddingLeft: '71px', marginTop: '22%' }} md={8}>
              {['language', 'useCase', 'price'].map((item, i) => (
                <div
                  style={{ display: 'flex', marginBottom: '5px' }}
                  key={item}
                >
                  <Typography variant="body2">
                    <b>{t(`${validateAndPublishItemText}.${item}`)}</b>
                    {getAppData(item)}
                  </Typography>
                </div>
              ))}
            </Grid>
          </Grid>
        )}
        {type === ReleaseProcessTypes.SERVICE_RELEASE && (
          <CardHorizontal
            borderRadius={6}
            imageAlt="Service Card"
            imagePath={LogoGrayData}
            label={''}
            buttonText=""
            onBtnClick={() => {}}
            title={statusData?.title || ''}
            subTitle={serviceTypes || ''}
            description={''}
            backgroundColor="rgb(224, 225, 226)"
          />
        )}
        <Divider className="verify-validate-form-divider" />
        <Typography variant="h4" sx={{ mb: 4 }}>
          {detailsText}
        </Typography>
        {['longDescriptionEN', 'longDescriptionDE'].map((item, i) => (
          <div key={item}>
            {item === 'longDescriptionEN' ? (
              <Typography
                variant="body2"
                className="form-field"
                style={{ whiteSpace: 'pre-line' }}
              >
                <span style={{ fontWeight: 'bold' }}>
                  {longDescriptionTitleEN}
                </span>
                {
                  statusData?.descriptions?.filter(
                    (lang: { languageCode: string }) =>
                      lang.languageCode === 'en'
                  )[0]?.longDescription
                }
              </Typography>
            ) : (
              <Typography
                variant="body2"
                className="form-field"
                style={{ whiteSpace: 'pre-line' }}
              >
                <span style={{ fontWeight: 'bold' }}>
                  {longDescriptionTitleDE}
                </span>
                {
                  statusData?.descriptions?.filter(
                    (lang: { languageCode: string }) =>
                      lang.languageCode === 'de'
                  )[0]?.longDescription
                }
              </Typography>
            )}
          </div>
        ))}
        {multipleImages && (
          <div style={{ display: 'flex' }}>
            {multipleImages?.map((img: { url: string }, i: number) => {
              return (
                <Box sx={{ margin: '37px auto 0 auto' }} key={img.url}>
                  <img
                    src={img.url}
                    alt={'images'}
                    className="verify-validate-images"
                  />
                </Box>
              )
            })}
          </div>
        )}

        <Divider className="verify-validate-form-divider" />
        {statusData?.privacyPolicies && (
          <>
            <div className="appdetail-privacy" style={{ marginBottom: '0px' }}>
              <div className="privacy-content">
                <Typography variant="h4" sx={{ mb: 4 }}>
                  {t('content.appdetail.privacy.heading')}
                </Typography>
                <Typography variant="body2" className="form-field">
                  {t('content.appdetail.privacy.message')}
                </Typography>
              </div>
              {statusData?.privacyPolicies &&
              statusData?.privacyPolicies.length ? (
                <div className="policies-list" style={{ maxWidth: '600px' }}>
                  {statusData?.privacyPolicies?.map((policy: string) => (
                    <Typography
                      variant="body2"
                      className="policy-name"
                      key={uniqueId(policy)}
                    >
                      {renderPrivacy(policy)}
                      {t(`content.appdetail.privacy.${policy}`)}
                    </Typography>
                  ))}
                </div>
              ) : (
                <Typography variant="body2" className="table-text">
                  {t('content.appdetail.privacy.notSupportedMessage')}
                </Typography>
              )}
            </div>
            <Divider className="verify-validate-form-divider" />
          </>
        )}

        {conformityDocument && (
          <>
            <Typography variant="h4" sx={{ mb: 4 }}>
              {conformityDocument}
            </Typography>
            {defaultValues && (
              <Typography variant="body2" className="form-field">
                {defaultValues.conformityDocumentsDescription}
              </Typography>
            )}
            <ul>
              {statusData?.documents &&
                statusData.documents[
                  DocumentTypeText.CONFORMITY_APPROVAL_BUSINESS_APPS
                ] &&
                statusData.documents[
                  DocumentTypeText.CONFORMITY_APPROVAL_BUSINESS_APPS
                ].map((item: DocumentData) => (
                  <li key={item.documentId} className="document-list">
                    <ArticleOutlinedIcon sx={{ color: '#9c9c9c' }} />
                    <button
                      className="document-button-link"
                      onClick={() =>
                        handleDownloadFn(item.documentId, item.documentName)
                      }
                    >
                      {item.documentName}
                    </button>
                  </li>
                ))}
            </ul>
            <Divider className="verify-validate-form-divider" />
          </>
        )}

        <Typography variant="h4" sx={{ mb: 4 }}>
          {documentsTitle}
        </Typography>
        {defaultValues && (
          <Typography variant="body2" className="form-field">
            {defaultValues.documentsDescription}
          </Typography>
        )}
        {statusData?.documents &&
        Object.keys(statusData.documents)?.length &&
        (statusData?.documents.hasOwnProperty(
          DocumentTypeId.ADDITIONAL_DETAILS
        ) ||
          statusData?.documents.hasOwnProperty(DocumentTypeId.APP_CONTRACT) ||
          statusData?.documents.hasOwnProperty(
            DocumentTypeId.APP_TECHNICAL_INFORMATION
          )) ? (
          Object.keys(statusData.documents).map(
            (item) =>
              (item === DocumentTypeId.ADDITIONAL_DETAILS ||
                item === DocumentTypeId.APP_CONTRACT ||
                item === DocumentTypeId.APP_TECHNICAL_INFORMATION) && (
                <li key={item} className="document-list">
                  <ArticleOutlinedIcon sx={{ color: '#9c9c9c' }} />
                  <button
                    className="document-button-link"
                    onClick={() =>
                      handleDownloadFn(
                        statusData?.documents[item][0]?.documentId,
                        statusData?.documents[item][0]?.documentName
                      )
                    }
                  >
                    {statusData?.documents[item][0]?.documentName}
                  </button>
                </li>
              )
          )
        ) : (
          <Typography variant="caption2" className="not-available">
            {t('global.errors.noDocumentsAvailable')}
          </Typography>
        )}

        {rolesData && (
          <>
            <Divider className="verify-validate-form-divider" />
            <Typography variant="h4" sx={{ mb: 4 }}>
              {t('content.adminboardDetail.roles.heading')}
            </Typography>
            <Typography variant="body2" className="form-field">
              {t('content.adminboardDetail.roles.message')}
            </Typography>
            {rolesData.length > 0 ? (
              <Grid container spacing={2} sx={{ margin: '0px' }}>
                {rolesData?.map((role) => (
                  <Grid item xs={6} key={role.roleId}>
                    <Typography variant="label2">{role.role}</Typography>
                    <Typography variant="body3">{role.description}</Typography>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="caption2" className="not-available">
                {t('global.errors.noRolesAvailable')}
              </Typography>
            )}
          </>
        )}

        <Divider className="verify-validate-form-divider" />
        <Typography variant="h4" sx={{ mb: 4 }}>
          {providerInformation}
        </Typography>
        {defaultValues && (
          <StaticTable
            data={defaultValues.providerTableData}
            horizontal={true}
          />
        )}
        <Divider className="verify-validate-form-divider" />
        <Typography variant="h4" sx={{ mb: 4 }}>
          {consentTitle}
        </Typography>
        <div className="form-field">
          {statusData?.agreements &&
            statusData?.agreements?.map(
              (item: { name: string; consentStatus: ConsentStatusEnum }) => (
                <div key={item.name}>
                  <Checkbox
                    key={item.name}
                    label={item.name}
                    checked={item.consentStatus === ConsentStatusEnum.ACTIVE}
                    disabled
                  />
                </div>
              )
            )}
        </div>

        {cxTestRunsTitle && (
          <>
            <Divider className="verify-validate-form-divider" />
            <Typography variant="h4" sx={{ mb: 4 }}>
              {cxTestRunsTitle}
            </Typography>
            {defaultValues && (
              <div className="form-field">
                {defaultValues.cxTestRuns &&
                  defaultValues.cxTestRuns?.map((item: any, index: number) => (
                    <div key={item.name}>
                      <Checkbox
                        key={item.name}
                        label={item.name}
                        checked={
                          item.consentStatus === ConsentStatusEnum.ACTIVE
                        }
                        disabled
                      />
                    </div>
                  ))}
              </div>
            )}
          </>
        )}
      </div>

      <Box mb={2}>
        {validatePublishNotification && (
          <Grid container xs={12} sx={{ mb: 2 }}>
            <Grid xs={6}></Grid>
            <Grid xs={6}>
              <PageNotifications
                title={error.title}
                description={error.message}
                open
                severity="error"
                onCloseNotification={() =>
                  setValidatePublishNotification(false)
                }
              />
            </Grid>
          </Grid>
        )}

        <Divider sx={{ mb: 2, mr: -2, ml: -2 }} />
        <Button
          startIcon={<HelpOutlineIcon />}
          variant="outlined"
          sx={{ mr: 1 }}
          onClick={() => window.open(helpUrl, '_blank')}
        >
          {helpText}
        </Button>
        <IconButton
          color="secondary"
          onClick={() =>
            type === ReleaseProcessTypes.APP_RELEASE
              ? dispatch(decrement())
              : dispatch(serviceReleaseStepDecrement())
          }
        >
          <KeyboardArrowLeftIcon />
        </IconButton>
        {loading ? (
          <span
            style={{
              float: 'right',
            }}
          >
            <CircleProgress
              size={40}
              step={1}
              interval={0.1}
              colorVariant={'primary'}
              variant={'indeterminate'}
              thickness={8}
            />
          </span>
        ) : (
          <Button
            onClick={handleSubmit(onValidatePublishSubmit)}
            variant="contained"
            disabled={!isValid}
            sx={{ float: 'right' }}
          >
            {submitButton}
          </Button>
        )}
      </Box>
    </div>
  )
}
