import {
  isObjectArray,
  camelToSnake,
  mapWithKeyTransform,
  snakeizeCamelKeys,
  isEmptyObject
} from 'src/utils/utils'

describe('utilities', () => {
  describe('isObjectArray', () => {
    context('given an array of objects', () => {
      const test = [
        { a: 1 },
        { b: 2 },
        { c: 3 }
      ]
      it('returns true', () => {
        expect(isObjectArray(test)).to.equal(true)
      })
    })
    context('given an array of mixed types', () => {
      const test = [
        'a',
        { b: 1 },
        2
      ]
      it('returns false', () => {
        expect(isObjectArray(test)).to.equal(false)
      })
    })
  })
  describe('camelToSnake', () => {
    context('given a string with no uppercase chars', () => {
      it('returns the same string', () => {
        const noCaps = 'xoxo'
        expect(camelToSnake(noCaps)).to.equal(noCaps)
      })
    })
    context('given a lower camel-cased string', () => {
      it('returns the correct snake-case string', () => {
        const tests = [
          'testString',
          'aTestString',
          'testStringB',
          'testStringXOXO'
        ]
        const expected = [
          'test_string',
          'a_test_string',
          'test_string_b',
          'test_string_x_o_x_o'
        ]
        tests.forEach((test, idx) => {
          expect(camelToSnake(test))
            .to.equal(expected[idx])
        })
      })
    })
    context('given an upper camel-cased string', () => {
      it('returns the correct snake-case string', () => {
        const testStr = 'AnUpperCamelCaseString'
        const expected = 'an_upper_camel_case_string'

        expect(camelToSnake(testStr)).to.equal(expected)
      })
    })
  })
  describe('mapWithKeyTransform', () => {
    context('given an object and a function that takes and returns a string', () => {
      it('returns an object with new keys', () => {
        const test = {
          A: 1,
          B: 2,
          C: 3
        }
        const expected = {
          a: 1,
          b: 2,
          c: 3
        }
        const downCase = str => str.toLowerCase()

        expect(mapWithKeyTransform(test, downCase))
          .to.deep.equal(expected)
      })
    })
    context('given a nested object and a function that takes and returns a string', () => {
      it('returns an object with keys transformed at all levels', () => {
        const test = {
          a: 1,
          b: {
            c: 3
          },
          d: {
            e: {
              f: 5
            }
          }
        }
        const expected = {
          A: 1,
          B: {
            C: 3
          },
          D: {
            E: {
              F: 5
            }
          }
        }
        const upCase = str => str.toUpperCase()

        expect(mapWithKeyTransform(test, upCase))
          .to.deep.equal(expected)
      })
    })
    context('given an object with an Array type value', () => {
      it('correctly returns Array value', () => {
        const test1 = {
          a: [1, 2, 3],
          b: {
            c: 4
          }
        }
        const test2 = {
          a: [
            { b: 1 },
            { c: 2 }
          ],
          d: {
            e: 3
          },
          f: 4
        }
        const expected1 = {
          aa: [1, 2, 3],
          bb: {
            cc: 4
          }
        }
        const expected2 = {
          aa: [
            { bb: 1 },
            { cc: 2 }
          ],
          dd: {
            ee: 3
          },
          ff: 4
        }
        const doubleMe = str => str + str

        expect(mapWithKeyTransform(test1, doubleMe))
          .to.deep.equal(expected1)
        expect(mapWithKeyTransform(test2, doubleMe))
          .to.deep.equal(expected2)
      })
    })
  })
  describe('snakeizeCamelKeys', () => {
    context('given an object with camelCase keys', () => {
      it('returns a new object with snake-case keys, and mapped values', () => {
        const test = {
          id: 1,
          pottedPlant: {
            leafColor: 'green',
            numLeaves: 3
          },
          potDecorations: [
            {
              decType: 'rock',
              decPrice: 1
            },
            {
              decType: 'pinwheel',
              decPrice: 4
            }
          ],
          fruits: null
        }
        const expected = {
          id: 1,
          potted_plant: {
            leaf_color: 'green',
            num_leaves: 3
          },
          pot_decorations: [
            {
              dec_type: 'rock',
              dec_price: 1
            },
            {
              dec_type: 'pinwheel',
              dec_price: 4
            }
          ],
          fruits: null
        }
        expect(snakeizeCamelKeys(test))
          .to.deep.equal(expected)
      })
    })
  })
  describe('isEmptyObject', () => {
    context('given an empty object', () => {
      it('returns true (bool)', () => {
        const cupping = {}
        expect(isEmptyObject(cupping)).to.equal(true)
      })
    })
    context('given an object with one or more k/v pairs', () => {
      it('returns false (bool)', () => {
        const cupping = { id: 1 }
        expect(isEmptyObject(cupping)).to.equal(false)
      })
    })
  })
})
