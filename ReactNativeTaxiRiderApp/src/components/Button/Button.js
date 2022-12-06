import React from 'react'
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native'
import { useTheme } from 'dopenative'
import dynamicStyles from './styles'

export default function Button({
  title,
  variant = 'default',
  disabled,
  loading,
  onPress,
  ...props
}) {
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const titleElement = React.isValidElement(title) ? (
    title
  ) : (
    <Text style={[styles.text, variant === 'primary' && styles.textPrimary]}>
      {title}
    </Text>
  )
  return (
    <View style={disabled && styles.disabled}>
      <TouchableOpacity
        disabled={disabled}
        style={[
          styles.container,
          variant === 'primary' && styles.primaryContainer,
        ]}
        onPress={onPress}
        {...props}>
        {loading ? <ActivityIndicator size="small" /> : titleElement}
      </TouchableOpacity>
    </View>
  )
}
