import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import MapView from 'react-native-maps'

export class WBMapView extends Component {

  constructor (props) {
    super(props);
    this.state = {
      text : 'useless example text',

      markers: [{
          title: 'hello',
          coordinates: {
            latitude: 37.700668, //37.700668, -122.465280
            longitude: -122.465280
          },
        },
        {
          title: 'world',
          coordinates: {
            latitude: 3.149771,
            longitude: 101.655449
          },
        }]


    };
  }

  onRegionChange(region) {
    // do something maybe?
  }

  render () {

    // debugger;

    return (
      <MapView.Animated
        style={styles.map}
        region={this.props.region}
        onRegionChange={this.onRegionChange}
        showsUserLocation
        // provider ={'google'} // TODO: uncomment and fix error - import google maps to ios
        scrollEnabled={this.props.scrollEnabled}
        onPress={() => {console.log('triggering onPress')}}
        onPanDrag={() => {
          this.props.onPanDragCallback();
        }}
      >
        {/* // annotations: */}
          {this.state.markers.map(marker => (
              <MapView.Marker
                key={marker.title} // to silence warning. "Warning: Each child in an array or iterator shoul dhave unique 'key' prop."
                coordinate={marker.coordinates}
                title={marker.title}
              />
            ))}


        </MapView.Animated>


    );
  }
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  }
});
