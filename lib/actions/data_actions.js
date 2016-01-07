"use strict";

var DataDispatcher = require("../dispatcher/data_dispatcher");

module.exports = {
  addDateRange: function addDateRange(key, st, fn) {
    DataDispatcher.handleAddDateRange({
      type: "ADD_DATE_RANGE",
      key: key,
      st: st,
      fn: fn
    });
  },

  deleteItem: function deleteItem(id, flash) {
    DataDispatcher.handleDelete({
      type: "DELETE_ITEM",
      flash: flash,
      id: id
    });
  },

  fetchData: function fetchData(progress, api) {
    DataDispatcher.handleFetchData({
      type: "FETCH_DATA",
      api: api,
      progress: progress
    });
  },

  filterChange: function filterChange() {
    DataDispatcher.handleFilterUpdate({
      type: "FILTER_SEARCH"
    });
  },

  keyUpdate: function keyUpdate() {
    DataDispatcher.handleKeyUpdate({
      type: "KEY_UPDATE"
    });
  },

  pageChange: function pageChange(data) {
    DataDispatcher.handlePageUpdate({
      type: "PAGE_UPDATE",
      data: data
    });
  },

  receiveAll: function receiveAll(data) {
    DataDispatcher.handleServerAction({
      type: "RECEIVE_DATA",
      data: data
    });
  },

  removeDateRange: function removeDateRange(key) {
    DataDispatcher.handleRemoveDateRange({
      type: "REMOVE_DATE_RANGE",
      key: key
    });
  },

  searching: function searching(data) {
    DataDispatcher.handleSearchAction({
      type: "SEARCH_DATA",
      data: data
    });
  },

  setSelected: function setSelected(id, selected) {
    DataDispatcher.handleSelectedAction({
      type: "SET_SELECTED",
      id: id,
      selected: selected
    });
  }

};
//# sourceMappingURL=data_actions.js.map