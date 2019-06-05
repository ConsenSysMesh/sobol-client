const _ = require('lodash');

module.exports = {
  /**
   * Builds a query string from an object
   * @param {object} params
   * @returns {string} query
   */
  buildQuery: (params) => {
    let query;

    if (params) {
      query = Object.keys(params)
        .filter(param => !_.isUndefined(params[param])) // exclude undefined
        .map(param => (Array.isArray(params[param]) // Handle array query parameters properly
          ? params[param]
            .map(value => `${param}=${encodeURIComponent(value)}`)
            .join('&')
          : `${param}=${encodeURIComponent(params[param])}`))
        .join('&');
    }

    return (query ? `?${query}` : '');
  },
};
