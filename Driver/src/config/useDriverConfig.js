import React, { useContext } from 'react'
import { useTheme, useTranslations } from 'dopenative'

const regexForNames = /^[a-zA-Z]{2,25}$/
const regexForPhoneNumber = /^(\+\d{1,3}[- ]?)?\d{10}$/
var regexForAadhar = /^[2-9]{1}[0-9]{3}\s{1}[0-9]{4}\s{1}[0-9]{4}$/

export const ConfigContext = React.createContext({})

export const ConfigProvider = ({ children }) => {
  const { theme } = useTheme()
  const { localized } = useTranslations()
  const config = {
    isSMSAuthEnabled: true,
    isGoogleAuthEnabled: true,
    isAppleAuthEnabled: true,
    isFacebookAuthEnabled: true,
    forgotPasswordEnabled: true,
    appIdentifier: 'rn-multivendor-driverapp-android',
    googleMapsAPIKey: 'AIzaSyBI8oXdc-lbtvRxuVstY6eXG5G9FNCT4fU',
    isDelayedLoginEnabled: false,
    tables: {
      VENDOR: 'vendors',
      VENDOR_ORDERS: 'restaurant_orders',
      VENDOR_DELIVERIES: 'restaurant_deliveries',
      VENDOR_REVIEWS: 'vendor_reviews',
      VENDOR_PRODUCTS: 'vendor_products',
      RESERVATIONS: 'reservations',
    },
    onboardingConfig: {
      welcomeTitle: localized('Bega Driver'),
      welcomeCaption: localized('Make money by completing trips.'),
      walkthroughScreens: [
        {
          icon: require('../assets/icons/accept-decline.png'),
          title: localized('Accept - Decline offers'),
          description: localized('Get multiple trip Offers to choose from'),
        },
        {
          icon: require('../assets/icons/income.png'),
          title: localized('Get paid'),
          description: localized(
            'Be your own boss and earn when you complete a trip.',
          ),
        },
        {
          icon: require('../assets/icons/travel.png'),
          title: localized('Track routes'),
          description: localized(
            'Track your routes in real-time, directly in the app.',
          ),
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
      {
        displayName: localized('Car Model'),
        type: 'ascii-capable',
        editable: true,
        regex: regexForNames,
        key: 'carModel',
        placeholder: localized('Car Model'),
      },
      {
        displayName: localized('Car License Plate'),
        type: 'ascii-capable',
        editable: true,
        regex: regexForNames,
        key: 'carPlate',
        placeholder: localized('Car License Plate'),
      },
      {
        displayName: localized('Phone Number'),
        type: 'phone-pad',
        editable: true,
        regex: regexForPhoneNumber,
        key: 'phoneNumber',
        placeholder: 'Phone Number',
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
        displayName: localized('CAR TYPE'),
        type: 'select',
        options: ['uber_x', 'comfort', 'uber_xl'],
        displayOptions: ['TaxiX', 'Comfort', 'TaxiXL'],
        editable: true,
        key: 'carType',
        placeholder: 'CAR TYPE',
      },
      {
        displayName: localized('Car Model'),
        type: 'ascii-capable',
        editable: true,
        regex: regexForNames,
        key: 'carName',
        placeholder: localized('Car Model'),
      },
      {
        displayName: localized('Car License Plate'),
        type: 'ascii-capable',
        editable: true,
        regex: regexForNames,
        key: 'carNumber',
        placeholder: localized('Car License Plate'),
      },
      {
        displayName: localized('Phone Number'),
        type: 'phone-pad',
        maxLength: 12,
        editable: true,
        regex: regexForPhoneNumber,
        key: 'phoneNumber',
        placeholder: 'Phone Number',
      },

      {
        displayName: localized('Aadhar Card'),
        type: 'numeric',
        secureTextEntry: false,
        editable: true,
        maxLength: 12,
        regex: regexForAadhar,
        key: 'aadharCard',
        placeholder: 'Aadhar Card',
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
          title: localized('CAR DETAILS'),
          fields: [
            {
              displayName: localized('Car Name'),
              type: 'text',
              editable: true,
              key: 'carName',
              placeholder: 'Your car name',
            },
            {
              displayName: localized('Car Number'),
              type: 'text',
              editable: true,
              key: 'carNumber',
              placeholder: 'Your car number',
            },
            {
              displayName: localized('Car Type'),
              type: 'select',
              options: ['uber_x', 'comfort', 'uber_xl', 'none'],
              displayOptions: ['TaxiX', 'Comfort', 'TaxiXL', 'None'],
              editable: true,
              key: 'carType',
              value: 'None',
            },
          ],
        },
        // {
        //   title: localized('PRIVATE DETAILS'),
        //   fields: [
        //     {
        //       displayName: localized('Phone Number'),
        //       type: 'text',
        //       editable: true,
        //       regex: regexForPhoneNumber,
        //       key: 'phoneNumber',
        //       placeholder: 'Your phone number',
        //     },
        //   ],
        // },
      ],
    },
    userSettingsFields: {
      sections: [
        {
          title: localized('SECURITY'),
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
          title: localized('ACCOUNT'),
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
              key: 'contacus',
              value: '142 Steiner Street, San Francisco, CA, 94115',
            },
            // {
            //   displayName: localized('E-mail us'),
            //   value: 'florian@instamobile.io',
            //   type: 'text',
            //   editable: false,
            //   key: 'email',
            //   placeholder: 'Your email address',
            // },
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
    contactUsPhoneNumber: '+16504859694',
    APIs: {
      firebase: 'firebase',
    },
    API_TO_USE: 'firebase', // "firebase", "wooCommerce", "shopify",
    stripeEnv: {
      API: {
        baseURL: 'https://murmuring-caverns-94283.herokuapp.com/', //your copied heroku link
        timeout: 30000,
      },
    },
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
