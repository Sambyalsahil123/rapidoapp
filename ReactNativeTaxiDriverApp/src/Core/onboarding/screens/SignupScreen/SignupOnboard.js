import React, { useState, useRef } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Modal,
  Platform,
} from 'react-native'
import { Button } from 'react-native-elements'
import ActionSheet from 'react-native-actionsheet'
import * as ImagePicker from 'expo-image-picker'
import FastImage from 'react-native-fast-image'

const Image = FastImage

const SignupOnBoard = ({ image, setImage }) => {
  // const { localized } = useTranslations()
  const [modalVisible, setModalVisible] = useState(false)
  const [modalVisible2, setModalVisible2] = useState(false)
  // const { theme, appearance } = useTheme()
  // const styless = dynamicStyles(theme, appearance)
  const [btnType, setBtnType] = useState(null)
  const actionSheet = useRef(null)

  const showActionSheet = btnEvent => {
    actionSheet?.current?.show()
    setBtnType(btnEvent)
  }

  // const navigation = useNavigation()
  const onActionDone = index => {
    if (index == 0) {
      pickImage()
    }
    if (index == 1) {
      openCamera()
    }
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library

    let result = await ImagePicker?.launchImageLibraryAsync({
      mediaTypes: ImagePicker?.MediaTypeOptions?.Images,
      allowsEditing: true,
      quality: 0.5,
    })

    if (!result?.cancelled) {
      switch (btnType) {
        case 'frontBtn':
          setImage(prev => ({ ...prev, frontImage: result?.uri }))
          break
        case 'backBtn':
          setImage(prev => ({ ...prev, backImage: result?.uri }))
          break
        default:
          break
      }
    }
  }

  const openCamera = async () => {
    const { status } = await ImagePicker?.requestCameraPermissionsAsync()
    if (status !== 'granted') {
      alert('Sorry, we need camera permissions to make this work!')
      return
    }

    let result = await ImagePicker?.launchCameraAsync({
      mediaTypes: ImagePicker?.MediaTypeOptions?.Images,
      allowsEditing: true,
      quality: 0.5,
    })

    if (!result?.cancelled) {
      switch (btnType) {
        case 'frontBtn':
          setImage(prev => ({ ...prev, frontImage: result?.uri }))
          break
        case 'backBtn':
          setImage(prev => ({ ...prev, backImage: result?.uri }))
          break
        default:
          break
      }
    }
  }

  return (
    // <View style={styles.container}>
    <View style={styles.fixToText}>
      {image.frontImage ? (
        <View>
          <Modal
            useNativeDriver={Platform.OS === 'android' ? true : false}
            animationType="fade"
            transparent={false}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}>
            <View style={styles.modalContent}>
              <Image style={styles.image} source={{ uri: image.frontImage }} />
            </View>
          </Modal>

          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={styles.imageStyle}>
            <Image
              title="Open Image"
              source={{ uri: image.frontImage }}
              style={styles.imageStyle}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => showActionSheet('frontBtn')}
            style={{
              backgroundColor: 'transparent',
              borderRadius: 5,
              borderWidth: 1,
              borderColor: 'grey',
              paddingHorizontal: 8,
              paddingVertical: 3,
              alignItems: 'center',
            }}>
            <Text style={{ fontSize: 15 }}>Edit</Text>
          </TouchableOpacity>
        </View>
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

      {image?.backImage ? (
        <View>
          <Modal
            useNativeDriver={Platform.OS === 'android' ? true : false}
            animationType="fade"
            transparent={false}
            visible={modalVisible2}
            onRequestClose={() => setModalVisible2(false)}>
            <View style={styles.modalContent}>
              <Image style={styles.image} source={{ uri: image.backImage }} />
            </View>
          </Modal>

          <TouchableOpacity
            onPress={() => setModalVisible2(true)}
            style={styles.imageStyle}>
            <Image
              title="Open Image"
              source={{ uri: image?.backImage }}
              style={styles.imageStyle}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => showActionSheet('backBtn')}
            style={{
              backgroundColor: 'transparent',
              borderRadius: 5,
              borderWidth: 1,
              borderColor: 'grey',
              paddingHorizontal: 8,
              paddingVertical: 3,
              alignItems: 'center',
            }}>
            <Text style={{ fontSize: 15 }}>Edit</Text>
          </TouchableOpacity>
        </View>
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

      <ActionSheet
        ref={actionSheet}
        title={"Please check that the image proofs aren't blurred."}
        options={['Gallery', 'Camera', 'Cancel']}
        cancelButtonIndex={2}
        onPress={index => {
          onActionDone(index)
        }}
      />
    </View>
  )
}
export default SignupOnBoard

const styles = StyleSheet.create({
  fixToText: {
    flex: 1,
    alignSelf: 'center',
    marginHorizontal: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '85%',
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
  imageStyle: {
    width: 100,
    height: 60,
    marginBottom: '15%',
    borderRadius: 5,
  },
  button: {
    backgroundColor: 'transparent',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'gray',
  },
})
