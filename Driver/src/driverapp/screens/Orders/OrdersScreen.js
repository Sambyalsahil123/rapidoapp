import React, { useRef, useEffect, useLayoutEffect, useState } from 'react'
import { FlatList, Text, View } from 'react-native'
import FastImage from 'react-native-fast-image'
import { useSelector } from 'react-redux'
import { useTheme, useTranslations } from 'dopenative'
import PropTypes from 'prop-types'
import dynamicStyles from './styles'
import Hamburger from '../../../components/Hamburger/Hamburger'
import { OrdersAPIManager } from '../../api/orders'
import {
  TNEmptyStateView,
  TNActivityIndicator,
} from '../../../Core/truly-native'

const statusDescription = {
  trip_completed: 'Trip Completed',
}

const OrdersScreen = props => {
  const { navigation } = props

  const [orders, setOrders] = useState(null)

  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const currentUser = useSelector(state => state.auth.user)
  const apiManager = useRef(new OrdersAPIManager())

  const emptyStateConfig = {
    title: localized('No Orders'),
    description: localized(
      'You have not received any orders yet. All your orders will be displayed here.',
    ),
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      title: localized('Orders'),
      headerLeft: () => (
        <Hamburger
          onPress={() => {
            navigation.openDrawer()
          }}
        />
      ),
    })
  })

  useEffect(() => {
    apiManager.current.subscribe(currentUser.id, onOrdersUpdate)
    return apiManager.current.unsubscribe
  }, [])

  const onOrdersUpdate = data => {
    setOrders(data)
  }

  const renderItem = ({ item }) => {
    return (
      <View style={styles.container}>
        <View>
          {item != null &&
            item.products != null &&
            item.products[0] != null &&
            item.products[0].photo != null &&
            item.products[0].photo.length > 0 && (
              <FastImage
                placeholderColor={theme.colors[appearance].grey9}
                style={styles.photo}
                source={{ uri: item.products[0].photo }}
              />
            )}
          <View style={styles.overlay} />
        </View>
        <View style={styles.routeContainer}>
          <View style={styles.routeIindicatorContainer}>
            <View style={styles.circle} />

            <View style={styles.line} />

            <View style={styles.square} />
          </View>
          <View style={styles.routeDescriptionContainer}>
            <Text numberOfLines={1} style={styles.routeTitle}>
              {item?.pickup?.title}
            </Text>
            <Text numberOfLines={1} style={styles.routeTitle}>
              {item?.dropoff?.title}
            </Text>
          </View>
        </View>
        <View style={styles.actionContainer}>
          <Text style={styles.total}>
            {localized('Total: $')}
            {item.price}
          </Text>
          <Text style={styles.statusText}>
            {statusDescription[item.status]}
          </Text>
        </View>
      </View>
    )
  }

  if (orders == null) {
    return <TNActivityIndicator />
  }

  if (orders.length == 0) {
    return (
      <View style={styles.emptyViewContainer}>
        <TNEmptyStateView emptyStateConfig={emptyStateConfig} />
      </View>
    )
  }

  return (
    <FlatList
      style={styles.flat}
      data={orders}
      showsVerticalScrollIndicator={false}
      renderItem={renderItem}
      keyExtractor={item => `${item.id}`}
      initialNumToRender={5}
    />
  )
}

OrdersScreen.propTypes = {
  user: PropTypes.shape(),
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }),
}

export default OrdersScreen
