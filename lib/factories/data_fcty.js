"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _ = require("lodash");
var DataManager = require("datamanager");

var DataFcty = (function (_DataManager) {
  _inherits(DataFcty, _DataManager);

  function DataFcty() {
    _classCallCheck(this, DataFcty);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(DataFcty).apply(this, arguments));
  }

  _createClass(DataFcty, [{
    key: "init",
    value: function init() {
      this.cache = {};
      this.pagination = 50;
      this.page = 1;
      this.itemNo = 0;
      this.current_search = null;
    }
  }, {
    key: "cacher",
    value: function cacher(presets) {
      var cache = presets || {};
      return {
        isEmpty: function isEmpty(items, key) {
          return cache[key] ? true : false;
        },
        get: function get(key) {
          return _.get(cache, key);
        },
        set: function set(key, value) {
          cache[key] = value;
        }
      };
    }
  }, {
    key: "addSelected",
    value: function addSelected(ids) {
      if (this.checkDataIds(ids)) {
        this.addToHistory();
        this.data = this.data.map(function (d) {
          var selected = false;
          var id = d.get("id");
          if (_.isArray(ids)) {
            selected = _.contains(ids, id);
          } else {
            selected = ids === id;
          }

          d = d.set("selected", selected);
          return d;
        });
      }
    }
  }, {
    key: "setApi",
    value: function setApi(uri) {
      this.url = uri;
    }
  }, {
    key: "cachedChecker",
    value: function cachedChecker(values) {
      var checker = {
        text: this.checkCacheText(values("text"), values("keys")),
        filters: this.checkCacheFilters(values("filters")),
        daterange: this.checkCachedDateRanges(values("dateRanges")),
        tab: this.checkTabsCache(values("tab"))
      };

      var checkAll = function checkAll() {
        return _.reduce(_.values(checker), function (t, n) {
          return n && t;
        });
      };

      return function (key) {
        return key === "all" ? checkAll() : checker[key];
      };
    }
  }, {
    key: "checkCache",
    value: function checkCache(items, key) {
      var check = this.checkEmptyOrCached(items, key);
      if (_.isBoolean(check)) {
        return check;
      }

      return function (tester) {
        return tester(items);
      };
    }
  }, {
    key: "checkDataIds",
    value: function checkDataIds(d) {
      if (_.isArray(d)) {
        return !_.isEmpty(d);
      } else {
        return _.isNumber(d);
      }
    }
  }, {
    key: "checkCachedDateRanges",
    value: function checkCachedDateRanges(dateRanges) {

      var check = this.checkEmptyOrCached(dateRanges, this.cache.dateRanges);

      if (_.isBoolean(check)) {
        return check;
      }

      check = true;
      var cacheDR = this.cache.dateRanges;

      _.forIn(dateRanges, function (v, k) {
        var dr = cacheDR[k];

        if (v.st !== dr.st || v.fn !== dr.fn) {
          check = false;
          return false;
        }
      });

      return check;
    }
  }, {
    key: "checkCacheFilters",
    value: function checkCacheFilters(filters) {
      var _this2 = this;

      var check = this.checkEmptyOrCached(filters, this.cache.filters);

      if (_.isBoolean(check)) {
        return check;
      }

      check = true;
      _.forEach(filters, function (f) {
        var cached = _this2.getFilterByKey("filter_by", f.filter_by);

        if (!f.selected.equals(cached.selected)) {
          check = false;
          return false;
        }
      });

      return check;
    }
  }, {
    key: "checkTabsCache",
    value: function checkTabsCache(tab) {
      var checkTabs = this.checkEmptyOrCached(tab, this.cache.tab);
      if (_.isBoolean(checkTabs)) {
        return checkTabs;
      }

      return this.cache.tabs === tab;
    }
  }, {
    key: "checkCacheText",
    value: function checkCacheText(val, keys) {
      var checkKeys = this.checkEmptyOrCached(keys, this.cache.keys);
      if (_.isBoolean(checkKeys)) {
        return checkKeys;
      }

      if (!this.cache.text) {
        return false;
      }

      return this.cache.text === val && _.difference(keys, this.cache.keys).length === 0;
    }
  }, {
    key: "checkDates",
    value: function checkDates(date, range) {
      var test = false;
      if (_.isDate(date)) {
        if (date > range.st && date < range.fn) {
          test = true;
        }
      }

      return test;
    }

    // Check and return filtered data

  }, {
    key: "checker",
    value: function checker(v, t, c) {
      var _this3 = this;

      if (_.isEmpty(v)) {
        return false;
      }

      var test = t;
      var cache = c;

      return function (searchFn) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        args.push(v);
        return test() ? cache : searchFn.apply(_this3, args);
      };
    }
  }, {
    key: "checkerFilters",
    value: function checkerFilters(data, check, values) {
      var filters = this.checker(values("filters"), function () {
        return check("filters");
      }, this.cache.filterSearch);

      return filters ? filters(this.filterSearch, data) : data;
    }
  }, {
    key: "checkerDateRanges",
    value: function checkerDateRanges(data, check, values) {
      var dr = this.checker(values("dateRanges"), function () {
        return check("filters") && check("dateRanges");
      }, this.cache.dateRangesSearch);

      return dr ? dr(this.dateRangeSearch, data) : data;
    }
  }, {
    key: "checkerTabs",
    value: function checkerTabs(data, check, values) {
      var tab = this.checker(values("tab"), function () {
        return check("tab");
      }, this.cache.tabSearch);

      return tab ? tab(this.tabSearch, data) : data;
    }
  }, {
    key: "checkEmptyOrCached",
    value: function checkEmptyOrCached(items, cache) {
      if (_.isEmpty(items) || !items) {
        return true;
      }

      return !cache ? false : null;
    }
  }, {
    key: "checkFilters",
    value: function checkFilters(opts, filter) {
      var selected = this.getIds(filter.selected);
      var ids = opts.get(filter.filter_by);

      return this.checkIds(selected, ids);
    }
  }, {
    key: "checkIds",
    value: function checkIds(selected, ids) {
      if (_.isArray(ids)) {
        if (_.intersection(selected, ids).length > 0) {
          return true;
        }
      } else if (_.include(selected, ids)) {
        return true;
      }

      return false;
    }
  }, {
    key: "dateRangeSearch",
    value: function dateRangeSearch(search, dateRanges) {
      var _this4 = this;

      this.cache.dateRanges = _.cloneDeep(dateRanges);
      if (!_.isEmpty(dateRanges)) {
        search = search.filter(function (d) {
          var checked = false;
          _.forIn(dateRanges, function (dr, key) {
            if (_this4.checkDates(d.get(key), dr)) {
              checked = true;
              return false;
            }
          });

          return checked;
        });
      }

      this.cache.dateRangesSearch = search;
      return search;
    }
  }, {
    key: "filterSearch",
    value: function filterSearch(search, filters) {
      var _this5 = this;

      this.cache.filters = filters;

      filters = _.where(filters, { all: false });
      console.log("filters", filters);
      if (filters.length > 0) {
        search = search.filter(function (d) {
          var checked = false;
          _.forEach(filters, function (filter) {
            if (_this5.checkFilters(d.get("filters"), filter)) {
              checked = true;
              return false;
            }
          });

          return checked;
        });
      }

      this.cache.filterSearch = search;
      return search;
    }
  }, {
    key: "tabSearch",
    value: function tabSearch(search, tab) {
      this.cache.tab = tab;

      var findKey = function findKey(key, d) {
        if (d.has(key)) {
          return d.get(key);
        }

        var filters = d.get("filters");

        return filters.has(key) ? filters.get(key) : false;
      };

      var checkValues = function checkValues(filter, d) {
        if (_.isArray(filter)) {
          return _.includes(filter);
        }

        return filter === d;
      };
      // console.log(tab.filterBy.type)
      if (_.isObject(tab) && tab.filterBy.type !== "all") {
        (function () {
          // console.log("foo")
          var filterBy = tab.filterBy;
          search = search.filter(function (d) {
            var item = findKey(filterBy.type, d);
            if (filterBy.filter) {
              return checkValues(filterBy.filter, item);
            }

            return item ? true : false;
          });
        })();
      }
      // console.log(search)
      return search;
    }
  }, {
    key: "filterByIds",
    value: function filterByIds(ids) {
      if (this.data) {
        return this.data.filter(function (d) {
          // console.log(ids, d.get("id"));
          return _.contains(ids, Number(d.get("id")));
        });
      }
      return null;
    }
  }, {
    key: "getFilterByKey",
    value: function getFilterByKey(key, keyComp) {
      return _.find(this.cache.filters, function (c) {
        return c[key] === keyComp;
      });
    }
  }, {
    key: "getIds",
    value: function getIds(selected) {
      var ids = selected.map(function (s) {
        return s.get("id");
      });

      return ids.toJS();
    }
  }, {
    key: "getSearch",
    value: function getSearch(data, val, keys) {
      var _this6 = this;

      //Do search
      var regex = new RegExp(val, "i");
      var search = data.filter(function (d) {
        return _this6.searchTxt(regex, d, keys);
      });

      this.cache.text = val;
      this.cache.keys = keys;
      this.cache.search = search;

      return search;
    }
  }, {
    key: "getValues",
    value: function getValues(data, keys) {
      if (keys.length > 1) {
        var all = data.filter(function (v, k) {
          return _.contains(keys, k);
        });
        return all.valueSeq().toJS().join(" ");
      } else {
        var k = _.isArray(keys) ? _.first(keys) : keys;
        return data.get(k);
      }
    }
  }, {
    key: "remove",
    value: function remove(id) {
      // let del = this.findById(id);
      var del = _get(Object.getPrototypeOf(DataFcty.prototype), "remove", this).call(this, id);
      var search = this.cache.fullSearch;

      if (del && search) {
        this.cache = _.mapValues(this.cache, function (v) {

          if (v.indexOf) {
            var i = v.indexOf(del);
            if (i > -1) {
              v = v.delete(i);
            }
          }
          return v;
        });
      }

      return del;
    }
  }, {
    key: "searchTxt",
    value: function searchTxt(regex, data, keys) {
      var values = this.getValues(data, keys);

      if (values) {
        return String(values).search(regex) > -1;
      }

      return false;
    }
  }, {
    key: "search",
    value: function search() {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      var values = this.setValues.apply(this, args);
      // console.log("tabs", values("tab"))
      //Cache Checks
      var check = this.cachedChecker(values);

      if (check("all")) {
        return this.cache.fullSearch;
      }
      // console.log("cache", this.cache)
      var searchData = this.checkerFilters(this.data, check, values);

      searchData = this.checkerTabs(searchData, check, values);

      searchData = this.checkerDateRanges(searchData, check, values);

      //Runs Search over data
      if (!_.isEmpty(values("text"))) {
        searchData = this.getSearch(searchData, values("text"), values("keys"));
      }

      this.cache.fullSearch = searchData; // Caches search
      return searchData;
    }

    //Setting Default values

  }, {
    key: "setter",
    value: function setter(test, key) {
      var tester = test;
      var k = key;

      return _.curry(function (obj, arg) {
        if (tester(arg)) {
          obj[k] = arg;
        }

        return obj;
      });
    }
  }, {
    key: "createSetters",
    value: function createSetters() {
      var setter_array = [];
      setter_array.push(this.setter(function (arg) {
        return _.isString(arg);
      }, "text"));

      setter_array.push(this.setter(function (arg) {
        return _.isArray(arg) && _.isString(_.first(arg));
      }, "keys"));

      setter_array.push(this.setter(function (arg) {
        return _.isArray(arg) && _.isObject(_.first(arg));
      }, "filters"));

      setter_array.push(this.setter(function (arg) {
        return _.isObject(arg) && _.has(arg, "filterBy");
      }, "tab"));

      setter_array.push(this.setter(function (arg) {
        return _.isObject(arg) && !_.has(arg, "filterBy");
      }, "dateRanges"));

      return setter_array;
    }
  }, {
    key: "setValues",
    value: function setValues() {

      //Checks values
      var settings = this.createSetters();

      var values = {};

      for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      _.forEach(args, function (arg) {
        _.forEach(settings, function (set) {
          set = set(values);
          values = set(arg);
        });
      });

      _.defaults(values, { "text": "" }, { "keys": [] }, { "filters": [] }, { "tab": {} }, { "dateRanges": {} });
      return function (key) {
        return values[key];
      };
    }
  }]);

  return DataFcty;
})(DataManager);

module.exports = DataFcty;
//# sourceMappingURL=data_fcty.js.map