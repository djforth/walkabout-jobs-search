const React = require("react")
     , _    = require("lodash");

const cssMixins  = require("morse-react-mixins").css_mixins;

const TabActions  = require("../actions/tabs_actions");
const TabStore    = require("../stores/tabs_store");

// const Search       = require("../vanilla_components/search");
// const TabItems = require("./tab_items");

// var MorseBootstrap = require("morse-bootstrap-react");
// const FlashNotice  = MorseBootstrap.FlashNotice;

class TabButton extends React.Component {

  constructor(props) {
    super(props);
    let opts = props.tab.options;
    this.tabCSS = opts.css.split(" ");
    this.tabCSS.push({active:opts.active});
    this.state = {css:this.getClasses(this.tabCSS)};
  }

  componentWillMount() {
    TabStore.addChangeListener("tab_change", this._tabChange.bind(this));
  }

  componentWillUnmount() {
   TabStore.removeChangeListener("tab_change", this._tabChange);
  }

  render(){
    return (
      <a href="#" onClick={this._tabClick.bind(this)} className={this.state.css} >
        {this.props.tab.title}
      </a>
    );
  }

  _tabChange(){
    let active = TabStore.isActive(this.props.tabsId, this.props.tab.id);
    this.tabCSS = _.map(this.tabCSS, (t)=>{
      if(_.isObject(t)){
        t.active = active;
      }

      return t;
    });

    this.setState({css:this.getClasses(this.tabCSS)});
  }

  _tabClick(e){
    e.preventDefault();

    TabActions.changeTab(this.props.tabsId, this.props.tab.id);
  }

}

Object.assign(TabButton.prototype, cssMixins);

module.exports = TabButton;
