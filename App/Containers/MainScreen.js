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
    // this.state = {
    //   visibleHeight: Metrics.screenHeight
    // }

    this.api = API.create()
  }


  getHubs = () =>  {

    this.api['getHubs'].apply(this, ['31']).then((result) => {
      console.log(FJSON.plain(result.data))
      // this.showResult(result, label || `${endpoint}(${args.join(', ')})`)
    })
    console.log('bar')
  }

  render () {

    {this.getHubs()}

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
              50m
            </Text>

          </View>

          <DevscreensButton />
        </ScrollView>
      </View>
    )
  }
}
