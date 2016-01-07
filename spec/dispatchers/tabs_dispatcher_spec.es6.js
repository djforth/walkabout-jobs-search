
const TabsDispatcher = require("../../src/dispatcher/tabs_dispatcher");

const dispatcherHelper = require("react-jasmine").checkDispatcher;


describe("Tabs dispatcher", function() {

  let options = [
    {
      handler:"handleAddingTabs",
      source:"ADDING_TABS"
    },
    {
      handler:"handleChangeDevice",
      source:"CHANGE_DEVICE"
    },
    {
      handler:"handleChangeTab",
      source:"CHANGE_TAB"
    }
  ];

  dispatcherHelper(TabsDispatcher, options);

});