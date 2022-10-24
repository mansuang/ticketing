<template>
    <div>
        <h1>Create a Ticket</h1>
        <form @submit.prevent="createTicket">
            <div class="form-group">
                <label>Title</label>
                <input class="form-control" v-model="form.title" />
            </div>
            <div class="form-group">
                <label>Price</label>
                <input type="number" min="0" step="1" class="form-control" v-model="form.price" />
            </div>
            <button class="btn btn-primary">Submit</button>
        </form>
    </div>
</template>

<script>

export default {
    data() {
        return {
            form: {
                title: '',
                price: '',
            }
        }
    },
    methods: {
        async createTicket() {
            try {
                const ticket = await this.$axios.post('/api/tickets', this.form);
            } catch (err) {
                return;
            }


            this.$bvModal.msgBoxOk('Ticket has been added !');

            this.form.title = '';
            this.form.price = '';

            this.$router.push('/');
            return;
        }
    }
}
</script>