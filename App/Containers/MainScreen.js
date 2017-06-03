import React from 'react'
import { ScrollView, Text, Image, View } from 'react-native'
import DevscreensButton from '../../ignite/DevScreens/DevscreensButton.js'
import FixtureAPI from '../../App/Services/FixtureApi'


import { Images } from '../Themes'
// import MapView from 'react-native-maps'
import { WBMapView } from '../../App/WB/WBMapView'

// For API
import API from '../../App/Services/Api'
import FJSON from 'format-json'

// Styles
import styles from './Styles/MainScreenStyles'

export default class MainScreen extends React.Component {

  api = {}
  // mapregion = region: { // SF
  //   latitude: 37.78825,
  //   longitude: -122.4324,
  //   latitudeDelta: 0.0922,
  //   longitudeDelta: 0.0421,
  // };

  constructor (props) {
    super(props)
    this.state = {
      hubs: [],
      displaytext: 'sometext',
      wbMapRegion: { // Atlanta
          latitude: 33.7627864,
          longitude: -84.3829767,
          latitudeDelta: 0.3922,
          longitudeDelta: 0.3421,
      },
      userLat: null,
      userLong: null,
      geolocationError: null,
      shouldMapFollowUser : true,
      isMapScrollEnabled : false // see commit message for more details.
    }

    this.api = API.create()
  }

  componentDidMount() {
      this.getHubs()
      this.getUserPosition()
      this.startWatchingUserPosition()
  }

  getHubs() {
    // this.callGetHubs()
    this.getMockHubs()
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
      })
    } else {
      // TODO: do something about the error.
    }
  }

  getUserPosition() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.updateRegion(position.coords);
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
        });

      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  }

  startWatchingUserPosition() {
    navigator.geolocation.watchPosition((position) => {
      console.log(position.coords)
      this.updateRegion(position.coords);
   });
  }

  updateRegion = (coords) => {
    if (this.state.shouldMapFollowUser){
      this.setState({
        wbMapRegion: {
            latitude: coords.latitude,
            longitude: coords.longitude,
            latitudeDelta: 0.2922,
            longitudeDelta: 0.2421,
        },
      });
    }
  }

  stopFollowingUser = () => {
    this.setState({
      shouldMapFollowUser: false,
      isMapScrollEnabled: true
    });
  }

  render () {
    return (

      <View style={styles.mainContainer}>
        <View style={styles.container}>

          <View style={styles.centered}>
            <Image source={Images.launch} style={styles.logo} />
          </View>

          <View style={styles.section} >

            <Text style={styles.sectionText}>
              {this.state.displaytext}
            </Text>

          </View>

          <View style={styles.mapContainer} >
            <WBMapView
              hubs={this.state.hubs}
              region={this.state.wbMapRegion}
              onPanDragCallback={stopFollowingUser => {
                this.stopFollowingUser()
              }}
              scrollEnabled= {this.state.isMapScrollEnabled}
            />
          </View>

        </View>
      </View>
    )
  }
}
