
const _           = require("lodash");
const DataManager = require("datamanager");

class DataFcty extends DataManager {

  init(){
    this.cache = {};
    this.pagination = 50;
    this.page       = 1;
    this.itemNo     = 0;
    this.current_search = null;
  }

  cacher(presets){
    let cache = presets || {};
    return {
      isEmpty:(items, key)=>{
        return (cache[key]) ? true : false;
      },
      get:(key)=>_.get(cache, key),
      set:(key, value)=>{
        cache[key] = value;
      }
    }
  }

  addSelected(ids){
    if(this.checkDataIds(ids)){
      this.addToHistory();
      this.data = this.data.map((d)=>{
        let selected = false;
        let id = d.get("id");
        if(_.isArray(ids)){
          selected = _.contains(ids, id);
        } else {
          selected = ids === id;
        }

        d = d.set("selected", selected);
        return d;
      });
    }

  }

  setApi(uri){
    this.url = uri;
  }

  cachedChecker(values){
    let checker =  {
      text      : this.checkCacheText(values("text"), values("keys")),
      filters   : this.checkCacheFilters(values("filters")),
      daterange : this.checkCachedDateRanges(values("dateRanges")),
      tab       : this.checkTabsCache(values("tab"))
    }

    let checkAll = function(){
      return _.reduce(_.values(checker), (t, n)=>{
        return (n && t);
      });
    }

    return function(key){
      return (key === "all") ? checkAll() : checker[key];
    }
  }

  checkCache(items, key){
    let check = this.checkEmptyOrCached(items, key);
    if(_.isBoolean(check)){
      return check;
    }

    return (tester)=>{
      return tester(items);
    }
  }

  checkDataIds(d){
    if(_.isArray(d)){
      return !_.isEmpty(d);
    } else {
      return _.isNumber(d);
    }
  }

  checkCachedDateRanges(dateRanges){

    let check = this.checkEmptyOrCached(dateRanges, this.cache.dateRanges);

    if(_.isBoolean(check)){
      return check;
    }

    check = true;
    let cacheDR = this.cache.dateRanges;

    _.forIn(dateRanges, (v, k)=>{
      let dr = cacheDR[k];

      if(v.st !== dr.st || v.fn !== dr.fn){
        check = false;
        return false;
      }
    });

    return check;
  }

  checkCacheFilters(filters){
    let check = this.checkEmptyOrCached(filters, this.cache.filters);

    if(_.isBoolean(check)){
      return check;
    }

    check = true;
    _.forEach(filters, (f)=>{
      let cached = this.getFilterByKey("filter_by", f.filter_by);

      if(!f.selected.equals(cached.selected)){
        check = false;
        return false;
      }
    });

    return check;
  }

  checkTabsCache(tab){
    let checkTabs = this.checkEmptyOrCached(tab, this.cache.tab);
    if (_.isBoolean(checkTabs)){
      return checkTabs;
    }

    return this.cache.tabs === tab;
  }


  checkCacheText(val, keys){
    let checkKeys = this.checkEmptyOrCached(keys, this.cache.keys);
    if (_.isBoolean(checkKeys)){
      return checkKeys;
    }

    if(!this.cache.text){
      return false;
    }

    return  this.cache.text === val && (_.difference(keys, this.cache.keys).length === 0);
  }


  checkDates(date, range){
    let test = false;
    if(_.isDate(date)){
      if((date > range.st) && (date < range.fn)){
        test = true;
      }
    }

    return test;

  }



  // Check and return filtered data
  checker(v, t, c){
    if(_.isEmpty(v)){
      return false;
    }

    let test  = t;
    let cache = c;

    return (searchFn, ...args)=>{
      args.push(v);
      return (test()) ? cache : searchFn.apply(this, args)
    }
  }

  checkerFilters(data, check, values){
    let filters = this.checker(values("filters"),
      ()=>{ return check("filters") },
      this.cache.filterSearch
    );

    return (filters) ? filters(this.filterSearch, data) : data;
  }

  checkerDateRanges(data, check, values){
    let dr = this.checker(values("dateRanges"),
      ()=>{
        return check("filters") && check("dateRanges")
      },
      this.cache.dateRangesSearch
    );

    return (dr) ? dr(this.dateRangeSearch, data) : data;
  }

  checkerTabs(data, check, values){
    let tab = this.checker(values("tab"),
      ()=>{ return check("tab") },
      this.cache.tabSearch
    );

    return (tab) ? tab(this.tabSearch, data) : data;
  }

  checkEmptyOrCached(items, cache){
    if(_.isEmpty(items) || !items){
      return true;
    }

    return (!cache) ? false : null;
  }

  checkFilters(opts, filter){
    let selected = this.getIds(filter.selected);
    let ids      = opts.get(filter.filter_by);

    return this.checkIds(selected, ids);
  }

  checkIds(selected, ids){
    if(_.isArray(ids)){
      if(_.intersection(selected, ids).length > 0){
        return true;
      }
    } else if(_.include(selected, ids)){
      return true;
    }

    return false;
  }


  dateRangeSearch(search, dateRanges){
    this.cache.dateRanges       = _.cloneDeep(dateRanges);
    if(!_.isEmpty(dateRanges)){
      search = search.filter((d)=>{
        let checked = false;
        _.forIn(dateRanges, (dr, key)=>{
          if(this.checkDates(d.get(key), dr)){
            checked = true;
            return false;
          }
        });

        return checked;
      });
    }

    this.cache.dateRangesSearch = search;
    return search;
  }

