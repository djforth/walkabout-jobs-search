
const FilterDispatcher = require("../../src/dispatcher/filter_dispatcher");

const dispatcherHelper = require("react-jasmine").checkDispatcher;


describe("FilterDispatcher", function() {

  let options = [
    {

      handler:"handleServerAction",
      source:"SERVER_ACTION"
    },

    {
      handler:"handleKeyUpdate",
      source:"KEY_UPDATE"
    },

    {
      handler:"handleFetchFilters",
      source:"FETCH"
    },

    {
      handler:"handleChangeDate",
      source:"CHANGE_DATE"
    },

    {

      handler:"handleCheckFilter",
      source:"CHECK_FILTER"
    },

    {
      handler:"handleSelectFilter",
      source:"SELECT_FILTER"
    },

    {
      handler:"setAllKeysUpdate",
      source:"SETTING_KEYS"
    }
  ];

  dispatcherHelper(FilterDispatcher, options);

});