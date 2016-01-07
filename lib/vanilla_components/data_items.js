"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//Libraries
var React = require("react");
// const _     = require("lodash");

//Flux
var DataStore = require("../stores/data_store");

//Components
// const DataItem = require("./data_item");

// Morse Libraies
var ViewportDetect = require("viewport-detection-es6");

var DataItems = (function (_React$Component) {
  _inherits(DataItems, _React$Component);

  function DataItems(props) {
    _classCallCheck(this, DataItems);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DataItems).call(this, props));

    _this.active = [{ active: false }];
    // this._select.bind(this);
    _this.state = { data: [], keys: [], visible: [], device: "desktop" };
    return _this;
  }

  _createClass(DataItems, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      var detect = new ViewportDetect();
      var device = detect.getDevice();
      // this.size  = detect.windowSize();
      // console.log("mountee")
      this.setState({
        device: device,
        visible: this.props[device]
      });
      detect.trackSize(function (device, size) {
        if (_this2.state.device !== device) {
          _this2.setState({
            device: device,
            visible: _this2.props[device]
          });
        }

        _this2.size = size;
      });

      //Data Changers
      DataStore.addChangeListener("delete", this._onSearch.bind(this));
      DataStore.addChangeListener("search", this._onSearch.bind(this));
      DataStore.addChangeListener("pagination", this._onPagination.bind(this));
      DataStore.addChangeListener("change", this._onChange.bind(this));
      DataStore.addChangeListener("fetched", this._onLoaded.bind(this));
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      DataStore.removeChangeListener("delete", this._onSearch);
      DataStore.removeChangeListener("search", this._onSearch);
      DataStore.removeChangeListener("fetched", this._onLoaded);
      DataStore.removeChangeListener("change", this._onChange);
      DataStore.removeChangeListener("pagination", this._onPagination);
    }
  }, {
    key: "renderData",
    value: function renderData() {
      if (this.state.data) {

        var items = this.state.data.map(function (k) {
          if (k) {
            return React.createElement(
              "h3",
              null,
              "Foo"
            );
          }
        });

        return items;
      }
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { key: "items", className: "items-list" },
        this.renderData()
      );
    }
  }, {
    key: "_onChange",
    value: function _onChange() {
      this.setState({ data: DataStore.paginationData() });
    }
  }, {
    key: "_onPagination",
    value: function _onPagination() {
      this.setState({ data: DataStore.paginationData() });
    }
  }, {
    key: "_onSearch",
    value: function _onSearch() {
      this.setState({ data: DataStore.getSearchData() });
    }
  }, {
    key: "_onLoaded",
    value: function _onLoaded() {
      this.setState({ data: DataStore.getAll(), keys: DataStore.getKeys() });
    }
  }]);

  return DataItems;
})(React.Component);

module.exports = DataItems;
//# sourceMappingURL=data_items.js.map