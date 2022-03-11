import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import VueTestcaseMinderEditor from 'vue-testcase-minder-editor'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    caseEditorStore: VueTestcaseMinderEditor.caseEditorStore
  },
  getters
})

export default store
