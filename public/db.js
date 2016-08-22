var localStorage_store = { // [{id, body}, {}..]
  fetch: function() {
    var str = localStorage.getItem("monday_items");
    return (str) ? JSON.parse(str) : str;
  },
  save: function(data) {
    localStorage.setItem("monday_items", JSON.stringify(data));
  },
  all: function() {
    var data = this.fetch();
    if (data && data.length > 0) {
      data.forEach(function(o){
        list.add(o);
      });
    } else if (!data) {
      this.save([]); // init
    }
  },
  add: function(o) {
    var data = this.fetch();
    data.push(o);
    this.save(data);
  },
  remove: function(id) {
    var data = this.fetch();
    data = data.filter(function(o){
      return o.id !== id;
    });
    this.save(data);
  },
  update: function(body, id) {
    var data = this.fetch();
    data = data.map(function(o){
      if (o.id === id) {o.body = body;}
      return o;
    });
    this.save(data);
  }
};

var chrome_store = { // {<id>: <str>, ..}
  n: 0,
  badge: function(x) {
    var n;
    if (!x) {
      n = this.n;
    }
    if (x === '>') {
      n = ++this.n;
    }
    if (x === '<') {
      n = --this.n;
    }
    if (n === 0) {
      n = '';
    }
    chrome.browserAction.setBadgeText({text: n.toString()});
  },
  all: function() {
    var self = this;
    chrome.storage.sync.get(null, function(o) {
      for (var prop in o) {
        var item = {id: prop, body: o[prop]};
        list.add(item);
      }
      self.n = Object.keys(o).length;
      self.badge();
    });
  },
  add: function(o) {
    var item = {};
    item[o.id] = o.body;
    chrome.storage.sync.set(item);
    this.badge('>');
  },
  remove: function(id) {
    chrome.storage.sync.remove(id);
    this.badge('<');
  },
  update: function(body, id) {
    var item = {};
    item[id] = body;
    chrome.storage.sync.set(item);
  }
};

var db;

if (chrome !== undefined && chrome.storage !== undefined) {
  db = chrome_store;
} else {
  db = localStorage_store;
}
