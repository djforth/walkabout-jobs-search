"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//Libraries
var React = require("react");

//Morse Libraries
// const ViewportDetect = require("viewport-detection-es6");

//Components
var DataItems = require("../components/data_items");
var GenericItem = require("./generic_item");
var GenericExpander = require("./generic_expander");
// const DataItem        = require("../components/data_item");

var GenericItems = (function (_DataItems) {
  _inherits(GenericItems, _DataItems);

  function GenericItems(props) {
    _classCallCheck(this, GenericItems);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(GenericItems).call(this, props));
  }

  _createClass(GenericItems, [{
    key: "renderData",
    value: function renderData() {
      var _this2 = this;

      if (this.state.data && this.state.data.size > 0) {

        var items = this.state.data.map(function (k) {
          if (k) {
            if (_this2.props.expandable) {
              return React.createElement(GenericExpander, _extends({}, _this2.props, {
                data: k,
                key: k.get("id")
              }));
            } else {
              return React.createElement(GenericItem, _extends({}, _this2.props, {
                data: k,
                key: k.get("id")
              }));
            }
          }

          return "";
        });

        return items;
      }

      // console.log(this.state.loading)
      if (this.state.data.size <= 0) {
        return React.createElement(
          "div",
          { className: "loader", key: "loader" },
          React.createElement(
            "h5",
            null,
            "Nothing Matches your search"
          )
        );
      }
      return "";
    }
  }]);

  return GenericItems;
})(DataItems);

module.exports = GenericItems;
//# sourceMappingURL=generic_items.js.map