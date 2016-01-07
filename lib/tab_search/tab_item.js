"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//Libraries
var React = require("react");
var _ = require("lodash");

// //Flux
// const DataStore    = require("../stores/data_store");
var ColumnsStore = require("../stores/columns_store");

//Components
var DataItem = require("../vanilla_components/data_item");

var Buttons = require("../vanilla_components/action_buttons");

var GenericItem = (function (_DataItem) {
  _inherits(GenericItem, _DataItem);

  function GenericItem(props) {
    _classCallCheck(this, GenericItem);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(GenericItem).call(this, props));

    _this.active = [{ active: false }];
    _this.mounted = false;
    // this.removed = ["row", "tr", "vPad5", {hide:false}];
    _this.state = { data: [], columns: [] };
    return _this;
  }

  _createClass(GenericItem, [{
    key: "renderAction",
    value: function renderAction() {
      return React.createElement(Buttons, { data: this.props.data, config: this.props.buttons });
    }
  }, {
    key: "renderAdditional",
    value: function renderAdditional() {
      var item = this.props.data;
      var list = ColumnsStore.getNonLabeled();
      if (item && item !== [] && list) {
        // let list = ColumnsStore.getLabeled();

        var td = _.map(list, (function (col) {
          if (col.key === "actions") {
            return React.createElement(
              "div",
              { className: this.checkCss(this.props.css, col.key), key: _.uniqueId() },
              this.renderAction()
            );
          } else {
            return React.createElement(
              "div",
              { className: this.checkCss(this.props.css, col.key), key: _.uniqueId() },
              this.displayData(item, col)
            );
          }
        }).bind(this));

        return td;
      }
      return "";
    }
  }, {
    key: "renderLi",
    value: function renderLi() {
      var item = this.props.data;
      var list = ColumnsStore.getLabeled();
      if (item && item !== [] && list) {
        // let list = ColumnsStore.getLabeled();

        var lis = _.map(list, (function (col) {
          if (col.key === "actions") {
            return React.createElement(
              "li",
              { className: this.checkCss(this.props.css, col.key), key: _.uniqueId() },
              this.renderAction()
            );
          } else {
            return React.createElement(
              "li",
              { className: this.checkCss(this.props.css, col.key), key: _.uniqueId() },
              React.createElement(
                "strong",
                null,
                col.title,
                ":"
              ),
              this.displayData(item, col)
            );
          }
        }).bind(this));

        return lis;
      }
      return "";
    }
  }, {
    key: "render",
    value: function render() {
      var h = ColumnsStore.getHeadline();
      var key = h ? h.key : h;
      // console.log("key", key)
      var headline = key && this.props.data.has(key) ? this.props.data.get(key) : "";

      return React.createElement(
        "article",
        { className: "job-item" },
        React.createElement(
          "h1",
          { className: "osw-r gamma up-c" },
          headline
        ),
        React.createElement(
          "ul",
          { className: "description" },
          this.renderLi()
        ),
        this.renderAdditional()
      );
    }
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      return this.props.data !== nextProps.data || this.state.columns !== nextState.columns;
    }
  }]);

  return GenericItem;
})(DataItem);

module.exports = GenericItem;
//# sourceMappingURL=tab_item.js.map