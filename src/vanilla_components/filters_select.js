//Libraries
const React = require("react");
const _     = require("lodash");

// const FilterStore      = require("../../stores/filterStore");
const FilterActions    = require("../actions/filter_actions");



class FiltersSelect extends React.Component {

  constructor(props) {
    super(props);
    this.state = {selected:"all"};
  }

  _onChange(e){
    let val = e.target.value;
    let filterBy = this.props.filter.getDetails("filterBy");

    this.setState({selected:Number(e.target.value)});
    FilterActions.selectFilter(filterBy, val);
    if(_.isFunction(this.props.callback)){
      this.props.callback();
    }
  }

  renderOptions(){
    if(this.props.filter) {
      let opts  = this.props.filter.getAll();

      let items = opts.map(function(f){
        return (<option
            key={_.uniqueId()}
            value={f.get("id")}
            >
              {f.get("title")}
            </option>
          );

      }.bind(this));

      return items;
    }

  }

  render() {
    let title = this.props.filter.getDetails("title");
    return (
      <div className="form-group">
        <label>{title}</label>
        <select onChange={this._onChange.bind(this)} className="form-control" value={this.state.selected}>
          <option value="all">All</option>
          {this.renderOptions()}
        </select>
      </div>
    );
  }
}

module.exports = FiltersSelect;
