<template>
    <div>
        <nuxt-link to="/">Back</nuxt-link>
        <b-card :title="ticket.title" img-alt="Image" img-top tag="article" class="mb-2">
            <b-card-text>
                ${{ ticket.price }}
            </b-card-text>

            <b-button href="#" variant="primary" @click.prevent="purchaseTicket(ticket.id)">Purchase</b-button>
        </b-card>

    </div>
</template>

<script>

export default {
    data() {
        return {
            ticket: {
                title: null,
                price: null,
            }
        }
    },
    methods: {
        async getTicket(ticketId) {
            const ticket = await this.$axios.get(`/api/tickets/${ticketId}`);
            this.ticket = ticket.data;
        },
        async purchaseTicket(ticketId) {
            try {
                const order = await this.$axios.post(`/api/orders`, { ticketId })
                console.log('order', order);
                this.$router.push(`/orders/${order.data.id}`)
            } catch (err) {
                return;
            }
        }
    },
    created() {
        this.getTicket(this.$route.params.ticket);
    }

}
</script>