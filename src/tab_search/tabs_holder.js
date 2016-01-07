const React = require("react")
     , _    = require("lodash");

const cssMixins  = require("morse-react-mixins").css_mixins;

const TabActions  = require("../actions/tabs_actions");
const TabStore    = require("../stores/tabs_store");

const TabButton  = require("./tab_button");

// const Search       = require("../vanilla_components/search");
// const TabItems = require("./tab_items");

// var MorseBootstrap = require("morse-bootstrap-react");
// const FlashNotice  = MorseBootstrap.FlashNotice;

class TabsHolder extends React.Component {

  constructor(props) {
    super(props);
    this.state = {tabs:[]};
  }

  componentWillMount() {
    this.setState({tabs:TabStore.getTabs(this.props.tabId)});

    TabStore.addChangeListener("adding", this._onAdding.bind(this));
  }

  componentWillUnmount() {
   TabStore.removeChangeListener("adding", this._onAdding);
  }

  _renderTabs(){

    if(this.state.tabs){
      let tabs = _.map(this.state.tabs.items, (tab, i)=>{
        return (<li key={`tabList${i}`}>
            <TabButton tab={tab} tabsId={this.props.tabsId} />
          </li>);
      });

      return tabs;
    }

    return "";
  }

  render(){
    return (
      <ul className="tabs">
       {this._renderTabs()}
      </ul>
    );

  }

  _onAdding(){
    this.setState({tabs:TabStore.getTabs(this.props.tabId)});
  }
}

module.exports = TabsHolder;
