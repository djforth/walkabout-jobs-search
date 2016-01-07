// require("babelify/polyfill");

const sinon     = require("sinon");
const _         = require("lodash");
const Immutable = require("immutable");

const createEl = require("react-jasmine").createElement;

const FiltersFcty  = require("../../src/factories/filters_fcty");

let mockdata = {
    title: "Collection Colours",
    filter_by:"color",
    input_type: "select",
    filter_options: [
      {
        id:0,
        title:"red"
      },
      {
        id:1,
        title:"green"
      },
      {
        id:2,
        title:"blue"
      }
    ]
  };


describe("FiltersFcty", function() {
  let filtersFcty;

  describe("basic setup", function() {
    let add, init;
    let store;
    beforeEach(function(){
      add   = jasmine.createSpy("add");

      store = {
        add:FiltersFcty.prototype.add
      };

      Object.assign(FiltersFcty.prototype, {
        add:add
      });

      filtersFcty =  new FiltersFcty(mockdata.title, mockdata.filter_by, mockdata.filter_options, mockdata.input_type);

    });

    afterEach(function(){
      Object.assign(FiltersFcty.prototype, {
        add:store.add
      });
    });

    it("should exist", function() {
      expect(filtersFcty).toBeDefined();
    });

    it("should set ID", function() {
      expect(filtersFcty.cid).toBeDefined()
      expect(filtersFcty.cid).toMatch(/filter/)
    });

    it("should have details obj", function() {
      expect(filtersFcty.details).toBeDefined()
      expect(filtersFcty.details.get("title")).toEqual(mockdata.title)
      expect(filtersFcty.details.get("filterBy")).toEqual(mockdata.filter_by)
      expect(filtersFcty.details.get("title")).toEqual(mockdata.title)
    });

    it("should call add", function() {
      expect(add).toHaveBeenCalledWith(mockdata.filter_options);
    });

  });

  describe("setApi", function() {
    beforeEach(function(){
      filtersFcty =  new FiltersFcty(mockdata.title, mockdata.filter_by,  mockdata.filter_options, mockdata.type);
    });

    it("should set url", function() {
      filtersFcty.setApi("/api/test.json");
    });
  });

  describe("get or set Selected ", function() {
    beforeEach(function(){
      filtersFcty =  new FiltersFcty(mockdata.title, mockdata.filter_by,  mockdata.filter_options, mockdata.input_type);
    });

    it("should set selected", function() {
      filtersFcty.setSelected("0");
      let selected = filtersFcty.data.get(0);

      expect(selected.get("selected")).toBeTruthy();
    });

    it("should set to false", function() {
      filtersFcty.data = filtersFcty.data.map((d)=>{
        d = d.set("selected", true);
        return d
      });

      filtersFcty.setSelected("0", false, false);
      let selected = filtersFcty.data.get(0);

      expect(selected.get("selected")).toBeFalsy();
    });

    it("should set to all to true", function() {
      filtersFcty.setSelected("all", true);

      filtersFcty.data.forEach((d)=>{
        expect(d.get("selected")).toBeTruthy();
      });
    });

    it("should set the correct one and reset the other", function() {
      filtersFcty.data = filtersFcty.data.map((d)=>{
        if (d.get("id") === 0){
          d = d.set("selected", true);
        }
        return d
      });

      filtersFcty.setSelected("1", true, true);
      let unselected = filtersFcty.data.get(0);
      expect(unselected.get("selected")).toBeFalsy();

      let selected = filtersFcty.data.get(1);
      expect(selected.get("selected")).toBeTruthy();

    });

    it("should return list of selected options", function() {
      filtersFcty.data = filtersFcty.data.map((d)=>{
        if (d.get("id") === 0){
          d = d.set("selected", true);
        }
        return d
      });

      let selected = filtersFcty.getSelected();

      let fb    = selected.filter_by
      let items = selected.selected
      expect(fb).toEqual("color")
      expect(items.size).toEqual(1)
    });


  });

  describe("get and has Details", function() {
    beforeEach(function(){
      filtersFcty =  new FiltersFcty(mockdata.title, mockdata.filter_by,  mockdata.filter_options, mockdata.type);
    });

    it("hasDetails", function() {
      expect(filtersFcty.hasDetails("filterBy", "color") ).toBeTruthy()
      expect(filtersFcty.hasDetails("filterBy", "designer") ).toBeFalsy()
    });
  });

});
