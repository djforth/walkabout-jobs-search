"use strict";

var Dispatcher = require("flux").Dispatcher;
var assign = require("react/lib/Object.assign");

var FilterDispatcher = assign(new Dispatcher(), {

  /**
   * @param {object} action The details of the action, including the action"s
   * type and additional data coming from the server.
   */
  handleServerAction: function handleServerAction(action) {
    var payload = {
      source: "SERVER_ACTION",
      action: action
    };
    this.dispatch(payload);
  },

  handleChangeDate: function handleChangeDate(action) {
    var payload = {
      source: "CHANGE_DATE",
      action: action
    };

    this.dispatch(payload);
  },

  handleCheckFilter: function handleCheckFilter(action) {
    var payload = {
      source: "CHECK_FILTER",
      action: action
    };

    this.dispatch(payload);
  },

  handleFetchFilters: function handleFetchFilters(action) {
    var payload = {
      source: "FETCH",
      action: action
    };

    this.dispatch(payload);
  },

  handleSelectFilter: function handleSelectFilter(action) {
    var payload = {
      source: "SELECT_FILTER",
      action: action
    };

    this.dispatch(payload);
  },

  handleKeyUpdate: function handleKeyUpdate(action) {
    var payload = {
      source: "KEY_UPDATE",
      action: action
    };

    this.dispatch(payload);
  },

  setAllKeysUpdate: function setAllKeysUpdate(action) {
    var payload = {
      source: "SETTING_KEYS",
      action: action
    };
    this.dispatch(payload);
  },

  setTab: function setTab(action) {
    var payload = {
      source: "SET_TAB",
      action: action
    };
    this.dispatch(payload);
  }

});

module.exports = FilterDispatcher;
//# sourceMappingURL=filter_dispatcher.js.map