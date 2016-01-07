const Dispatcher = require("flux").Dispatcher;
const assign     = require("react/lib/Object.assign");

const ColumnsDispatcher = assign(new Dispatcher(), {

  /**
   * @param {object} action The details of the action, including the action"s
   * type and additional data coming from the server.
   */
  handleAddingColumns: function(action) {
    var payload = {
      source: "ADDING_COLUMNS",
      action: action
    };
    this.dispatch(payload);
  },

  handleChangeDevice: function(action) {
    var payload = {
      source: "CHANGE_DEVICE",
      action: action
    };
    this.dispatch(payload);
  }
});


module.exports = ColumnsDispatcher;
