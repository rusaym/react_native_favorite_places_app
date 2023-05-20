import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View } from 'react-native'
import AllPlaces from './screens/AllPlaces'
import AddPlace from './screens/AddPlace'
import IconButton from './components/UI/IconButton'
import { Colors } from './constants/colors'
import Map from './screens/Map'
import { useCallback, useEffect, useState } from 'react'
import { init } from './utils/database'
// import AppLoading from 'expo-app-loading'
import * as SplashScreen from 'expo-splash-screen'
import PlaceDetails from './screens/PlaceDetails'

const Stack = createNativeStackNavigator()
SplashScreen.preventAutoHideAsync()

export default function App() {
  const [dbInitialized, setDbInitialized] = useState(false)

  useEffect(() => {
    init()
      .then(() => {
        setDbInitialized(true)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  // if (!dbInitialized) {
  //   return <AppLoading />
  // }

  const onLayoutRootView = useCallback(async () => {
    if (dbInitialized) {
      await SplashScreen.hideAsync()
    }
  }, [dbInitialized])

  if (!dbInitialized) {
    return null
  }

  return (
    <>
      <StatusBar style='dark' />
      <View onLayout={onLayoutRootView} style={{ flex: 1 }}>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerStyle: { backgroundColor: Colors.primary500 },
              headerTintColor: Colors.gray700,
              contentStyle: { backgroundColor: Colors.gray700 },
            }}
          >
            <Stack.Screen
              name='AllPlaces'
              component={AllPlaces}
              options={({ navigation }) => ({
                title: 'Your favorite places',
                headerRight: ({ tintColor }) => (
                  <IconButton
                    icon='add'
                    size={24}
                    color={tintColor}
                    onPress={() => navigation.navigate('AddPlace')}
                  />
                ),
              })}
            />
            <Stack.Screen
              name='AddPlace'
              component={AddPlace}
              options={{
                title: 'Add new place',
              }}
            />
            <Stack.Screen name='Map' component={Map} />
            <Stack.Screen
              name='PlaceDetails'
              component={PlaceDetails}
              options={{
                title: 'Loading place...',
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
