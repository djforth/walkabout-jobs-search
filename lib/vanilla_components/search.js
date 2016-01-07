"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//Libraries
var React = require("react");
// console.log('WTF', React);
var _ = require("lodash");

//Flux
// const DataStore      = require("../stores/data_store");
var DataActions = require("../actions/data_actions");
var FilterActions = require("../actions/filter_actions");
var ColumnsActions = require("../actions/columns_actions");

var ColumnsStore = require("../stores/columns_store");
var DataStore = require("../stores/data_store");
// const FilterStore   = require("../stores/filter_store");

// Morse Libraies
var ViewportDetect = require("viewport-detection-es6");

//Components
// const DataHead    =  require("./data_head");
var Filters = require("./filters");
// const PaginationHolder  = require("./pagination");
// const ProgressBar = require("react-bootstrap/lib/ProgressBar.js");

var Search = (function (_React$Component) {
  _inherits(Search, _React$Component);

  function Search(props) {
    _classCallCheck(this, Search);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Search).call(this, props));

    _this.active = [{ active: false }];
    _this.percent = 0;
    _this.state = { data: [], keys: [], visible: [], device: "desktop" };
    return _this;
  }

  _createClass(Search, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      if (this.props.search) {
        DataStore.setSearchVal(this.props.search);
      }
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      // console.log("Search mounting")
      var detect = new ViewportDetect();
      this.device = detect.getDevice();
      this.size = detect.windowSize();
      var colsId = ColumnsActions.addingColumns(this.props.columns);
      ColumnsActions.changeDevice(this.device);
      this.setState({
        // device:device,
        loading: true,
        loading_txt: "Starting data load",
        percent: 0,
        colsId: colsId
      });
      detect.trackSize((function (device, size) {
        if (this.device !== device) {
          this.device = device;
          ColumnsActions.changeDevice(device);
        }

        this.size = size;
      }).bind(this));

      //Adds Keys
      var keys = ColumnsStore.getSearchable();
      FilterActions.setKeys(_.pluck(keys, "key"));

      this.setLoading();
      DataStore.addChangeListener("fetched", this._onLoaded.bind(this));
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      DataStore.removeChangeListener("fetched", this._onLoaded);
    }
  }, {
    key: "handleSelect",
    value: function handleSelect(event, selectedEvent) {
      this.setState({
        activePage: selectedEvent.eventKey
      });
    }
  }, {
    key: "loading",
    value: function loading() {
      if (this.state.loading) {
        return React.createElement(
          "div",
          { className: "loader" },
          React.createElement(
            "h5",
            null,
            this.state.loading_txt
          )
        );
      }
    }
  }, {
    key: "render",
    value: function render() {
      // console.log('props', this.props.icon);
      return React.createElement(
        "div",
        null,
        React.createElement(Filters, _extends({}, this.props, { key: "filters" })),
        this.props.children,
        this.loading()
      );
    }
  }, {
    key: "setLoading",
    value: function setLoading() {
      var _this2 = this;

      var FakeLoading = window.setInterval(function () {
        if (_this2.percent < 50) {
          _this2.percent++;
        }

        _this2.setState({ percent: _this2.percent, loading: true, loading_txt: _this2.percent + "% loaded" });
      }, 1000);

      //Get Data
      DataActions.fetchData(function (p) {
        clearInterval(FakeLoading);
        if (p.percent >= 100) {
          _this2.setState({ loading: false, percent: p.percent });
        } else {
          _this2.percent = _this2.percent > p.percent ? _this2.percent : p.percent;
          _this2.setState({ percent: _this2.percent, loading_txt: _this2.perecent + "% loaded" });
        }
      }, this.props.dataApi);
    }
  }, {
    key: "_onLoaded",
    value: function _onLoaded() {
      // let items_count = DataStore.getAll();
      this.setState({ loading: false, percent: 100 });
    }
  }]);

  return Search;
})(React.Component);

module.exports = Search;
//# sourceMappingURL=search.js.map