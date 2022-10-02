<template>
    <form method="post" @submit.prevent="signIn">
        <h1>Sign In</h1>
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
                email: '',
                password: '',
            },
            errors: [],
        }
    },
    computed: {
        // ...mapGetters({
        //     errs: "index/getErrors"
        // })
    },
    methods: {
        async signIn() {
            this.errors = [];
            // console.log('sign up', this.form);
            try {
                const response = await this.$axios.post('/api/users/signin', this.form);
            } catch (err) {
                this.errors = err.response.data.errors;
            }
        }


    }
}
</script>>