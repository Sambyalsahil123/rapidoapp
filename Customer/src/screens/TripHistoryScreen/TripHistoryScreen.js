import React, { useLayoutEffect, useEffect, useState } from 'react'
import { FlatList, View } from 'react-native'
import { useSelector } from 'react-redux'
import { useTheme, useTranslations } from 'dopenative'
import TripHistoryItem from './TripHistoryItem/TripHistoryItem'
import MenuIcon from '../../components/MenuIcon/MenuIcon'
import { tripsAPIManager } from '../../api'
import dynamicStyles from './styles'
import { TNActivityIndicator, TNEmptyStateView } from '../../Core/truly-native'

export default function TripHistoryScreen({ navigation }) {
  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const currentUser = useSelector(({ auth }) => auth.user)

  const [loading, setLoading] = useState(false)
  const [trips, setTrips] = useState([])

  const emptyStateConfig = {
    title: localized('No Rides'),
    description: localized(
      'You have not ordered any rides yet. All your completed trips will appear here.',
    ),
  }

  useLayoutEffect(() => {
    const currentTheme = theme.colors[appearance]
    navigation.setOptions({
      headerLeft: renderNavHeaderLeft,
      headerStyle: [
        styles.navHeaderContainer,
        {
          backgroundColor: currentTheme.primaryBackground,
        },
      ],
      headerTitleStyle: {
        color: currentTheme.primaryText,
      },
    })
  }, [navigation])

  useEffect(() => {
    setLoading(true)
    const unsubscribe = tripsAPIManager.subscribeTripHistory(
      currentUser.id,
      onHistoryUpdate,
    )
    return unsubscribe
  }, [])

  const onHistoryUpdate = data => {
    setTrips(data)
    setLoading(false)
  }

  const renderNavHeaderLeft = () => {
    return <MenuIcon onPress={() => navigation.openDrawer()} />
  }

  const renderTripItem = ({ item, index }) => {
    return <TripHistoryItem key={item.id ?? `${index}`} item={item} />
  }

  const renderEmptyState = () => {
    return (
      <View style={styles.emptyViewContainer}>
        <TNEmptyStateView emptyStateConfig={emptyStateConfig} />
      </View>
    )
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <TNActivityIndicator />
      </View>
    )
  }

  return (
    <FlatList
      style={styles.container}
      data={trips}
      keyExtractor={(item, index) => item.id ?? `${index}`}
      renderItem={renderTripItem}
      ListEmptyComponent={renderEmptyState}
    />
  )
}
