import React, { useState, useRef } from 'react'
import {
  View,
  TouchableOpacity,
  ScrollView,
  TouchableHighlight,
  Platform,
} from 'react-native'
import ActionSheet from 'react-native-actionsheet'
import ImageView from 'react-native-image-view'
import ImagePicker from 'react-native-image-picker'
import FastImage from 'react-native-fast-image'
import { useTheme, useTranslations } from 'dopenative'
import dynamicStyles from './styles'
import { Permissions } from 'expo'

const Image = FastImage

const TNProfilePictureSelector = props => {
  const [profilePictureURL, setProfilePictureURL] = useState(
    props.profilePictureURL || '',
  )
  const originalProfilePictureURL = useRef(props.profilePictureURL || '')
  if (originalProfilePictureURL.current !== (props.profilePictureURL || '')) {
    originalProfilePictureURL.current = props.profilePictureURL || ''
    setProfilePictureURL(props.profilePictureURL || '')
  }

  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null)
  const [isImageViewerVisible, setIsImageViewerVisible] = useState(false)
  const [tappedImage, setTappedImage] = useState([])
  const actionSheet = useRef(null)
  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)
  const [btnType, setBtnType] = useState(null)

  const handleProfilePictureClick = url => {
    if (url) {
      const isAvatar = url.search('avatar')
      const image = [
        {
          source: {
            uri: url,
          },
        },
      ]
      if (isAvatar === -1) {
        setTappedImage(image)
        setIsImageViewerVisible(true)
      } else {
        showActionSheet()
      }
    } else {
      showActionSheet()
    }
  }

  const onImageError = () => {
    console.log('Error loading profile photo at url ' + profilePictureURL)
    const defaultProfilePhotoURL =
      'https://www.iosapptemplates.com/wp-content/uploads/2019/06/empty-avatar.jpg'
    setProfilePictureURL(defaultProfilePhotoURL)
  }

  // const getPermissionAsync = async () => {
  //   if (Platform.OS === 'ios') {
  //     let permissionResult =
  //       await ImagePicker.requestMediaLibraryPermissionsAsync(false)

  //     if (permissionResult.granted === false) {
  //       alert(
  //         localized(
  //           'Sorry, we need camera roll permissions to make this work.',
  //         ),
  //       )
  //     }
  //   }
  // }

  const pickImage = () => {
    ImagePicker.launchImageLibrary(
      {
        quality: 0.5,
        allowsEditing: true,

        mediaType: 'photo',
      },
      response => {
        if (response.didCancel) {
          console.log('User cancelled image picker')
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error)
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton)
        } else {
          setProfilePictureURL(response.uri)
          props.setProfilePictureFile(response)
        }
      },
    )
  }

  const openCamera = async () => {
    // const { status } = await Permissions.askAsync(Permissions.CAMERA)
    // if (status !== 'granted') {
    //   alert('Sorry, we need camera permissions to make this work!')
    //   return
    // }
    ImagePicker.launchCamera(
      {
        quality: 0.5,
        allowsEditing: true,
        mediaType: 'photo',
      },
      response => {
        if (response.didCancel) {
          console.log('User cancelled image picker')
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error)
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton)
        } else {
          setProfilePictureURL(response.uri)
          props.setProfilePictureFile(response)
        }
      },
    )
  }
  // const pickImage = async () => {
  //   const options = {
  //     title: localized('Select photo'),
  //     cancelButtonTitle: localized('Cancel'),
  //     takePhotoButtonTitle: localized('Take Photo'),
  //     chooseFromLibraryButtonTitle: localized('Choose from Library'),
  //     maxWidth: 2000,
  //     maxHeight: 2000,
  //     storageOptions: {
  //       skipBackup: true,
  //       path: 'images',
  //     },
  //   }

  //   // await getPermissionAsync()

  //   let result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //     allowsEditing: true,
  //     quality: 0.5,
  //     aspect: [1, 1],
  //   })

  //   console.log(result)

  // if (!result.cancelled) {
  //   // setProfilePictureURL(result.uri)

  //   // props.setProfilePictureFile(result)

  // switch (btnType) {
  //   case 'img':
  //     // setSingleImg(result?.uri)
  //     setProfilePictureURL(result.uri)
  //     props.setProfilePictureFile(result)

  //     break
  //   default:
  //     break
  // }
  // }
  // }

  // const openCamera = async () => {
  //   const { status } = await ImagePicker?.requestCameraPermissionsAsync()
  //   if (status !== 'granted') {
  //     alert('Sorry, we need camera permissions to make this work!')
  //     return
  //   }

  //   // let result = await ImagePicker?.launchCameraAsync({
  //   //   mediaTypes: ImagePicker?.MediaTypeOptions?.Images,
  //   //   allowsEditing: true,
  //   //   quality: 0.5,
  //   //   aspect: [1, 1],
  //   // })

  //   switch (btnType) {
  //     case 'img':
  //       // setSingleImg(result?.uri)
  //       setProfilePictureURL(result.uri)
  //       props.setProfilePictureFile(result)

  //       break
  //     default:
  //       break
  //   }
  // }

  const closeButton = () => (
    <TouchableOpacity
      style={styles.closeButton}
      onPress={() => setIsImageViewerVisible(false)}>
      <Image style={styles.closeIcon} source={theme.icons.close} />
    </TouchableOpacity>
  )

  const showActionSheet = btnEvent => {
    setSelectedPhotoIndex(btnEvent)
    actionSheet.current.show()
    setBtnType(btnEvent)
  }

  const onActionDone = index => {
    if (index == 0) {
      // onPressAddPhotoBtn()
      pickImage()
    }
    // if (index == 2) {
    //   // Remove button
    //   if (profilePictureURL) {
    //     setProfilePictureURL(null)
    //     props.setProfilePictureFile(null)
    //   }
    // }

    if (index == 1) {
      openCamera()
    }
  }

  // const actionSheet = useRef(null)

  // const showActionSheet = btnEvent => {
  //   actionSheet?.current?.show()
  //   setBtnType(btnEvent)
  // }

  // const onActionDone = index => {
  //   if (index == 0) {
  //     openCamera()
  //   }
  //   if (index == 1) {
  //     pickImage()
  //   }
  // }

  // const actionsheetOptions = profilePictureURL
  //   ? [
  //       localized('Change Profile Photo'),
  //       localized('Cancel'),
  //       localized('Remove Profile Photo'),
  //     ]
  //   : [localized('Set Profile Photo '), localized('Cancel')]
  return (
    <>
      <View style={styles.imageBlock}>
        <TouchableHighlight
          style={styles.imageContainer}
          onPress={() => handleProfilePictureClick(profilePictureURL)}>
          <Image
            style={[styles.image, { opacity: profilePictureURL ? 1 : 0.3 }]}
            source={
              profilePictureURL
                ? { uri: profilePictureURL }
                : theme.icons.userAvatar
            }
            resizeMode="cover"
            onError={onImageError}
          />
        </TouchableHighlight>

        <TouchableOpacity
          name="img"
          onPress={() => showActionSheet('img')}
          style={styles.addButton}>
          <Image style={styles.cameraIcon} source={theme.icons.cameraFilled} />
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ActionSheet
          ref={actionSheet}
          title={localized("Please check that the image aren't blurred.")}
          options={['Gallery', 'Camera', 'Cancel']}
          cancelButtonIndex={2}
          destructiveButtonIndex={1}
          onPress={index => {
            onActionDone(index)
          }}
        />
        <ImageView
          images={tappedImage}
          isVisible={isImageViewerVisible}
          onClose={() => setIsImageViewerVisible(false)}
          controls={{ close: closeButton }}
        />
      </ScrollView>
    </>
  )
}

export default TNProfilePictureSelector
