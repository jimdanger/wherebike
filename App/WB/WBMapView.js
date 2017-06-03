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
    };
  }

  onRegionChange(region) {
    debugger;
    this.setState({ region });
  }


  render () {

    // debugger;

    return (
      <MapView.Animated
        style={styles.map}
        initialRegion={this.props.region}
        showsUserLocation
      />
    );
  }
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  }
});
