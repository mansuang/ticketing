module.exports = {
    modules: [
        'bootstrap-vue/nuxt',
        '@nuxtjs/axios',
        '@nuxtjs/auth-next'
    ],
    axios: {
        baseURL: '/',
        credentials: true
    },
    publicRuntimeConfig: {
        axios: {
            browserBaseURL: "/"
        }
    },

    privateRuntimeConfig: {
        axios: {
            baseURL: "https://ingress-nginx-controller.ingress-nginx.svc.cluster.local"
        }
    },
    auth: {
        plugins: [
            '~/plugins/axios',
            // '~/plugins/ssr-request',
        ],
        redirect: {
            login: '/login',
            logout: '/',
            callback: '/login',
            home: '/user'
        },
        strategies: {
            sanctumToken: {
                provider: 'laravel/jwt',
                url: '/',
                token: {
                    property: 'token',
                    global: true,
                    // required: true,
                    // type: 'Bearer'
                },
                user: {
                    // property: 'user',
                    // autoFetch: true
                },
                endpoints: {
                    login: { url: '/api/users/signin', method: 'post' },
                    logout: { url: '/api/users/signout', method: 'post' },
                    user: { url: '/api/users/currentuser', method: 'get' }
                }
            },
            local: {
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
    ssr: false,
}