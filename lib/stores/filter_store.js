"use strict";

var _ = require("lodash");

var FilterDispatcher = require("../dispatcher/filter_dispatcher");
var FilterAction = require("../actions/filter_actions");
var EventEmitter = require("events").EventEmitter;
var assign = require("react/lib/Object.assign");

var AjaxPromises = require("ajax-es6-module");
var ajaxPromises = new AjaxPromises();

var FiltersFcty = require("../factories/filters_fcty");

// let Masterfilters =  new FiltersFcty();

var store = {
  keys: [],
  dates: {},
  selectedKey: "all",
  filters: [],
  changed: true,
  cache: null,
  tabs: [],

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
  checked: function checked(filterBy, id, _checked) {
    var filter = this.get(filterBy);

    if (filter) {
      filter.setSelected(id, _checked);
    }
    this.changed = true;
  },
  fetchData: function fetchData(api) {
    var _this = this;

    this.setApi(api);
    return ajaxPromises.fetch().then(function (data) {
      _this.filters = _this.processFilters(data);
      FilterAction.receiveAll(_this.filters);
      return _this.filters;
    }).catch(function (err) {
      throw new Error(err);
    });
  },
  get: function get(id) {
    return _.find(this.filters, function (f) {
      return f.hasDetails("filterBy", id);
    });
  },
  getAll: function getAll() {
    return this.filters;
  },
  getDates: function getDates() {
    return this.dates;
  },
  getAllKeys: function getAllKeys() {
    return this.keys;
  },
  getFilters: function getFilters() {
    var data = this.cache;
    if (this.changed) {

      this.cache = data = this.getSelectedFilters();
      this.changed = false;
    }
    return data;
  },
  getSelectedFilters: function getSelectedFilters() {
    return _.map(this.filters, function (f) {
      return f.getSelected();
    });
  },
  getSelectedKey: function getSelectedKey() {

    return this.selectedKey;
  },
  getSelectedKeys: function getSelectedKeys() {
    if (this.selectedKey === "all") {
      return this.keys;
    } else {
      return [this.selectedKey];
    }
  },
  getVisible: function getVisible() {
    return _.filter(this.filters, function (f) {
      return f.isVisible();
    });
  },
  isSelectedKey: function isSelectedKey(k) {
    return this.selectedKey === k;
  },
  setDate: function setDate(dr) {
    if (!_.has(this.dates, dr.key)) {
      this.dates[dr.key] = {};
    }

    if (dr.pos === "start") {
      this.dates[dr.key].st = dr.date;
    } else {
      this.dates[dr.key].fn = dr.date;
    }
  },
  setKeys: function setKeys(ks) {
    this.keys = ks;
  },

  // setTabFilter(tab){

  // }

  setTab: function setTab(tab) {

    this.tab = tab;
    this.changed = true;
    if (!_.isEmpty(this.filters)) {
      this.filters = _.map(this.filters, function (filter) {
        // console.log('filters', tab.filters);
        filter.reset();
        filter.setVisible(tab.filters);
        return filter;
      });
    }
  },
  processFilters: function processFilters(data) {
    var _this2 = this;

    return _.map(data, function (d) {
      var fcty = new FiltersFcty(d.title, d.filter_by, d.filter_options, d.input_type);
      fcty.setSelected("all", true);

      if (_this2.tab) {
        fcty.setVisible(_this2.tab.filters);
      }

      return fcty;
    });
  },
  selected: function selected(filterBy, id) {
    var val = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

    var filter = this.get(filterBy);
    // console.log(filterBy, id)
    filter.setSelected(id, val, true);
    this.changed = true;
  },
  setSelected: function setSelected(sel) {
    this.selectedKey = sel;
  },
  setApi: function setApi(uri) {
    ajaxPromises.addUrl(uri);
  }
};

var FilterStore = assign({}, EventEmitter.prototype, store);
FilterStore.setMaxListeners(0);

var registeredCallback = function registeredCallback(payload) {
  var action = payload.action;
  switch (action.type) {

    case "CHANGE_DATE":
      FilterStore.setDate(action);
      FilterStore.emitChange("change_date");
      break;

    case "CHANGE_KEY":
      FilterStore.setSelected(action.data);
      FilterStore.emitChange("change_key");
      break;

    case "CHECK_FILTER":
      // _data = action.data;
      FilterStore.checked(action.filterBy, action.id, action.value);
      FilterStore.emitChange("filter_change");
      break;

    case "FETCH":
      // FilterStore.setApi(action.api);
      FilterStore.fetchData(action.api);
      FilterStore.emitChange("fetching");
      break;

    case "RECEIVE_DATA":
      // _data = action.data;
      FilterStore.emitChange("fetched");
      break;

    case "SELECT_FILTER":
      // _data = action.data;
      FilterStore.selected(action.filterBy, action.id);
      FilterStore.emitChange("filter_change");
      break;

    case "SET_KEYS":
      FilterStore.setKeys(action.data);
      FilterStore.emitChange("setting_keys");
      break;

    case "SET_TAB":
      FilterStore.setTab(action.tab);
      FilterStore.emitChange("set_tab");
      break;
  }
};

FilterStore.dispatchToken = FilterDispatcher.register(registeredCallback);
module.exports = FilterStore;
//# sourceMappingURL=filter_store.js.map