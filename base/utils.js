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
        .filter(param => params[param]) // exclude undefined
        .map(param => `${param}=${params[param]}`)
        .join('&');
    }

    return (query ? `?${query}` : '');
  },
};
