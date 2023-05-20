import { Alert, Button, Image, StyleSheet, Text, View } from 'react-native'
import {
  launchCameraAsync,
  useCameraPermissions,
  PermissionStatus,
} from 'expo-image-picker'
import { useState } from 'react'
import { Colors } from '../../constants/colors'
import OutlinedButton from '../UI/OutlinedButton'

const ImagePicker = ({ onImageTaken }) => {
  const [pickedImage, setPickedImage] = useState()

  const [cameraPermissionInformation, requestPermission] =
    useCameraPermissions()

  const verifyPermission = async () => {
    if (cameraPermissionInformation.status === PermissionStatus.UNDETERMINED) {
      const permissionResponse = await requestPermission()

      return permissionResponse.granted
    }

    if (cameraPermissionInformation.status === PermissionStatus.DENIED) {
      Alert.alert(
        'Insufficient Permissions!',
        'You need to grant camera permissions to use this app.'
      )
      return false
    }
    return true
  }

  const takeImageHandler = async () => {
    const hasPermisiion = await verifyPermission()
    if (!hasPermisiion) return

    const image = await launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.5,
    })
    setPickedImage(image.assets[0].uri)
    onImageTaken(image.assets[0].uri)
  }

  let imagePreview = <Text>No image taken</Text>
  if (pickedImage) {
    imagePreview = <Image source={{ uri: pickedImage }} style={styles.image} />
  }

  return (
    <View>
      <View style={styles.imagePreview}>{imagePreview}</View>
      <OutlinedButton onPress={takeImageHandler} icon='camera'>
        Take Image
      </OutlinedButton>
    </View>
  )
}

export default ImagePicker

const styles = StyleSheet.create({
  imagePreview: {
    width: '100%',
    height: 200,
    marginVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary100,
    borderRadius: 4,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
})
