const ColumnsAction = require("../../src/actions/columns_actions");


const actionHelper = require("react-jasmine").checkActions;

describe("ColumnsAction", function() {

  let options = [
    {
      action:"addingColumns",
      handler:"handleAddingColumns",
      args:["foo"],
      dispactchArgs:{
        type   : "ADDING_COLUMNS",
        columns: "foo"
      }
    },
    {
      action:"changeDevice",
      handler:"handleChangeDevice",
      args:["foo"],
      dispactchArgs:{
        type   : "CHANGE_DEVICE",
        device : "foo"
      }
    }
  ];

  actionHelper(ColumnsAction, "ColumnsDispatcher", options);

});