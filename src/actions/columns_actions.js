const ColumnsDispatcher = require("../dispatcher/columns_dispatcher");

module.exports = {
  addingColumns:(cols)=>{
    ColumnsDispatcher.handleAddingColumns({
      type    : "ADDING_COLUMNS",
      columns : cols
    });
  },

  changeDevice:(device)=>{
    ColumnsDispatcher.handleChangeDevice({
      type   : "CHANGE_DEVICE",
      device : device
    });
  }
};
