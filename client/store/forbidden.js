export const state = () => ({
    errors: null
});

export const getters = {
    errors(state) {
        return state.errors;
    }
};

export const mutations = {
    SET_VERIFICATION_ERRORS(state, errors) {
        state.errors = errors;
    }
};

export const actions = {
    setErrors({commit}, errors) {
        commit('SET_VERIFICATION_ERRORS', errors);
    },
    clearErrors({commit}) {
        commit('SET_VERIFICATION_ERRORS', null);
    }
};