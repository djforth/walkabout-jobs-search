const FilterAction = require("../../src/actions/filter_actions");


const actionHelper = require("react-jasmine").checkActions;

describe("FilterAction", function() {

  let options = [
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
      action:"changeDate",
      handler:"handleChangeDate",
      args:["foo", new Date(2015,0,18)],
      dispactchArgs:{
        type :"CHANGE_DATE",
        date : new Date(2015,0,18),
        key  : "foo",
        pos  : "start"
      }
    },

    {
      action:"changeKey",
      handler:"handleKeyUpdate",
      args:["foo"],
      dispactchArgs:{
        type:"CHANGE_KEY",
        data:"foo"
      }
    },

    {
      action:"checkFilter",
      handler:"handleCheckFilter",
      args:["foo", 1, "bar"],
      dispactchArgs:{
        type:"CHECK_FILTER",
        filterBy:"foo",
        id:1,
        value:"bar"
      }
    },

    {
      action:"fetchFilters",
      handler:"handleFetchFilters",
      args:["foo"],
      dispactchArgs:{
        type : "FETCH",
        api  : "foo"
      }
    },

    {
      action:"selectFilter",
      handler:"handleSelectFilter",
      args:["foo", 1],
      dispactchArgs:{
        type:"SELECT_FILTER",
        filterBy:"foo",
        id:1
      }
    },

    {
      action:"setKeys",
      handler:"setAllKeysUpdate",
      args:["foo"],
      dispactchArgs:{
        type:"SET_KEYS",
        data:"foo"
      }
    }
  ];

  actionHelper(FilterAction, "FilterDispatcher", options);

});