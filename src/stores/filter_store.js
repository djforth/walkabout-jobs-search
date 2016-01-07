const _ = require("lodash");

const FilterDispatcher = require("../dispatcher/filter_dispatcher");
const FilterAction     = require("../actions/filter_actions");
const EventEmitter     = require("events").EventEmitter;
const assign           = require("react/lib/Object.assign");

const AjaxPromises  = require("ajax-es6-module");
let ajaxPromises    = new AjaxPromises();

const FiltersFcty = require("../factories/filters_fcty");

// let Masterfilters =  new FiltersFcty();



const store =  {
  keys         : [],
  dates        : {},
  selectedKey  : "all",
  filters      : [],
  changed      : true,
  cache        : null,
  tabs         : [],

  emitChange(event) {
    this.emit(event);
  },

  /**
   * @param {function} callback
   */
  addChangeListener(event, callback) {
    this.on(event, callback);
  },

  removeChangeListener(event, callback) {
    this.removeListener(event, callback);
  },

  checked(filterBy, id, checked){
    let filter = this.get(filterBy);

    if(filter){
      filter.setSelected(id, checked);
    }
    this.changed  = true;
  },

  fetchData(api){
    this.setApi(api);
    return ajaxPromises.fetch().then((data)=>{
      this.filters = this.processFilters(data);
      FilterAction.receiveAll(this.filters);
      return this.filters;
    }).catch((err)=>{
      throw new Error(err);
    });
  },

  get(id) {
    return _.find(this.filters, (f)=>{
      return f.hasDetails("filterBy", id);
    });
  },

  getAll() {
    return this.filters;
  },

  getDates() {
    return this.dates;
  },

  getAllKeys() {
    return this.keys;
  },

  getFilters(){
    let data = this.cache;
    if(this.changed) {

      this.cache =  data = this.getSelectedFilters();
      this.changed = false;
    }
    return data;
  },

  getSelectedFilters(){
    return _.map(this.filters, (f)=>{
      return f.getSelected();
    });
  },

  getSelectedKey(){

    return this.selectedKey;
  },

  getSelectedKeys(){
    if(this.selectedKey === "all"){
      return this.keys;
    } else {
      return [this.selectedKey];
    }
  },

  getVisible(){
    return _.filter(this.filters, (f)=>{
      return f.isVisible();
    });
  },

  isSelectedKey(k){
    return this.selectedKey === k;
  },

  setDate(dr){
    if(!_.has(this.dates, dr.key)){
      this.dates[dr.key] = {};
    }

    if(dr.pos === "start"){
      this.dates[dr.key].st = dr.date;
    } else {
      this.dates[dr.key].fn = dr.date;
    }
  },

  setKeys(ks){
    this.keys = ks;
  },

  // setTabFilter(tab){

  // }

  setTab(tab){

    this.tab     = tab;
    this.changed = true;
    if(!_.isEmpty(this.filters)){
      this.filters = _.map(this.filters, (filter)=>{
        // console.log('filters', tab.filters);
        filter.reset();
        filter.setVisible(tab.filters);
        return filter;
      });


    }
  },

  processFilters(data){
    return _.map(data, (d)=>{
      let fcty = new FiltersFcty(d.title, d.filter_by, d.filter_options, d.input_type);
      fcty.setSelected("all", true);

      if(this.tab){
        fcty.setVisible(this.tab.filters);
      }

      return fcty;
    });
  },

  selected(filterBy, id, val=true){
    let filter = this.get(filterBy);
    // console.log(filterBy, id)
    filter.setSelected(id, val, true);
    this.changed  = true;
  },

  setSelected(sel){
    this.selectedKey = sel;
  },

  setApi(uri){
    ajaxPromises.addUrl(uri);
  }

};

const FilterStore = assign({}, EventEmitter.prototype, store);
FilterStore.setMaxListeners(0);

const registeredCallback = function(payload) {
  var action = payload.action;
  switch(action.type) {

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
