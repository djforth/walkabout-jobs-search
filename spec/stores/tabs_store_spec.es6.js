
const TabsStore = require('../../src/stores/tabs_store');

const storeHelper    = require("react-jasmine").storeHelpers;
const defaultsHelper = require("react-jasmine").checkDefaults;

const _         = require('lodash');
const Immutable = require('immutable');



describe('TabsStore', function() {
  let mockdata, final, tablet
  beforeEach(()=>{
    mockdata = [
      {title:"Search our Jobs", filterBy:{type:"all", filter:null}, filters:[], search:true, options:{css:"osw-r up-c gamma tab-btn", active:true}},
      {title:"Head Office opportunities", filterBy:{type:"head_office_role", filter:null}, filters:["categories"], search:false, options:{css:"osw-r up-c gamma tab-btn", active:false}},
      {title:"Venue opportunities", filterBy:{type:"venues", filter:null}, filters:["venues"], search:false, options:{css:"osw-r up-c gamma tab-btn", active:false}}
    ];

    final = _.map(_.cloneDeep(mockdata), (tab, i)=>{
      tab.id = i;
      return tab;
    });

    tablet = _.where(final, {tablet:true});
  })

  let options = [
    {
      func:"addTabs",
      action:{
        type:"ADDING_TABS",
        tabs:"foo",
        id:1
      },
      args:["foo", 1],
      change:"adding"
    },
    {
      func:"changeDevice",
      action:{
        type:"CHANGE_DEVICE",
        device:"mobile"
      },
      args:"mobile",
      change:"device_change"
    },
    {
      func:"changeTab",
      action:{
        type:"CHANGE_TAB",
        id:1,
        tab:"foo"
      },
      args:[1, "foo"],
      change:"tab_change"
    }
  ];


  storeHelper.checkDispatcher(TabsStore, "registeredCallback", options)

  storeHelper.checkChangeEvents(()=>{
    return TabsStore.__get__("store");
  });

  describe('store functions', function() {
    let store, columns

    beforeEach(()=>{
      store  = TabsStore.__get__("store");
    });

    describe('setting functions', function() {
      let id;

      beforeEach(()=>{
        spyOn(store, "setIDs").and.returnValue(final);
        id = store.addTabs(mockdata, 1);
      })

      it("should add tabs to store", function() {


        expect(id).toEqual(1)
        let tabs = store.tabs[0]
        expect(tabs.items).toEqual(final);
        expect(tabs.id).toEqual(1);
        // expect(column.visible).toEqual(tablet);
        expect(store.setIDs).toHaveBeenCalledWith(mockdata);
        // expect(store.setVisibleColumns).toHaveBeenCalledWith(final);
      });


      describe("changeTab", ()=>{
        beforeEach(()=>{
          spyOn(store, "getTabs").and.returnValue(final);
          spyOn(store, "setTabs");

          store.changeTab(1,3)

        });

        it("should call getTabs", ()=>{
          expect(store.getTabs).toHaveBeenCalledWith(1);
        });

        // it('should set active tab', function() {
        //   let items =  store.setTabs.calls.getArgs(0)
        // });
      })

    });


  });

});