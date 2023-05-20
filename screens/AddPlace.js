import PlaceForm from '../components/Places/PlaceForm'
import { insertPlace } from '../utils/database'

const AddPlace = ({ navigation }) => {
  const createPlaceHandker = async (place) => {
    await insertPlace(place)

    navigation.navigate('AllPlaces')
  }
  return <PlaceForm onCreatePlace={createPlaceHandker} />
}

export default AddPlace
