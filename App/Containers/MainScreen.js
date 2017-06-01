import React from 'react'
import { ScrollView, Text, Image, View } from 'react-native'
import DevscreensButton from '../../ignite/DevScreens/DevscreensButton.js'

import { Images } from '../Themes'

// Styles
import styles from './Styles/MainScreenStyles'

export default class MainScreen extends React.Component {

  foo = () =>  {
    console.log('bar')
  }

  render () {

    {this.foo()}


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
