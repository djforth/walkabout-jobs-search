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
// const ColumnsStore = require("../stores/columns_store");

//Components
var DataItem = require("../components/data_item");

var Buttons = require("../components/action_buttons");

var GenericItem = (function (_DataItem) {
  _inherits(GenericItem, _DataItem);

  function GenericItem(props) {
    _classCallCheck(this, GenericItem);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(GenericItem).call(this, props));

    _this.active = [{ active: false }];
    _this.mounted = false;
    _this.removed = ["row", "tr", "vPad5", { hide: false }];
    _this.state = { data: [], columns: [], removed: _this.getClasses(_this.removed) };
    return _this;
  }

  _createClass(GenericItem, [{
    key: "_deleteCallBack",
    value: function _deleteCallBack() {
      this.removed = this.toggleCss(this.removed);
      this.setState({ removed: this.getClasses(this.removed) });
      // React.unmountComponentAtNode(this.getDOMNode().parentNode)
    }
  }, {
    key: "renderAction",
    value: function renderAction() {
      return React.createElement(Buttons, { data: this.props.data, config: this.props.buttons, delete_cb: this._deleteCallBack.bind(this) });
    }
  }, {
    key: "renderTd",
    value: function renderTd() {

      var item = this.props.data;
      if (item && item !== [] && this.state.columns) {
        // if(item.toJS){
        //   console.log("item", item.toJS());
        // }

        var td = _.map(this.state.columns, (function (col) {
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
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { className: this.state.removed },
        this.renderTd()
      );
    }

    // setDeleteApi(){
    //   if(_.isString(this.props.delete)){
    //     return this.props.delete.replace(":id", this.props.data.get("id"));
    //   }

    //   return "";
    // }

    // setEditPath(){
    //   if(_.isString(this.props.delete)){
    //     return this.props.edit.replace(":id", this.props.data.get("id"));
    //   }

    //   return "";
    // }

  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      return this.props.data !== nextProps.data || this.state.columns !== nextState.columns || this.state.removed !== nextState.removed;
    }
  }]);

  return GenericItem;
})(DataItem);

module.exports = GenericItem;
//# sourceMappingURL=generic_item.js.map