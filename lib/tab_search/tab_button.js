"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require("react"),
    _ = require("lodash");

var cssMixins = require("morse-react-mixins").css_mixins;

var TabActions = require("../actions/tabs_actions");
var TabStore = require("../stores/tabs_store");

// const Search       = require("../vanilla_components/search");
// const TabItems = require("./tab_items");

// var MorseBootstrap = require("morse-bootstrap-react");
// const FlashNotice  = MorseBootstrap.FlashNotice;

var TabButton = (function (_React$Component) {
  _inherits(TabButton, _React$Component);

  function TabButton(props) {
    _classCallCheck(this, TabButton);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TabButton).call(this, props));

    var opts = props.tab.options;
    _this.tabCSS = opts.css.split(" ");
    _this.tabCSS.push({ active: opts.active });
    _this.state = { css: _this.getClasses(_this.tabCSS) };
    return _this;
  }

  _createClass(TabButton, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      TabStore.addChangeListener("tab_change", this._tabChange.bind(this));
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      TabStore.removeChangeListener("tab_change", this._tabChange);
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "a",
        { href: "#", onClick: this._tabClick.bind(this), className: this.state.css },
        this.props.tab.title
      );
    }
  }, {
    key: "_tabChange",
    value: function _tabChange() {
      var active = TabStore.isActive(this.props.tabsId, this.props.tab.id);
      this.tabCSS = _.map(this.tabCSS, function (t) {
        if (_.isObject(t)) {
          t.active = active;
        }

        return t;
      });

      this.setState({ css: this.getClasses(this.tabCSS) });
    }
  }, {
    key: "_tabClick",
    value: function _tabClick(e) {
      e.preventDefault();

      TabActions.changeTab(this.props.tabsId, this.props.tab.id);
    }
  }]);

  return TabButton;
})(React.Component);

Object.assign(TabButton.prototype, cssMixins);

module.exports = TabButton;
//# sourceMappingURL=tab_button.js.map