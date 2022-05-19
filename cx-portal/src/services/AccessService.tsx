import React from 'react'
import Admin from 'components/pages/Admin'
import RegistrationRequests from 'components/pages/Admin/components/RegistrationRequests'
import EdcConnector from 'components/pages/EdcConnector'
import Connector from 'components/pages/Connector'
import DataCatalog from 'components/pages/DataCatalog'
import DeveloperHub from 'components/pages/DeveloperHub'
import DigitalTwins from 'components/pages/DigitalTwins'
import Logout from 'components/pages/Logout'
import MyAccount from 'components/pages/MyAccount'
import NotificationCenter from 'components/pages/NotificationCenter'
import Organization from 'components/pages/Organization'
import PartnerNetwork from 'components/pages/PartnerNetwork'
import SemanticHub from 'components/pages/SemanticHub'
import Translator from 'components/pages/Translator'
import UserManagement from 'components/pages/UserManagement'
import UserDetails from '../components/pages/UserManagement/UserDetails'
import AppUserDetails from 'components/pages/UserManagement/AppUserDetails'
import { IPage, PAGES, ROLES } from 'types/MainTypes'
import UserService from './UserService'
import { Route } from 'react-router-dom'
import Help from 'components/pages/Help'
import Contact from 'components/pages/Contact'
import Imprint from 'components/pages/Imprint'
import Privacy from 'components/pages/Privacy'
import Terms from 'components/pages/Terms'
import CookiePolicy from 'components/pages/CookiePolicy'
import ThirdPartyLicenses from 'components/pages/ThirdPartyLicenses'
import InviteBusinessPartner from 'components/pages/InviteBusinessPartner'
import AppMarketplace from 'components/pages/AppMarketplace'
import Home from 'components/pages/Home'
import Registration from 'components/pages/Registration'
import AppDetail from 'components/pages/AppDetail'
import Appstore from 'components/pages/Appstore'
import AppstoreDetail from 'components/pages/Appstore/components/AppstoreDetail'

/**
 * ALL_PAGES
 *
 * this is the main application config table. Each entry has at least:
 * name - name of the page used as application route (without leading '/')
 * role - role required to access this page on the front end
 * element - either a JSX Element that renders the page or a custom router setup
 *           for that page. By default it will create a simple route name -> element
 */
const ALL_PAGES: IPage[] = [
  { name: PAGES.ROOT, element: <Home /> },
  { name: PAGES.HOME, element: <Home /> },
  { name: PAGES.REGISTRATION, element: <Registration /> },
  {
    name: PAGES.APPSTORE,
    role: ROLES.APPSTORE_VIEW,
    isRoute: true,
    element: (
      <Route key={PAGES.APPSTORE} path={PAGES.APPSTORE} element={<Appstore />}>
        <Route index element={<></>} />
        <Route path=":appId" element={<AppstoreDetail />} />
      </Route>
    ),
  },
  {
    name: PAGES.APP_MARKETPLACE,
    role: ROLES.APPSTORE_VIEW,
    element: <AppMarketplace />,
  },
  {
    name: PAGES.APP_DETAIL,
    role: ROLES.APPSTORE_VIEW,
    isRoute: true,
    element: (
      <Route
        key={PAGES.APP_DETAIL}
        path={PAGES.APP_DETAIL}
        element={<AppDetail />}
      >
        <Route index element={<></>} />
        <Route path=":appId" element={<AppDetail />} />
      </Route>
    ),
  },
  {
    name: PAGES.DATACATALOG,
    role: ROLES.DATACATALOG_VIEW,
    element: <DataCatalog />,
  },
  {
    name: PAGES.DIGITALTWIN,
    role: ROLES.DIGITALTWIN_VIEW,
    element: <DigitalTwins />,
  },
  {
    name: PAGES.SEMANTICHUB,
    role: ROLES.SEMANTICHUB_VIEW,
    element: <SemanticHub />,
  },
  {
    name: PAGES.DEVELOPERHUB,
    role: ROLES.DEVELOPER,
    element: <DeveloperHub />,
  },
  {
    name: PAGES.CONNECTOR,
    role: ROLES.CONNECTOR_SETUP,
    element: <Connector />,
  },
  { name: PAGES.ACCOUNT, element: <MyAccount /> },
  {
    name: PAGES.NOTIFICATIONS,
    element: <NotificationCenter />,
  },
  {
    name: PAGES.ORGANIZATION,
    role: ROLES.ORGANIZATION_VIEW,
    element: <Organization />,
  },
  {
    name: PAGES.PARTNER_NETWORK,
    role: ROLES.PARTNER_NETWORK_VIEW,
    element: <PartnerNetwork />,
  },
  {
    name: PAGES.USER_MANAGEMENT,
    role: ROLES.USERMANAGEMENT_VIEW,
    element: <UserManagement />,
  },
  {
    name: PAGES.USER_DETAILS,
    role: ROLES.USERMANAGEMENT_VIEW_USER_ACCOUNT,
    // role: ROLES.USERMANAGEMENT_VIEW,
    isRoute: true,
    element: (
      <Route
        key={PAGES.USER_DETAILS}
        path={`${PAGES.USER_MANAGEMENT}/${PAGES.USER_DETAILS}`}
        element={<UserDetails />}
      >
        <Route path=":appId" element={<UserDetails />} />
      </Route>
    ),
  },
  {
    name: PAGES.APP_USER_DETAILS,
    role: ROLES.USERMANAGEMENT_VIEW,
    isRoute: true,
    element: (
      <Route
        key={PAGES.APP_USER_DETAILS}
        path={`${PAGES.USER_MANAGEMENT}/${PAGES.APP_USER_DETAILS}`}
        element={<AppUserDetails />}
      >
        <Route path=":appId" element={<AppUserDetails />} />
      </Route>
    ),
  },
  {
    name: PAGES.INVITE,
    role: ROLES.INVITE_NEW_PARTNER,
    element: <InviteBusinessPartner />,
  },
  { name: PAGES.ADMINISTRATION, role: ROLES.CX_ADMIN, element: <Admin /> },
  {
    name: PAGES.REGISTRATION_REQUESTS,
    role: ROLES.CX_ADMIN,
    element: <RegistrationRequests />,
  },
  {
    name: PAGES.TRANSLATOR,
    role: ROLES.CX_ADMIN,
    element: <Translator />,
  },
  { name: PAGES.HELP, element: <Help /> },
  { name: PAGES.CONTACT, element: <Contact /> },
  { name: PAGES.IMPRINT, element: <Imprint /> },
  { name: PAGES.PRIVACY, element: <Privacy /> },
  { name: PAGES.TERMS, element: <Terms /> },
  { name: PAGES.COOKIE_POLICY, element: <CookiePolicy /> },
  { name: PAGES.THIRD_PARTY_LICENSES, element: <ThirdPartyLicenses /> },
  {
    name: PAGES.EDC_CONNECTOR,
    role: ROLES.TECHNICAL_SETUP_VIEW,
    element: <EdcConnector />,
  },
  { name: PAGES.LOGOUT, element: <Logout /> },
]

