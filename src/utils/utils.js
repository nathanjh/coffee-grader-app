/**
 * Convert a camel-case `string` to snake-case.
 *
 * @param {String} str
 * @return {String}
 */

export const camelToSnake =
  str => str.replace(/[A-Z]/g, toUnderscoreLower)

// helper for camelToSnake String.prototype.replace call
function toUnderscoreLower (match, offset, string) {
  return (offset > 0 ? '_' : '') + match.toLowerCase()
}

/**
 *  `Map` an object with all keys converted based on
 *  supplied keyTranform callback function
 *
 * @param {Object} obj
 * @param {Function} keyTransform
 * @return {Object}
*/

export const mapWithKeyTransform = (obj, keyTransform) => {
  return Object.keys(obj).reduce((newObj, key) => {
    const val = obj[key]
    const newVal =
      (typeof val === 'object' && !Array.isArray(val)) ? mapWithKeyTransform(val, keyTransform) : val
    newObj[keyTransform(key)] = newVal
    return newObj
  }, {})
}

/**
 *  convert an object's keys from camel to snake-case
 *
 * @param {Object} obj
 * @return {Object}
*/

export const snakeizeCamelKeys = obj => {
  return mapWithKeyTransform(obj, camelToSnake)
}
