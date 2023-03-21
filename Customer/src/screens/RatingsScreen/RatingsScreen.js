import React, { useState } from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import { useTheme, useTranslations } from 'dopenative'
import { Rating } from 'react-native-ratings'
import { tripsAPIManager } from '../../api'
import dynamicStyles from './styles'
import { useConfig } from '../../config'

export default function RatingsScreen({ route, navigation }) {
  const driver = route.params?.driver

  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const config = useConfig()

  const [ratings, setRatings] = useState(null)

  const onDonePress = () => {
    if (ratings) {
      tripsAPIManager.rateDriver(driver.id, ratings)
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'Main',
          },
        ],
      })
    }
  }

  const onRatingCompleted = newRating => {
    setRatings(newRating)
  }

  return (
    <View style={styles.container}>
      <View style={styles.activityContainer}>
        <View style={styles.driverContainer}>
          <View style={styles.driverAvatarContainer}>
            <Image
              style={styles.driverAvatar}
              source={{
                uri:
                  driver?.profilePictureURL ?? config.defaultProfilePhotoURL,
              }}
            />
          </View>
        </View>
        <View style={styles.ratingsContainer}>
          <Rating
            type="custom"
            style={styles.ratingStars}
            ratingCount={5}
            startingValue={0}
            imageSize={43}
            tintColor={styles.ratingStars.color}
            readonly={false}
            ratingBackgroundColor={'#e5e5e6'}
            onFinishRating={onRatingCompleted}
          />
        </View>
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>
            {localized('Rate driver')}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        disabled={!ratings}
        onPress={onDonePress}
        style={[styles.doneTitleContainer]}>
        <Text style={styles.doneTitle}>{localized('Done')}</Text>
      </TouchableOpacity>
    </View>
  )
}
