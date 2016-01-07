"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require("react");
var _ = require("lodash");

var ColumnsStore = require("../stores/columns_store");

//Mixins
var cssMixins = require("morse-react-mixins").css_mixins;
var textMixins = require("morse-react-mixins").text_mixins;

var DataItem = (function (_React$Component) {
  _inherits(DataItem, _React$Component);

  function DataItem(props) {
    _classCallCheck(this, DataItem);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DataItem).call(this, props));

    _this.active = [{ active: false }];
    // this._select.bind(this);
    _this.state = { data: null, columns: [], datefield: [] };

    return _this;
  }

  _createClass(DataItem, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.mounted = true;
      this.setState({ data: this.props.data, columns: ColumnsStore.getVisible() });

      ColumnsStore.addChangeListener("change", this._onChange.bind(this));
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.mounted = false;
      ColumnsStore.removeChangeListener("change", this._onChange);
    }
  }, {
    key: "getFmt",
    value: function getFmt(col) {
      if (_.has(col, "fmt")) {
        return col.fmt;
      }

      if (_.has(col, "type")) {
        if (col.type === "dateTime") {
          return "%d/%m/%Y %H:%M";
        }
        if (col.type === "date") {
          return "%d/%m/%Y";
        }
      }

      return "%d/%m/%Y";
    }
  }, {
    key: "displayData",
    value: function displayData(item, col) {
      var key = col.key;
      var data = item.get(col.key);
      // console.log("data", data);
      if (_.isUndefined(data)) {
        return "";
      }

      if (_.isDate(data)) {
        data = item.get(key + "Df");
        var fmt = this.getFmt(col);
        return data.formatDate(fmt);
      }

      return this.rawMarkup(data);
    }
  }, {
    key: "renderColumn",
    value: function renderColumn(col, item) {
      return React.createElement(
        "div",
        { className: this.checkCss(this.props.css, col.key), key: _.uniqueId("dataItem") },
        this.displayData(item, col)
      );
    }
  }, {
    key: "rawMarkup",
    value: function rawMarkup(data) {
      return React.createElement("span", { dangerouslySetInnerHTML: { __html: data } });
    }
  }, {
    key: "renderTd",
    value: function renderTd() {
      var item = this.props.data;
      if (item && this.state.columns) {
        var td = _.map(this.state.columns, (function (col) {
          return this.renderColumn(col, item);
        }).bind(this));

        return td;
      }
      return "";
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { className: "row tr vPad5" },
        this.renderTd()
      );
    }
  }, {
    key: "_onChange",
    value: function _onChange() {
      if (this.mounted) {
        this.setState({
          columns: ColumnsStore.getVisible()
        });
      }
    }
  }]);

  return DataItem;
})(React.Component);

Object.assign(DataItem.prototype, cssMixins);
Object.assign(DataItem.prototype, textMixins);

module.exports = DataItem;
//# sourceMappingURL=data_item.js.map