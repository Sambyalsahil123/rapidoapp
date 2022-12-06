import React from 'react'
import { StatusBar } from 'react-native'
import { OnboardingConfigProvider } from './Core/onboarding/hooks/useOnboardingConfig'
import { useConfig } from './config'
import { ProfileConfigProvider } from './Core/profile/hooks/useProfileConfig'
import RootNavigator from './navigation/Root'

const MainNavigator = RootNavigator

export default AppContent = () => {
  const config = useConfig()

  return (
    <ProfileConfigProvider config={config}>
      <OnboardingConfigProvider config={config}>
        <StatusBar barStyle="dark-content" />
        <MainNavigator />
      </OnboardingConfigProvider>
    </ProfileConfigProvider>
  )
}
