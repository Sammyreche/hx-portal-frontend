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

import { Box } from '@mui/material'
import { Typography, Tooltips } from 'cx-portal-shared-components'
import { IHashMap } from 'types/MainTypes'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import { useState } from 'react'

const CopyValue = ({ value }: { value: string }) => {
  const [copied, setCopied] = useState<boolean>(false)

  return (
    <Box
      sx={{
        margin: '4px 0',
        cursor: 'pointer',
        display: 'flex',
        color: copied ? '#44aa44' : '#cccccc',
        ':hover': {
          color: copied ? '#44aa44' : '#888888',
        },
      }}
      onClick={async () => {
        await navigator.clipboard.writeText(value)
        setCopied(true)
        setTimeout(() => setCopied(false), 1000)
      }}
    >
      {value}
      <ContentCopyIcon
        sx={{
          marginLeft: '10px',
        }}
      />
    </Box>
  )
}

const ReadOnlyValue = ({
  label,
  tooltipMessage = '',
  value,
  style,
}: {
  label: string
  tooltipMessage?: string
  value: string
  style?: IHashMap<string>
}) => {
  return (
    <div style={style}>
      <div style={{ display: 'flex' }}>
        <Typography
          variant="label3"
          sx={{ textAlign: 'left', marginRight: '10px' }}
        >
          {label}
        </Typography>
        <Tooltips
          additionalStyles={{
            cursor: 'pointer',
            marginTop: '30px !important',
          }}
          tooltipPlacement="top-start"
          tooltipText={tooltipMessage}
        >
          <div>
            <HelpOutlineIcon sx={{ color: '#B6B6B6' }} fontSize={'small'} />
          </div>
        </Tooltips>
      </div>
      <CopyValue value={value} />
    </div>
  )
}

export default ReadOnlyValue
