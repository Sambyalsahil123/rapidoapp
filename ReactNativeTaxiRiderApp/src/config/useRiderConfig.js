import React, { useContext } from 'react'
import { useTheme, useTranslations } from 'dopenative'

const regexForNames = /^[a-zA-Z]{2,25}$/
const regexForPhoneNumber = /\d{9}$/

export const ConfigContext = React.createContext({})

export const ConfigProvider = ({ children }) => {
  const { theme } = useTheme()
  const { localized } = useTranslations()
  const config = {
    defaultProfilePhotoURL:
      'https://www.iosapptemplates.com/wp-content/uploads/2019/06/empty-avatar.jpg',
    defaultCarAvatar:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZh2MZ2vQUMd6kXVGsTEEcrbgr4DAhbnG88A&usqp=CAU',
    googleMapsAPIKey: 'AIzaSyBI8oXdc-lbtvRxuVstY6eXG5G9FNCT4fU',
    isSMSAuthEnabled: true,
    isGoogleAuthEnabled: true,
    isAppleAuthEnabled: true,
    isFacebookAuthEnabled: true,
    forgotPasswordEnabled: true,
    appIdentifier: 'rn-taxi-app-android',
    onboardingConfig: {
      welcomeTitle: localized('InstaTaxi'),
      welcomeCaption: localized(
        'Book a cab, track your ride and rate your driver.',
      ),
      walkthroughScreens: [
        {
          icon: require('../assets/icons/booktaxi.png'),
          title: localized('Book a Taxi'),
          description: localized(
            'Choose the pick up location and the destination for your trip and a driver will automatically pick you up.',
          ),
        },
        {
          icon: require('../assets/icons/maptrack.png'),
          title: localized('Track Your Ride'),
          description: localized(
            'Visualize the driver on the interactive map and track your ride.',
          ),
        },
        {
          icon: require('../assets/icons/paytaxi.png'),
          title: localized('Pay for Your Ride'),
          description: localized(
            'Pay for your ride with Apple Pay, Android Pay, Cash or Credit Cards.',
          ),
        },
        {
          icon: require('../assets/icons/star.png'),
          title: localized('Rate Your Driver'),
          description: localized(
            'Rate your driver after each ride to improve the quality of your rides.',
          ),
        },
        {
          icon: require('../assets/icons/triphistory.png'),
          title: localized('Trips History'),
          description: localized(
            'Check out the entire history of your trips instantly.',
          ),
        },
      ],
    },
    drawerMenu: {
      forceHeaderStyle: {
        backgroundColor: '#000',
        marginTop: 0,
        height: Platform.OS === 'ios' ? '25%' : '31%',
      },
      forceNameStyle: {
        color: '#fff',
      },
      forceEmailStyle: {
        color: '#fff',
      },
      forceMenuItemsStyle: {
        // marginLeft: 0,
      },
      forceMenuItemStyle: {
        fontWeight: '400',
        fontSize: 18,
        // marginLeft: 10,
        marginTop: 5,
      },
      upperMenu: [
        {
          title: localized('Home'),

          navigationPath: 'Home',
        },
        {
          title: localized('Your Trips'),
          navigationPath: 'Trips',
        },
        {
          title: localized('Wallet'),
          navigationPath: 'Wallet',
        },
        {
          title: localized('Profile'),
          navigationPath: 'Profile',
        },
      ],
      lowerMenu: [
        {
          title: localized('LOG OUT'),
          icon: theme.icons.shutdown,
          action: 'logout',
        },
      ],
    },
    tosLink: 'https://www.instamobile.io/eula-instachatty/',
    isUsernameFieldEnabled: false,
    smsSignupFields: [
      {
        displayName: localized('First Name'),
        type: 'ascii-capable',
        editable: true,
        regex: regexForNames,
        key: 'firstName',
        placeholder: 'First Name',
      },
      {
        displayName: localized('Last Name'),
        type: 'ascii-capable',
        editable: true,
        regex: regexForNames,
        key: 'lastName',
        placeholder: 'Last Name',
      },
    ],
    signupFields: [
      {
        displayName: localized('First Name'),
        type: 'ascii-capable',
        editable: true,
        regex: regexForNames,
        key: 'firstName',
        placeholder: 'First Name',
      },
      {
        displayName: localized('Last Name'),
        type: 'ascii-capable',
        editable: true,
        regex: regexForNames,
        key: 'lastName',
        placeholder: 'Last Name',
      },
      {
        displayName: localized('E-mail Address'),
        type: 'email-address',
        editable: true,
        regex: regexForNames,
        key: 'email',
        placeholder: 'E-mail Address',
        autoCapitalize: 'none',
      },
      {
        displayName: localized('Password'),
        type: 'default',
        secureTextEntry: true,
        editable: true,
        regex: regexForNames,
        key: 'password',
        placeholder: 'Password',
        autoCapitalize: 'none',
      },
    ],
    editProfileFields: {
      sections: [
        {
          title: localized('PUBLIC PROFILE'),
          fields: [
            {
              displayName: localized('First Name'),
              type: 'text',
              editable: true,
              regex: regexForNames,
              key: 'firstName',
              placeholder: 'Your first name',
            },
            {
              displayName: localized('Last Name'),
              type: 'text',
              editable: true,
              regex: regexForNames,
              key: 'lastName',
              placeholder: 'Your last name',
            },
          ],
        },
        {
          title: localized('PRIVATE DETAILS'),
          fields: [
            {
              displayName: localized('E-mail Address'),
              type: 'text',
              editable: true,
              key: 'email',
              placeholder: 'Your email address',
            },
            {
              displayName: localized('Phone Number'),
              type: 'text',
              editable: true,
              regex: regexForPhoneNumber,
              key: 'phone',
              placeholder: 'Your phone number',
            },
          ],
        },
      ],
    },
    userSettingsFields: {
      sections: [
        {
          title: localized('GENERAL'),
          fields: [
            {
              displayName: localized('Allow Push Notifications'),
              type: 'switch',
              editable: true,
              key: 'push_notifications_enabled',
              value: true,
            },
            {
              ...(Platform.OS === 'ios'
                ? {
                    displayName: localized('Enable Face ID / Touch ID'),
                    type: 'switch',
                    editable: true,
                    key: 'face_id_enabled',
                    value: false,
                  }
                : {}),
            },
          ],
        },
        {
          title: '',
          fields: [
            {
              displayName: localized('Save'),
              type: 'button',
              key: 'savebutton',
            },
          ],
        },
      ],
    },
    contactUsFields: {
      sections: [
        {
          title: localized('CONTACT'),
          fields: [
            {
              displayName: localized('Address'),
              type: 'text',
              editable: false,
              key: 'push_notifications_enabled',
              value: '142 Steiner Street, San Francisco, CA, 94115',
            },
            {
              displayName: localized('E-mail us'),
              value: 'florian@instamobile.io',
              type: 'text',
              editable: false,
              key: 'email',
              placeholder: 'Your e-mail address',
            },
          ],
        },
        {
          title: '',
          fields: [
            {
              displayName: localized('Call Us'),
              type: 'button',
              key: 'savebutton',
            },
          ],
        },
      ],
    },
    drawerMenuConfig: {
      adminDrawerConfig: {
        upperMenu: [
          {
            title: localized('HOME'),
            icon: theme.icons.shop,
            navigationPath: 'Restaurants',
          },
          {
            title: localized('ORDERS'),
            icon: theme.icons.delivery,
            navigationPath: 'AdminOrder',
          },
          {
            title: localized('DELIVERY'),
            icon: theme.icons.delivery,
            navigationPath: 'Map',
          },
        ],
        lowerMenu: [
          {
            title: localized('LOG OUT'),
            icon: theme.icons.shutdown,
            action: 'logout',
          },
        ],
      },
      vendorDrawerConfig: {
        upperMenu: [
          {
            title: localized('HOME'),
            icon: theme.icons.shop,
            navigationPath: 'Home',
          },
          {
            title: localized('CUISINES'),
            icon: theme.icons.menu,
            navigationPath: 'CategoryList',
          },
          {
            title: localized('SEARCH'),
            icon: theme.icons.search,
            navigationPath: 'Search',
          },
          {
            title: localized('CART'),
            icon: theme.icons.cart,
            navigationPath: 'Cart',
          },
          {
            title: localized('RESERVATIONS'),
            icon: theme.icons.reserve,
            navigationPath: 'ReservationHistoryScreen',
          },
          {
            title: localized('PROFILE'),
            icon: theme.icons.profile,
            navigationPath: 'MyProfile',
          },
          {
            title: localized('ORDERS'),
            icon: theme.icons.delivery,
            navigationPath: 'OrderList',
          },
        ],
        lowerMenu: [
          {
            title: localized('LOG OUT'),
            icon: theme.icons.shutdown,
            action: 'logout',
          },
        ],
      },
      customerDrawerConfig: {
        upperMenu: [
          {
            title: localized('HOME'),
            icon: theme.icons.shop,
            navigationPath: 'Home',
          },
          {
            title: localized('CUISINES'),
            icon: theme.icons.menu,
            navigationPath: 'CategoryList',
          },
          {
            title: localized('SEARCH'),
            icon: theme.icons.search,
            navigationPath: 'Search',
          },
          {
            title: localized('CART'),
            icon: theme.icons.cart,
            navigationPath: 'Cart',
          },
          {
            title: localized('PROFILE'),
            icon: theme.icons.profile,
            navigationPath: 'MyProfile',
          },
          {
            title: localized('ORDERS'),
            icon: theme.icons.delivery,
            navigationPath: 'OrderList',
          },
        ],
        lowerMenu: [
          {
            title: localized('LOG OUT'),
            icon: theme.icons.shutdown,
            action: 'logout',
          },
        ],
      },
      vendorDrawer: {
        upperMenu: [
          {
            title: localized('MANAGE ORDERS'),
            icon: theme.icons.shop,
            navigationPath: 'Home',
          },
          {
            title: localized('MANAGE PRODUCTS'),
            icon: theme.icons.foods,
            navigationPath: 'Products',
          },
        ],
        lowerMenu: [
          {
            title: localized('LOG OUT'),
            icon: theme.icons.shutdown,
            action: 'logout',
          },
        ],
      },
      driverDrawerConfig: {
        upperMenu: [
          {
            title: localized('HOME'),
            icon: theme.icons.shop,
            navigationPath: 'DriverHome',
          },
          {
            title: localized('ORDERS'),
            icon: theme.icons.delivery,
            navigationPath: 'OrderList',
          },
          {
            title: localized('PROFILE'),
            icon: theme.icons.profile,
            navigationPath: 'MyProfile',
          },
        ],
        lowerMenu: [
          {
            title: localized('LOG OUT'),
            icon: theme.icons.shutdown,
            action: 'logout',
          },
        ],
      },
    },
    contactUsPhoneNumber: '+16504850000',
    serverSideEnv: {
      API: {
        baseURL: 'https://agile-retreat-80253.herokuapp.com/', //your copied heroku link
        timeout: 15000,
      },
    },
    facebookIdentifier: '285315185217069',
    webClientId:
      '525472070731-mg8m3q8v9vp1port7nkbq9le65hp917t.apps.googleusercontent.com',
    FIREBASE_COLLECTIONS: {
      USERS: 'users',
      PAYMENT_METHODS: 'payment_methods',
      STRIPE_CUSTOMERS: 'stripe_customers',
      CATEGORIES: 'vendor_categories',
      CHARGES: 'charges',
      ORDERS: 'restaurant_orders',
      SOURCES: 'sources',
      PRODUCTS: 'vendor_products',
      SHIPPING_METHODS: 'shipping_methods',
    },
    displayCurrencyTitle: '$',
    currency: 'usd',
  }

  return (
    <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
  )
}

export const useConfig = () => useContext(ConfigContext)
