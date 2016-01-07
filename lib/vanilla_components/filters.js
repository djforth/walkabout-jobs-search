"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//Libraries
var React = require("react");
var _ = require("lodash");

//Flux
var TabsStore = require("../stores/tabs_store");
var FilterStore = require("../stores/filter_store");
var FilterActions = require("../actions/filter_actions");
var DataActions = require("../actions/data_actions");

//Components
var SearchFilter = require("./searchfilter");
var FiltersSelect = require("./filters_select");

//Mixins
var cssMixins = require("morse-react-mixins").css_mixins;

var Filters = (function (_React$Component) {
  _inherits(Filters, _React$Component);

  function Filters(props) {
    _classCallCheck(this, Filters);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Filters).call(this, props));

    _this.state = { search: true };
    return _this;
  }

  _createClass(Filters, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      //
      //Data Changers
      FilterStore.addChangeListener("change", this._onUpdate.bind(this));
      FilterStore.addChangeListener("fetched", this._onUpdate.bind(this));

      TabsStore.addChangeListener("tab_change", this._onChange.bind(this));

      //Get Data
      FilterActions.fetchFilters(this.props.filterApi);
      FilterActions.setTab(TabsStore.getFilters());
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      FilterStore.removeChangeListener("change", this._onUpdate);
      FilterStore.removeChangeListener("fetched", this._onUpdate);

      TabsStore.removeChangeListener("tab_change", this._onChange);
    }
  }, {
    key: "_filtered",
    value: function _filtered() {
      DataActions.filterChange();
    }
  }, {
    key: "_renderSearch",
    value: function _renderSearch() {
      // console.log(this.props.icon)
      if (this.state.search) {
        return React.createElement(SearchFilter, { key: "SearchFilter", icon: this.props.icon });
      }

      return "";
    }
  }, {
    key: "_renderFilters",
    value: function _renderFilters() {
      var _this2 = this;

      if (this.state.filters) {
        var items = _.map(this.state.filters, function (f) {
          return React.createElement(FiltersSelect, { filter: f, key: _.uniqueId("select"), callback: _this2._filtered.bind() });
        });

        return items;
      }
    }
  }, {
    key: "render",
    value: function render() {

      return React.createElement(
        "div",
        { className: "search-filter" },
        this._renderSearch(),
        this._renderFilters()
      );
    }
  }, {
    key: "_onUpdate",
    value: function _onUpdate() {
      // FilterActions.setTab(TabsStore.getFilters());
      this.setState({ filters: FilterStore.getVisible() });
    }
  }, {
    key: "_onChange",
    value: function _onChange() {
      // console.log('tabs change', TabsStore.getFilters());
      FilterActions.setTab(TabsStore.getFilters());
      this.setState({ search: TabsStore.getSearch(), filters: FilterStore.getVisible() });
    }
  }]);

  return Filters;
})(React.Component);

Object.assign(Filters.prototype, cssMixins);

module.exports = Filters;
//# sourceMappingURL=filters.js.map