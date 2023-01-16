/********************************************************************************
 * Copyright (c) 2021,2022 Mercedes-Benz Group AG and BMW Group AG
 * Copyright (c) 2021,2022 Contributors to the Eclipse Foundation
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

import { Box } from '@mui/material'
import { Typography } from '../../Typography'
import { ProviderProps } from '../StaticTypes'

export default function TextCenterAlignedBody2({
  provider,
}: {
  provider: ProviderProps
}) {
  return (
    <Box
      sx={{
        textAlign: 'center',
        margin: '40px',
      }}
    >
      <Box>
        <Typography
          sx={{
            padding: '20px',
          }}
          variant="body2"
        >
          {provider.subTitle1}
        </Typography>
        <Typography
          sx={{
            padding: '20px',
          }}
          variant="body2"
        >
          {provider.subTitle2}
        </Typography>
        <Typography
          sx={{
            padding: '20px',
          }}
          variant="body2"
        >
          {provider.subTitle3}
        </Typography>
      </Box>
    </Box>
  )
}
