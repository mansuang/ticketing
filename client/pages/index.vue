<template>
    <div>
        <h1>Tickets</h1>
        <b-table striped hover :items="formatTickets" :sort-by.sync="sortBy" :sort-desc.sync="sortDesc">
            <!-- A custom formatted column -->
            <template #cell(title)="data">
                <b>{{ data.value }}</b>
            </template>

            <template #cell(id)="data">
                <nuxt-link :to="`/tickets/${data.value}`">View</nuxt-link>
            </template>
        </b-table>
    </div>
</template>

<script>

export default {
    data() {
        return {
            sortBy: 'title',
            sortDesc: false,
            tickets: []
        }
    },
    computed: {
        formatTickets() {
            return this.tickets.map((ticket) => {
                return { title: ticket.title, price: ticket.price, id: ticket.id };
            });
        }
    },
    methods: {
        async getTickets() {
            const tickets = await this.$axios.get('/api/tickets');
            this.tickets = tickets.data;
        }
    },
    created() {
        this.getTickets();
    }
}
</script>
