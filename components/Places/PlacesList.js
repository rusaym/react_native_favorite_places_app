import { FlatList, StyleSheet, Text, View } from 'react-native'
import PlaceItem from './PlaceItem'
import { Colors } from '../../constants/colors'
import { useNavigation } from '@react-navigation/native'

const PlacesList = ({ places }) => {
  const naigation = useNavigation()

  const selectPlaceHandler = (id) => {
    naigation.navigate('PlaceDetails', {
      placeId: id,
    })
  }

  if (!places || places.length === 0) {
    return (
      <View style={styles.fallbackContainer}>
        <Text style={styles.fallbackText}>No places added yet</Text>
      </View>
    )
  }

  const placeHandler = ({ item }) => (
    <PlaceItem place={item} onSelect={selectPlaceHandler} />
  )

  return (
    <FlatList
      style={styles.list}
      data={places}
      keyExtractor={(item) => item.id}
      renderItem={placeHandler}
    />
  )
}

export default PlacesList

const styles = StyleSheet.create({
  list: {
    margin: 24,
  },
  fallbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackText: {
    fontSize: 16,
    color: Colors.primary200,
  },
})
