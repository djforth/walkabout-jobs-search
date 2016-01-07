const _         = require("lodash");
const Immutable = require("immutable");

const DataStore = require("../../src/stores/data_store");

const storeHelper    = require("react-jasmine").storeHelpers;
const defaultsHelper = require("react-jasmine").checkDefaults;

describe("DataStore", function() {

  let options = [
    {
      func:"setDateRanges",
      action:{
        type:"ADD_DATE_RANGE",
        key:"foo",
        st:"bar",
        fn:"bar bar"
      },
      args:["foo", "bar", "bar bar"],
      change:"search"
    },
    {
      func:"deleteItem",
      action:{
        type:"DELETE_ITEM",
        id:1,
        flash:"Success!"
      },
      change:"delete"
    },
    {
      func:null,
      action:{
        type:"KEY_UPDATE"
      },
      change:"search"
    },

    {
      func:"fetchData",
      action:{
        type:"FETCH_DATA",
        api:"api",
        progress:"progress"
      },
      change:"fetching"
    },

    {
      func:null,
      action:{
        type:"FILTER_SEARCH"
      },
      change:"search"
    },

    {
      func:"removeDateRange",
      action:{
        type:"REMOVE_DATE_RANGE",
        key:"foo"
      },
      args:"foo",
      change:"search"
    },

    {
      func:"setPage",
      action:{
        type:"PAGE_UPDATE",
        data:"foo"
      },
      args:"foo",
      change:"pagination"
    },

    {
      func:null,
      action:{
        type:"RECEIVE_DATA"
      },
      change:"fetched"
    },

    {
      func:"setSearchVal",
      action:{
        type:"SEARCH_DATA",
        data:"foo"
      },
      args:"foo",
      change:"search"
    },

    {
      func:"setSelected",
      action:{
        type:"SET_SELECTED",
        id:1,
        selected:true
      },
      args:[1, true],
      change:"change"
    }
  ];

  storeHelper.checkDispatcher(DataStore, "registeredCallback", options);

  describe("store functions", function() {
    let store, fcty;
    let data          = [{title:"foo", id:1}, {title:"Bar", id:2}, {title:"foo-bar", id:3}];
    let immutableData = Immutable.fromJS(data);
    let ids           = [1, 2, 3];

    beforeEach(()=>{
      store  = DataStore.__get__("store");
    });

    var defaults = {
        searchVal  :null,
        pagination : 50,
        page       : 1,
        itemNo     : 0,
        cache      : null,
        selected   : []
      };

    defaultsHelper(
      ()=>{ return store }
      , defaults
    );

    describe("deleteItem", function() {
      beforeEach(()=>{
        spyOn(store.data, "remove");

      });

      it("should call remove with id if notice", function() {
        store.deleteItem(1, {type:"notice", message:"Success!"});
        expect(store.data.remove).toHaveBeenCalledWith(1);
      });

      it("should call not call remove with id if error", function() {
        store.deleteItem(1, {type:"error", message:"Success!"});
        expect(store.data.remove).not.toHaveBeenCalled();
      });
    });

    describe("basic get functions", function() {
      it("get returns correctly", function() {
        spyOn(store.data, "findById")
        store.get(1);
        expect(store.data.findById).toHaveBeenCalledWith(1)
      });

      it("getAll returns correctly", function() {
        spyOn(store.data, "getAll").and.returnValue(immutableData);
        store.pagination = 2;
        let data = store.getAll()
        expect(store.data.getAll).toHaveBeenCalled();
        expect(data).toEqual(immutableData.slice(0, 1))
      });

      it("getByIds returns correctly", function() {
        spyOn(store.data, "filterByIds");
        store.getByIds(ids)
        expect(store.data.filterByIds).toHaveBeenCalledWith(ids)
      });

      it("getCurrentData returns correctly", function() {
        spyOn(store.data, "getAll").and.returnValue("foo");
        let data = store.getCurrentData();
        expect(store.data.getAll).toHaveBeenCalled();
        expect(data).toEqual("foo")
      });

      it("getKeys returns correctly", function() {
        spyOn(store.data, "getKeys").and.returnValue("foo");
        let data = store.getKeys();
        expect(store.data.getKeys).toHaveBeenCalled();
        expect(data).toEqual("foo")
      });

      it("getDateFmt and return correct formatted date", function() {
        spyOn(store.data, "formatDate").and.returnValue("18/01/2015");
        let data = immutableData.first()
        let fmt = store.getDateFmt(data, "foo")

        expect(store.data.formatDate).toHaveBeenCalledWith(data, "foo", "%d/%m/%Y");
        expect(fmt).toEqual("18/01/2015");
      });
    });

    describe("basic set Functions", function() {
      it("should set Api", function() {
        let url = "http://phillcollins.com"
        store.setApi(url);
        expect(store.data.url).toEqual(url)
      });

      it("should set page", function() {
        store.setPage(2);
        expect(store.page).toEqual(2);
      });

      it("should set search value", function() {
        store.setSearchVal("foo");
        expect(store.searchVal).toEqual("foo");
      });

      it("should set selectedIds", function() {
        store.selectedIds(ids);
        expect(store.selected).toEqual(ids);
      });


    });

    describe('dateRanges', function() {
      it("should not set dateRanges if not dates passed", function() {
        store.setDateRanges("require_by", new Date(2015, 0, 18), "foo")
        expect(store.dateRanges.require_by).toBeUndefined()
      });

      it("should not set dateRanges if not dates passed", function() {
        store.setDateRanges("require_by", new Date(2015, 0, 18), new Date(2015, 1, 18))
        expect(store.dateRanges.require_by.st).toEqual(new Date(2015, 0, 18));
        expect(store.dateRanges.require_by.fn).toEqual(new Date(2015, 1, 18));
      });

      it("should remove date range", function() {
        store.dateRanges.require_by = {st:new Date(2015, 0, 18), fn:new Date(2015, 1, 18)}

        store.removeDateRange("require_by")
        expect(store.dateRanges.require_by).toBeUndefined()
      });
    });

    describe("fetching and process Data", function() {
      let action, promise, resolve, reject;
      beforeEach(()=>{
        action = DataStore.__get__("DataAction");
        promise = new Promise((res, rej)=>{
          resolve = res;
          reject  = rej;
        });
        store.data.url = "http://phillcollins.com";
        spyOn(store.data, "fetch").and.returnValue(promise);
      });

      it("should pass progress function to fetch", function() {
        let spyProgress = jasmine.createSpy("progress");
        store.fetchData(spyProgress);
        expect(store.data.fetch).toHaveBeenCalledWith(spyProgress);
      });

      it("should fetch data", function(done) {
        spyOn(store, "processData");
        store.fetchData().then(()=>{
          expect(store.processData).toHaveBeenCalledWith("success");
        })
        resolve("success");
        setTimeout(function() {
            done();
          }, 100);

      });

      it("should throw error data", function(done) {

        store.fetchData().catch((err)=>{
          expect(err).toEqual(new Error("failure"));
        })
        reject("failure");
        setTimeout(function() {
            done();
          }, 100);

      });

      describe("processData", function() {
        beforeEach(function() {
          spyOn(action, "receiveAll");
          spyOn(store.data, "addSelected");
          spyOn(store.data, "getAll").and.returnValue(immutableData);
        });

        it("should not add selected if empty", function() {
          store.selected = [];
          store.processData();
          expect(store.data.addSelected).not.toHaveBeenCalled();
        });

        it("should add selected if data", function() {
          store.selected = ids;
          store.processData();
          expect(store.data.addSelected).toHaveBeenCalledWith(ids);
        });

        it("should call getAll", function() {
          store.processData();
          expect(store.data.getAll).toHaveBeenCalled();
        });

        it("should set Item number", function() {
          store.processData();
          expect(store.itemNo).toEqual(3);
        });

        it("should call recieveAll and return data", function() {
          let data = store.processData();
          expect(action.receiveAll).toHaveBeenCalledWith(immutableData);
          expect(data).toEqual(immutableData);
        });

      });


      describe("pagination Functions", function() {
        describe("getPagination", function() {
          it("should return then number of pagination", function() {
            store.itemNo     = 100;
            store.pagination = 25;

            expect(store.getPagination()).toEqual(4);
          });

          it("should return 0 if less than 1", function() {
            store.itemNo     = 22;
            store.pagination = 25;

            expect(store.getPagination()).toEqual(0);
          });
        });

        describe("getPage", function() {
          beforeEach(function() {
            store.page       = 2;
            store.pagination = 50;
          });

          it("should return the correct split", function() {
            let pag = store.getPage();
            expect(pag.st).toEqual(50);
            expect(pag.fn).toEqual(99);
          });
        });

        describe("paginationData", function() {
          beforeEach(function() {
            store.cache = immutableData;
            spyOn(store, "getPage").and.returnValue({st:0, fn:2});
          });

          it("should return the correct data", function() {
            let data = store.paginationData();
            expect(store.getPage).toHaveBeenCalled();
            expect(data).toEqual(immutableData.slice(0, 2));
          });
        });
      });


      describe("getSearchData", function() {
        let filterStore, data;
        beforeEach(function() {
          filterStore = DataStore.__get__("FilterStore");
          spyOn(filterStore, "getSelectedKeys").and.returnValue(["key"]);
          spyOn(filterStore, "getFilters").and.returnValue(["filter"]);

          spyOn(store.data, "search").and.returnValue(immutableData);

          store.searchVal  = "foo";
          store.page       = 10;
          store.itemNo     = 10;
          store.cache      = [];
          store.pagination = 2;

          data = store.getSearchData();

        });

        it("should set page", function() {
          expect(store.page).toEqual(1);
        });

        it("should get keys and filters", function() {
          expect(filterStore.getSelectedKeys).toHaveBeenCalled();
          expect(filterStore.getFilters).toHaveBeenCalled();
        });

        it("should call data search", function() {
          expect(store.data.search).toHaveBeenCalled()
          let args = store.data.search.calls.argsFor(0);
          console.log(args)
          expect(args[0]).toEqual("foo");
          expect(args[1]).toEqual(["key"]);
          expect(args[2]).toEqual(["filter"]);
        });

        it("should set itemNo", function() {
          expect(store.itemNo).toEqual(3);
        });

        it("should set cache", function() {
          expect(store.cache).toEqual(immutableData);
        });

        it("should return the correct data", function() {
          expect(data).toEqual(immutableData.slice(0, 1))
        });
      });
    });


    describe("setSelected", function() {
      beforeEach(function() {
        spyOn(store.data, "update")
        store.cache = immutableData;

        store.setSelected(1, true);
      });

      it("should call data update", function() {
        expect(store.data.update).toHaveBeenCalledWith(1, {selected:true});
      });

      it("should update cache", function() {
        let selected =  store.cache.filter((d)=>{
          return d.get("selected");
        })
        let data = selected.first().toJS();

        expect(selected.size).toEqual(1);
        expect(data.id).toEqual(1);
        expect(data.selected).toBeTruthy()
      });
    });
  });
});