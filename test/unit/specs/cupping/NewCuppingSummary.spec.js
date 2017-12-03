import NewCuppingSummary from '@/cupping/NewCuppingSummary'
import Vue from 'vue'
import Vuex from 'vuex'
import Cupping from 'src/store/modules/cupping'
import Sessions from 'src/store/modules/sessions'
import { mount } from 'vue-test-utils'

describe('NewCuppingSummary.vue', () => {
  Vue.use(Vuex)

  const cupping = {
    id: 1,
    location: 'Cafe Grumpy Chelsea circa 2009',
    cupDate: 'Sat Oct 14 2017 20:01:59 GMT-0700 (PDT)',
    cupsPerSample: 3,
    host_id: 224,
    open: true,
    cuppedCoffees: [
      {
        coffee: {
          id: 31,
          name: 'Kreb-Full-o Java',
          origin: 'Carazo, Nicaragua',
          producer: 'Leopold Berge I',
          variety: 'Red Bourbon'
        },
        coffeeAlias: 'sample 1',
        coffeeId: 31,
        cuppingId: 1,
        id: 52,
        roastDate: '2017-10-13T08:00:00.000Z',
        roaster: {
          id: 4,
          location: 'Itzelborough',
          name: 'Chillwave Roastery',
          website: 'http://bartoletti.co/donny'
        },
        roasterId: 4
      },
      {
        coffee: {
          id: 31,
          name: 'Morning America',
          origin: 'Opalca, Honduras',
          producer: 'Mose Murazik',
          variety: 'Mundo Novo'
        },
        coffeeAlias: 'sample 2',
        coffeeId: 33,
        cuppingId: 1,
        id: 53,
        roastDate: '2017-10-13T08:00:00.000Z',
        roaster: {
          id: 5,
          location: 'Pacochachester',
          name: 'Gastropub Roastery',
          website: 'http://paucek.biz/nasir'
        },
        roasterId: 5
      }
    ],
    scores: [],
    invites: [
      {
        cuppingId: 1,
        grader: {
          id: 12,
          name: 'lucky the scrub-jay',
          email: 'lucky@sj.com',
          username: 'l_t_s_j'
        },
        graderEmail: null,
        graderId: 12,
        id: 50,
        inviteToken: null,
        status: 'pending'
      },
      {
        cuppingId: 1,
        grader: {
          id: 13,
          name: 'baby-bird the scrub-jay',
          email: 'bb@sj.com',
          username: 'BB1rD'
        },
        graderEmail: null,
        graderId: 13,
        id: 52,
        inviteToken: null,
        status: 'pending'
      }
    ]
  }
  const user = {
    name: 'frank the scrub-jay'
  }
  let wrapper, store

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        Cupping,
        Sessions
      }
    })
    wrapper = mount(NewCuppingSummary, { store })
  })

  describe('rendered content', () => {
    beforeEach(() => {
      store.commit('setCupping', cupping)
      store.commit('updateUser', user)
      wrapper.update()
    })
    afterEach(() => {
      store.commit('setCupping', {})
      // store.commit('clearAllSessionData')
    })

    it('renders the cupping location', () => {
      expect(wrapper.text()).to.include(cupping.location)
    })
    it('renders the cupping cupDate', () => {
      expect(wrapper.text()).to.match(/Sat/)
    })
    it('renders the cupping cupsPerSample', () => {
      expect(wrapper.text()).to.include(cupping.cupsPerSample)
    })
    it('renders the cupping host name', () => {
      expect(wrapper.text()).to.include(user.name)
    })
    context('when cupping has samples(cuppedCoffees)', () => {
      it("renders the cupping's samples(cuppedCoffees)", () => {
        cupping.cuppedCoffees
          .map(sample => sample.coffee.name)
          .forEach(name =>
            expect(wrapper.text()).to.include(name))
      })
    })
    context('when cupping has invites', () => {
      it("renders the cupping's invites", () => {
        cupping.invites
          .map(invite => invite.grader.name)
          .forEach(name =>
            expect(wrapper.text()).to.include(name))
      })
    })
  })
  describe('computed properties', () => {
    describe('cuppingHasData', () => {
      context('when no cupping in the store', () => {
        it('returns false', () => {
          expect(wrapper.vm.cuppingHasData).to.equal(false)
        })
      })
      context('when cupping exists in the store', () => {
        beforeEach(() => store.commit('setCupping', cupping))
        afterEach(() => store.commit('setCupping', {}))

        it('returns true', () => {
          expect(wrapper.vm.cuppingHasData).to.equal(true)
        })
      })
    })
    describe('summaryTitle', () => {
      context('when a host exists', () => {
        it('returns the correct text', () => {
          store.commit('updateUser', user)

          expect(wrapper.vm.summaryTitle)
            .to.equal(`${user.name}'s cupping`)
        })
      })
      context('when no host is found', () => {
        it('returns the correct text', () => {
          store.commit('clearAllSessionData')

          expect(wrapper.vm.summaryTitle)
            .to.equal('Your new cupping so far...')
        })
      })
    })
  })
})
