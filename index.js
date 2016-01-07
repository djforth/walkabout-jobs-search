

// Actions
var ColumsActions = require("./lib/actions/columns_actions");
var DataActions   = require("./lib/actions/data_actions");
var FilterActions = require("./lib/actions/filter_actions");

exports.Actions = {
  Columns : ColumsActions,
  Data    : DataActions,
  Filters : FilterActions
}

// Dispatchers
var ColumnsDispatcher   = require("./lib/dispatcher/columns_dispatcher");
var DataDispatcher   = require("./lib/dispatcher/data_dispatcher");
var FilterDispatcher = require("./lib/dispatcher/filter_dispatcher");

exports.Dispatcher = {
  Columns : ColumnsDispatcher,
  Data    : DataDispatcher,
  Filters : FilterDispatcher
}

// Factories
var DataFactory   = require("./lib/factories/data_fcty");
var FilterFactory = require("./lib/factories/filters_fcty");

exports.Factories = {
  Data    : DataFactory,
  Filters : FilterFactory
}

// Stores
var ColumnsStores = require("./lib/stores/columns_store");
var DataStores    = require("./lib/stores/data_store");
var FilterStores  = require("./lib/stores/filter_store");

exports.Stores = {
  Columns : ColumnsStores,
  Data    : DataStores,
  Filters : FilterStores
}

// var Filters      = require("./lib/vanilla_components/filters");
// var Search       = require("./lib/vanilla_components/search");
// var SearchFilter = require("./lib/vanilla_components/searchfilters");
// //
// exports.Components = {
//   // CheckBox     : CheckBox,
//   // DataHead     : DataHead,
//   // DataItem     : DataItem,
//   // DataItems    : DataItems,
//   Filters      : Filters,
//   // FilterCheck  : FilterCheck,
//   // FilterRadio  : FilterRadio,
//   // FilterSelect : FilterSelect,
//   // Keys         : Keys,
//   // Pagination   : Pagination,
//   Search       : Search,
//   SearchFilter : SearchFilter
// }



var TabSearch = require("./lib/tab_search/tab_search");

exports.Tab = {
  // Expander : GenericExpander,
  // Items    : GenericItems,
  // Item     : GenericItem,
  Search   : TabSearch
}