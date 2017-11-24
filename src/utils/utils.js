/**
 * Test whether a value is an array of objects
 *(ObjectArray)
 *
 * @param {*} value
 * @return {boolean}
 */

export const isObjectArray = value => {
  return Array.isArray(value) &&
         value.every(el => isObject(el))
}

// helper object type-check function
function isObject (val) {
  return val &&
         typeof val === 'object' &&
         val.constructor === Object
}

/**
 * Convert a camel-case `string` to snake-case.
 *
 * @param {string} str
 * @return {string}
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
    let newVal
    if (isObjectArray(val)) {
      newVal =
        val.map(el => mapWithKeyTransform(el, keyTransform))
    }
    else if (typeof val === 'object' &&
             val !== null &&
             !Array.isArray(val)) {
      newVal = mapWithKeyTransform(val, keyTransform)
    }
    else {
      newVal = val
    }
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

/**
 *  check that a POJO is empty
 *
 *  @param {Object} obj
 *  @return {boolean}
*/

export const isEmptyObject = obj => {
  return Object.keys(obj).length === 0 &&
         obj.constructor === Object
}
