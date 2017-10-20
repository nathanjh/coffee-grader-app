import {
  isNum
} from 'src/utils/validators/customValidators'

describe('custom validators', () => {
  describe('isNum', () => {
    context('given any infinite or non-number type', () => {
      it('returns false (boolean)', () => {
        const invalidNums = [
          NaN,
          Infinity,
          -Infinity,
          'one',
          undefined,
          null,
          false
        ]
        invalidNums.forEach(input => expect(isNum(input)).to.equal(false))
      })
    })
    context('given any finite number', () => {
      it('returns true (boolean)', () => {
        const validNums = [1.2, 600]
        validNums.forEach(input => expect(isNum(input)).to.equal(true))
      })
    })
  })
})
