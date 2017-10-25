import 'babel-polyfill'
import CGAutocomplete from '@/cupping/forms/CGAutocomplete'
import CoffeeGraderApi from 'src/api/coffeeGraderApi'
import { mount } from 'vue-test-utils'
import Vue from 'vue'
import Vuex from 'vuex'
import Sessions from 'src/store/modules/sessions'

Vue.use(Vuex)

describe('CGAutocomplete.vue', () => {
  describe('data', () => {
    it('is a function that returns the data object', () => {
      expect(CGAutocomplete.data).to.be.a('function')
      expect(CGAutocomplete.data()).to.be.a('object')
    })
    it('has a String type terms property', () => {
      expect(CGAutocomplete.data().terms).to.be.a('string')
    })
    it('terms default value is an empty string', () => {
      expect(CGAutocomplete.data().terms).to.equal('')
    })
  })
  describe('methods', () => {
    describe('search', () => {
      const store = new Vuex.Store({
        modules: { Sessions }
      })
      it('is a function', () => {
        expect(CGAutocomplete.methods.search).to.be.a('function')
      })
      context('when api query returns an empty collection', () => {
        it("emits a 'noResults' event", async function () {
          const apiCall = sinon.stub(CoffeeGraderApi, 'get')
            .returns(Promise.resolve({
              data: {
                coffees: []
              }
            }))
          const spy = sinon.spy()
          const wrapper = mount(CGAutocomplete, { store })

          wrapper.vm.$on('noResults', spy)

          const done = sinon.stub()
          await wrapper.vm.search('nomatch', done)

          assert(spy.called)
          apiCall.restore()
        })
      })
      context('when api query returns a collection with one or more items', () => {
        it("calls the 'done' method with response collection", async function () {
          const collection = [
            { id: 1, name: 'joe', origin: 'Brazil' },
            { id: 2, name: 'joey', origin: 'Peru' }
          ]
          const apiCall = sinon.stub(CoffeeGraderApi, 'get')
            .returns(Promise.resolve({
              data: {
                coffees: collection
              }
            }))
          const wrapper = mount(CGAutocomplete, { store })
          const done = sinon.stub()
          const parsedCollection =
            wrapper.vm.parseCollection(collection, 'origin')

          await wrapper.vm.search('joe', done)
          assert(done.calledWith(parsedCollection))
          apiCall.restore()
        })
      })
    })
    describe('selected', () => {
      it('is a function', () => {
        expect(CGAutocomplete.methods.selected).to.be.a('function')
      })
      it("emits an 'itemSelected' event with the expected payload", () => {
        const item = {
          label: 'sample A',
          id: 4
        }
        const wrapper = mount(CGAutocomplete)
        const spy = sinon.spy()
        wrapper.vm.$on('itemSelected', spy)

        wrapper.vm.selected(item)

        expect(spy.calledWith(item)).to.be.true
      })
    })
    describe('parseCollection', () => {
      const parseCollection = CGAutocomplete.methods.parseCollection

      it('is a function', () => {
        expect(parseCollection).to.be.a('function')
      })
      context('given an array of objects with name and id properties', () => {
        const collection = [
          {
            name: 'the first thing',
            id: 1,
            funFact: "it's the first"
          },
          {
            name: 'the second thing',
            id: 2,
            funFact: "it's the second"
          }
        ]
        it('returns an array of parsed label-objects', () => {
          const parsedCollection = parseCollection(collection)
          expect(parsedCollection[0])
            .to.include({ label: 'the first thing', id: 1 })
        })
        context('given an optional sublabel argument (String)', () => {
          it('maps the target value to the parsed object sublabel key', () => {
            expect(parseCollection(collection)[0])
              .to.include({ sublabel: undefined })
            const parsedWithSublabel = parseCollection(collection, 'funFact')

            expect(parsedWithSublabel[1])
              .to.include({ sublabel: "it's the second" })
          })
        })
      })
    })
  })
})
