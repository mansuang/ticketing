<template>
    <form method="post" @submit.prevent="userLogin">
        <h1>Sign Inx {{ $auth.loggedIn ? 'Login' : 'guest' }}</h1>
        <div class="form-group">
            <label>Email Address</label>
            <input class="form-control" v-model="form.email" />
        </div>
        <div class="form-group">
            <label>Password</label>
            <input type="password" class="form-control" v-model="form.password" />
        </div>
        <div class="alert alert-danger" v-if="errors.length">
            <ul class="my-0">
                <li v-for="(error,index) in errors" :key="index">{{ error.message }}</li>
            </ul>
        </div>
        <button class="btn btn-primary">Sign In</button>
    </form>
</template>

<script>
// import { mapGetters } from 'vuex'
export default {
    auth: false,
    data() {
        return {
            form: {
                email: 'test@test.com',
                password: 'password',
            },
        }
    },
    computed: {
        // ...mapGetters({
        //     errs: "index/getErrors"
        // })
    },
    methods: {
        async userLogin() {
            let response = await this.$auth.loginWith('local', { data: this.form })
            this.$router.push('/');
        }
    },
    created() {
        console.log('loggedIn', this.$auth.loggedIn)
        console.log('user', this.$auth.user)
        console.log('axios baseUrl', this.$axios.defaults.baseURL)
    }
}
</script>>