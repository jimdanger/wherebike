import React from 'react'
import { ScrollView, Text, Image, View } from 'react-native'
import DevscreensButton from '../../ignite/DevScreens/DevscreensButton.js'

import { Images } from '../Themes'

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
      this.getHubs()
  }

  getHubs() {
    this.callGetHubs()
  }

  callGetHubs = () => {
    this.api['getHubs'].apply(this, ['31']).then((result) => {
      this.processGetHubsAPIResult(result)
    })
  }

  processGetHubsAPIResult = (response) => {
    if (response.ok) {
      console.log(FJSON.plain(response.data))
      // debugger;
      this.setState({
          hubs: response.data,
          displaytext : response.data[0].address
      })

      console.log(this.state.hubs[0].address)

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

          <DevscreensButton />
        </ScrollView>
      </View>
    )
  }
}
