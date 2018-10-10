import io from 'socket.io-client';
import { SOCKET_IO_URL } from 'config/env';
import GoalActions from 'core/goals/data/actions';
import FeedActions from 'core/feed/data/actions';
import NotificationActions from 'core/notifications/data/actions';
import { store } from 'ui/App';
import { GoalType, OperationTypes, Types } from 'platform/common/constants';
import InteractionActions from 'core/interactions/data/actions';
import Goal from 'platform/objects/goal';
import _ from 'lodash';

const Logger = console;

/**
 * Help manage a socket io connection
 */
export default class SocketIoConnection {
  _socket = null;
  _isSubscribed = false;
  _rootId = null;
  /**
   * Create a socket-io connection with the server.
   * @param {string} rootId the current root ID
   * @param {string} jwtToken the token to authenticate with instead of session data.
   */
  constructor(rootId, jwtToken) {
    if (jwtToken) {
      this._rootId = rootId;
      this.connect(rootId, jwtToken);
    } else {
      throw new Error('Must supply JWT token in order to create a socket-io connection.');
    }
  }

  /**
   * Connects securely
   * @param {string} rootId the current root ID
   * @param {string} jwtToken token
   * @returns {void}
   */
  connect = (rootId, jwtToken) => {
    // NOTE: this is super important since socket.io does not respect calling
    // events and binding to our class scope, it instead uses its own socket class scope
    // (not doing this will result in multiple connections being open upon each reconnect)
    const _this = this;
    _this._socket = io.connect(`${SOCKET_IO_URL}?token=${jwtToken}`);
    _this._socket.on('connect', () => {
      Logger.log('Established socket.io connection.');

      _this._socket.emit('authenticate', rootId);

      if (!_this._isSubscribed) {
        Logger.log('Subscribing to socket.io events.');

        _this._socket
          .on('change made', (change) => {
            // fault tolerance
            if (!change) {
              // eslint-disable-next-line no-console
              console.error('NULL change detected from socket.io');
              return;
            }

            // TODO: figure out how to pass in the function to execute on connection

            // This is to react to server-side goal changes and make the UI cache up to date.
            // TODO: As this logic grows in complexity, we should consider a more robust solution
            const _handleCalculatedGoalUpdate = (goal, goalsById) => {
              if (!goal) return;
              const parentId = goal.contributesToId;
              const parentGoal = goalsById[parentId];
              const hasCalculatedParent = parentId && parentGoal
                && parentGoal.goalType === GoalType.Calculated;
              if (hasCalculatedParent) {
                // get parent goal chain
                const parents = Goal.getParentGoalChain(parentId, goalsById);
                const goalsToFetch = Goal.getOutdatedCalculatedGoals(parents);
                goalsToFetch.forEach(g =>
                  store.dispatch(GoalActions.fetch(g._id)));
              }
            };

            if (change.objectType === Types.Goal) {
              const state = store.getState();
              const { goalsById } = state.data.goals;

              if (change.operation === OperationTypes.Delete) {
                const goals = Object.values(goalsById);
                const parentGoals = goals.filter(g =>
                  _.some(g.subGoals, ['_id', change.objectId]));
                const parentGoal = parentGoals && parentGoals.length > 0
                  ? parentGoals[0] : null;
                const goal = {
                  ...change.obj,
                  contributesToId: parentGoal ? parentGoal._id : '',
                };
                store.dispatch(GoalActions.deleteLocal(change.objectId));
                _handleCalculatedGoalUpdate(goal, goalsById);
              } else if (change.operation === OperationTypes.Create) {
                store.dispatch(GoalActions.fetch(change.objectId))
                  .then(() => {
                    const newGoalsById = store.getState().data.goals.goalsById;
                    const newGoal = newGoalsById[change.objectId];
                    _handleCalculatedGoalUpdate(newGoal, newGoalsById);
                  });
              } else if (change.operation === OperationTypes.Update) {
                store.dispatch(GoalActions.fetch(change.objectId))
                  .then(() => {
                    const newGoalsById = store.getState().data.goals.goalsById;
                    const newGoal = newGoalsById[change.objectId];
                    const oldProgress = Goal.calculateCurrentProgress(change.obj);
                    const newProgress = Goal.calculateCurrentProgress(newGoal);
                    if (oldProgress !== newProgress) {
                      _handleCalculatedGoalUpdate(newGoal, newGoalsById);
                    }
                  });
              } else {
                store.dispatch(GoalActions.fetch(change.objectId));
              }
            }

            if (change.objectType === Types.Interaction &&
                change.obj.objectType === Types.ChangeRecord) {
              // update to a thread, since targetting a change record
              store.dispatch(InteractionActions.newInteraction(change.result));
            } else {
              // this should trigger an update of existing change feeds
              store.dispatch(FeedActions.newChange(change));
            }

            store.dispatch(NotificationActions.getUnreadCount());
          })
          .on('unauthorized', (msg) => {
            Logger.log(`unauthorized: ${JSON.stringify(msg.data)}`);
            throw new Error(msg.data.type);
          })
          .on('disconnect', () => {
            // NOTE: DO NOT set _isSubscribed to false, or else it will try to
            // re-register the on change even handlers as a result, triggering
            // duplicate client-side updates for every connection
            Logger.log('socket.io connection disconnected.');
          });
        _this._isSubscribed = true;
      }
    });
  }

  /**
   * Disconnects
   * @returns {void}
   */
  disconnect() {
    this._socket.close();
  }

  getCurrentRootId() {
    return this._rootId;
  }
}
