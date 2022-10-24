<template>
    <div>
        <div
            class="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-white border-bottom shadow-sm">
            <h5 class="my-0 mr-md-auto font-weight-normal">Company name</h5>
            <nav class="my-2 my-md-0 mr-md-3">
                <NuxtLink class="p-2 text-dark" to="/">Home</NuxtLink>
                <NuxtLink class="p-2 text-dark" to="/tickets/new">New Ticket</NuxtLink>
                <NuxtLink class="p-2 text-dark" to="/user">User</NuxtLink>
            </nav>
            <NuxtLink v-if="!$auth.user" class="btn btn-outline-primary" to="/login">Sign In</NuxtLink>
            <NuxtLink v-if="!$auth.user" class="btn btn-outline-primary ml-1" to="/auth/signup">Sign up</NuxtLink>
            <div v-if="$auth.user">Hello {{ $auth.user.email }}</div>
            <a v-if="$auth.user" class="btn btn-outline-primary ml-1" href="/login"
                @click.prevent="$auth.logout(); $router.push('/login');">Logout</a>
        </div>

        <div class="container">
            <ShowError />
            <Nuxt />
        </div>
    </div>
</template>

<script>
import ShowError from '../components/show-error.vue';
// import { mapGetters } from 'vuex'
export default {
    components: { ShowError }
}
</script>>