import { useState, useEffect, ChangeEvent, useMemo, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import partnerNetworkSlice, {
  partnerNetworkSelector,
} from 'features/partnerNetwork/slice'
import {
  fetchBusinessPartners,
  getOneBusinessPartner,
} from 'features/partnerNetwork/actions'
import { Table, Button, PageHeader } from 'cx-portal-shared-components'
import 'components/pages/PartnerNetwork/PartnerNetwork.scss'
import { useTranslation } from 'react-i18next'
import { PartnerNetworksTableColumns } from 'components/pages/PartnerNetwork/partnerNetworkTableColumns'
import PartnerNetworkSearchForm from './components/PartnerNetworkSearchForm'
import BusinessPartnerDetailOverlay from './BusinessPartnerDetailOverlay'
import { GridCellParams } from '@mui/x-data-grid'
import { PartnerNetworkDataGrid } from 'features/partnerNetwork/types'
import Patterns from 'types/Patterns'
import uniqueId from 'lodash/uniqueId'
import debounce from 'lodash.debounce'

// fucntion to check whether the text matched only letters, spaces, "!", "?", "&", "@", ".", "_", "-" and numbers
const validateSearchText = (text: string): boolean =>
  /^[a-zA-ZÀ-ÿ0-9 !?@&_\-.]*$/.test(text)

// function to check whether the text matches the BPN pattern
const checkIfBPNLNumber = (text: string): boolean =>
  Patterns.BPN.test(text.trim())

const PartnerNetwork = () => {
  const { t } = useTranslation()
  const columns = PartnerNetworksTableColumns(useTranslation)
  const dispatch = useDispatch()
  const [searchText, setSearchText] = useState<string>('')
  const [searchError, setSearchError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [pageSize] = useState<number>(100)
  const [overlayOpen, setOverlayOpen] = useState<boolean>(false)
  const [selectedBPN, setSelectedBPN] = useState<PartnerNetworkDataGrid>(
    {} as PartnerNetworkDataGrid
  )
  const { mappedPartnerList, loading, paginationData } = useSelector(
    partnerNetworkSelector
  )

  useEffect(() => {
    const params = {
      ...{ size: pageSize, page: currentPage },
    }
    dispatch(fetchBusinessPartners({ params }))
  }, [currentPage, dispatch, pageSize])

  // Reset store data when page init
  useEffect(() => {
    dispatch(partnerNetworkSlice.actions.resetPartnerNetworkState())
  }, [dispatch])

  const onSearchTextChange = (e: ChangeEvent) => {
    const inputElem = e.target as HTMLInputElement
    setSearchText(inputElem.value)

    const isValidText = validateSearchText(inputElem.value)

    if (isValidText) {
      setSearchError(null)
      return debounceSearch(inputElem.value)
    } else {
      return setSearchError(t('content.partnernetwork.searchfielderrormessage'))
    }
  }

  const onSearchClick = useCallback(
    (searchText: string) => {
      // Reset previous data set before loading search results
      dispatch(partnerNetworkSlice.actions.resetPartnerNetworkState())

      // There is two different endpoint for BPN search and for the field search
      // Detect which api call to make a request
      if (searchText !== '' && checkIfBPNLNumber(searchText)) {
        dispatch(getOneBusinessPartner({ bpn: searchText }))
      }
      // Reset current page to default everytime user search some term
      else {
        const params = {
          ...{ size: pageSize, page: 0 },
          ...(searchText !== '' && { name: searchText }),
        }
        dispatch(
          fetchBusinessPartners({
            params,
          })
        )
      }
    },
    [dispatch, pageSize]
  )

  const debounceSearch = useMemo(
    () =>
      debounce((args: string) => {
        onSearchClick(args)
      }, 2000),
    [onSearchClick]
  )
  const onTableCellClick = (params: GridCellParams) => {
    // Show overlay only when detail field clicked
    if (params.field === 'detail') {
      setSelectedBPN(params.row as PartnerNetworkDataGrid)
      setOverlayOpen(true)
    }
  }

  return (
    <main className="partner-network-page-container">
      <BusinessPartnerDetailOverlay
        {...{
          selectedRowBPN: selectedBPN,
          openDialog: overlayOpen,
          handleOverlayClose: () => setOverlayOpen(false),
        }}
      />
      <PageHeader
        title={t('content.partnernetwork.headertitle')}
        topPage={false}
        headerHeight={200}
      ></PageHeader>

      <PartnerNetworkSearchForm
        {...{
          searchText,
          onSearchTextChange,
          searchError,
        }}
      />
      <div className="partner-network-table-container">
        <Table
          {...{
            rows: mappedPartnerList,
            rowsCount: paginationData.totalElements,
            columns: columns,
            title: t('content.partnernetwork.tabletitle'),
            rowHeight: 75,
            hideFooter: true,
            disableColumnFilter: true,
            disableColumnMenu: true,
            disableColumnSelector: true,
            disableDensitySelector: true,
            disableSelectionOnClick: true,
            onCellClick: (params: GridCellParams) => onTableCellClick(params),
            toolbarVariant: 'premium',
            toolbar: {
              onFilter: () => {},
              filter: [
                {
                  name: 'country',
                  values: [
                    {
                      value: 'DE',
                      label: t('content.partnernetwork.filters.germany'),
                    },
                    {
                      value: 'Others',
                      label: t('content.partnernetwork.filters.others'),
                    },
                  ],
                },
              ],
            },
            loading,
          }}
          getRowId={(row) => uniqueId(row.bpn)}
        />
      </div>
      <div className="load-more-button-container">
        {paginationData.totalElements > pageSize * currentPage &&
          paginationData.totalElements! > pageSize && (
            <Button
              size="medium"
              onClick={() => setCurrentPage((prevState) => prevState + 1)}
            >
              {t('content.partnernetwork.loadmore')}
            </Button>
          )}
      </div>
    </main>
  )
}

export default PartnerNetwork
