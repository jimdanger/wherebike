import { StyleSheet } from 'react-native'
import { Metrics, ApplicationStyles } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    paddingBottom: Metrics.baseMargin,
    flex: 1,
    backgroundColor : '#177E89'
    // https://coolors.co/177e89-084c61-db3a34-ffc857-323031
  },
  mapContainer: {
    paddingBottom: Metrics.baseMargin,
    flex: 1,
    backgroundColor : '#177E89'
    // https://coolors.co/177e89-084c61-db3a34-ffc857-323031
  },
  logo: {
    marginTop: Metrics.doubleSection,
    height: Metrics.images.logo,
    width: Metrics.images.logo,
    resizeMode: 'contain'
  },
  centered: {
    alignItems: 'center'
  }
})
