//Libraries
const React = require("react");
const _     = require("lodash");

//Flux
// const DataAction   = require("../actions/data_actions");
// const ColumnsStore = require("../stores/columns_store");

//Components
const DataExpander = require("../components/data_expander_item");

var Buttons     = require("../components/action_buttons");

class GenericExpander extends DataExpander {
  renderAction(){
    return (
      <Buttons data={this.props.data} config={this.props.buttons} delete_cb={this._deleteCallBack.bind(this)}  />
    );
  }

  _deleteCallBack(){
    this.removed  = this.toggleCss(this.removed);
    this.setState({removed:this.getClasses(this.removed)});
    // React.unmountComponentAtNode(this.getDOMNode().parentNode)
  }

  renderTd(){
    let item = this.props.data;
    if(item && this.state.columns){
       let td = _.map(this.state.columns, function(col){
        let key = col.key;
        if(key === "actions"){
          return (<div className={this.checkCss(this.props.css, key)}>{this.renderAction()}</div>);
        }

        return this.renderColumn(col, item);
      }.bind(this));

      return td;
    }
    return "";
  }

  render() {
    // console.log("props", this.props)
    return (
      <div className={`tr ${this.state.active}`}>
        <div className="clearfix">
          {this.renderTd()}
          {this.renderShowButton()}
        </div>
        {this.renderAdditional()}
      </div>

    );
  }

  // shouldComponentUpdate(nextProps, nextState){
  //   return this.props.data !== nextProps.data || this.state.columns !== nextState.columns || this.state.removed !== nextState.removed;
  // }
}

module.exports = GenericExpander;

