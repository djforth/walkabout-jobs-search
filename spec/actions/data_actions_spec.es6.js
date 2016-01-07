
const DataAction = require("../../src/actions/data_actions");


const actionHelper = require("react-jasmine").checkActions;

describe("DataAction", function() {

  let options = [
    {
      action:"addDateRange",
      handler:"handleAddDateRange",
      args:["foo", "bar", "foobar"],
      dispactchArgs:{
        type : "ADD_DATE_RANGE",
        key  : "foo",
        st   : "bar",
        fn   : "foobar"
      }
    },
    {
      action:"deleteItem",
      handler:"handleDelete",
      args:[1, "Success!"],
      dispactchArgs:{
        type:"DELETE_ITEM",
        id:1,
        flash:"Success!"
      }
    },
    {
      action:"keyUpdate",
      handler:"handleKeyUpdate",
      args:[],
      dispactchArgs:{
        type:"KEY_UPDATE"
      }
    },

    {
      action:"receiveAll",
      handler:"handleServerAction",
      args:["foo"],
      dispactchArgs:{
        type:"RECEIVE_DATA",
        data:"foo"
      }
    },

    {
      action:"removeDateRange",
      handler:"handleRemoveDateRange",
      args:["foo"],
      dispactchArgs:{
        type : "REMOVE_DATE_RANGE",
        key  : "foo"
      }
    },

    {
      action:"filterChange",
      handler:"handleFilterUpdate",
      args:[],
      dispactchArgs:{
        type:"FILTER_SEARCH"
      }
    },

    {
      action:"fetchData",
      handler:"handleFetchData",
      args:["progress", "api"],
      dispactchArgs:{
        type:"FETCH_DATA",
        api:"api",
        progress:"progress"
      }
    },

    {
      action:"pageChange",
      handler:"handlePageUpdate",
      args:["foo"],
      dispactchArgs:{
        type:"PAGE_UPDATE",
        data:"foo"
      }
    },

    {
      action:"searching",
      handler:"handleSearchAction",
      args:["foo"],
      dispactchArgs:{
        type:"SEARCH_DATA",
        data:"foo"
      }
    },

    {
      action:"setSelected",
      handler:"handleSelectedAction",
      args:[1, "foo"],
      dispactchArgs:{
        type:"SET_SELECTED",
        id:1,
        selected:"foo"
      }
    }
  ];

  actionHelper(DataAction, "DataDispatcher", options);

});