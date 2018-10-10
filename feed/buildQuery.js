import { PageParameters } from 'platform/common/constants';

/** Given params, build a query for backend
 * @param {string} endpoint end point to call, either 'find' or 'find-count'
 * @param {object} state state
 * @returns {string} query string
 */
export default function buildQuery(endpoint, {
  operation, interactionType, objectId, objectType, page,
}) {
  const DEFAULT_SORT_DIRECTION = -1;
  const limit = PageParameters.ActivityFeedLimit;
  const sortDirection = DEFAULT_SORT_DIRECTION;
  const offset = page ? page * limit : 0;

  let q = `/feed/${endpoint}?limit=${limit}&offset=${offset}`;
  if (operation) {
    q = `${q}&operation=${operation}`;
  }
  if (interactionType) {
    q = `${q}&interactionType=${interactionType}`;
  }
  if (sortDirection) {
    q = `${q}&sortDirection=${sortDirection}`;
  }
  if (objectId) {
    q = `${q}&objectId=${objectId}`;
  }
  if (objectType) {
    q = `${q}&objectType=${objectType}`;
  }
  return q;
}
