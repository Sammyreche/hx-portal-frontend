import { Box, TextField, Grid, Button } from '@mui/material'

import { ComponentStory } from '@storybook/react'
import { CardHorizontalTable as Component } from '.'

export default {
  title: 'Card Table',
  component: Component,
}

const SampleAccordianBody = () => {
  return (
    <Box p={3}>
      <Grid container spacing={5}>
        <Grid item md={6}>
          <TextField
            variant="standard"
            fullWidth
            label="Alias"
            value={'{alias}'}
          />
        </Grid>
        <Grid item md={6}>
          <TextField
            variant="standard"
            fullWidth
            label="Display Name"
            value={'{displayname}'}
          />
        </Grid>
        <Grid item md={12}>
          <TextField
            variant="standard"
            label="Auth Type"
            value={'{auth type, OUDC or SAML}'}
          />
        </Grid>
        <Grid item md={12}>
          <TextField
            label="Authorization URL"
            variant="standard"
            fullWidth
            value={'{authorization URL}'}
          />
        </Grid>
        <Grid item md={12}>
          <TextField
            label="Auth Method"
            variant="standard"
            fullWidth
            value={'{authmethod}'}
          />
        </Grid>
        <Grid item md={12}>
          <Button variant="contained">Save</Button>
        </Grid>
      </Grid>
    </Box>
  )
}

const menuItems = [
  { key: 'name', label: 'Catena X' },
  { key: 'name1', label: 'Catena X' },
]

const SAMPLE_ROW = [
  {
    identityProviderId: 1,
    identityProviderCategoryId: 'Keyclock Shared',
    displayName: 'SAP',
    enabled: true,
    body: <SampleAccordianBody />,
  },
  {
    identityProviderId: 2,
    identityProviderCategoryId: 'OIDC',
    displayName: 'SAP Comp.',
    enabled: false,
    body: <SampleAccordianBody />,
  },
]

const Template: ComponentStory<typeof Component> = (args: any) => (
  <Component {...args}></Component>
)

export const CardTable = Template.bind({})
CardTable.args = {
  hover: true,
  data: {
    identityProviderCategoryId: 'categoryId',
    displayName: 'Deep',
    enabled: true,
    identityProviderId: '9069378354',
    body: <SampleAccordianBody />,
    menuOptions: menuItems,
  },
  onMenuClick: (key) => console.log(key),
  activeLabel: 'ACTIVE',
  inactiveLabel: 'INACTIVE',
}
