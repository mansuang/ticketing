export default function ({ $axios }) {

    $axios.defaults.headers.common['host'] = 'ticketing.test'

}