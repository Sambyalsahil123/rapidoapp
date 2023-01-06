import React, { useState, useRef } from 'react'
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  Modal,
} from 'react-native'
import { Button } from 'react-native-elements'
import ActionSheet from 'react-native-actionsheet'
import * as ImagePicker from 'expo-image-picker'
import { useTheme, useTranslations } from 'dopenative'
// import dynamicStyles from './styles'
import { useNavigation } from '@react-navigation/native'

const SignupOnBoard = ({ image, setImage }) => {
  const { localized } = useTranslations()
  const [modalVisible, setModalVisible] = useState(false)
  const [modalVisible2, setModalVisible2] = useState(false)
  // const { theme, appearance } = useTheme()
  // const styless = dynamicStyles(theme, appearance)
  const [btnType, setBtnType] = useState(null)
  const actionSheet = useRef(null)

  const showActionSheet = btnEvent => {
    actionSheet.current.show()
    setBtnType(btnEvent)
  }
  // const navigation = useNavigation()
  const onActionDone = index => {
    if (index === 0) {
      captureFromCamera()
    }
    if (index === 1) {
      pickImage()
    }
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      // base64: true,
      allowsEditing: true,
      aspect: [6, 4],
      quality: 0.5,
    })

    if (!result.cancelled) {
      switch (btnType) {
        case 'frontBtn':
          setImage(prev => ({ ...prev, frontImage: result.uri }))
          break
        case 'backBtn':
          setImage(prev => ({ ...prev, backImage: result.uri }))
          break
        default:
          break
      }
    }
  }

  async function openCamera() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync()
    if (status !== 'granted') {
      alert('Sorry, we need camera permissions to make this work!')
      return
    }
  }

  const captureFromCamera = async () => {
    await openCamera()
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [6, 4],
      quality: 0.5,
    })

    // if (!result.cancelled) {
    //   setImage({ ...image, frontImage: result.uri });
    // }

    // if (!result.cancelled) {
    //   // Compress the image
    //   let compressedImage = await ImageManipulator.manipulateAsync(
    //     result.uri,
    //     [{ resize: { width: 400 } }],
    //     { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
    //   );

    //   // Save the compressed image to the app's cache
    //   let savedResult = await Cache.set(
    //     'my-image-key',
    //     compressedImage.base64,
    //     { format: 'jpg' }
    //   );
    // }

    if (!result.cancelled) {
      switch (btnType) {
        case 'frontBtn':
          setImage(prev => ({ ...prev, frontImage: result.uri }))
          break
        case 'backBtn':
          setImage(prev => ({ ...prev, backImage: result.uri }))
          break
        default:
          break
      }
    }
  }

  return (
    <>
      <View style={styles.container}>
        <View style={styles.fixToText}>
          {image.frontImage ? (
            <>
              <Modal
                animationType="fade"
                transparent={false}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalContent}>
                  <Image
                    style={styles.image}
                    source={{ uri: image.frontImage }}
                  />
                </View>
              </Modal>

              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Image
                  title="Open Image"
                  source={{ uri: image.frontImage }}
                  style={{
                    width: 100,
                    height: 50,
                    borderRadius: 5,
                    marginBottom: 40,
                  }}
                />

                <View
                  style={{
                    backgroundColor: 'transparent',
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: 'grey',
                    width: 40,
                    marginLeft: 30,
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{ fontSize: 15 }}
                    onPress={() => showActionSheet('frontBtn')}>
                    Edit
                  </Text>
                </View>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity>
              <Button
                titleStyle={{ color: 'gray' }}
                buttonStyle={styles.button}
                title={'Front Image'}
                name="frontImgBtn"
                onPress={() => showActionSheet('frontBtn')}
              />
            </TouchableOpacity>
          )}

          {image.backImage ? (
            <>
              <Modal
                animationType="fade"
                transparent={false}
                visible={modalVisible2}
                onRequestClose={() => setModalVisible2(false)}>
                <View style={styles.modalContent}>
                  <Image
                    style={styles.image}
                    source={{ uri: image.backImage }}
                  />
                </View>
              </Modal>
              <TouchableOpacity onPress={() => setModalVisible2(true)}>
                <Image
                  source={{ uri: image.backImage }}
                  style={{
                    width: 100,
                    height: 50,
                    borderRadius: 5,
                    marginBottom: 40,
                  }}
                />
                <View
                  style={{
                    backgroundColor: 'transparent',
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: 'grey',
                    width: 40,
                    marginLeft: 30,
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{ fontSize: 15 }}
                    onPress={() => showActionSheet('backBtn')}>
                    Edit
                  </Text>
                </View>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity>
              <Button
                titleStyle={{ color: 'gray' }}
                buttonStyle={styles.button}
                title={'Back Image'}
                name="backImgBtn"
                onPress={() => showActionSheet('backBtn')}
              />
            </TouchableOpacity>
          )}
        </View>
        <ActionSheet
          ref={actionSheet}
          options={['Camera', 'Gallery', 'Cancel']}
          cancelButtonIndex={2}
          destructiveButtonIndex={1}
          onPress={index => onActionDone(index)}
          title={"Please check that the image proofs aren't blurred."}
        />
      </View>
    </>
  )
}
export default SignupOnBoard

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 16,
    alignItems: 'center',
  },
  fixToText: {
    margin: 20,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: 300,
    height: 50,
  },
  modalContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '30%',
  },
  button: {
    backgroundColor: 'transparent',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'gray',
  },
})
