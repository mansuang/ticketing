<template>
    <div>
        <h1>Order# {{ order.id }}</h1>
        <nuxt-link :to="`/tickets/${order.ticket.id}`">Back</nuxt-link>
        <b-card :title="order.ticket.title" img-alt="Image" img-top tag="article" class="mb-2">
            <b-card-text>
                <div>Price: ${{ order.ticket.price }}</div>
                <div v-if="isExpire">Order is expired</div>
                <div v-if="!isExpire">Order will expire in {{ expireInSeconds }} seconds</div>
            </b-card-text>

            <b-button :disabled="isExpire" href="#" variant="primary" @click.prevent="payOrder(order.id)">Pay</b-button>
        </b-card>
        <stripe-checkout ref="checkoutRef" mode="payment" :pk="publishableKey" :line-items="lineItems"
            :success-url="successURL" :cancel-url="cancelURL" @loading="v => loading = v" />
    </div>
</template>

<script>
import { StripeCheckout } from '@vue-stripe/vue-stripe';
export default {
    components: { StripeCheckout },
    data() {
        // this.publishableKey = process.env.STRIPE_PUBLISHABLE_KEY;
        return {
            order: {
                id: null,
                expiresAt: (new Date()).toISOString(),
                ticket: {
                    title: null,
                    price: 0
                },
            },
            expireInSeconds: 0,
            timer: null,
            loading: false,
            successURL: 'https://ticketing.test',
            cancelURL: 'https://ticketing.test/tickets/new',
            publishableKey: 'pk_test_51LwEFKHacTtnL4oasMMJuULucS5OLngThg9MOzTtU2r4mBSpZz0jczoFHHILsWzf1mRh4MbBCZK2jcvNMLUcK7xh00BC4vH223'
        };
    },
    computed: {
        isExpire() {
            return this.expireInSeconds < 0;
        },
        lineItems() {
            return [
                {
                    price: (this.order.ticket.price).toString(), // The id of the one-time price you created in your Stripe dashboard
                    quantity: 1,
                },
            ];
        }
    },
    methods: {
        async getOrder(orderId) {
            const order = await this.$axios.get(`/api/orders/${orderId}`);
            this.order = order.data;
        },
        async payOrder(orderId) {
            this.$refs.checkoutRef.redirectToCheckout();
            // try {
            //     const order = await this.$axios.post(`/api/payments`, {
            //         token: 'tok_visa',
            //         orderId: orderId,
            //     })
            // } catch (err) {
            //     return;
            // }

            // this.$bvModal.msgBoxOk('Ticket has been added !');
        },
        countExpire() {
            const msLeft = new Date(this.order.expiresAt) - new Date()
            this.expireInSeconds = Math.round(msLeft / 1000);
            if (this.isExpire) {
                clearInterval(this.timer);
            }
        }
    },
    created() {
        this.getOrder(this.$route.params.order);
        // this.timer = setInterval(this.countExpire, 1000);
        console.log('ENV', process.env)
    }

}
</script>