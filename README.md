#  Where Bike


## :bike: :bike: Description

* A React-Native project which runs on iOS and Android.
* Easily locate the closest Atlanta bike-share hub.
* See map with all hubs, and arrow pointing to closest hub. All by merely launching the app.
* Displays real-time data about available bikes and free racks.
* Gesture recognizers allow users to pull for larger map view.

<p align="center">
  <a>
    <img src="wherebike.gif" title="MVP demo" alt="vimrcBuilder Demo" border="10"/>
  </a>
</p>

UI still needs polish and TLC. This gif demonstrates the functionality.

## :arrow_up: How to Setup

**Step 1:** git clone this repo:

**Step 2:** cd to the cloned repo:

**Step 3:** Install the Application with `npm install`


## :arrow_forward: How to Run App

1. `cd` to the repo
2. Run Build for either OS
  * for iOS
    * run `react-native run-ios`
  * for Android
    * connect exactly one physical Android device to your computer via USB.
    * ensure connectivity by running `$ adb devices`
    * run `react-native run-android`


## :construction: Work in Progress

* This project works and has basic functionality.  However, proceed with caution.
* Main features left to add:
  * UI polish 
  * Integrate with other cities.
  * Display public bike racks.
    * Atlanta's bike-share program allows users to return bikes either at a bike-share hub, or by simply locking it to any public bike rack. (Small additional fee applies.)
    * The ability to view hubs and public racks in the same UI would be a good value add.
  * Allow user to swipe compass left/right to select next closest hubs.





## :thumbsup: Other notes

* Compass will not work on the iOS emulator.
* You will notice lag in developer mode. Use Xcode to build with a release scheme to avoid lag. See [these docs for more details](https://facebook.github.io/react-native/docs/running-on-device.html).  
* I used [Ignite](https://infinite.red/ignite) to generate boilerplate code and get started quickly.
* To explore, I recommend you start with App/Containers/MainScreen.js
* This was my first react-native project. I welcome feedback, open an issue! :smiley:





<!-- ## :closed_lock_with_key: Secrets

This project uses [react-native-config](https://github.com/luggit/react-native-config) to expose config variables to your javascript code in React Native. You can store API keys
and other sensitive information in a `.env` file:

```
API_URL=https://myapi.com
GOOGLE_MAPS_API_KEY=abcdefgh
```

and access them from React Native like so:

```
import Secrets from 'react-native-config'

Secrets.API_URL  // 'https://myapi.com'
Secrets.GOOGLE_MAPS_API_KEY  // 'abcdefgh'
```

The `.env` file is ignored by git keeping those secrets out of your repo. -->
