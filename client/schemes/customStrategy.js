import { LocalScheme } from '~auth/runtime';


export default class CustomScheme extends LocalScheme {
    // Override `fetchUser` method of `local` scheme
    async fetchUser(endpoint) {
        // Token is required but not available
        // Try to fetch user and then set
        this.$auth.ctx.app.$axios.defaults.headers.common['host'] = process.env.API_HOST_NAME || 'ticketing.test'

        if (!this.check().valid) {
            return
        }

        // User endpoint is disabled.
        if (!this.options.endpoints.user) {
            this.$auth.setUser({})
            return
        }


        return this.$auth.requestWith(
            this.name,
            endpoint,
            this.options.endpoints.user
        ).then((response) => {
            // const user = getProp(response.data, this.options.user.property)
            const user = response.data.currentUser;
            // Transform the user object
            const customUser = {
                ...user,
                // fullName: user.firstName + ' ' + user.lastName,
                roles: ['user']
            }


            // Set the custom user
            // The `customUser` object will be accessible through `this.$auth.user`
            // Like `this.$auth.user.fullName` or `this.$auth.user.roles`
            this.$auth.setUser(customUser)

            return response
        }).catch((error) => {
            console.log('Server Request Error', error);
            this.$auth.callOnError(error, { method: 'fetchUser' })
        })
    }
}