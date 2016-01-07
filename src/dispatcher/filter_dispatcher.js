const Dispatcher = require("flux").Dispatcher;
const assign     = require("react/lib/Object.assign");

const FilterDispatcher = assign(new Dispatcher(), {

  /**
   * @param {object} action The details of the action, including the action"s
   * type and additional data coming from the server.
   */
  handleServerAction: function(action) {
    var payload = {
      source: "SERVER_ACTION",
      action: action
    };
    this.dispatch(payload);
  },

  handleChangeDate: function(action) {
    var payload = {
      source: "CHANGE_DATE",
      action: action
    };

    this.dispatch(payload);
  },

  handleCheckFilter: function(action) {
    var payload = {
      source: "CHECK_FILTER",
      action: action
    };

    this.dispatch(payload);
  },

  handleFetchFilters: function(action) {
    var payload = {
      source: "FETCH",
      action: action
    };

    this.dispatch(payload);
  },

   handleSelectFilter: function(action) {
    var payload = {
      source: "SELECT_FILTER",
      action: action
    };

    this.dispatch(payload);
  },

  handleKeyUpdate: function(action) {
    var payload = {
      source: "KEY_UPDATE",
      action: action
    };

    this.dispatch(payload);
  },

  setAllKeysUpdate: function(action) {
    var payload = {
      source: "SETTING_KEYS",
      action: action
    };
    this.dispatch(payload);
  },

  setTab:function(action){
    var payload = {
      source: "SET_TAB",
      action: action
    };
    this.dispatch(payload);
  }


});

module.exports = FilterDispatcher;
