import React from 'react'
import { ScrollView, Text, Image, View, DeviceEventEmitter,
  Animated, Alert, PanResponder, Dimensions} from 'react-native'
import DevscreensButton from '../../ignite/DevScreens/DevscreensButton.js'
import FixtureAPI from '../../App/Services/FixtureApi'
import { Images } from '../Themes'
import { WBMapView } from '../../App/WB/WBMapView'
import API from '../../App/Services/Api'
import FJSON from 'format-json'
import styles from './Styles/MainScreenStyles'
import ReactNativeHeading from 'react-native-heading' // docs: https://github.com/yonahforst/react-native-heading
import Geolib from 'geolib' // docs: https://github.com/manuelbieh/geolib

const Window = Dimensions.get('window');
const kGrabBarHeight = 75;

export default class MainScreen extends React.Component {

  api = {}

  constructor (props) {
    super(props)
    this.originalCompassSectionHeight = Window.height/2 - kGrabBarHeight/2;

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
      pan: new Animated.ValueXY(),
      compassSectionHeight: this.originalCompassSectionHeight
    }
    this.api = API.create()
    this.compassHeading = 0;
    this.rhumbLineBearing = 0;
    this.setupDragableBar();
    this.dragBarMidPosition = null;
  }

  setupDragableBar = () => {
    this.panResponder = PanResponder.create({
       onStartShouldSetPanResponder: () => true,
       onPanResponderGrant: (e, gestureState) => {
         this.state.pan.setOffset({x: this.state.pan.x._value, y: this.state.pan.y._value});
         this.state.pan.setValue({x: 0, y: 0});
       },
      onPanResponderMove: (evt, gestureState) => {

      // this.compassSectionHeight += gestureState.dy
      this.setState({
         compassSectionHeight: this.originalCompassSectionHeight + gestureState.dy

       });
     },
       onPanResponderRelease : (e, gesture) => {
         // code to execute when the element is released
          this.originalCompassSectionHeight = this.state.compassSectionHeight
          //  this.state.pan.flattenOffset(); // is this needed? does not appear so
       }
   });
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
    navigator.geolocation.watchPosition(
      (position) => {
        this.updateRegion(position.coords);
        let sortedHubs = this.sortHubsByDistanceFromUser(this.state.hubs, position);
        let chosenHub = 0 // in the future, user will be able to select more than just the closest one.
        this.updateDisplayToChosenHub(position, sortedHubs, chosenHub);
      },(error) => {
        console.log("ERROR in geolocation.watchPosition : " + error.message)
        if (error.code == 1) {
            this.showAlert(
              'Error',
              'Please turn on location services and restart this app.', //
              [{text: 'OK', onPress: this.okayPressed()},
              ]
            );
        }
      }
    );
  }

  okayPressed() {
    console.log('OK Pressed');
    // TODO: make better UX, wait until user position is available and take action.
  }

  showAlert(title, message, buttons) {
    Alert.alert(
      title,
      message,
      buttons,
      { cancelable: false }
    )
  }
  updateDisplayToChosenHub = (position, sortedHubs, index) => {

    this.rhumbLineBearing = geolib.getRhumbLineBearing(
      position.coords,
      {latitude: sortedHubs[index].middle_point.coordinates[1],
        longitude: sortedHubs[index].middle_point.coordinates[0]}
    );
    this.setArrow()
    this.setState({
      bikeHubName: sortedHubs[index].name,
      distance: sortedHubs[index].distance,
      availableBikes: sortedHubs[index].available_bikes,
      freeRacks: sortedHubs[index].free_racks,
    });
  }

  setArrow = () => {
    let degrees = this.rhumbLineBearing - this.compassHeading
    // console.log(degrees);
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
      var heading = data.heading; // iOS returns heading here
      if (heading == undefined) {
          heading = data; // Android returns heading here
      }
      this.compassHeading = heading;
      this.setArrow();
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
        {/* // COMPASS */}
        <View style={{
          height: this.state.compassSectionHeight,
          justifyContent: 'center',
          alignItems: 'stretch',
          backgroundColor: 'powderblue'
        }}>

        <View style={styles.centered}>
          <View
            style={{transform:[{rotate: this.state.arrowRotationDegrees}]}}
            shouldRasterizeIOS={true}
            renderToHardwareTextureAndroid={true}
            >
              <Image source={Images.arrow} style={styles.arrow}/>
            </View>
          </View>

        </View>
        {/* // COMPASS END */}

        {/* // GRAB BAR */}
        <View>
          <Animated.View
            {...this.panResponder.panHandlers}
            // style={[this.state.pan.getLayout()]}
            >
              <View style={{height: kGrabBarHeight, backgroundColor: 'steelblue'}}>

                 <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-around'}}>

                   <Text>
                   {this.state.bikeHubName}
                  </Text>
                  <Text>
                  {this.state.distance + "m"}
                 </Text>
                 </View>
                 <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-around'}}>

                 <Text>
                 {'Available bikes: ' + this.state.availableBikes}
                </Text>
                <Text >
                  {'Free racks: ' + this.state.freeRacks}
                </Text>

                 </View>


              </View>


          </Animated.View>

        </View>
        {/* // END GRAB BAR */}

        {/* // MAP */}
        <View style={{
          // height: Window.height/2 - kGrabBarHeight/2,
          flex: 1,
          justifyContent: 'center',
          alignItems: 'stretch'

        }}>

        <WBMapView
          hubs={this.state.hubs}
          region={this.state.wbMapRegion}
          onPanDragCallback={stopFollowingUser => {
            this.stopFollowingUser()
          }}
          scrollEnabled= {this.state.isMapScrollEnabled}
        />

      </View>
     {/* // END MAP */}
   </View>
   
    )
  }
}
