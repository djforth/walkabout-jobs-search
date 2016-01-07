"use strict";

var EventEmitter = require("events").EventEmitter;
var assign = require("react/lib/Object.assign");

var _ = require("lodash");

var textMixins = require("morse-react-mixins").text_mixins;
var TabsDispatcher = require("../dispatcher/tabs_dispatcher");

var store = {
  device: "mobile",
  tabs: [],
  tabs_ids: [],
  visible_tabs: [],

  emitChange: function emitChange(event) {
    this.emit(event);
  },
  addChangeListener: function addChangeListener(event, callback) {
    this.on(event, callback);
  },
  removeChangeListener: function removeChangeListener(event, callback) {
    this.removeListener(event, callback);
  },
  addTabs: function addTabs(t, id) {
    id = id || _.uniqueId();
    var tabs = this.setIDs(t);
    this.tabs.push({ id: id, items: tabs });
    return id;
  },
  changeDevice: function changeDevice(d) {
    this.device = d;
    // this.tabs = _.map(this.tabs, (tab)=>{
    //   tab.visible = this.setVisibleTabs(tab.tabs);
    //   return tab;
    // });
  },
  changeTab: function changeTab(id, t) {

    var tabs = this.getTabs(id);
    var items = tabs.items;
    items = _.map(items, function (tab) {
      tab.options.active = tab.id === t;
      return tab;
    });

    this.setTabs(id, items);
  },
  getActive: function getActive() {
    var tabs = this.getTabs();
    var item = _.find(tabs.items, function (t) {
      return t.options.active;
    });
    return item;
  },
  getFilters: function getFilters() {
    var tab = this.getActive();
    return { filters: tab.filters, filterBy: tab.filterBy };
  },
  getSearch: function getSearch() {
    var tab = this.getActive();
    return tab.search;
  },
  getTabs: function getTabs(id) {
    var items = undefined;
    if (id) {
      items = _.find(this.tabs, function (tab) {
        return tab.id === id;
      });
    } else {
      items = _.first(this.tabs);
    }
    if (items) {
      return items;
    }

    return { id: null, tabs: [] };
  },
  isActive: function isActive(tabsId, id) {
    var tabs = this.getTabs(tabsId);
    var item = _.find(tabs.items, function (t) {
      return t.id === id;
    });
    return item.options.active;
  },
  setIDs: function setIDs(tabs) {
    return _.map(tabs, function (tab) {
      tab.id = _.uniqueId();
      return tab;
    });
  },
  setTabs: function setTabs(id, items) {
    this.tabs = _.map(this.tabs, function (tab) {
      if (tab.id === id) {
        tab.items = items;
      }

      return tab;
    });
  },
  setTitles: function setTitles(tabs) {
    tabs = _.map(tabs, (function (tab) {
      if (!_.has(tab, "title")) {
        var title = this.capitalize(tab.key);
        _.set(tab, "title", title);
      }

      return tab;
    }).bind(this));

    return tabs;
  }
};

Object.assign(store, textMixins);

var TabsStore = assign({}, EventEmitter.prototype, store);

var registeredCallback = function registeredCallback(payload) {
  var action = payload.action;
  switch (action.type) {
    case "ADDING_TABS":
      TabsStore.addTabs(action.tabs, action.id);
      TabsStore.emitChange("adding");
      break;

    case "CHANGE_DEVICE":
      TabsStore.changeDevice(action.device);
      TabsStore.emitChange("device_change");
      break;

    case "CHANGE_TAB":
      TabsStore.changeTab(action.id, action.tab);
      TabsStore.emitChange("tab_change");
      break;
  }
};

TabsStore.dispatchToken = TabsDispatcher.register(registeredCallback);
TabsStore.setMaxListeners(0);

module.exports = TabsStore;
//# sourceMappingURL=tabs_store.js.map