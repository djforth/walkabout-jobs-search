//Libraries
const React = require("react");
const _     = require("lodash");

//Flux
const TabsStore      = require("../stores/tabs_store");
const FilterStore   = require("../stores/filter_store");
const FilterActions = require("../actions/filter_actions");
const DataActions   = require("../actions/data_actions");

//Components
const SearchFilter  = require("./searchfilter");
const FiltersSelect = require("./filters_select");

//Mixins
const cssMixins  = require("morse-react-mixins").css_mixins;

class Filters extends React.Component {
  constructor(props) {
    super(props);
    this.state = {search:true};
  }

  componentDidMount() {
//
    //Data Changers
    FilterStore.addChangeListener("change", this._onUpdate.bind(this));
    FilterStore.addChangeListener("fetched", this._onUpdate.bind(this));

    TabsStore.addChangeListener("tab_change", this._onChange.bind(this));

    //Get Data
    FilterActions.fetchFilters(this.props.filterApi);
    FilterActions.setTab(TabsStore.getFilters());
  }

  componentWillUnmount() {
    FilterStore.removeChangeListener("change", this._onUpdate);
    FilterStore.removeChangeListener("fetched", this._onUpdate);

    TabsStore.removeChangeListener("tab_change", this._onChange);
  }

  _filtered(){
    DataActions.filterChange();
  }

  _renderSearch(){
    // console.log(this.props.icon)
    if(this.state.search){
      return (
        <SearchFilter key="SearchFilter" icon={this.props.icon} />
      );
    }

    return "";
  }


  _renderFilters(){
    if(this.state.filters){
      let items = _.map(this.state.filters, (f)=>{
        return <FiltersSelect filter={f} key={_.uniqueId("select")} callback={this._filtered.bind()} />;
      });

      return items;
    }

  }


  render() {

    return (
      <div className="search-filter">
        {this._renderSearch()}
        {this._renderFilters()}
      </div>
    );
  }

  _onUpdate() {
    // FilterActions.setTab(TabsStore.getFilters());
    this.setState({filters:FilterStore.getVisible()});
  }

  _onChange() {
    // console.log('tabs change', TabsStore.getFilters());
    FilterActions.setTab(TabsStore.getFilters());
    this.setState({search:TabsStore.getSearch(), filters:FilterStore.getVisible()});
  }
}

Object.assign(Filters.prototype, cssMixins);

module.exports = Filters;
