var chrome_store = {
  badge: function(n) {
    if (n === 0) {
      n = '';
    }
    chrome.browserAction.setBadgeText({text: n.toString()});
  },
  fetch: function(cb) {
    chrome.storage.sync.get({monday_items: []}, function(o) {
      var data = o.monday_items;
      db.badge(data.length); // temp hack!
      cb(data);
    });
  },
  save: function(data) {
    chrome.storage.sync.set({monday_items: data}, function(){
      db.badge(data.length);
    });
  },
  add: function(o, cb) {
    db.fetch(function(data){
      data.push(o);
      db.save(data);
      cb(o);
    });
  },
  remove: function(el, id, cb) {
    db.fetch(function(data){
      data = data.filter(function(o){
        return o.id !== id;
      });
      db.save(data);
      cb(el);
    });
  },
  update: function(el, body, id, cb) {
    db.fetch(function(data){
      data = data.map(function(o){
        if (o.id === id) {o.body = body;}
        return o;
      });
      db.save(data);
      cb(el);
    });
  },
  drop: function(cb) {
    db.save([]);
    cb();
  }
};

var localStorage_store = {
  fetch: function(cb) {
    var str = localStorage.getItem("monday_items"),
        arg = (str) ? JSON.parse(str) : [];
    cb(arg);
  },
  save: function(data) {
    localStorage.setItem("monday_items", JSON.stringify(data));
  },
  add: function(o, cb) {
    db.fetch(function(data){
      data.push(o);
      db.save(data);
      cb(o);
    });
  },
  remove: function(el, id, cb) {
    db.fetch(function(data){
      data = data.filter(function(o){
        return o.id !== id;
      });
      db.save(data);
      cb(el);
    });
  },
  update: function(el, body, id, cb) {
    db.fetch(function(data){
      data = data.map(function(o){
        if (o.id === id) {o.body = body;}
        return o;
      });
      db.save(data);
      cb(el);
    });
  },
  drop: function(cb) {
    db.save([]);
    cb();
  }
};
