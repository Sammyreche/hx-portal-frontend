/********************************************************************************
 * Copyright (c) 2021, 2023 BMW Group AG
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

import { useTranslation } from 'react-i18next'
import { PageBreadcrumb } from 'components/shared/frame/PageBreadcrumb/PageBreadcrumb'
import { PageHeader } from 'cx-portal-shared-components'
import { useFetchProvidedAppsQuery } from 'features/apps/apiSlice'
import NoItems from '../NoItems'
import { AppOverviewList } from '../AppOverview/AppOverviewList'
import { appToCard } from 'features/apps/mapper'

export default function AppOverviewNew() {
  const { t } = useTranslation()
  const { data } = useFetchProvidedAppsQuery()

  console.log('data', data)

  return (
    <main>
      <PageHeader
        title={t('content.appoverview.headerTitle')}
        topPage={true}
        headerHeight={200}
      >
        <PageBreadcrumb backButtonVariant="contained" />
      </PageHeader>
      <section>
        {data && data.length > 0 ? (
          <AppOverviewList
            filterItem={data.map((item) => appToCard(item))}
            showOverlay={() => {}}
          />
        ) : (
          <NoItems />
        )}
      </section>
    </main>
  )
}
