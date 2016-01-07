//Libraries
const React   = require("react");
const _ = require("lodash");

const DataActions    = require("../actions/data_actions");
const DataStore   = require("../stores/data_store");
const FilterStore    = require("../stores/filter_store");
const ColumnsStore   = require("../stores/columns_store");

//Mixins
const cssMixins  = require("morse-react-mixins").css_mixins;
const textMixins = require("morse-react-mixins").text_mixins;

class SearchFilters extends React.Component{

  constructor(props) {
    super(props);
    this.dropdown =  ["input-group-btn", {"open":false}];



    this.state = {
      dropdown:this.getClasses(this.dropdown),
      expanded:"false",
      selectedkey:"all",
      searchVal:""
    };
  }

  componentDidMount() {

    this.quickSearch = (_.isBoolean(this.props.quickSearch)) ? this.props.quickSearch : true;

    if(FilterStore.isSelectedKey(this.props.item)){
      this.active = [{active:true}];
      this.setState({active:this.getClasses(this.active)});
    }

    this.setState({searchVal:DataStore.getSearchVal()});
    // FilterStore.addChangeListener("change_key", this._openDropdown.bind(this));
    ColumnsStore.addChangeListener("adding", this._onAdd.bind(this));
  }

  componentWillUnmount() {
    // FilterStore.removeChangeListener("change_key", this._openDropdown);
    ColumnsStore.removeChangeListener("adding", this._onAdd);
  }

  _onAdd(){
    this.setState({
      keys:ColumnsStore.getSearchable()
    });
  }

  _onChange(e){

    if(this.quickSearch){
      if(this.loop){
        window.clearTimeout(this.loop);
      }

      this.loop = window.setTimeout((val)=>{
        if(val.length > 2 || val === ""){
          DataActions.searching(val);
        }
      }, 200, e.target.value);

      this.setState({searchVal:e.target.value});
    }

    // _.defer((val)=>{
    //   DataActions.searching(val);
    // }, e.target.value);
  }

  // _openDropdown(){
  //   this.dropdown = this.toggleCss(this.dropdown);
  //   let expanded  = (this.state.expended === "true") ? "false" : "true";
  //   this.setState({
  //     dropdown:this.getClasses(this.dropdown),
  //     expanded:expanded,
  //     selectedkey:FilterStore.getSelectedKey()
  //   });
  // }

  _preventSubmit(e){
    // console.log("submiting", e);
    e.preventDefault();

  }

  // renderKeys(){
  //   if(this.state.keys){
  //     let items = this.state.keys.map(function(k){
  //       return (<Keys item={k} key={_.uniqueId("key")} />);
  //       });

  //       return items;
  //   }
  // }

  render() {
    return (
      <form onSubmit={this._preventSubmit.bind(this)} className="search-filter">
        <input alt="Search" type="image" src={this.props.icon} />
        <div className="fields-container">
          <input type="text" name="querystr" id="querystr" placeholder="Search" value={this.state.searchVal} onChange={this._onChange.bind(this)} />
        </div>

      </form>
    );
  }
}

Object.assign(SearchFilters.prototype, cssMixins);
Object.assign(SearchFilters.prototype, textMixins);

module.exports = SearchFilters;
