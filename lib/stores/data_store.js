"use strict";

var EventEmitter = require("events").EventEmitter;
var assign = require("react/lib/Object.assign");
var _ = require("lodash");

var DataDispatcher = require("../dispatcher/data_dispatcher");
var DataAction = require("../actions/data_actions");
var FilterStore = require("./filter_store");
var TabsStore = require("./tabs_store");

var DataFcty = require("../factories/data_fcty");

// let data =  new DataFcty();
// console.count("Data")

// var searchVal;
// var pagination = 50;
// var page       = 1;
// var itemNo     = 0;
// var cache;
// var selected = [];

var store = {

  cache: null,
  data: new DataFcty(),
  dateRanges: {},
  flash: null,
  itemNo: 0,
  removed: null,
  pagination: 50,
  page: 1,
  searchVal: null,
  selected: [],

  emitChange: function emitChange(event) {
    this.emit(event);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function addChangeListener(event, callback) {
    this.on(event, callback);
  },
  removeChangeListener: function removeChangeListener(event, callback) {
    this.removeListener(event, callback);
  },
  checkDeleted: function checkDeleted(id) {
    return this.removed === id;
  },
  deleteItem: function deleteItem(id, fl) {

    if (fl.type === "notice") {
      this.removed = id;
      this.data.remove(id);

      if (this.cache) {
        this.cache.remove(id);
      }
    }

    this.flash = fl;
  },
  fetchData: function fetchData(progress) {
    console.log('GET DATA');
    return this.data.fetch(progress).then(this.processData.bind(this)).catch(function (err) {
      var error = new Error(err);
      throw error;
    });
  },
  get: function get(id) {
    return this.data.findById(id);
  },
  getAll: function getAll() {
    if (!_.isEmpty(this.searchVal)) {
      return this.getSearchData();
    } else {
      this.cache = this.data.getAll();
      return this.cache.slice(0, this.pagination - 1);
    }
  },
  getFlash: function getFlash() {
    return this.flash;
  },
  getByIds: function getByIds(ids) {
    return this.data.filterByIds(ids);
  },
  getCurrentData: function getCurrentData() {
    return this.data.getAll();
  },
  getDateFmt: function getDateFmt(item, key) {
    var fmt = arguments.length <= 2 || arguments[2] === undefined ? "%d/%m/%Y" : arguments[2];

    return this.data.formatDate(item, key, fmt);
  },
  getKeys: function getKeys() {
    return this.data.getKeys();
  },
  getPage: function getPage() {
    var i = this.page - 1;
    var st = i * this.pagination;
    var fn = st + this.pagination - 1;

    return { st: st, fn: fn };
  },
  getPagination: function getPagination() {
    var no = this.itemNo / this.pagination;
    if (no < 1) {
      return 0;
    } else {
      return Math.ceil(no);
    }
  },
  getSearchData: function getSearchData() {
    this.page = 1;
    var keys = FilterStore.getSelectedKeys();
    var filters = FilterStore.getFilters();
    var dateRanges = FilterStore.getDates();
    var tab = TabsStore.getActive();
    var search = this.data.search(this.searchVal, keys, filters, dateRanges, tab);
    this.itemNo = search.size;
    this.cache = search;
    // console.log("search", search.size)
    return search.slice(0, this.pagination - 1);
  },
  getSearchVal: function getSearchVal() {
    return this.searchVal;
  },
  paginationData: function paginationData() {
    var page = this.getPage();
    return this.cache.slice(page.st, page.fn);
  },
  processData: function processData() {
    if (!_.isEmpty(this.selected)) {
      this.data.addSelected(this.selected);
    }

    var d = this.data.getAll();
    console.log(d);
    this.itemNo = d.size ? d.size : 0;

    // simulate success callback
    DataAction.receiveAll(d);

    return d;
  },
  removeDateRange: function removeDateRange(key) {
    this.dateRanges = _.omit(this.dateRanges, key);
  },
  setApi: function setApi(uri) {
    this.data.url = uri;
  },
  setDateRanges: function setDateRanges(key, st, fn) {
    if (_.isDate(st) && _.isDate(fn)) {
      this.dateRanges[key] = {
        st: st,
        fn: fn
      };
    }
  },
  setPage: function setPage(p) {
    this.page = p;
  },
  setSearchVal: function setSearchVal(val) {
    this.searchVal = val;
  },
  selectedIds: function selectedIds(ids) {
    this.selected = ids;
  },
  setSelected: function setSelected(id) {
    var selected = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

    this.data.update(id, { selected: selected });
    if (this.cache) {
      this.cache = this.cache.map(function (c) {
        if (c) {
          if (c && c.get("id") === id) {
            c = c.set("selected", selected);
          }
          return c;
        }
      });
    }
  }
};

var DataStore = assign({}, EventEmitter.prototype, store);
DataStore.setMaxListeners(0);

var registeredCallback = function registeredCallback(payload) {
  var action = payload.action;

  switch (action.type) {
    case "ADD_DATE_RANGE":
      DataStore.setDateRanges(action.key, action.st, action.fn);
      DataStore.emitChange("search");
      break;

    case "DELETE_ITEM":
      DataStore.deleteItem(action.id, action.flash);
      DataStore.emitChange("delete");
      break;

    case "KEY_UPDATE":
      DataStore.emitChange("search");
      break;

    case "FETCH_DATA":
      DataStore.setApi(action.api);
      DataStore.fetchData(action.progress);
      DataStore.emitChange("fetching");
      break;

    case "FILTER_SEARCH":
      DataStore.emitChange("search");
      break;

    case "PAGE_UPDATE":
      DataStore.setPage(action.data);
      DataStore.emitChange("pagination");
      break;

    case "RECEIVE_DATA":
      DataStore.emitChange("fetched");
      break;

    case "REMOVE_DATE_RANGE":
      DataStore.removeDateRange(action.key);
      DataStore.emitChange("search");
      break;

    case "SEARCH_DATA":
      DataStore.setSearchVal(action.data);
      DataStore.emitChange("search");
      break;

    case "SET_SELECTED":
      DataStore.setSelected(action.id, action.selected);
      DataStore.emitChange("change");
      break;
  }
};

DataStore.dispatchToken = DataDispatcher.register(registeredCallback);

module.exports = DataStore;
//# sourceMappingURL=data_store.js.map