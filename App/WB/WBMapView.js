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
    // do something maybe?
  }

  render () {

    return (
      <MapView.Animated
        style={styles.map}
        region={this.props.region}
        onRegionChange={this.onRegionChange}
        showsUserLocation
        // provider ={'google'} // TODO: uncomment and fix error - import google maps to ios
        scrollEnabled={this.props.scrollEnabled}
        showsCompass={true}
        onPress={() => {console.log('triggering onPress')}}
        onPanDrag={() => {
          this.props.onPanDragCallback();
        }}
      >

        {this.props.hubs.map(hub => (
          <MapView.Marker
            key={hub.name} // to silence warning. "Warning: Each child in an array or iterator shoul dhave unique 'key' prop."
            coordinate={{
              longitude: hub.middle_point.coordinates[0],
              latitude: hub.middle_point.coordinates[1]
            }}
            title={hub.name}
            description={'Available bikes: ' + hub.available_bikes + '. Free racks: ' + hub.free_racks}
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
