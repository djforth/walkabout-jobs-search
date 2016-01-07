"use strict";

var Dispatcher = require("flux").Dispatcher;
var assign = require("react/lib/Object.assign");

var DataDispatcher = assign(new Dispatcher(), {

  handleAddDateRange: function handleAddDateRange(action) {
    var payload = {
      source: "ADD_DATE_RANGE",
      action: action
    };
    this.dispatch(payload);
  },

  handleDelete: function handleDelete(action) {
    var payload = {
      source: "DELETE_ITEM",
      action: action
    };

    this.dispatch(payload);
  },

  handleServerAction: function handleServerAction(action) {
    var payload = {
      source: "SERVER_ACTION",
      action: action
    };
    this.dispatch(payload);
  },

  handleFetchData: function handleFetchData(action) {
    var payload = {
      source: "FETCH_DATA",
      action: action
    };
    this.dispatch(payload);
  },

  handleFilterUpdate: function handleFilterUpdate(action) {
    var payload = {
      source: "FILTER_UPDATE",
      action: action
    };

    this.dispatch(payload);
  },

  handleSearchAction: function handleSearchAction(action) {

    var payload = {
      source: "SEARCH_DATA",
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

  handlePageUpdate: function handlePageUpdate(action) {
    var payload = {
      source: "PAGE_UPDATE",
      action: action
    };

    this.dispatch(payload);
  },

  handleRemoveDateRange: function handleRemoveDateRange(action) {
    var payload = {
      source: "REMOVE_DATE_RANGE",
      action: action
    };
    this.dispatch(payload);
  },

  handleSelectedAction: function handleSelectedAction(action) {
    var payload = {
      source: "SET_SELECTED",
      action: action
    };

    this.dispatch(payload);
  }
});

module.exports = DataDispatcher;
//# sourceMappingURL=data_dispatcher.js.map