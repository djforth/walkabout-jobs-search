//Libraries
const React = require("react")
     , _    = require("lodash");

const DataStore   = require("../stores/data_store");
const TabActions  = require("../actions/tabs_actions");

const Search     = require("../vanilla_components/search");
const TabItems   = require("./tab_items");
const TabButton  = require("./tab_button");
const TabsHolder = require("./tabs_holder");

// var MorseBootstrap = require("morse-bootstrap-react");
// const FlashNotice  = MorseBootstrap.FlashNotice;

class TabSearch extends React.Component {

  constructor(props) {
    super(props);
    this.state = {tabsId:null};
  }

  componentWillMount(){
    if(this.props.tabs){
      let id = _.uniqueId("tabs");
      TabActions.addingTabs(this.props.tabs, id);
      // console.log(id);
      this.setState({tabsId:id});
    }
  }

  _renderIntro(){
    if(this.props.intro){
      return (
        <p className="intro" key="intro">{this.props.intro}</p>
      );
    }

    return "";
  }

  render() {
    // console.log("tabs", this.props.icon)
    return (
      <div className="search">
        <TabsHolder tabsId={this.state.tabsId} />
        <div className="search-body">
          {this._renderIntro()}
          <Search {...this.props} >
            <h2 className="osw-r up-c gamma sub">Or browse all Jobs...</h2>
            <TabItems {...this.props} key = "GenericItems" />
          </Search>
        </div>
      </div>
    );
  }

}

module.exports = TabSearch;

