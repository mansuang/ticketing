<template>
    <div>
        <h1>Order# {{ order.id }}</h1>
        <nuxt-link :to="`/tickets/${order.ticket.id}`">Back</nuxt-link>
        <b-card :title="order.ticket.title" img-alt="Image" img-top tag="article" class="mb-2">
            <b-card-text>
                ${{ order.ticket.price }}
            </b-card-text>

            <b-button href="#" variant="primary" @click.prevent="payOrder(order.id)">Pay</b-button>
        </b-card>
    </div>
</template>

<script>

export default {
    data() {
        return {
            order: {
                id: null,
                expiresAt: null,
                ticket: {
                    title: null,
                    price: null
                },
            }
        }
    },
    methods: {
        async getOrder(orderId) {
            const order = await this.$axios.get(`/api/orders/${orderId}`);
            this.order = order.data;
        },
        async payOrder(orderId) {
            try {
                const order = await this.$axios.post(`/api/payments`, {
                    token: 'tok_visa',
                    orderId: orderId,
                })
            } catch (err) {
                return;
            }

            this.$bvModal.msgBoxOk('Ticket has been added !');
        }
    },
    created() {
        this.getOrder(this.$route.params.order);
    }

}
</script>