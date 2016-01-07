const EventEmitter  = require("events").EventEmitter;
const assign        = require("react/lib/Object.assign");

const _ = require("lodash");

const textMixins = require("morse-react-mixins").text_mixins;
const ColumnsDispatcher = require("../dispatcher/columns_dispatcher");




const store = {
  device          : "desktop",
  columns         : [],
  columns_ids     : [],
  visible_columns : [],


  emitChange(event) {
    this.emit(event);
  },

  addChangeListener(event, callback) {
    this.on(event, callback);
  },

  removeChangeListener(event, callback) {
    this.removeListener(event, callback);
  },

  addColumns(c, id){
    id   = id || _.uniqueId();
    let cols = this.setTitles(c);
    this.columns.push({id:id, cols:cols, visible:this.setVisibleColumns(cols)});

    return id;
  },

  changeDevice(d){
    this.device = d;
    this.columns = _.map(this.columns, (col)=>{
      col.visible = this.setVisibleColumns(col.cols);
      return col;
    });

  },

  getColumn(id){
    let items;
    if(id){
      items =  _.find(this.columns, (col)=>{
        return col.id === id;
      });
    } else {
      items = _.first(this.columns);
    }

    if(items){
      return items;
    }

    return {cols:[], visible:[]};
  },

  getDateColumns(id){
    let column = this.getColumn(id).cols;
    let dates = _.chain(column)
      .filter((col)=>(col.type === "date" || col.type === "dateTime"))
      .map((col)=> this.reduceObj(col, ["key", "title", "type", "fmt"]))
      .value();

    return dates;
  },

  getHeadline(id){
    return _.find(this.getColumn(id).visible, (col)=>{
      // console.log(col)

      return (col.headline) ? col.headline : false;
    });
  },

  getKeys(id){
    let visible = this.getColumn(id).visible;
    return _.pluck(visible, "key");
  },

  getKeyAndTitle(id){
    let visible = this.getColumn(id).visible;
    return _.map(visible, (col)=> this.reduceObj(col, ["key", "title"]));
  },

  getLabeled(id){
    return _.filter(this.getColumn(id).visible, (col)=>{
      return col.label;
    });
  },

  getNonLabeled(id){
    return _.filter(this.getColumn(id).visible, (col)=>{
      return _.isBoolean(col.label) && !col.label;
    });
  },

  getSearchable(id){
    let column = this.getColumn(id).cols;
    let searchables = _.chain(column)
      .filter((col)=>col.searchable)
      .map((col)=> this.reduceObj(col, ["key", "title"]))
      .value();

    return searchables;
  },

  getShowable(id){
    let column = this.getColumn(id);
    let showables = _.chain(column.cols)
      .filter((col)=>{
        return col.show && !_.includes(column.visible, col);
      })
      .map((col)=> this.reduceObj(col, ["key", "title"]))
      .value();
    return showables;
  },

  getSortable(id){
    let column = this.getColumn(id).cols;
    let sortables = _.chain(column)
      .filter((col)=>col.sortable)
      .map((col)=> this.reduceObj(col, ["key", "title"]))
      .value();

    return sortables;
  },

  getTitles(id){
    let visible = this.getColumn(id).visible;
    return _.pluck(visible, "title");
  },

  getTitleForKey(key, id){
    let column = this.getColumn(id).cols;
    let item = _.find(column, (col)=> col.key === key );
    return item.title;
  },

  getVisible(id){
    return this.getColumn(id).visible;
  },

  reduceObj(obj, values){
    let reduced = _.omit(obj, (v, k)=>{
      return !_.includes(values, k);
    });
    return reduced;
  },

  removeCols(removeItems){
    return _.reject(this.columns, (col)=>{
      return _.includes(removeItems, col);
    });
  },

  setVisibleColumns(cols){
    let check = {};
    check[this.device] = true;
    return _.where(cols, check);
  },

  setTitles(columns){
    columns = _.map(columns, function(col){
      // console.log(that.capitalize)
      if(!_.has(col, "title")){
        let title = this.capitalize(col.key);
        _.set(col, "title", title);
      }

      return col;
    }.bind(this));

    return columns;
  }
};

Object.assign(store, textMixins);


const ColumnsStore = assign({}, EventEmitter.prototype, store);

const registeredCallback = function(payload) {
  let action = payload.action;
  switch(action.type) {
    case "ADDING_COLUMNS":
      ColumnsStore.addColumns(action.columns, action.id);
      ColumnsStore.emitChange("adding");
      break;

    case "CHANGE_DEVICE":
      ColumnsStore.changeDevice(action.device);
      ColumnsStore.emitChange("change");
      break;
    }
};

ColumnsStore.dispatchToken = ColumnsDispatcher.register(registeredCallback);
ColumnsStore.setMaxListeners(0);

module.exports = ColumnsStore;
