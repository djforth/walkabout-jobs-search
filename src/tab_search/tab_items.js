//Libraries
const React = require("react")
     , _    = require("lodash");

//Morse Libraries
// const ViewportDetect = require("viewport-detection-es6");

//Flux
const TabsStore = require("../stores/tabs_store")
    , DataStore = require("../stores/data_store");


//Components
const DataItems   = require("../vanilla_components/data_items");
const TabItem     = require("./tab_item");
// const GenericExpander = require("./generic_expander");
// const DataItem        = require("../components/data_item");

class TabItems extends DataItems {

  constructor(props) {
    super(props);
    this.state = {data:null}
  }

  componentDidMount() {
    super.componentDidMount();

    TabsStore.addChangeListener("tab_change", this._onTabChange.bind(this));
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    TabsStore.removeChangeListener("tab_change", this._onTabChange);
  }

  renderNoItems(){
    return (
        <div className="loader" key="loader">
          <h5>{this.props.noresults}</h5>
        </div>
      );
  }

  renderItem(item){
    return (<TabItem {...this.props}
            data    = {item}
            key     = {item.get("id")}
          />);
  }

  renderData(){
    let data = this.state.data
    if(_.isNull(data) || !data) return "";

    if(data.size <= 0) return this.renderNoItems();

    let items = []
    this.state.data.forEach((k)=>{
       items.push(this.renderItem(k));
    });

    return items
  }

  _onTabChange(){
    DataStore.setSearchVal("");
    this.setState({data:DataStore.getSearchData()});
  }
}

module.exports = TabItems;
