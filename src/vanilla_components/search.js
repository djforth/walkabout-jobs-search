//Libraries
const React = require("react");
// console.log('WTF', React);
const _     = require("lodash");


//Flux
// const DataStore      = require("../stores/data_store");
const DataActions    = require("../actions/data_actions");
const FilterActions  = require("../actions/filter_actions");
const ColumnsActions = require("../actions/columns_actions");

const ColumnsStore  = require("../stores/columns_store");
const DataStore     = require("../stores/data_store");
// const FilterStore   = require("../stores/filter_store");

// Morse Libraies
const ViewportDetect = require("viewport-detection-es6");


//Components
// const DataHead    =  require("./data_head");
const Filters     =  require("./filters");
// const PaginationHolder  = require("./pagination");
// const ProgressBar = require("react-bootstrap/lib/ProgressBar.js");

class Search extends React.Component{

  constructor(props) {
    super(props);
    this.active = [{active:false}];
    this.percent = 0;
    this.state = {data:[], keys:[], visible:[], device:"desktop"};
  }

  componentWillMount(){
    if(this.props.search){
      DataStore.setSearchVal(this.props.search);
    }
  }


  componentDidMount() {
    // console.log("Search mounting")
    const detect = new ViewportDetect();
    this.device = detect.getDevice();
    this.size  = detect.windowSize();
    let colsId = ColumnsActions.addingColumns(this.props.columns);
    ColumnsActions.changeDevice(this.device);
    this.setState({
      // device:device,
      loading:true,
      loading_txt:"Starting data load",
      percent: 0,
      colsId:colsId
    });
    detect.trackSize(function(device, size){
      if(this.device !== device){
        this.device =  device;
        ColumnsActions.changeDevice(device);

      }

      this.size   = size;

    }.bind(this));

    //Adds Keys
    let keys = ColumnsStore.getSearchable();
    FilterActions.setKeys(_.pluck(keys, "key"));

    this.setLoading();
    DataStore.addChangeListener("fetched", this._onLoaded.bind(this));



  }

  componentWillUnmount() {
    DataStore.removeChangeListener("fetched", this._onLoaded);
  }


  handleSelect(event, selectedEvent){
    this.setState({
      activePage: selectedEvent.eventKey
    });
  }

  loading(){
    if(this.state.loading){
      return (
        <div className="loader">
          <h5>{this.state.loading_txt}</h5>

        </div>
      );
    }
  }

  render() {
    // console.log('props', this.props.icon);
    return (
      <div>
        <Filters {...this.props} key={"filters"} />
        { this.props.children }
        {this.loading()}

      </div>
    );
  }

  setLoading(){

    let FakeLoading = window.setInterval(()=>{
      if(this.percent < 50){
        this.percent++;
      }

      this.setState({percent:this.percent, loading:true, loading_txt:`${this.percent}% loaded`});
    }, 1000);

    //Get Data
    DataActions.fetchData((p)=>{
      clearInterval(FakeLoading);
      if(p.percent >= 100){
        this.setState({loading:false, percent:p.percent});
      } else {
        this.percent = (this.percent > p.percent) ? this.percent : p.percent;
        this.setState({percent:this.percent, loading_txt:`${this.perecent}% loaded`});
      }
    }, this.props.dataApi);

  }

  _onLoaded(){
    // let items_count = DataStore.getAll();
    this.setState({loading:false, percent:100});
  }

}

module.exports = Search;
