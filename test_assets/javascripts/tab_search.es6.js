require("babel-polyfill");
const React    = require("react");
const ReactDOM = require("react-dom");
const Search  = require("../../index");
const Tab = require("../../lib/tab_search/tab_search")
//Search.Tab.Search;

// {
//   "css":{"default":""},
//   "dataApi":"/jobs/feed.json",
//   "filterApi":"/jobs/filters.json",
//   "icon":"/assets/search_icon-35d05c315773a0f60957f2774c2cb050.jpg",
//   "intro":"Search for a job with us today and start on a journey of a lifetime!",
//   "search":null,
//   "noresults":"We currently don’t have any available vacancies but please check back soon.",

//   "buttons":[
//     {"key":"show","title":{"text":"View :replace","replace":"title"},"text":"See details \u0026 apply","options":{"button_css":"button pop-l delta"}}],

//     "tabs":[{"title":"Search our Jobs","filterBy":{"type":"all","filter":null},"filters":[],"search":true,"options":{"css":"osw-r up-c gamma tab-btn","active":true}},
//     {"title":"Head Office opportunities","filterBy":{"type":"head_office_role","filter":null},"filters":["job_template"],"search":false,"options":{"css":"osw-r up-c gamma tab-btn","active":false}},
//     {"title":"Venue opportunities","filterBy":{"type":"venue","filter":null},"filters":["venue"],"search":false,"options":{"css":"osw-r up-c gamma tab-btn","active":false}}],

//   "columns":[{"key":"id","searchable":false,"show":false,"headline":false,"label":true},{"key":"json_title","title":"Title","searchable":true,"show":true,"headline":true,"label":true,"desktop":true,"mobile":true,"tablet":true},{"key":"visible_from_date","title":"Posted","type":"date","fmt":"%b %d, %Y","searchable":true,"show":true,"headline":false,"label":true,"desktop":true,"mobile":true,"tablet":true},{"key":"visible_until_date","title":"Closing","type":"date","fmt":"%b %d, %Y","searchable":true,"show":true,"headline":false,"label":true,"desktop":true,"mobile":true,"tablet":true},{"key":"with_accommodation","title":"Live in","searchable":true,"show":true,"headline":false,"label":true,"desktop":true,"mobile":true,"tablet":true},{"key":"shift","searchable":true,"show":true,"headline":false,"label":true,"desktop":true,"mobile":true,"tablet":true},{"key":"start_date","title":"Start Date","type":"date","fmt":"%b %d, %Y","searchable":true,"show":true,"headline":false,"label":true,"desktop":true,"mobile":true,"tablet":true},{"key":"summary","title":true,"type":"date","searchable":true,"show":true,"headline":false,"label":false,"desktop":true,"mobile":true,"tablet":true},{"key":"actions","searchable":true,"show":true,"headline":false,"label":false,"desktop":true,"mobile":true,"tablet":true}]}

let columns = [{"key":"id","searchable":false,"show":false,"headline":false,"label":true},{"key":"json_title","title":"Title","searchable":true,"show":true,"headline":true,"label":true,"desktop":true,"mobile":true,"tablet":true},{"key":"visible_from_date","title":"Posted","type":"date","fmt":"%b %d, %Y","searchable":true,"show":true,"headline":false,"label":true,"desktop":true,"mobile":true,"tablet":true},{"key":"visible_until_date","title":"Closing","type":"date","fmt":"%b %d, %Y","searchable":true,"show":true,"headline":false,"label":true,"desktop":true,"mobile":true,"tablet":true},{"key":"with_accommodation","title":"Live in","searchable":true,"show":true,"headline":false,"label":true,"desktop":true,"mobile":true,"tablet":true},{"key":"shift","searchable":true,"show":true,"headline":false,"label":true,"desktop":true,"mobile":true,"tablet":true},{"key":"start_date","title":"Start Date","type":"date","fmt":"%b %d, %Y","searchable":true,"show":true,"headline":false,"label":true,"desktop":true,"mobile":true,"tablet":true},{"key":"summary","title":true,"type":"date","searchable":true,"show":true,"headline":false,"label":false,"desktop":true,"mobile":true,"tablet":true},{"key":"actions","searchable":true,"show":true,"headline":false,"label":false,"desktop":true,"mobile":true,"tablet":true}]

// [
//   {key:"id"},
//   {key:"json_title", title:"Title"},
//   {key:"visible_from_date", title:"Posted", type:"date", fmt:"%b %d, %Y",},
//   {key:"visible_until_date", title:"Closing", type:"date", fmt:"%b %d, %Y"},
//   {key:"with_accommodation", title:"Live in"},
//   {key:"shift"},
//   {key:"job_start_date", title:"Start Date", type:"date", fmt:"%b %d, %Y"},
//   {key:"summary", type:"date", fmt:"%b %d, %Y"},
//   {key:"actions"}
// ];

columns = columns.map((c)=>{
  if(c.key !== "id"){
    c.desktop = true;
    c.mobile  = true;
    c.tablet  = true;
    c.searchable = true;
    c.show    = true;
  }

  switch(c.key){
    case "id":
      c.show = false
    break;
    case "json_title":
      c.headline = true;
    break;
    case "summary":
    case "actions":
      c.label = false;
    break;
    default:
      c.label = true;
  }

  return c;
});


let tabs = [{"title":"Search our Jobs","filterBy":{"type":"all","filter":null},"filters":[],"search":true,"options":{"css":"osw-r up-c gamma tab-btn","active":true}},{"title":"Head Office opportunities","filterBy":{"type":"head_office_role","filter":null},"filters":["job_template"],"search":false,"options":{"css":"osw-r up-c gamma tab-btn","active":false}},{"title":"Venue opportunities","filterBy":{"type":"venue","filter":null},"filters":["venue"],"search":false,"options":{"css":"osw-r up-c gamma tab-btn","active":false}}]


// [
//   {title:"Search our Jobs", filterBy:{type:"all", filter:null}, filters:[], search:true, options:{css:"osw-r up-c gamma tab-btn", active:true}},
//   {title:"Head Office opportunities", filterBy:{type:"head_office_role", filter:null}, filters:["job_template"], search:false, options:{css:"osw-r up-c gamma tab-btn", active:false}},
//   {title:"Venue opportunities", filterBy:{type:"venue", filter:null}, filters:["venue"], search:false, options:{css:"osw-r up-c gamma tab-btn", active:false}},
// ]


// console.log('foo', "bar");
    //   col[:show] = case col[:key]
    //     when "id" then false
    //     when "requester_name" then false
    //     when "expected_returned" then false
    //     else true
    //   end

    //   col
    // end

let css = {default: ""};

let buttons = [
  {"key":"show","title":{"text":"View :replace","replace":"title"},"text":"See details \u0026 apply","options":{"button_css":"button pop-l delta"}}
]

let date_ranges = [
  {key:"required_by", type:"date"}
]

let intro = "Search for a job with us today and start on a journey of a lifetime!"



ReactDOM.render(
  <Tab
    buttons     = {buttons}
    columns     = {columns}
    css         = {css}
    dataApi     = "/api/vanilla/feed_test.json"
    expandable  = {true}
    filterApi   = "/api/vanilla/filters_test.json"
    intro       = {intro}
    icon        = "/assets/images/search.png"
    search      = ""
    tabs        = {tabs}
    noresults   = "We currently don’t have any available vacancies but please check back soon."
  />,
  document.getElementById('search')
);

