// require("babelify/polyfill");

const sinon     = require("sinon");
const _         = require("lodash");
const Immutable = require("immutable");

const createEl = require("react-jasmine").createElement;

const DataFcty  = require("../../src/factories/data_fcty");

let filters

let mockdata = require("../data/data");


describe("DataFcty", function() {

	 let dataFcty;

	 beforeEach(function(){
	 		filters = [
				{
					filter_by:"color",
					selected:Immutable.fromJS(
						[
							{
								id:1,
								title:"green",
								selected:true
							}
						]
					),
					all:false
				},
				{
					filter_by:"Genesis",
					selected:Immutable.fromJS(
						[
							{
								id:1,
								title:"Phil Collins",
								selected:true
							}
						]
					),
					all:true
				}
			]
			dataFcty = new DataFcty({}, mockdata)
	 });

	 it("getIds", function() {

		 let ids = dataFcty.getIds(filters[0].selected)
		 expect(ids).toEqual([1])
	 });

	 it("should return true if filter option is present", function() {
		 let item = dataFcty.data.first();
		 item = item.get("filter_options")
		 item = item.set("color", 1)
		 spyOn(dataFcty, "getIds").and.returnValue([1])
		 spyOn(dataFcty, "checkIds").and.returnValue(true)


		 let test = dataFcty.checkFilters(item, filters[0]);

		 expect(test).toBeTruthy();
		 expect(dataFcty.getIds).toHaveBeenCalledWith(filters[0].selected);
		 expect(dataFcty.checkIds).toHaveBeenCalledWith([1], 1)


	 });

	 it("should return false if filter option is not present", function() {
		 let item = dataFcty.data.first();
		 item = item.get("filter_options")
		 item = item.set("color", 1)
		 spyOn(dataFcty, "getIds").and.returnValue([2])

		 let test = dataFcty.checkFilters(item, filters);

		 expect(test).toBeFalsy();

	 });
	 describe("Utility functions",()=>{
			describe('checkEmptyOrCached', function() {
				it("should return true if items empty", function() {
					expect(dataFcty.checkEmptyOrCached([], "key")).toBeTruthy();
				});

				it("should return false if cache not set", function() {
					expect(dataFcty.checkEmptyOrCached(["foo"], "key")).toBeFalsy();
				});

				it("should return null if not empty and cache set", function() {
					dataFcty.cache.key = ["foo"]
					expect(dataFcty.checkEmptyOrCached(["foo"], "key")).toBeNull();
				});
			});
	 })


	 describe("Filters functions", ()=>{
		describe('getFilterByKey', function() {
			beforeEach(()=>{
				dataFcty.cache.filters = filters;
			});

			it("should return the correct cache", function() {
				let item = dataFcty.getFilterByKey("filter_by", "Genesis");
				expect(item.filter_by).toEqual("Genesis");
			});
		});

		describe('checkCacheFilters', function() {
			let checked

			beforeEach(()=>{
				checked = null;
				spyOn(dataFcty, "checkEmptyOrCached").and.callFake(()=>{
					return checked;
				});

				spyOn(dataFcty, "getFilterByKey").and.callFake((k, v)=>{
					return filters[0]
				})

			});

			it("should return checked value if checkEmptyOrCached returns boolean", ()=>{
				checked = true;
				let test = dataFcty.checkCacheFilters(filters);
				expect(test).toBeTruthy();
				expect(dataFcty.checkEmptyOrCached).toHaveBeenCalledWith(filters, "filters");
			});

			it("return true if cached.filters equals filters", function() {

				let items = [_.clone(filters[0])];
				let val = dataFcty.checkCacheFilters(items);
				expect(val).toBeTruthy()
			});

			it("return false if cached.filters does not equal filters", function() {
				let item      = _.clone(filters[0])
				item.selected = item.selected.push({
					id:2,
					title:"Purple",
					selected:true
				})

				let items = [item];
				let val = dataFcty.checkCacheFilters(items);
				expect(val).toBeFalsy()
			});
		});

		describe('filterSearch', function() {
			let dataIm;
			let data = [
				{
					title:"foo",
					filters:{
						colors:1
					}
				},
				{
					title:"bar",
					filters:{
						colors:2
					}
				},
				{
					title:"foobar",
					filters:{
						colors:3
					}
				}
			]
			beforeEach(()=>{
				dataIm = Immutable.fromJS(data);
				dataFcty.data = dataIm;
				spyOn(dataFcty, "checkFilters").and.callFake((v, filters)=>{
					console.log("filters", v.toJS())
					console.log(v.get("colors") === 1)
					return (v.get("colors") === 1)
				});
			});

			it("should return all data if no filters", function() {
				let search = dataFcty.filterSearch(dataIm, []);
				expect(search).toEqual(dataIm)
				let cache = dataFcty.cache
				expect(cache.filters).toEqual([]);
				expect(cache.filterSearch).toEqual(dataIm);
			});

			it("should return all data if filters set to true", function() {
				let search = dataFcty.filterSearch(dataIm, [filters[1]]);
				expect(search).toEqual(dataIm)

				let cache = dataFcty.cache
				expect(cache.filters).toEqual([filters[1]]);
				expect(cache.filterSearch).toEqual(dataIm);
			});

			it("should run filter search if valid too", function() {
				let search = dataFcty.filterSearch(dataIm, filters);

				expect(dataFcty.checkFilters).toHaveBeenCalled();
				expect(dataFcty.checkFilters.calls.count()).toEqual(3);
				let expected = dataIm.slice(0, 1);
				expect(search.equals(expected)).toBeTruthy()

				let cache = dataFcty.cache
				expect(cache.filters).toEqual(filters);
				expect(cache.filterSearch.equals(expected)).toBeTruthy()
			});
		});
	 })

	 // describe("when search text", function() {
		// 	let regex, data, keys;
		// 	beforeEach(()=>{
		// 		data  = dataFcty.data.get(0)
		// 		keys  = ["title", "instruments"];
		// 		// spyOn(dataFcty, "getValues").and.returnValue()
		// 	})

		// 	it("should return true if matches", ()=> {
		// 		spyOn(dataFcty, "getValues").and.returnValue("Foo banks");
		// 		regex = new RegExp("Banks", "i");
		// 		let test = dataFcty.searchTxt(regex, data, keys);

		// 		expect(dataFcty.getValues).toHaveBeenCalledWith(data, keys);
		// 		expect(test).toBeTruthy();
		// 	});


		// 	it("should return false if not matches", ()=> {
		// 		spyOn(dataFcty, "getValues").and.returnValue("banks");
		// 		regex = new RegExp("Foo", "i");

		// 		let test = dataFcty.searchTxt(regex, data, keys);
		// 		expect(dataFcty.getValues).toHaveBeenCalledWith(data, keys);
		// 		expect(test).toBeFalsy();
		// 	});



	 // });

	describe("getValues", function() {
		let data, keys
			beforeEach(()=>{
				data  = dataFcty.data.get(0)
				keys  = ["title", "instruments"];
			})

			it("should return the correct data for key", function() {
				let value = dataFcty.getValues(data, "title");
				expect(value).toEqual(data.get("title"));
			});

			it("should return combined data", function() {
				let value    = dataFcty.getValues(data, keys);
				let combined = `${data.get("title")} ${data.get("instruments")}`;

				expect(value).toEqual(combined);

			});

			it("should only return combined string of keys", function() {
				data = data.set("foo", "bar");
				let value    = dataFcty.getValues(data, ["title", "foo"]);
				let combined = `${data.get("title")} bar`;

				expect(value).toEqual(combined);
			});
	});

	describe("Date search", ()=>{
		let dateRanges, data, dataIm;
		beforeEach(()=>{
				dateRanges = {
					required_by:{
						st:new Date(2015, 7, 1),
						fn:new Date(2015, 7, 31)
					}
				};

				data = [
					{
						title:"foo",
						required_by:new Date(2015, 6, 30)
					},
					{
						title:"bar",
						required_by:new Date(2015, 7, 1)
					},
					{
						title:"foobar",
						required_by:new Date(2015, 7, 31)
					},
					{
						title:"foobarbar",
						required_by:new Date(2015, 8, 1)
					}
				]

				dataIm = Immutable.fromJS(data);
				dataFcty.cache.data = dataIm;
		});



		describe('checkCachedDateRanges', function() {
			let checked
			beforeEach(()=>{

				checked = null;
				spyOn(dataFcty, "checkEmptyOrCached").and.callFake(()=>{
					return checked;
				});
			});

			it("should return checked value if checkEmptyOrCached returns boolean", ()=>{
				checked = false;
				let test = dataFcty.checkCachedDateRanges(dateRanges);
				expect(test).toBeFalsy();
				expect(dataFcty.checkEmptyOrCached).toHaveBeenCalledWith(dateRanges, "dateRanges");
			});


			it("should return true if cached matches new date fields", ()=>{
				dataFcty.cache.dateRanges = dateRanges;
				let test = dataFcty.checkCachedDateRanges(dateRanges);
				expect(test).toBeTruthy();
			});

			it("should return false if cached doesn't matches new date fields", ()=>{
				dataFcty.cache.dateRanges = {
					required_by:{
						st:new Date(2015, 7, 1),
						fn:new Date(2015, 8, 31)
					}
				};
				let test = dataFcty.checkCachedDateRanges(dateRanges);
				expect(test).toBeFalsy();
			});


		});

		describe('checkDates', function() {
			it("should return false if no date is passed", function() {
				let test = dataFcty.checkDates("foo", dateRanges)
				expect(test).toBeFalsy();
			});

			it("should return false if date is before start ranges", function() {
				let test = dataFcty.checkDates(new Date(2015, 6, 30), dateRanges)
				expect(test).toBeFalsy();
			});

			it("should return false if date is after finish range", function() {
				let test = dataFcty.checkDates(new Date(2015, 6, 30), dateRanges)
				expect(test).toBeFalsy();
			});

			it("should return true if date is between date ranges", function() {
				let test = dataFcty.checkDates(new Date(2015, 7, 15), dateRanges)
				expect(test).toBeFalsy();
			});
		});

		describe('dateRangeSearch', function() {
			let data
			beforeEach(()=>{
				spyOn(dataFcty, "checkDates").and.callFake((date)=>{
					let month = date.getMonth()
					return month > 6  && month < 8;
 				})
			});

			it("should set cache dateRanges", function() {
				let search = dataFcty.dateRangeSearch(dataIm, {})
				expect(dataFcty.cache.dateRanges).toEqual({})
			});

			it("should return all data if dateRanges empty", function() {
				let search = dataFcty.dateRangeSearch(dataIm, {})
				expect(search).toEqual(dataIm);
				expect(dataFcty.cache.dateRangesSearch).toEqual(dataIm);
			});

			it("should return only records within date range", function() {
				let search   = dataFcty.dateRangeSearch(dataIm, dateRanges);
				let expected = dataIm.slice(1, 3);
				expect(search.equals(expected)).toBeTruthy();
				expect(dataFcty.cache.dateRangesSearch.equals(expected)).toBeTruthy();
			});


		});
	})

	describe("text search", ()=>{
		describe('checkCache', function() {
			let key, text, val, keys
			beforeEach(()=>{
				val = "";
				keys = ["foo", "bar"];
				key =  text = null;
				spyOn(dataFcty, "checkEmptyOrCached").and.callFake((v, k)=>{
					return key;
				})
			})
			it("should return false if key cache is empty", function() {
				key = false;
				expect(dataFcty.checkCacheText(val, keys)).toBeFalsy();
				expect(dataFcty.checkEmptyOrCached).toHaveBeenCalledWith(keys, "keys");
				expect(dataFcty.checkEmptyOrCached.calls.count()).toEqual(1);
			});

			it("should return false if key cache is empty", function() {
				key = true;
				expect(dataFcty.checkCacheText(val, keys)).toBeTruthy();
				expect(dataFcty.checkEmptyOrCached).toHaveBeenCalledWith(keys, "keys");
				expect(dataFcty.checkEmptyOrCached.calls.count()).toEqual(1);
			});

			it("should return false if text not cached", function() {
				dataFcty.cache.text = undefined;
				expect(dataFcty.checkCacheText(val, keys)).toBeFalsy();
			});

			it("should return false if cached text doesn't match new value ", function() {
				dataFcty.cache.text = "foo";
				expect(dataFcty.checkCacheText("bar", keys)).toBeFalsy();
			});

			it("should return false if cached keys doesn't match new keys ", function() {
				dataFcty.cache.text = "bar"
				dataFcty.cache.keys = ["foo"];
				expect(dataFcty.checkCacheText("bar", keys)).toBeFalsy();
			});

			it("should return true if keys and search val match cache ", function() {
				dataFcty.cache.text = "bar"
				dataFcty.cache.keys = keys;
				expect(dataFcty.checkCacheText("bar", keys)).toBeTruthy();
			});
		});

	})

	describe("main search", function() {
		let cacheTxt, cacheFltr, cacheDR;
		let val, keys, filters, tab, dateRanges;

		beforeEach(()=>{
			val = "Foo"
			keys = ["foo"]
			filters = [{filter_by:"foo", selected:["foo"]}]
			dateRanges = {
				required_by:{
					st:new Date(2015, 7, 1),
					fn:new Date(2015, 7, 31)
				}
			};

			tab = {filterBy:"foo"};

			spyOn(dataFcty, "checkCacheText").and.callFake(()=>{
				return cacheTxt;
			});

			spyOn(dataFcty, "checkCacheFilters").and.callFake(()=>{
				return cacheFltr;
			});

			spyOn(dataFcty, "checkCachedDateRanges").and.callFake(()=>{
				return cacheDR;
			});



		})
		describe("setValues", ()=>{

			it("should set text value if sting is passed", function() {
				let vals = dataFcty.setValues(val);
				expect(vals("text")).toEqual(val);
			});

			it("should set keys value if array of sting is passed", function() {
				let vals = dataFcty.setValues(keys);
				// console.log("vals", vals)
				expect(vals("keys")).toEqual(keys);
			});



			it("should set filters value if array of objects is passed", function() {
				let vals = dataFcty.setValues(filters);
				expect(vals("filters")).toEqual(filters);

			});

			it("should set filters value if array of objects is passed", function() {

				let vals = dataFcty.setValues(dateRanges);
				expect(vals("dateRanges")).toEqual(dateRanges);

			});

			it("should set defaults", function() {
				let vals = dataFcty.setValues();
				expect(vals("text")).toEqual("");
				expect(vals("keys")).toEqual([]);
				expect(vals("filters")).toEqual([]);
				expect(vals("dateRanges")).toEqual({});
				expect(vals("tab")).toEqual({});
			});
		});

		describe("cache check", ()=>{
			let fullSearch = ["Phil"];
			let search;
			beforeEach(()=>{
				dataFcty.cache.fullSearch = fullSearch;
				spyOn(dataFcty, "setValues").and.callFake(()=>{
					let obj = {
						text       : val,
						keys       : keys,
						filters    : filters,
						dateRanges : dateRanges
					}

					return (k)=>{
						return obj[k];
					}
				});
				spyOn(dataFcty, "cachedChecker").and.callFake(()=>{
					return ()=>{
						return true;
					}

				});
				cacheDR = cacheFltr = cacheTxt =  true;
				search =  dataFcty.search(val, keys, filters, dateRanges)
			});

			it("should call setValues", function() {
				expect(dataFcty.setValues).toHaveBeenCalledWith(val, keys, filters, dateRanges);
			});

			it("should call check cached functions", function() {
				expect(dataFcty, "cachedChecker").toHaveBeenCalled();
				// expect(dataFcty.checkCacheFilters).toHaveBeenCalledWith(filters);
				// expect(dataFcty.checkCachedDateRanges).toHaveBeenCalledWith(dateRanges);
			});

			it("should return cached search if text, filter and date range are all cached", function() {
				expect(search).toEqual(fullSearch)
			});
		});

		describe('check filter search', function() {
			let filterSearch = ["bar"];
			let values;
			beforeEach(function() {
				values = {
					text       : "",
					keys       : keys,
					filters    : filters,
					dateRanges : dateRanges
				};

				dataFcty.cache.filterSearch     = filterSearch;
				dataFcty.cache.dateRangesSearch = filterSearch;
				spyOn(dataFcty, "setValues").and.callFake(()=>{
					let obj = {
						text       : val,
						keys       : keys,
						filters    : filters,
						dateRanges : dateRanges
					}

					return (k)=>{
						return obj[k];
					}
				});

				spyOn(dataFcty, "filterSearch").and.returnValue(filterSearch);
				spyOn(dataFcty, "dateRangeSearch").and.callFake((search, dr)=>{
					return search;
				});
			});

			it("should return cached filterSearch if cache matches", function() {
				cacheDR   = false;
				cacheTxt  = true;
				cacheFltr = true;
				dataFcty.cache.filterSearch =
					dataFcty.cache.dateRangesSearch = ["foo"]
				let search   = dataFcty.search(val, keys, filters, dateRanges);

				expect(search).toEqual(["foo"]);
				expect(dataFcty.filterSearch).not.toHaveBeenCalled();
			});

			it("should run filter search if cache don't matches", function() {
				cacheDR   = true;
				cacheTxt  = true;
				cacheFltr = false;
				dataFcty.cache.filterSearch = ["foo"]
				dataFcty.cache.dateRangesSearch =  ["bar"]
				let search   = dataFcty.search(val, keys, filters, dateRanges);

				expect(search).toEqual(["bar"]);
				expect(dataFcty.cache.fullSearch).toEqual(["bar"]);
				expect(dataFcty.filterSearch).toHaveBeenCalled();
			});
		});

		describe('check date ranges', function() {
			let search = ["bar"];
			let values;
			beforeEach(()=>{
				values = {
					text       : "",
					keys       : keys,
					filters    : filters,
					dateRanges : dateRanges
				}
				dataFcty.data  = ["foo", "bar", "fooBar", "fooBarBar"];
				dataFcty.cache.filterSearch     = ["foo", "bar", "fooBar"];
				dataFcty.cache.dateRangesSearch = ["foo", "bar"];

				spyOn(dataFcty, "dateRangeSearch").and.returnValue(["foo"])
				spyOn(dataFcty, "setValues").and.callFake(()=>{
					return values;
				});
			});

			it("should not do a date search if no date ranges", function() {
				cacheDR   = true;
				cacheTxt  = false;
				cacheFltr = true;
				values.dateRanges = {}
				let search   = dataFcty.search("", keys, filters);
				expect(search).toEqual(["foo", "bar", "fooBar"]);
			});

			it("should return cached search if filters & date ranges are cached", function() {
				cacheDR   = true;
				cacheTxt  = false;
				cacheFltr = true;

				let search   = dataFcty.search("", keys, filters, dateRanges);

				expect(search).toEqual(["foo", "bar"]);
				expect(dataFcty.cache.fullSearch).toEqual(["foo", "bar"]);
				expect(dataFcty.dateRangeSearch).not.toHaveBeenCalled();
			});

			it("should return cached search if filters & date ranges are cached", function() {
				cacheDR   = false;
				cacheTxt  = false;
				cacheFltr = true;

				let search   = dataFcty.search("", keys, filters, dateRanges);

				expect(search).toEqual(["foo"]);
				expect(dataFcty.cache.fullSearch).toEqual(["foo"]);
				expect(dataFcty.dateRangeSearch).toHaveBeenCalledWith(["foo", "bar", "fooBar"], dateRanges);
			});
		});

		describe('remove functions', function() {
			beforeEach(()=>{
	      // spyOn(dataFcty.super, "remove")
	      dataFcty.data = Immutable.fromJS([{foo:"bar", id:3}, {foo:"bar", id:2}]);
	      dataFcty.cache.fullSearch = Immutable.fromJS([{foo:"bar", id:3}, {foo:"bar", id:2}]);
	    });


	      it("should return null if not found", function() {
	        let del = dataFcty.remove(4);
	        expect(del).toBeNull();
	      });

	      it("should remove item", function() {
	        let del = dataFcty.remove(3);
	        // console.log("data", dataFcty.data.size)
	        expect(dataFcty.cache.fullSearch.size).toEqual(1);
	        expect(del.toJS()).toEqual({foo:"bar", id:3});
	      });

		});

		describe('check text search', function() {
			let search = ["bar"];
			let values;
			beforeEach(()=>{
				values = {
					text       : val,
					keys       : keys,
					filters    : [],
					dateRanges : {}
				}
				dataFcty.data = ["foo", "bar", "fooBar"];

				spyOn(dataFcty, "setValues").and.callFake(()=>{
					return values;
				});

				spyOn(dataFcty, "getSearch").and.returnValue(["foo"])
			});

			it("should not do a text search if text empty", function() {
				cacheDR   = true;
				cacheTxt  = false;
				cacheFltr = true;
				values.text = ""
				let search   = dataFcty.search("", keys, filters);
				expect(search).toEqual(["foo", "bar", "fooBar"]);
			});

			it("should set text search if val", function() {
				cacheDR   = true;
				cacheTxt  = false;
				cacheFltr = true;
				let search   = dataFcty.search("foo", keys, filters);
				expect(search).toEqual(["foo"]);
			});
		});

		xit("should return true if search filter & filter is true", function() {
			spyOn(dataFcty, "searchTxt").and.returnValue(true);
			spyOn(dataFcty, "checkFilters").and.returnValue(true)

			let data = dataFcty.search("foo", ["key"], filters)

			expect(data.size).toEqual(17);
		});

		xit("should return false if search filter is true & filter is false", function() {
			spyOn(dataFcty, "searchTxt").and.returnValue(true);
			spyOn(dataFcty, "checkFilters").and.returnValue(false);

			// let data = dataFcty.search("foo", ["key"], filters)

			// expect(data.size).toEqual(0);
		});

		xit("should return false if search filter is false & filter is true", function() {
			spyOn(dataFcty, "searchTxt").and.returnValue(false);
			spyOn(dataFcty, "checkFilters").and.returnValue(true);

			let data = dataFcty.search("foo", ["key"], filters)

			expect(data.size).toEqual(0);
		});

		xit("should return false if search filter is false & filter is false", function() {
			spyOn(dataFcty, "searchTxt").and.returnValue(false);
			spyOn(dataFcty, "checkFilters").and.returnValue(false);

			let data = dataFcty.search("foo", ["key"], filters)

			expect(data.size).toEqual(0);
		});
	});

});

