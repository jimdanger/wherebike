export default {
  getHubs: () => {
    return {
      ok: true,
      data: require('../Fixtures/hubs.json')
    }
  },
}
