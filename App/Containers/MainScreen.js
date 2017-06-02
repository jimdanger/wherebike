import React from 'react'
import { ScrollView, Text, Image, View } from 'react-native'
import DevscreensButton from '../../ignite/DevScreens/DevscreensButton.js'
import FixtureAPI from '../../App/Services/FixtureApi'


import { Images } from '../Themes'
import MapView from 'react-native-maps'

// For API
import API from '../../App/Services/Api'
import FJSON from 'format-json'

// Styles
import styles from './Styles/MainScreenStyles'

export default class MainScreen extends React.Component {

  api = {}

  constructor (props) {
    super(props)
    this.state = {
      hubs: [],
      displaytext: 'sometext'
    }
    this.api = API.create()
    this.getHubs = this.getHubs.bind(this)
  }

  componentDidMount() {
      // this.getHubs()
      this.getMockHubs()
  }

  getHubs() {
    this.callGetHubs()
  }

  callGetHubs = () => {
    this.api['getHubs'].apply(this, ['31']).then((result) => {
      this.processGetHubsAPIResult(result)
    })
  }

  getMockHubs(){
    this.processGetHubsAPIResult(FixtureAPI.getHubs())
  }

  processGetHubsAPIResult = (response) => {
    if (response.ok) {
      console.log(FJSON.plain(response.data))

      this.setState({
          hubs: response.data,
          displaytext : response.data[0].address
      }, ()=> {
        console.log(this.state.hubs[0].address)
        // here is where we can sort, store, calculate distance, 
        // display info, and otherwise do things with the hubs.
      })
    } else {
      // TODO: do something about the error.
    }
  }

  render () {
    return (

      <View style={styles.mainContainer}>
        <ScrollView style={styles.container}>

          <View style={styles.centered}>
            <Image source={Images.launch} style={styles.logo} />
          </View>

          <View style={styles.section} >
            {/* <Image source={Images.ready} /> */}
            {/* // how to make this dynamic? */}
            <Text style={styles.sectionText}>
              {this.state.displaytext}
            </Text>
          </View>

          <View style={styles.section} >

            <MapView
              style={styles.map}
              initialRegion={{
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            />
          </View>

          {/* <DevscreensButton /> */}
        </ScrollView>
      </View>
    )
  }
}
