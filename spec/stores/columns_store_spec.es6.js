
const ColumnsStore = require('../../src/stores/columns_store');

const storeHelper    = require("react-jasmine").storeHelpers;
const defaultsHelper = require("react-jasmine").checkDefaults;

const _         = require('lodash');
const Immutable = require('immutable');


describe('ColumnsStore', function() {
  let mockdata, final, tablet
  beforeEach(()=>{
    mockdata = [
      {key:"id"},
      {key:"assigned_to_name", title:"Assigned to", searchable:true, show:true},
      {key:"region_title", title:"Region", searchable:true, sortable:true},
      {key:"requester_name", title:"Requested By", desktop:true, mobile:true, tablet:true, searchable:true, show:true},
      {key:"request_made", title:"Request made on", type:"date", fmt:"%d/%m/%Y", searchable:true},
      {key:"required_by", title:"Required by", type:"dateTime", fmt:"%d/%m/%Y %H:%M", desktop:true, mobile:true, tablet:true, searchable:true},
      {key:"expected_returned", title:"expected_returned", type:"dateTime", fmt:"%d/%m/%Y %H:%M", searchable:true},
      {key:"status", desktop:true, tablet:true},
      {key:"company_name", title:"Company", desktop:true},
      {key:"actions", desktop:true, mobile:true, tablet:true}
    ];

    final = _.map(_.cloneDeep(mockdata), (col)=>{
      if(!_.has(col, "title")){
        _.set(col, "title", col.key.replace(/^./, (match)=> match.toUpperCase()))
      }

      return col
    });

    tablet = _.where(final, {tablet:true});
  })

  let options = [
    {
      func:"addColumns",
      action:{
        type:"ADDING_COLUMNS",
        columns:"foo",
        id:1
      },
      args:["foo", 1],
      change:"adding"
    },
    {
      func:"changeDevice",
      action:{
        type:"CHANGE_DEVICE",
        device:"desktop"
      },
      args:"desktop",
      change:"change"
    }
  ];

  storeHelper.checkDispatcher(ColumnsStore, "registeredCallback", options)

  storeHelper.checkChangeEvents(()=>{
    return ColumnsStore.__get__("store");
  });

  describe('store functions', function() {
    let store, columns

    beforeEach(()=>{
      store  = ColumnsStore.__get__("store");
    });

    describe('setting functions', function() {

      it("should add columns to store", function() {
        spyOn(store, "setVisibleColumns").and.returnValue(tablet);
        spyOn(store, "setTitles").and.returnValue(final);
        let id = store.addColumns(mockdata, 1);

        expect(id).toEqual(1)
        let column = store.columns[0]
        expect(column.cols).toEqual(final);
        expect(column.id).toEqual(1);
        expect(column.visible).toEqual(tablet);
        expect(store.setTitles).toHaveBeenCalledWith(mockdata);
        expect(store.setVisibleColumns).toHaveBeenCalledWith(final);
      });

      it("should set device", function() {
        store.columns = [
          {
            id:1,
            cols:["foo", "bar"],
            visible: ["bar"]
          }
        ]
        spyOn(store, "setVisibleColumns").and.returnValue(["foo"]);
        store.changeDevice("mobile");
        expect(store.device).toEqual("mobile");
        expect(store.columns[0].visible).toEqual(["foo"]);
        expect(store.setVisibleColumns).toHaveBeenCalledWith(["foo", "bar"]);
      });

      it("should set visible columns", function() {
        store.device = "tablet";
        let visible = store.setVisibleColumns(final);
        expect(visible).toEqual(tablet)
      });

      it("should set titles", function() {
        let result = store.setTitles(mockdata);
        expect(result).toEqual(final)
      });

      it("should take and object and return only relevant keys", function() {
        let data = {key:"required_by", title:"Required by", type:"dateTime", fmt:"%d/%m/%Y %H:%M", desktop:true, mobile:true, tablet:true, searchable:true};

        let obj = store.reduceObj(data, ["key", "title"])
        expect(obj).toEqual({key:"required_by", title:"Required by"})
      });
    });

    describe('get columns', function() {
      beforeEach(function() {
        store.columns = [
          {
            id:1,
            cols:["foo", "bar"],
            visible: ["bar"]
          },
          {
            id:31,
            cols:["foo", "bar", "phil"],
            visible: ["foo"]
          }
        ]
      });

      it("should return first column if no ID is passed", function() {
        let column = store.getColumn();
        expect(column).toEqual(store.columns[0])
      });

      it("should return correct column if  ID is passed", function() {
        let column = store.getColumn(31);
        expect(column).toEqual(store.columns[1])
      });
    });


    describe("get functions", function() {
      beforeEach(function() {
        store.columns = [
          {
            id:1,
            cols:final,
            visible:tablet
          }
        ]
        spyOn(store, "getColumn").and.returnValue({
          id:1,
          cols:final,
          visible:tablet
        });
        // store.columns         = final;
        // store.visible_columns = tablet;
      });

      it("should get visible keys for correct device", function() {
        let keys = store.getKeys(1);
        expect(store.getColumn).toHaveBeenCalledWith(1);
        expect(keys).toEqual(["requester_name", "required_by", "status", "actions"]);
      });

      it("should get visible titles for correct device", function() {
        let titles = store.getTitles(1);
        expect(store.getColumn).toHaveBeenCalledWith(1);
        expect(titles).toEqual(["Requested By", "Required by", "Status", "Actions"]);
      });

      it("should return title for a specific key", function() {
        let title = store.getTitleForKey("requester_name", 1);
        expect(store.getColumn).toHaveBeenCalledWith(1);
        expect(title).toEqual("Requested By")
      });


      it("should get date columns", function() {
        let dates = store.getDateColumns(1);
        expect(store.getColumn).toHaveBeenCalledWith(1);
        expect(dates.length).toEqual(3)
        expect(dates).toContain({key:"request_made", title:"Request made on", type:"date", fmt:"%d/%m/%Y"});
        expect(dates).toContain({key:"required_by", title:"Required by", type:"dateTime", fmt:"%d/%m/%Y %H:%M"});
        expect(dates).toContain({key:"expected_returned", title:"expected_returned", type:"dateTime", fmt:"%d/%m/%Y %H:%M"});
      });

      it("should return searchable keys", function() {
        let searchable = store.getSearchable(1);
        expect(store.getColumn).toHaveBeenCalledWith(1);
        expect(searchable.length).toEqual(6);
        let titles = _.pluck(searchable, "title");
        expect(titles).toEqual(["Assigned to", "Region", "Requested By", "Request made on", "Required by", "expected_returned"]);
        let keys = _.keys(searchable[0]);
        expect(keys).toEqual(["key", "title"]);
      });

      it("should return showable columns", function() {
        let showable = store.getShowable();
        expect(showable.length).toEqual(1);
        let titles = _.pluck(showable, "title");
        expect(titles).toEqual(["Assigned to"]);
        let keys = _.keys(showable[0]);
        expect(keys).toEqual(["key", "title"]);
      });

       it("should return searchable keys", function() {
        let sortable = store.getSortable(1);
        expect(store.getColumn).toHaveBeenCalledWith(1);
        expect(sortable.length).toEqual(1);
        expect(sortable).toEqual([{key:"region_title", title:"Region"}])
      });
    });

  })
});