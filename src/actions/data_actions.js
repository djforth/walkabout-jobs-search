const DataDispatcher = require("../dispatcher/data_dispatcher");

module.exports = {
  addDateRange:(key, st, fn)=>{
    DataDispatcher.handleAddDateRange({
      type: "ADD_DATE_RANGE",
      key : key,
      st  : st,
      fn  : fn
    });
  },

  deleteItem:(id, flash)=>{
    DataDispatcher.handleDelete({
      type: "DELETE_ITEM",
      flash: flash,
      id:id
    });
  },

  fetchData:(progress, api)=>{
    DataDispatcher.handleFetchData({
      type: "FETCH_DATA",
      api:api,
      progress:progress
    });
  },

  filterChange:()=>{
    DataDispatcher.handleFilterUpdate({
      type: "FILTER_SEARCH"
    });
  },

  keyUpdate:()=>{
    DataDispatcher.handleKeyUpdate({
      type: "KEY_UPDATE"
    });
  },

  pageChange:(data)=>{
    DataDispatcher.handlePageUpdate({
      type: "PAGE_UPDATE",
      data: data
    });
  },

  receiveAll: (data)=> {
    DataDispatcher.handleServerAction({
      type: "RECEIVE_DATA",
      data: data
    });
  },

  removeDateRange:(key)=>{
    DataDispatcher.handleRemoveDateRange({
      type: "REMOVE_DATE_RANGE",
      key : key
    });
  },


  searching:(data)=>{
    DataDispatcher.handleSearchAction({
      type: "SEARCH_DATA",
      data: data
    });
  },

  setSelected:(id, selected)=>{
    DataDispatcher.handleSelectedAction({
      type     : "SET_SELECTED",
      id       : id,
      selected :selected
    });
  }

};
