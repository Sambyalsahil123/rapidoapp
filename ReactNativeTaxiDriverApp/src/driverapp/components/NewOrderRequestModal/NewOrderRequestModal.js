import React from 'react'
import { View, Text } from 'react-native'
import Modal from 'react-native-modal'
import Button from 'react-native-button'
import { useTheme, useTranslations } from 'dopenative'
import dynamicStyles from './styles'

export default function NewOrderRequestModal({
  onAccept,
  onReject,
  isVisible,
  onModalHide,
}) {
  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)
  return (
    <Modal
      style={styles.modalContainer}
      swipeDirection="down"
      isVisible={isVisible}
      onModalHide={onModalHide}>
      <View style={styles.container}>
        <Text style={styles.title}>{localized('Accept New Ride?')}</Text>
        <View style={styles.actionContainer}>
          <Button
            containerStyle={styles.actionButtonContainer}
            style={styles.actionButtonText}
            onPress={onAccept}>
            {localized('Accept')}
          </Button>
        </View>
        <Button style={styles.cancel} onPress={onReject}>
          {localized('Reject')}
        </Button>
      </View>
    </Modal>
  )
}
