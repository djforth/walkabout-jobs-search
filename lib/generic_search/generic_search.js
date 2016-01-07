"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//Libraries
var React = require("react");

var DataStore = require("../stores/data_store");

var Search = require("../components/search");
var GenericItems = require("./generic_items");

var MorseBootstrap = require("morse-bootstrap-react");
var FlashNotice = MorseBootstrap.FlashNotice;

var GenericSearch = (function (_React$Component) {
  _inherits(GenericSearch, _React$Component);

  function GenericSearch(props) {
    _classCallCheck(this, GenericSearch);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(GenericSearch).call(this, props));

    _this.state = { flash: null };
    return _this;
  }

  _createClass(GenericSearch, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      DataStore.addChangeListener("delete", this._onDelete.bind(this));
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      DataStore.removeChangeListener("delete", this._onDelete);
    }
  }, {
    key: "renderFlash",
    value: function renderFlash() {
      if (this.state.flash) {
        return React.createElement(
          FlashNotice,
          { type: this.state.flash.type },
          this.state.flash.msg
        );
      }
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { className: "serach" },
        this.renderFlash(),
        React.createElement(
          Search,
          this.props,
          React.createElement(GenericItems, _extends({}, this.props, { key: "GenericItems" }))
        )
      );
    }
  }, {
    key: "_onDelete",
    value: function _onDelete() {
      this.setState({ flash: DataStore.getFlash() });
    }
  }]);

  return GenericSearch;
})(React.Component);

module.exports = GenericSearch;
//# sourceMappingURL=generic_search.js.map