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
      text : 'useless example text'
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
        // provider ={'google'} // TODO: uncomment and fix error - import google maps
        scrollEnabled={this.props.scrollEnabled}

        showsMyLocationButton
        onPress={() => {console.log('triggering onPress')}}
        onPanDrag={() => {
          this.props.onPanDragCallback();
          console.log('triggering onPanDrag')
        }}
        // followUserLocation = {false}

      />
    );
  }
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  }
});
