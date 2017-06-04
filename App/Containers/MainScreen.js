import React from 'react'
import { ScrollView, Text, Image, View, DeviceEventEmitter} from 'react-native'
import DevscreensButton from '../../ignite/DevScreens/DevscreensButton.js'
import FixtureAPI from '../../App/Services/FixtureApi'
import { Images } from '../Themes'
import { WBMapView } from '../../App/WB/WBMapView'
import API from '../../App/Services/Api'
import FJSON from 'format-json'
import styles from './Styles/MainScreenStyles'
import ReactNativeHeading from 'react-native-heading' // TODO: follow installation for Android, https://github.com/yonahforst/react-native-heading
import Geolib from 'geolib' // docs: https://github.com/manuelbieh/geolib

export default class MainScreen extends React.Component {

  api = {}

  constructor (props) {
    super(props)
    this.state = {
      hubs: [],
      bikeHubName: 'bikeHubName',
      distance: 'distance',
      availableBikes: 'availableBikes',
      freeRacks: 'freeRacks',
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
      isMapScrollEnabled : false, // see commit message for details on why this is needed.
      headingIsSupported: false,
      arrowRotationDegrees: '0 deg',
      compassHeading: 0,
      rhumbLineBearing: 0
    }
    this.api = API.create()
  }

  componentDidMount() {
      this.getHubs()
      this.startGettingCompassHeading()
  }

  componentWillUnmount() {
  	ReactNativeHeading.stop();
  	DeviceEventEmitter.removeAllListeners('headingUpdated');
  }

  getHubs() {
    // this.callGetHubs() // TODO: DO NOT DELETE THIS LINE. this is the real api call.
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
      }, ()=> {
        this.startWatchingUserPosition()

      })
    } else {
      // TODO: do something about the error.
    }
  }

  startWatchingUserPosition() {
    navigator.geolocation.watchPosition((position) => {
      console.log(position.coords);
      this.updateRegion(position.coords);
      let sortedHubs = this.sortHubsByDistanceFromUser(this.state.hubs, position);
      let chosenHub = 0 // in the future, user will be able to select more than just the closest one.
      this.updateDisplayToChosenHub(position, sortedHubs, chosenHub);
   });
  }

  updateDisplayToChosenHub = (position, sortedHubs, index) => {

    let rhumbLineBearing = geolib.getRhumbLineBearing(
      position.coords,
      {latitude: sortedHubs[index].middle_point.coordinates[1],
        longitude: sortedHubs[index].middle_point.coordinates[0]}
    );

    this.setState({
      bikeHubName: sortedHubs[index].name,
      distance: sortedHubs[index].distance,
      availableBikes: sortedHubs[index].available_bikes,
      freeRacks: sortedHubs[index].free_racks,
      rhumbLineBearing: rhumbLineBearing,
    }, ()=> {
      this.setArrow()
    });
  }

  setArrow = () => {
    console.log('setArrow called');

    let degrees = this.state.rhumbLineBearing - this.state.compassHeading
    this.setState({
      arrowRotationDegrees: degrees + ' deg'
    });

  }

  updateRegion = (coords) => {
    if (this.state.shouldMapFollowUser){
      this.setState({
        wbMapRegion: {
            latitude: coords.latitude,
            longitude: coords.longitude,
            latitudeDelta: 0.0122,
            longitudeDelta: 0.0011,
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

  startGettingCompassHeading = () => {
    ReactNativeHeading.start(1)
    .then(didStart => {
      this.setState({
        headingIsSupported: didStart,
      })
    })

    DeviceEventEmitter.addListener('headingUpdated', data => {
      this.setState({
        compassHeading: data.heading,
      }, ()=> {
        this.setArrow()
      })
    });
  }



  sortHubsByDistanceFromUser = (hubs, userPosition) => { // TODO: write a test for this function.

    // create array of object that 'geolib.orderByDistance' expects:
    var spots = []
    for (var i = 0; i < hubs.length; i++) {
      spots.push({latitude: hubs[i].middle_point.coordinates[1], longitude: hubs[i].middle_point.coordinates[0]} );
    }

    // Returns a sorted array [{latitude: x, longitude: y, distance: z, key: property}]
    let orderedHubKeys = geolib.orderByDistance(userPosition.coords, spots);

    // use the new sorted array and its key property to sort actual hubs.
    var sortedHubs = []
    for (var i = 0; i < orderedHubKeys.length; i++) {
        let hub = hubs[orderedHubKeys[i].key]
        hub.distance = orderedHubKeys[i].distance
        sortedHubs.push(hub);
    }
    return sortedHubs
  }

  render () {
    return (

      <View style={styles.mainContainer}>
        <View style={styles.container}>

          <View style={styles.centered}>
              <View style={{transform:[{rotate: this.state.arrowRotationDegrees}]}}>
            <Image source={Images.arrow} style={styles.logo} />
            </View>
          </View>

          <View style={styles.section} >

            <Text style={styles.sectionText}>
              {this.state.bikeHubName}
            </Text>

            {/*
            <Text style={styles.sectionText}>
              {this.state.distance + "m"}
            </Text>
            <Text style={styles.sectionText}>
              {'Available bikes: ' + this.state.availableBikes}
            </Text>
            <Text style={styles.sectionText}>
              {'Free racks: ' + this.state.freeRacks}
            </Text>
             */}

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
