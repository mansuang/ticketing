export default function ({ $axios }) {

    $axios.defaults.headers.common['host'] = 'ticketing.test'
    $axios.defaults.headers.common['cookie'] = 'auth.strategy=local; session=eyJqd3QiOiJleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKcFpDSTZJall6TXpnMU5UQXpOemhpTldJeE56VXlZVGhsWXpaallpSXNJbVZ0WVdsc0lqb2lkR1Z6ZEVCMFpYTjBMbU52YlNJc0ltbGhkQ0k2TVRZMk5EWTRNakV5TVgwLk5LQkV1RVZMR3ZQSWVqdzUyZXhSX016TmVGQ2YwelA1eHVpNlZFSWM0VncifQ==; auth.redirect=%2F; auth._token_expiration.local=false; auth._token.local=false'
    console.log('Making request to ')

}