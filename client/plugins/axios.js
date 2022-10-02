export default function ({ $axios, store, $auth, redirect }) {

    $axios.onRequest((config) => {
        console.log('config', config)
    })

    $auth.onRedirect((to, from) => {
        console.log('redirectFrom', from)
        console.log('redirectTo', to)
        console.log('redirect.LoggedIn !!!', $auth?.loggedIn)
        // you can optionally change `to` by returning a new value
    })

    console.log({
        "server": process.server,
        "client": process.client
    })


    console.log('$auth.LoggedIn !!!', $auth?.loggedIn)


    $axios.onError(error => {
        if (error.response.status === 400 || error.response.status === 422) {
            store.dispatch('validation/setErrors', error.response.data.errors);
            return Promise.resolve(error);
        }

        if (error.response.status === 403) {
            store.dispatch('forbidden/setErrors', error.response.data.message);
            return Promise.resolve(error);
            // redirect('/forbidden')
        }

        // if (error.response.status === 401) {
        //     if ($auth.loggedIn) {
        //       $auth.logout();
        //     }
        //     redirect("/login");
        //   }        

        return Promise.reject(error);
    });

    $axios.onRequest(() => {
        store.dispatch('validation/clearErrors');

    });

}