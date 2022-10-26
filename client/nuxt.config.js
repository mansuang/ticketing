module.exports = {
    modules: [
        'bootstrap-vue/nuxt',
        '@nuxtjs/axios',
        '@nuxtjs/auth-next'
    ],
    axios: {
        baseURL: '/',
        credentials: true,
        secure: false,
    },
    publicRuntimeConfig: {
        axios: {
            browserBaseURL: "/"
        }
    },

    privateRuntimeConfig: {
        axios: {
            baseURL: "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local"
        }
    },
    auth: {
        plugins: [
            '~/plugins/axios',
        ],
        redirect: {
            login: '/login',
            logout: '/',
            callback: '/login',
            home: '/user'
        },
        strategies: {
            local: {
                scheme: '~/schemes/customStrategy',
                token: {
                    property: 'token',
                    global: true,
                    // required: true,
                    // type: 'Bearer'
                },
                user: {
                    property: 'currentUser',
                    // autoFetch: true
                },
                endpoints: {
                    login: { url: '/api/users/signin', method: 'post' },
                    logout: { url: '/api/users/signout', method: 'post' },
                    user: { url: '/api/users/currentuser', method: 'get' }
                }
            }
        }
    },
    router: {
        middleware: ['auth', 'clearValidationErrors']
    },
    plugins: [
        '~/plugins/validation',
    ],
    ssr: true,
}