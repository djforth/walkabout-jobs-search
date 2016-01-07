const _         = require("lodash");
const Immutable = require("immutable");

const FilterStore = require("../../src/stores/filter_store");

const storeHelper     = require("react-jasmine").storeHelpers;

const defaultsHelper = require("react-jasmine").checkDefaults

describe("filterStore", function() {
  let options = [
    {
      func:"setSelected",
      action:{
        type:"CHANGE_KEY",
        data:"foo"
      },
      args:"foo",
      change:"change_key"
    },

    {
      func:"checked",
      action:{
        type:"CHECK_FILTER",
        filterBy:"foo",
        id:1,
        value:"bar"
      },
      args:["foo", 1, "bar"],
      change:"filter_change"
    },

    {
      func:null,
      action:{
        type:"RECEIVE_DATA"
      },
      change:"fetched"
    },

    {
      func:"fetchData",
      action:{
        type : "FETCH",
        api  : "foo"
      },
      args: ["foo"],
      change:"fetching"
    },

    {
      func:"selected",
      action:{
        type:"SELECT_FILTER" ,
        filterBy:"foo",
        id:1
      },
      args:["foo", 1],
      change:"filter_change"
    },

    {
      func:"setKeys",
      action:{
        type:"SET_KEYS" ,
        data:[1, 2]
      },
      args:[[1, 2]],
      change:"setting_keys"
    }
  ];

  storeHelper.checkDispatcher(FilterStore, "registeredCallback", options);


  storeHelper.checkChangeEvents(()=>{
    return FilterStore.__get__("store");
  });

  var defaults = {
        keys         : [],
        selectedKey  : "all",
        filters      : [],
        changed      : true,
        cache        : null
      };

    defaultsHelper(
      ()=>{ return FilterStore.__get__("store"); }
      , defaults
    );



    describe("get functions", function() {


      let store, ajaxPromises;
      beforeEach(function() {
        store        = FilterStore.__get__("store");
        ajaxPromises = FilterStore.__get__("ajaxPromises");
      });

      let storeFn = ()=>{ return store; }
      let getFn = [
        {fn:"getAll", key:"filters", value: ["filter"]},
        {fn:"getAllKeys", key:"keys", value:["key"]},
        {fn:"getSelectedKey", key:"selectedKey", value:"key"}
      ];
      storeHelper.checkAllGet(storeFn, getFn);
      describe("get", function() {
        let spy1, spy2, mockdata;
        beforeEach(()=>{
          spy1 = jasmine.createSpy("hasDetails1").and.returnValue(false);
          spy2 = jasmine.createSpy("hasDetails1").and.returnValue(true);
          mockdata = [
            { hasDetails:spy1 },
            { hasDetails:spy2 }
          ];
        });

        it("should get", function() {
          store.filters = mockdata;
          let spy = store.get("color");
          expect(spy1).toHaveBeenCalledWith("filterBy", "color");
          expect(spy2).toHaveBeenCalledWith("filterBy", "color");
          expect(spy.hasDetails).toEqual(spy2);
        });

      });


      describe("getFilters & getSelectedFilters", ()=> {
        let mockdata = ["foo", "bar"];
        describe("get Filters", ()=> {
          beforeEach(()=> {
            spyOn(store, "getSelectedFilters").and.returnValue(mockdata);
          });

          it("should return current selected filters", function() {
            let data = store.getFilters();

            expect(store.getSelectedFilters).toHaveBeenCalled();
            expect(store.changed).toBeFalsy();
            expect(store.cache).toEqual(mockdata);
            expect(data).toEqual(mockdata);
          });

          it("should return cached filters not changed", function() {
            store.cache   = ["foo"];
            store.changed = false;
            let data = store.getFilters();

            expect(store.getSelectedFilters).not.toHaveBeenCalled();
            expect(store.changed).toBeFalsy();
            expect(store.cache).toEqual(["foo"]);
            expect(data).toEqual(["foo"]);
          });


        });

        describe("getSelectedFilters", function() {
          let spy1, spy2;
          beforeEach(()=>{
            spy1 = jasmine.createSpy("getSelected1").and.returnValue("foo");
            spy2 = jasmine.createSpy("getSelected2").and.returnValue("bar");
            store.filters = [
              { getSelected:spy1 },
              { getSelected:spy2 }
            ];
          });

          it("should return current selected filters", function() {
            let data = store.getSelectedFilters();

            expect(spy1).toHaveBeenCalled();
            expect(spy2).toHaveBeenCalled();

            expect(data).toEqual(["foo", "bar"]);
          });
        });

      });

      describe("getSelectedKeys", function() {
        beforeEach(function() {
          store.keys = ["keys"];
        });

        it("should return all keys if selectedKey is 'all'", function() {
          store.selectedKey = "all";
          let keys = store.getSelectedKeys();
          expect(keys).toEqual(store.keys);
        });

        it("should return selectedKey if not all", function() {
          store.selectedKey = "foo";
          let keys = store.getSelectedKeys();
          expect(keys).toEqual(["foo"]);
        });
      });

      describe('getDates', function() {
        beforeEach(function() {
          store.dates = {foo:"foo"}
        });

        afterEach(()=>{
          store.dates = {}

        })

        it("should return dates", function() {
          // store.dates = {foo:"foo"}
          expect(store.getDates()).toEqual({foo:"foo"});
        });
      });
    });

    describe("set functions", function() {
      let store, ajaxPromises;
      beforeEach(function() {
        store = FilterStore.__get__("store");
        ajaxPromises = FilterStore.__get__("ajaxPromises");
      });
      let storeFn = ()=>{ return store; }
      let getFn = [
        {fn:"setKeys", key:"keys", value: ["key"]},
        {fn:"setSelected", key:"selectedKey", value:["key"]}
      ];
      storeHelper.checkAllSet(storeFn, getFn);

      it("should set api", function() {
        spyOn(ajaxPromises, "addUrl");
        store.setApi("http://philcollins.co.uk");
        expect(ajaxPromises.addUrl).toHaveBeenCalledWith("http://philcollins.co.uk");
      });

      describe('date management', function() {
        it("should add start date", function() {
          let st = new Date(2015, 0, 18);
          store.setDate({key:"foo", date:st, pos:"start"})

          let dr = store.dates.foo;

          expect(dr).toEqual({st:st});
        });

        it("should add end date", function() {
          store.dates.foo = {st:new Date(2015, 0, 18)}
          let fn = new Date(2015, 0, 28);
          store.setDate({key:"foo", date:fn, pos:"end"})

          let dr = store.dates.foo;
          expect(dr).toEqual({st:new Date(2015, 0, 18), fn:fn});
        });
      });

      describe("selected", function() {
        let spy  = jasmine.createSpyObj("filter", ["setSelected"])
        beforeEach(function() {
          spyOn(store, "get").and.returnValue(spy)
          store.changed =  false;
        });

        afterEach(()=>{
          spy.setSelected.calls.reset();
        })

        it("should set selected with true by default", function() {
          store.selected("color", 1);

          expect(store.get).toHaveBeenCalledWith("color");
          expect(spy.setSelected).toHaveBeenCalledWith(1, true, true);

          expect(store.changed).toBeTruthy();
        });

        it("should set selected to false", function() {
          store.selected("color", 1, false);

          expect(store.get).toHaveBeenCalledWith("color");
          expect(spy.setSelected).toHaveBeenCalledWith(1, false, true);

          expect(store.changed).toBeTruthy();
        });
      });


    });




    describe("fetch and process filters", function() {
      let action, ajax, promise, resolve, reject, store;
      beforeEach(()=>{
        store  = FilterStore.__get__("store");
      });

      describe("fetch filters", function() {
        beforeEach(function() {
          action = FilterStore.__get__("FilterAction");
          ajax   = FilterStore.__get__("ajaxPromises");

          promise = new Promise((res, rej)=>{
            resolve = res;
            reject  = rej;
          });

          ajax.url = "http://phillcollins.com";
          spyOn(store, "setApi")
          spyOn(ajax, "fetch").and.returnValue(promise);
          spyOn(store, "processFilters").and.returnValue(["foo"]);
          spyOn(action, "receiveAll");
        });

        it("should fetch data", function(done) {

          store.fetchData(ajax.url).then((data)=>{
            expect(store.processFilters).toHaveBeenCalledWith("success");
            expect(action.receiveAll).toHaveBeenCalledWith(["foo"]);
            expect(data).toEqual(["foo"]);
          });

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
      });

      describe("processData", function() {
        let revert, spy1, spy2;
        let mockdata = [
          {
            title:"foo",
            filter_by:"color",
            filter_options:["foo"],
            input_type:"checked"
          },
          {
            title:"bar",
            filter_by:"collection",
            filter_options:["bar"],
            input_type:"radio"
          }
        ];
        beforeEach(()=>{
          spy2   = jasmine.createSpy("setSelected")
          spy1   = jasmine.createSpy("FiltersFcty").and.returnValue({setSelected:spy2});
          revert = FilterStore.__set__("FiltersFcty", spy1);
        });

        afterEach(()=>{
          revert();

          spy1.calls.reset();
          spy2.calls.reset();

        });

        it("should call filterFcty", function() {
          let data = store.processFilters(mockdata);

          expect(spy1.calls.count()).toEqual(2);


          _.forEach(spy1.calls.allArgs(), (calls, i)=>{
            _.forEach(calls, (c)=>{
              expect(_.includes(mockdata[i], c)).toBeTruthy();
            });
          });
        });

        it("should call set selected", function() {
          let data = store.processFilters(mockdata);

          expect(spy2.calls.count()).toEqual(2);

          _.forEach(spy2.calls.allArgs(), (calls, i)=>{

            expect(calls).toEqual(["all", true]);

          });

        });

        it("should return data", function() {
          let data = store.processFilters(mockdata);
          expect(data.length).toEqual(2);
        });
      });
    });


});