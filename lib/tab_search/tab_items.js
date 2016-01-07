"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//Libraries
var React = require("react"),
    _ = require("lodash");

//Morse Libraries
// const ViewportDetect = require("viewport-detection-es6");

//Flux
var TabsStore = require("../stores/tabs_store"),
    DataStore = require("../stores/data_store");

//Components
var DataItems = require("../vanilla_components/data_items");
var TabItem = require("./tab_item");
// const GenericExpander = require("./generic_expander");
// const DataItem        = require("../components/data_item");

var TabItems = (function (_DataItems) {
  _inherits(TabItems, _DataItems);

  function TabItems(props) {
    _classCallCheck(this, TabItems);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TabItems).call(this, props));

    _this.state = { data: null };
    return _this;
  }

  _createClass(TabItems, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      _get(Object.getPrototypeOf(TabItems.prototype), "componentDidMount", this).call(this);

      TabsStore.addChangeListener("tab_change", this._onTabChange.bind(this));
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      _get(Object.getPrototypeOf(TabItems.prototype), "componentWillUnmount", this).call(this);
      TabsStore.removeChangeListener("tab_change", this._onTabChange);
    }
  }, {
    key: "renderData",
    value: function renderData() {
      var _this2 = this;

      if (_.isNull(this.state.data)) return "";

      if (this.state.data && this.state.data.size > 0) {

        return this.state.data.map(function (k) {
          return React.createElement(TabItem, _extends({}, _this2.props, {
            data: k,
            key: k.get("id")
          }));
        });
      }

      if (this.state.data.size <= 0) {
        return React.createElement(
          "div",
          { className: "loader", key: "loader" },
          React.createElement(
            "h5",
            null,
            this.props.noresults
          )
        );
      }

      return "";
    }
  }, {
    key: "_onTabChange",
    value: function _onTabChange() {
      DataStore.setSearchVal("");
      this.setState({ data: DataStore.getSearchData() });
    }
  }]);

  return TabItems;
})(DataItems);

module.exports = TabItems;
//# sourceMappingURL=tab_items.js.map