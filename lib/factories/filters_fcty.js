"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//Libraries
var Immutable = require("immutable");
var _ = require("lodash");

//Morse Libraries
var AjaxPromises = require("ajax-es6-module");
var DataManager = require("datamanager");

var FiltersFcty = (function (_DataManager) {
  _inherits(FiltersFcty, _DataManager);

  function FiltersFcty(title, filter_by, filter_opts) {
    var input_type = arguments.length <= 3 || arguments[3] === undefined ? "checkbox" : arguments[3];

    _classCallCheck(this, FiltersFcty);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(FiltersFcty).call(this));

    _this.ajaxPromises = new AjaxPromises();
    _this.data = null;

    _this.history = [];
    _this.keys = null;
    _this.cid = _.uniqueId("filter");

    _this.details = Immutable.fromJS({ title: title, filterBy: filter_by, input_type: input_type, visible: true });

    _this.defaults = input_type === "checkbox" ? { selected: true } : { selected: false };

    if (filter_opts) {
      _this.add(filter_opts);
    }
    return _this;
  }

  _createClass(FiltersFcty, [{
    key: "getDetails",
    value: function getDetails(key) {
      if (key) {
        return this.details.get(key);
      }
      return "";
    }
  }, {
    key: "hasDetails",
    value: function hasDetails(key, val) {
      return this.details.get(key) === val;
    }
  }, {
    key: "getSelected",
    value: function getSelected() {
      var all = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

      var selected = undefined;
      if (all) {
        selected = this.data;
      } else {
        selected = this.data.filter(function (d) {
          return d.get("selected");
        });
      }

      if (selected.size === 0 && this.details.get("input_type") !== "checkbox") {
        selected = this.data;
      }

      return { filter_by: this.details.get("filterBy"), selected: selected, all: selected.size === this.data.size };
    }
  }, {
    key: "isVisible",
    value: function isVisible() {
      return this.details.get('visible');
    }
  }, {
    key: "reset",
    value: function reset() {
      var _this2 = this;

      this.data = this.data.map(function (d) {
        return _this2.addDefaults(d);
      });
      // console.log(this.data.toJS())
    }
  }, {
    key: "setApi",
    value: function setApi(uri) {
      this.url = uri;
    }
  }, {
    key: "setSelected",
    value: function setSelected(id) {
      var value = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];
      var reset = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

      this.addToHistory();
      this.data = this.data.map(function (d) {
        switch (id) {
          case String(d.get("id")):
            d = d.set("selected", value);
            break;
          case "all":
            d = d.set("selected", value);
            break;
          default:
            if (reset) {
              d = d.set("selected", !value);
            }
            break;
        }

        return d;
      });
    }
  }, {
    key: "setVisible",
    value: function setVisible(filters) {
      var filterBy = this.details.get('filterBy');
      // console.log(filters, filterBy)
      var vis = _.includes(filters, filterBy);
      // console.log('vis', vis);
      this.details = this.details.set('visible', vis);
    }
  }]);

  return FiltersFcty;
})(DataManager);

module.exports = FiltersFcty;
//# sourceMappingURL=filters_fcty.js.map