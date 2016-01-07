//Libraries
const React = require("react");
const _     = require("lodash");

// //Flux
// const DataStore    = require("../stores/data_store");
const ColumnsStore = require("../stores/columns_store");

//Components
const DataItem   = require("../vanilla_components/data_item");

var Buttons     = require("../vanilla_components/action_buttons");

class GenericItem extends DataItem {

  constructor(props) {
    super(props);
    this.active  = [{active:false}];
    this.mounted = false;
    // this.removed = ["row", "tr", "vPad5", {hide:false}];
    this.state = {data:[], columns:[]};
  }

  renderAction(){
    return (
      <Buttons data={this.props.data} config={this.props.buttons} />
    );
  }

  renderAdditional(){
    let item = this.props.data;
    let list = ColumnsStore.getNonLabeled();
    if(item && item !== [] && list){
       // let list = ColumnsStore.getLabeled();

       let td = _.map(list, function(col){
         if(col.key === "actions"){
          return (<div className={this.checkCss(this.props.css, col.key)} key={_.uniqueId()}>{this.renderAction()}</div>);
         } else {
          return (
            <div className={this.checkCss(this.props.css, col.key)} key={_.uniqueId()}>
              {this.displayData(item, col)}
            </div>
          );
        }
      }.bind(this));

      return td;
    }
    return "";
  }

  renderLi(){
    let item = this.props.data;
    let list = ColumnsStore.getLabeled();
    if(item && item !== [] && list){
       // let list = ColumnsStore.getLabeled();

       let lis = _.map(list, function(col){
         if(col.key === "actions"){
          return (<li className={this.checkCss(this.props.css, col.key)} key={_.uniqueId()}>{this.renderAction()}</li>);
         } else {
          return (
            <li className={this.checkCss(this.props.css, col.key)} key={_.uniqueId()}>
              <strong>{col.title}:</strong>
              {this.displayData(item, col)}
            </li>
          );
        }
      }.bind(this));

      return lis;
    }
    return "";
  }

  render() {
    let h   = ColumnsStore.getHeadline();
    let key = (h) ? h.key : h
    // console.log("key", key)
    let headline = (key && this.props.data.has(key)) ? this.props.data.get(key) : "";

    return (
      <article className="job-item">
        <h1 className="osw-r gamma up-c">{headline}</h1>
        <ul className="description">
          {this.renderLi()}
        </ul>
        {this.renderAdditional()}
      </article>

    );
  }

  shouldComponentUpdate(nextProps, nextState){
    return this.props.data !== nextProps.data || this.state.columns !== nextState.columns;
  }
}

module.exports = GenericItem;
