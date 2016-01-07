const EventEmitter  = require("events").EventEmitter;
const assign        = require("react/lib/Object.assign");

const _ = require("lodash");

const textMixins = require("morse-react-mixins").text_mixins;
const TabsDispatcher = require("../dispatcher/tabs_dispatcher");



const store = {
  device       : "mobile",
  tabs         : [],
  tabs_ids     : [],
  visible_tabs : [],


  emitChange(event) {
    this.emit(event);
  },

  addChangeListener(event, callback) {
    this.on(event, callback);
  },

  removeChangeListener(event, callback) {
    this.removeListener(event, callback);
  },

  addTabs(t, id){
    id   = id || _.uniqueId();
    let tabs = this.setIDs(t);
    this.tabs.push({id:id, items:tabs});
    return id;
  },

  changeDevice(d){
    this.device = d;
    // this.tabs = _.map(this.tabs, (tab)=>{
    //   tab.visible = this.setVisibleTabs(tab.tabs);
    //   return tab;
    // });

  },

  changeTab(id, t){

    let tabs = this.getTabs(id);
    let items =  tabs.items;
    items = _.map(items, (tab)=>{
      tab.options.active = (tab.id === t);
      return tab;
    });

    this.setTabs(id, items);
  },

  getActive(){
    let tabs = this.getTabs();
    let item = _.find(tabs.items, (t)=> t.options.active);
    return item;
  },

  getFilters(){
    let tab = this.getActive();
    return {filters:tab.filters, filterBy:tab.filterBy};
  },

  getSearch(){
    let tab = this.getActive();
    return tab.search;
  },

  getTabs(id){
    let items;
    if(id){
      items =  _.find(this.tabs, (tab)=>{
        return tab.id === id;
      });
    } else {
      items = _.first(this.tabs);
    }
    if(items){
      return items;
    }

    return {id:null, tabs:[]};
  },

  isActive(tabsId, id){
    let tabs = this.getTabs(tabsId);
    let item = _.find(tabs.items, (t)=> t.id === id);
    return item.options.active;
  },

  setIDs(tabs){
    return _.map(tabs, (tab)=>{
      tab.id = _.uniqueId();
      return tab;
    });
  },

  setTabs(id, items){
    this.tabs = _.map(this.tabs, (tab)=>{
      if(tab.id === id){
        tab.items = items;
      }

      return tab;
    });
  },


  setTitles(tabs){
    tabs = _.map(tabs, function(tab){
      if(!_.has(tab, "title")){
        let title = this.capitalize(tab.key);
        _.set(tab, "title", title);
      }

      return tab;
    }.bind(this));

    return tabs;
  }
};

Object.assign(store, textMixins);


const TabsStore = assign({}, EventEmitter.prototype, store);

const registeredCallback = function(payload) {
  let action = payload.action;
  switch(action.type) {
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
