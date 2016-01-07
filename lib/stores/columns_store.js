"use strict";

var EventEmitter = require("events").EventEmitter;
var assign = require("react/lib/Object.assign");

var _ = require("lodash");

var textMixins = require("morse-react-mixins").text_mixins;
var ColumnsDispatcher = require("../dispatcher/columns_dispatcher");

var store = {
  device: "desktop",
  columns: [],
  columns_ids: [],
  visible_columns: [],

  emitChange: function emitChange(event) {
    this.emit(event);
  },
  addChangeListener: function addChangeListener(event, callback) {
    this.on(event, callback);
  },
  removeChangeListener: function removeChangeListener(event, callback) {
    this.removeListener(event, callback);
  },
  addColumns: function addColumns(c, id) {
    id = id || _.uniqueId();
    var cols = this.setTitles(c);
    this.columns.push({ id: id, cols: cols, visible: this.setVisibleColumns(cols) });

    return id;
  },
  changeDevice: function changeDevice(d) {
    var _this = this;

    this.device = d;
    this.columns = _.map(this.columns, function (col) {
      col.visible = _this.setVisibleColumns(col.cols);
      return col;
    });
  },
  getColumn: function getColumn(id) {
    var items = undefined;
    if (id) {
      items = _.find(this.columns, function (col) {
        return col.id === id;
      });
    } else {
      items = _.first(this.columns);
    }

    if (items) {
      return items;
    }

    return { cols: [], visible: [] };
  },
  getDateColumns: function getDateColumns(id) {
    var _this2 = this;

    var column = this.getColumn(id).cols;
    var dates = _.chain(column).filter(function (col) {
      return col.type === "date" || col.type === "dateTime";
    }).map(function (col) {
      return _this2.reduceObj(col, ["key", "title", "type", "fmt"]);
    }).value();

    return dates;
  },
  getHeadline: function getHeadline(id) {
    return _.find(this.getColumn(id).visible, function (col) {
      // console.log(col)

      return col.headline ? col.headline : false;
    });
  },
  getKeys: function getKeys(id) {
    var visible = this.getColumn(id).visible;
    return _.pluck(visible, "key");
  },
  getKeyAndTitle: function getKeyAndTitle(id) {
    var _this3 = this;

    var visible = this.getColumn(id).visible;
    return _.map(visible, function (col) {
      return _this3.reduceObj(col, ["key", "title"]);
    });
  },
  getLabeled: function getLabeled(id) {
    return _.filter(this.getColumn(id).visible, function (col) {
      return col.label;
    });
  },
  getNonLabeled: function getNonLabeled(id) {
    return _.filter(this.getColumn(id).visible, function (col) {
      return _.isBoolean(col.label) && !col.label;
    });
  },
  getSearchable: function getSearchable(id) {
    var _this4 = this;

    var column = this.getColumn(id).cols;
    var searchables = _.chain(column).filter(function (col) {
      return col.searchable;
    }).map(function (col) {
      return _this4.reduceObj(col, ["key", "title"]);
    }).value();

    return searchables;
  },
  getShowable: function getShowable(id) {
    var _this5 = this;

    var column = this.getColumn(id);
    var showables = _.chain(column.cols).filter(function (col) {
      return col.show && !_.includes(column.visible, col);
    }).map(function (col) {
      return _this5.reduceObj(col, ["key", "title"]);
    }).value();
    return showables;
  },
  getSortable: function getSortable(id) {
    var _this6 = this;

    var column = this.getColumn(id).cols;
    var sortables = _.chain(column).filter(function (col) {
      return col.sortable;
    }).map(function (col) {
      return _this6.reduceObj(col, ["key", "title"]);
    }).value();

    return sortables;
  },
  getTitles: function getTitles(id) {
    var visible = this.getColumn(id).visible;
    return _.pluck(visible, "title");
  },
  getTitleForKey: function getTitleForKey(key, id) {
    var column = this.getColumn(id).cols;
    var item = _.find(column, function (col) {
      return col.key === key;
    });
    return item.title;
  },
  getVisible: function getVisible(id) {
    return this.getColumn(id).visible;
  },
  reduceObj: function reduceObj(obj, values) {
    var reduced = _.omit(obj, function (v, k) {
      return !_.includes(values, k);
    });
    return reduced;
  },
  removeCols: function removeCols(removeItems) {
    return _.reject(this.columns, function (col) {
      return _.includes(removeItems, col);
    });
  },
  setVisibleColumns: function setVisibleColumns(cols) {
    var check = {};
    check[this.device] = true;
    return _.where(cols, check);
  },
  setTitles: function setTitles(columns) {
    columns = _.map(columns, (function (col) {
      // console.log(that.capitalize)
      if (!_.has(col, "title")) {
        var title = this.capitalize(col.key);
        _.set(col, "title", title);
      }

      return col;
    }).bind(this));

    return columns;
  }
};

Object.assign(store, textMixins);

var ColumnsStore = assign({}, EventEmitter.prototype, store);

var registeredCallback = function registeredCallback(payload) {
  var action = payload.action;
  switch (action.type) {
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
//# sourceMappingURL=columns_store.js.map