/**
 * mainMenuFull
 *
 * lists all the entries that are visible in the main menu for a user with maximum permissions.
 * it will be restricted by personal user permissions
 */
const mainMenuFull = [
  PAGES.HOME,
  PAGES.APP_MARKETPLACE,
  PAGES.DATACATALOG,
  PAGES.DIGITALTWIN,
  PAGES.SEMANTICHUB,
  PAGES.DEVELOPERHUB,
  PAGES.CONNECTOR,
]

/**
 * userMenuFull
 *
 * lists all the entries that are visible in the user menu for a user with maximum permissions
 * it will be restricted by personal user permissions
 */
const userMenuFull = [
  PAGES.ACCOUNT,
  PAGES.NOTIFICATIONS,
  PAGES.ORGANIZATION,
  PAGES.PARTNER_NETWORK,
  PAGES.USER_MANAGEMENT,
  PAGES.INVITE,
  PAGES.ADMINISTRATION,
  PAGES.REGISTRATION_REQUESTS,
  PAGES.EDC_CONNECTOR,
  PAGES.LOGOUT,
]

/**
 * footerMenuFull
 *
 * lists all the entries that are visible in the footer menu for a user with maximum permissions.
 * it will be restricted by personal user permissions
 */
const footerMenuFull = [
  PAGES.HELP,
  PAGES.CONTACT,
  PAGES.IMPRINT,
  PAGES.PRIVACY,
  PAGES.TERMS,
  PAGES.COOKIE_POLICY,
  PAGES.THIRD_PARTY_LICENSES,
]

let pageMap: { [page: string]: IPage }

const hasAccess = (page: string): boolean => {
  const fullPage = pageMap[page]
  if (!fullPage) return false // page doesn't exist
  const role = fullPage.role
  if (!role) return true // no permission required for this page
  return UserService.hasRole(role) // check if user has the required permission
}

const accessToMenu = (menu: string[]) =>
  menu.filter((page: string) => hasAccess(page))

const mainMenu = () => accessToMenu(mainMenuFull)

const userMenu = () => accessToMenu(userMenuFull)

const footerMenu = () => accessToMenu(footerMenuFull)

const permittedRoutes = () =>
  ALL_PAGES.filter((page: IPage) => hasAccess(page.name)).map((p) => p.element)

function init() {
  // from the list of pages set up a map for easier access and create default routes
  pageMap = ALL_PAGES.reduce((map: { [page: string]: IPage }, page: IPage) => {
    map[page.name] = page
    if (!page.isRoute) {
      page.element = (
        <Route key={page.name} path={page.name} element={page.element} />
      )
    }
    return map
  }, {})
}

const AccessService = {
  init,
  hasAccess,
  permittedRoutes,
  mainMenu,
  userMenu,
  footerMenu,
}

export default AccessService
