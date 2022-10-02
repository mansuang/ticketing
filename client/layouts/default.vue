<template>
    <div class="container">
        <nav>
            <ul>
                <li>
                    <NuxtLink to="/">Home</NuxtLink>
                </li>
                <li>
                    <NuxtLink to="/user">user</NuxtLink>
                </li>
                <li>
                    <NuxtLink to="/auth/signup">Sign Up</NuxtLink>
                </li>
                <li>
                    <NuxtLink to="/login">Sign In</NuxtLink>
                </li>
                <li>
                    <a href="#" @click.prevent="$auth.logout(); $router.push('/login');">Logout</a>
                </li>
            </ul>
        </nav>
        <Nuxt />
    </div>
</template>

<script>
// import { mapGetters } from 'vuex'
export default {
}
</script>>