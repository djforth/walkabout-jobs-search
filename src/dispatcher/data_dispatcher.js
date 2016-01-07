const Dispatcher = require("flux").Dispatcher;
const assign     = require("react/lib/Object.assign");

const DataDispatcher = assign(new Dispatcher(), {

  handleAddDateRange: function(action) {
    var payload = {
      source: "ADD_DATE_RANGE",
      action: action
    };
    this.dispatch(payload);
  },

  handleDelete: function(action){
    var payload = {
      source: "DELETE_ITEM",
      action: action
    };

    this.dispatch(payload);
  },

  handleServerAction: function(action) {
    var payload = {
      source: "SERVER_ACTION",
      action: action
    };
    this.dispatch(payload);
  },

  handleFetchData: function(action) {
    var payload = {
      source: "FETCH_DATA",
      action: action
    };
    this.dispatch(payload);
  },

  handleFilterUpdate: function(action){
    var payload = {
      source: "FILTER_UPDATE",
      action: action
    };

    this.dispatch(payload);
  },


  handleSearchAction: function(action) {

    var payload = {
      source: "SEARCH_DATA",
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

  handlePageUpdate: function(action) {
    var payload = {
      source: "PAGE_UPDATE",
      action: action
    };

    this.dispatch(payload);
  },

  handleRemoveDateRange: function(action) {
    var payload = {
      source: "REMOVE_DATE_RANGE",
      action: action
    };
    this.dispatch(payload);
  },

  handleSelectedAction: function(action){
    var payload = {
      source: "SET_SELECTED",
      action: action
    };

    this.dispatch(payload);
  }
});

module.exports = DataDispatcher;
