"use strict";

var FilterDispatcher = require("../dispatcher/filter_dispatcher");

module.exports = {
  changeDate: function changeDate(key, date) {
    var pos = arguments.length <= 2 || arguments[2] === undefined ? "start" : arguments[2];

    FilterDispatcher.handleChangeDate({
      type: "CHANGE_DATE",
      date: date,
      key: key,
      pos: pos
    });
  },

  checkFilter: function checkFilter(filterBy, id, value) {
    FilterDispatcher.handleCheckFilter({
      type: "CHECK_FILTER",
      filterBy: filterBy,
      id: id,
      value: value
    });
  },

  changeKey: function changeKey(data) {
    FilterDispatcher.handleKeyUpdate({
      type: "CHANGE_KEY",
      data: data
    });
  },

  fetchFilters: function fetchFilters(api) {
    FilterDispatcher.handleFetchFilters({
      type: "FETCH",
      api: api
    });
  },

  receiveAll: function receiveAll(data) {
    FilterDispatcher.handleServerAction({
      type: "RECEIVE_DATA",
      data: data
    });
  },

  selectFilter: function selectFilter(filterBy, id) {
    FilterDispatcher.handleSelectFilter({
      type: "SELECT_FILTER",
      filterBy: filterBy,
      id: id
    });
  },

  setKeys: function setKeys(data) {
    FilterDispatcher.setAllKeysUpdate({
      type: "SET_KEYS",
      data: data
    });
  },

  setTab: function setTab(tab) {
    FilterDispatcher.setTab({
      type: "SET_TAB",
      tab: tab
    });
  }
};
//# sourceMappingURL=filter_actions.js.map