import React, { useLayoutEffect, useEffect, useState } from 'react'
import { View } from 'react-native'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { useDispatch, useSelector } from 'react-redux'
import { useTheme, useTranslations } from 'dopenative'
import { setDestination, setOrigin } from '../../redux'
import dynamicStyles from './styles.js'
import PlaceRow from './PlaceRow'
import { useConfig } from '../../config'

export default function SearchModal({ navigation, route }) {
  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const config = useConfig()

  const savingPlace = route?.params?.savingPlace
  const updatingOrigin = route?.params?.updatingOrigin
  const updatingDestination = route?.params?.updatingDestination ?? savingPlace

  const dispatch = useDispatch()

  const currentUser = useSelector(({ auth }) => auth.user)
  const origin = useSelector(({ trip }) => trip.origin)
  const destination = useSelector(({ trip }) => trip.destination)

  const [predefinedPlaces, setPredefinedPlaces] = useState()

  const isUpdatingRoute = updatingOrigin || updatingDestination

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: styles.navHeaderContainer,
    })
  }, [navigation])

  useEffect(() => {
    const savedPlaces = []
    ;(currentUser?.savedPlaces ?? []).forEach(savedPlace => {
      const placeDescription = savedPlace.name ?? savedPlace.title
      if (!placeDescription && !savedPlace.latitude) {
        return
      }
      const place = {
        description: placeDescription,
        geometry: {
          location: { lat: savedPlace.latitude, lng: savedPlace.longitude },
        },
      }
      savedPlaces.push(place)
    })

    setPredefinedPlaces(savedPlaces)
  }, [])

  useEffect(() => {
    if (destination && origin && !isUpdatingRoute) {
      navigation.goBack()
    }
  }, [destination, origin])

  const onSetDestination = (data, { geometry }) => {
    const {
      location: { lat: latitude, lng: longitude },
    } = geometry
    const place = {
      latitude,
      longitude,
      title: data.structured_formatting?.main_text ?? data.vicinity,
      placeId: data?.place_id,
      subtitle: data?.structured_formatting?.secondary_text ?? '',
    }
    if (savingPlace) {
      navigation.navigate('SavePlace', {
        place,
      })
      return
    }
    dispatch(setDestination(place))
  }

  const onSetOrigin = (data, { geometry }) => {
    const {
      location: { lat: latitude, lng: longitude },
    } = geometry
    const place = {
      latitude,
      longitude,
      title: data.structured_formatting?.main_text ?? data.vicinity,
      placeId: data?.place_id,
      subtitle: data?.structured_formatting?.secondary_text ?? '',
    }
    dispatch(setOrigin(place))
  }

  const generalAutoCompleteProps = {
    enablePoweredByContainer: false,
    suppressDefaultStyles: true,
    query: {
      key: config.googleMapsAPIKey,
      language: 'en',
    },
    fetchDetails: true,
    styles: {
      textInput: styles.textInput,
      textInputContainer: styles.textInputContainer,
      separator: styles.separator,
    },
    renderRow: data => <PlaceRow data={data} />,
  }

  const routeAutoCompleteProps = {
    origin: {
      placeholder: localized('Where from?'),
      onPress: onSetOrigin,
      currentLocation: true,
      currentLocationLabel: localized('Current location'),
      textInputProps: {
        autoFocus: true,
      },
      styles: {
        ...generalAutoCompleteProps.styles,
        container: styles.autocompleteContainer,
        listView: !updatingOrigin && styles.listView,
      },
      renderDescription: data => data.description || data.vicinity,
      predefinedPlaces: predefinedPlaces,
    },
    destination: {
      placeholder: savingPlace ? 'Enter address' : 'Where to?',
      onPress: onSetDestination,
      textInputProps: {
        autoFocus: updatingDestination,
      },
      styles: {
        ...generalAutoCompleteProps.styles,
        container: {
          ...styles.autocompleteContainer,
          top: !updatingDestination ? 55 : 0,
        },
      },
    },
  }

  const renderGooglePlacesAutocomplete = (generalProps, specificProps) => {
    if (predefinedPlaces) {
      return <GooglePlacesAutocomplete {...generalProps} {...specificProps} />
    }
  }

  const renderLineIndicator = () => {
    if (predefinedPlaces) {
      return (
        /* Circle near Origin input */
        <>
          {!updatingDestination && (
            <View
              style={[styles.circle, origin?.title && styles.tintIndicator]}
            />
          )}

          {/* Line between dots */}
          {!isUpdatingRoute && <View style={styles.line} />}

          {/* Square near Destination input */}
          {!updatingOrigin && (
            <View
              style={[
                styles.square,
                destination?.title && styles.tintIndicator,
                updatingDestination && { top: 20 },
              ]}
            />
          )}
        </>
      )
    }
  }

  return (
    <View style={styles.container}>
      {!updatingDestination &&
        renderGooglePlacesAutocomplete(
          generalAutoCompleteProps,
          routeAutoCompleteProps.origin,
        )}
      {!updatingOrigin &&
        renderGooglePlacesAutocomplete(
          generalAutoCompleteProps,
          routeAutoCompleteProps.destination,
        )}
      {renderLineIndicator()}
    </View>
  )
}
