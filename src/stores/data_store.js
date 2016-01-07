const EventEmitter  = require("events").EventEmitter;
const assign        = require("react/lib/Object.assign");
const _             = require("lodash");

const DataDispatcher = require("../dispatcher/data_dispatcher");
const DataAction     = require("../actions/data_actions");
const FilterStore    = require("./filter_store");
const TabsStore      = require("./tabs_store");

const DataFcty = require("../factories/data_fcty");

// let data =  new DataFcty();
// console.count("Data")


// var searchVal;
// var pagination = 50;
// var page       = 1;
// var itemNo     = 0;
// var cache;
// var selected = [];



const store = {

  cache      : null,
  data       : new DataFcty(),
  dateRanges : {},
  flash      :null,
  itemNo     : 0,
  removed    : null,
  pagination : 50,
  page       : 1,
  searchVal  :null,
  selected   : [],



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

  checkDeleted(id){
    return this.removed === id;
  },

  deleteItem(id, fl){

    if(fl.type === "notice"){
      this.removed = id;
      this.data.remove(id);

      if(this.cache){
        this.cache.remove(id);
      }

    }

    this.flash = fl;
  },



  fetchData(progress){
    console.log('GET DATA');
    return this.data.fetch(progress)
      .then(
        this.processData.bind(this)
      )
      .catch((err)=>{
        let error = new Error(err);
        throw error;
      });
  },

  get(id) {
    return this.data.findById(id);
  },

  getAll() {
    if(!_.isEmpty(this.searchVal)){
      return this.getSearchData();
    } else {
      this.cache = this.data.getAll();
      return this.cache.slice(0, this.pagination - 1);
    }

  },

  getFlash(){
    return this.flash;
  },

  getByIds(ids) {
    return this.data.filterByIds(ids);
  },

  getCurrentData(){
    return this.data.getAll();
  },

  getDateFmt(item, key, fmt="%d/%m/%Y"){
    return this.data.formatDate(item, key, fmt);
  },

  getKeys(){
    return this.data.getKeys();
  },

  getPage(){
    let i  = this.page - 1;
    let st = i * this.pagination;
    let fn = (st + this.pagination) - 1;

    return {st:st, fn:fn};
  },

  getPagination(){
    let no = this.itemNo / this.pagination;
    if( no < 1 ){
      return 0;
    } else {
      return Math.ceil(no);
    }
  },

  getSearchData(){
    this.page      = 1;
    let keys       = FilterStore.getSelectedKeys();
    let filters    = FilterStore.getFilters();
    let dateRanges = FilterStore.getDates();
    let tab        = TabsStore.getActive();
    let search = this.data.search(this.searchVal, keys, filters, dateRanges, tab);
    this.itemNo = search.size;
    this.cache  = search;
    // console.log("search", search.size)
    return search.slice(0, this.pagination - 1);
  },

  getSearchVal(){
    return this.searchVal;
  },

  paginationData(){
    let page = this.getPage();
    return this.cache.slice(page.st, page.fn);
  },

  processData(){
    if(!_.isEmpty(this.selected)){
      this.data.addSelected(this.selected);
    }

    let d = this.data.getAll();
    console.log(d)
    this.itemNo = (d.size) ? d.size : 0;

    // simulate success callback
    DataAction.receiveAll(d);

    return d;
  },

  removeDateRange(key){
    this.dateRanges = _.omit(this.dateRanges, key);
  },

  setApi(uri){
    this.data.url = uri;
  },

  setDateRanges(key, st, fn){
    if(_.isDate(st) && _.isDate(fn)){
      this.dateRanges[key] = {
        st:st,
        fn:fn
      };
    }
  },

  setPage(p){
    this.page = p;
  },

  setSearchVal(val){
    this.searchVal = val;
  },

  selectedIds(ids){
    this.selected = ids;
  },

  setSelected(id, selected=true){

    this.data.update(id, {selected:selected});
    if(this.cache){
      this.cache = this.cache.map((c)=>{
        if(c){
          if(c && c.get("id") === id){
            c = c.set("selected", selected);
          }
          return c;
        }
      });
    }

  }
};

const DataStore = assign({}, EventEmitter.prototype, store);
DataStore.setMaxListeners(0);

const registeredCallback = function(payload) {
  var action = payload.action;

  switch(action.type) {
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
