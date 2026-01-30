/**
 * Safe localStorage wrapper with error handling
 * Gracefully handles cases where localStorage is unavailable (private browsing, disabled, etc.)
 */

const isLocalStorageAvailable = () => {
  try {
    const test = '__storage_test__'
    localStorage.setItem(test, test)
    localStorage.removeItem(test)
    return true
  } catch (e) {
    return false
  }
}

export const safeLocalStorage = {
  /**
   * Safely get an item from localStorage
   * @param {string} key - The key to retrieve
   * @param {any} defaultValue - Default value if key doesn't exist or localStorage is unavailable
   * @returns {string|null|any} The stored value or default value
   */
  getItem(key, defaultValue = null) {
    if (!isLocalStorageAvailable()) {
      return defaultValue
    }

    try {
      const value = localStorage.getItem(key)
      return value !== null ? value : defaultValue
    } catch (e) {
      return defaultValue
    }
  },

  /**
   * Safely set an item in localStorage
   * @param {string} key - The key to set
   * @param {string} value - The value to store
   * @returns {boolean} True if successful, false otherwise
   */
  setItem(key, value) {
    if (!isLocalStorageAvailable()) {
      return false
    }

    try {
      localStorage.setItem(key, value)
      return true
    } catch (e) {
      return false
    }
  },

  /**
   * Safely remove an item from localStorage
   * @param {string} key - The key to remove
   * @returns {boolean} True if successful, false otherwise
   */
  removeItem(key) {
    if (!isLocalStorageAvailable()) {
      return false
    }

    try {
      localStorage.removeItem(key)
      return true
    } catch (e) {
      return false
    }
  },

  /**
   * Safely clear all items from localStorage
   * @returns {boolean} True if successful, false otherwise
   */
  clear() {
    if (!isLocalStorageAvailable()) {
      return false
    }

    try {
      localStorage.clear()
      return true
    } catch (e) {
      return false
    }
  }
}