  filterSearch(search, filters){
    this.cache.filters = filters;

    filters = _.where(filters, {all:false});
    console.log("filters", filters)
    if(filters.length > 0){
      search = search.filter((d)=>{
        let checked = false;
        _.forEach(filters, (filter)=>{
          if(this.checkFilters(d.get("filters"), filter)){
            checked = true;
            return false;
          }
        });

        return checked;
      });
    }

    this.cache.filterSearch = search;
    return search;
  }

  tabSearch(search, tab){
    this.cache.tab = tab;


    let findKey = (key, d)=>{
      if(d.has(key)){
        return d.get(key)
      }

      let filters = d.get("filters");

      return (filters.has(key)) ? filters.get(key) : false
    }

    let checkValues = (filter, d)=>{
      if(_.isArray(filter)){
        return _.includes(filter)
      }

      return filter === d;
    }
    // console.log(tab.filterBy.type)
    if(_.isObject(tab) && tab.filterBy.type !== "all"){
      // console.log("foo")
      let filterBy = tab.filterBy
      search = search.filter((d)=>{
        let item = findKey(filterBy.type, d)
        if(filterBy.filter){
          return checkValues(filterBy.filter, item)
        }

        return (item) ? true : false;
      })
    }
    // console.log(search)
    return search;

  }

  filterByIds(ids){
    if(this.data){
      return this.data.filter((d)=>{
        // console.log(ids, d.get("id"));
        return _.contains(ids, Number(d.get("id")));
      });
    }
    return null;
  }

  getFilterByKey(key, keyComp){
    return _.find(this.cache.filters, (c)=>{
      return c[key] === keyComp;
    });
  }

  getIds(selected){
    let ids = selected.map((s)=>{
      return s.get("id");
    });

    return ids.toJS();
  }

  getSearch(data, val, keys){
    //Do search
    let regex = new RegExp(val, "i");
    let search = data.filter((d)=>{
      return this.searchTxt(regex, d, keys);
    });

    this.cache.text   = val;
    this.cache.keys   = keys;
    this.cache.search = search;

    return search;
  }

  getValues(data, keys){
    if(keys.length > 1){
      let all = data.filter((v, k)=>{
        return _.contains(keys, k);
      });
      return all.valueSeq().toJS().join(" ");
    } else {
      let k = (_.isArray(keys)) ? _.first(keys) : keys;
      return data.get(k);
    }
  }

  remove(id){
    // let del = this.findById(id);
    let del    =  super.remove(id);
    let search = this.cache.fullSearch;

    if(del && search){
      this.cache = _.mapValues(this.cache, (v)=>{

        if(v.indexOf){
          let i = v.indexOf(del);
          if(i > -1) {
            v = v.delete(i);
          }
        }
        return v;
      });

    }

    return del;
  }

  searchTxt(regex, data, keys){
    let values = this.getValues(data, keys);

    if(values){
      return (String(values).search(regex) > -1);
    }

    return false;
  }



  search(...args){
    let values = this.setValues.apply(this, args);
    // console.log("tabs", values("tab"))
    //Cache Checks
    let check = this.cachedChecker(values)

    if(check("all")){
      return this.cache.fullSearch;
    }
    // console.log("cache", this.cache)
    let searchData = this.checkerFilters(this.data, check, values);

    searchData = this.checkerTabs(searchData, check, values);

    searchData = this.checkerDateRanges(searchData, check, values);

    //Runs Search over data
    if(!_.isEmpty(values("text"))){
      searchData =  this.getSearch(searchData, values("text"), values("keys"));
    }

    this.cache.fullSearch = searchData; // Caches search
    return searchData;

  }

  //Setting Default values
  setter(test, key){
    let tester = test;
    let k      = key;

    return _.curry(function(obj, arg){
      if(tester(arg)){
        obj[k] = arg
      }

      return obj
    });
  }

  createSetters(){
    let setter_array = []
    setter_array.push(this.setter((arg)=>{
      return _.isString(arg);
    }, "text"));

    setter_array.push(this.setter((arg)=>{
      return _.isArray(arg) && _.isString(_.first(arg));
    }, "keys"));

    setter_array.push(this.setter((arg)=>{
      return _.isArray(arg) && _.isObject(_.first(arg));
    }, "filters"));

    setter_array.push(this.setter((arg)=>{
      return _.isObject(arg) && _.has(arg, "filterBy");
    }, "tab"));

    setter_array.push(this.setter((arg)=>{
      return _.isObject(arg) && !_.has(arg, "filterBy");
    }, "dateRanges"));

    return setter_array;
  }

  setValues(...args){

    //Checks values
    let settings = this.createSetters();

    let values = {};
    _.forEach(args, (arg)=>{
      _.forEach(settings, (set)=>{
        set    = set(values);
        values = set(arg);
      })

    });

    _.defaults(values,
      { "text"       : "" },
      { "keys"       : [] },
      { "filters"    : [] },
      { "tab"        : {} },
      { "dateRanges" : {} });
    return function(key){
      return values[key]
    };
  }
}

module.exports = DataFcty;
