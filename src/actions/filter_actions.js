const FilterDispatcher = require("../dispatcher/filter_dispatcher");

module.exports = {
  changeDate: (key, date, pos="start")=> {
    FilterDispatcher.handleChangeDate({
      type : "CHANGE_DATE",
      date : date,
      key  : key,
      pos  : pos
    });
  },

  checkFilter:(filterBy, id, value)=>{
    FilterDispatcher.handleCheckFilter({
      type: "CHECK_FILTER",
      filterBy:filterBy,
      id:id,
      value:value
    });
  },

  changeKey: (data)=> {
    FilterDispatcher.handleKeyUpdate({
      type: "CHANGE_KEY",
      data: data
    });
  },

  fetchFilters:(api)=>{
    FilterDispatcher.handleFetchFilters({
      type : "FETCH",
      api  : api
    });
  },

  receiveAll: (data)=> {
    FilterDispatcher.handleServerAction({
      type: "RECEIVE_DATA",
      data: data
    });
  },

  selectFilter:(filterBy, id)=>{
    FilterDispatcher.handleSelectFilter({
      type: "SELECT_FILTER",
      filterBy:filterBy,
      id:id
    });
  },

  setKeys: (data)=> {
    FilterDispatcher.setAllKeysUpdate({
      type: "SET_KEYS",
      data: data
    });
  },

  setTab: (tab)=>{
    FilterDispatcher.setTab({
      type: "SET_TAB",
      tab: tab
    });
  }
};
