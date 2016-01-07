//Libraries
const React = require("react");
const _     = require("lodash");

//Flux
const DataAction   = require("../actions/data_actions");

//Mixins
const textMixins = require("morse-react-mixins").text_mixins;
const cssMixins  = require("morse-react-mixins").css_mixins;

class ActionButtons extends React.Component {
  constructor(props) {
    super(props);
  }

  // deleteCallBack(flash){
  //   // console.log('id', this.props.data.get("id"));
  //   // DataAction.deleteItem(this.props.data.get("id"), {type:"notice"});
  //   DataAction.deleteItem(this.props.data.get("id"), flash);
  //   if(_.isFunction(this.props.delete_cb)){
  //     this.props.delete_cb(this.props.data.get("id"), flash);
  //   }
  // }


  componentWillMount(){

    let config = _.map(this.props.config, (conf)=>{
      if(!this.props.data.get("buttons").has(conf.key)){
        return "";
      }

      conf.restful         = conf.restful || "get";
      if(conf.title){
        conf.title_str  = this.setTitle(conf.title);
      }

      if(conf.delete_msg){
        conf.delete_msg_str = this.setTitle(conf.delete_msg);
      }
      conf.path       = this.getPath(conf.key);
      return conf;
    });

    this.setState({config:config});
  }

  getPath(key){
    let btn = this.props.data.get("buttons");
    return btn.get(key);
  }

  renderButtons(){
    if(this.props.data && this.state.config){
      let btns = _.map(this.state.config, (config)=>{
        if(config.path === "" || _.isNull(config.path)){
          return "";
        }
        return (<li key={_.uniqueId()}>
          <a href={config.path} title={config.title_str} className={config.options.button_css}>{config.text}</a>
        </li>);
      });

      return btns;
    }

    return "";
  }

  render(){
    return (
      <ul className="actions">
        {this.renderButtons()}
      </ul>
    );
  }
  // Best performance - http://jsperf.com/test-approach
  setTitle(obj){
    let keys = _.remove(_.keys(obj), (k)=>{
      return k !== "text";
    });

    let title = obj.text;
    _.forEach(keys, (k)=>{
      let txt = this.props.data.get(obj[k]);
      title = title.replace(`:${k}`, txt);
    });

    return title;
  }
}

Object.assign(ActionButtons.prototype, cssMixins);
Object.assign(ActionButtons.prototype, textMixins);

module.exports = ActionButtons;
