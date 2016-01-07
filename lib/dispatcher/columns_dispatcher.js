"use strict";

var Dispatcher = require("flux").Dispatcher;
var assign = require("react/lib/Object.assign");

var ColumnsDispatcher = assign(new Dispatcher(), {

  /**
   * @param {object} action The details of the action, including the action"s
   * type and additional data coming from the server.
   */
  handleAddingColumns: function handleAddingColumns(action) {
    var payload = {
      source: "ADDING_COLUMNS",
      action: action
    };
    this.dispatch(payload);
  },

  handleChangeDevice: function handleChangeDevice(action) {
    var payload = {
      source: "CHANGE_DEVICE",
      action: action
    };
    this.dispatch(payload);
  }
});

module.exports = ColumnsDispatcher;
//# sourceMappingURL=columns_dispatcher.js.map