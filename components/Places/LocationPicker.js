import React, { useEffect, useState } from 'react'
import OutlinedButton from '../UI/OutlinedButton'
import { Alert, Image, StyleSheet, Text, View } from 'react-native'
import { Colors } from '../../constants/colors'
import {
  getCurrentPositionAsync,
  useForegroundPermissions,
  PermissionStatus,
} from 'expo-location'
import { getAddress, getMapPreview } from '../../utils/location'
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native'
const LocationPicker = ({ onLocationPicked }) => {
  const [pickedLocation, setPickedLocation] = useState()
  const isFocused = useIsFocused()

  const [locationPermissionInformation, requestPermission] =
    useForegroundPermissions()

  const navigation = useNavigation()
  const route = useRoute()

  useEffect(() => {
    if (isFocused && route.params) {
      const mapPickedLocation = route.params && {
        lat: route.params.pickedLat,
        lng: route.params.pickedLng,
      }
      setPickedLocation(mapPickedLocation)
    }
  }, [route, isFocused])

  const verifyPermissions = async () => {
    if (
      locationPermissionInformation.status === PermissionStatus.UNDETERMINED
    ) {
      const permissionResponse = await requestPermission()

      return permissionResponse.granted
    }

    if (locationPermissionInformation.status === PermissionStatus.DENIED) {
      Alert.alert(
        'Insufficient Permissions!',
        'You need to grant camera permissions to use this app.'
      )
      return false
    }
    return true
  }

  const getLocationHandler = async () => {
    const hasPermission = await verifyPermissions()
    if (!hasPermission) {
      return
    }

    const location = await getCurrentPositionAsync()
    setPickedLocation({
      lat: location.coords.latitude,
      lng: location.coords.longitude,
    })
  }
  const pickOnMapHandler = () => {
    navigation.navigate('Map')
  }

  let locationPreview = <Text>No location picked</Text>

  if (pickedLocation) {
    locationPreview = (
      <Image
        style={styles.image}
        source={{
          uri: getMapPreview(pickedLocation),
        }}
      />
    )
  }

  useEffect(() => {
    const handleLocation = async () => {
      if (pickedLocation) {
        const address = await getAddress(pickedLocation.lat, pickedLocation.lng)
        onLocationPicked({ ...pickedLocation, address })
      }
    }
    handleLocation()
  }, [pickedLocation, onLocationPicked])

  return (
    <View>
      <View style={styles.mapPreview}>{locationPreview}</View>
      <View style={styles.actions}>
        <OutlinedButton icon='location' onPress={getLocationHandler}>
          Locate User
        </OutlinedButton>
        <OutlinedButton icon='map' onPress={pickOnMapHandler}>
          Pick on Map
        </OutlinedButton>
      </View>
    </View>
  )
}

export default LocationPicker

const styles = StyleSheet.create({
  mapPreview: {
    width: '100%',
    height: 200,
    marginVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary100,
    borderRadius: 4,
    overflow: 'hidden',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  image: {
    width: '100%',
    height: '100%',
  },
})
