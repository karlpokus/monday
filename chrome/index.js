var list = {
  el: '.list',
  blurInput: function(el) {
    $(el).blur();
  },
  newItem: function(o) {
    return $('<input/>')
      .prop({type: 'text', value: o.body})
      .data('id', o.id);
  },
  empty: function() {
    $(list.el).empty();
  },
  remove: function(el) {
    $(el).remove();
  },
  addOne: function(o) {
    var el = list.newItem(o);
    $(list.el).prepend(el);
  },
  addAll: function(data) {
    if (data.length > 0) {
      data.forEach(function(o){
        var el = list.newItem(o);
        $(list.el).prepend(el);
      });
    }
  }
};

var main = {
  el: '#main',
  focus: function() {
    $(main.el).focus();
  },
  reset: function() {
    $(main.el).val('');
  },
  historyIndex: 0,
  showHistory: function(arrow, data) {
    if (arrow === 'up' && data && main.historyIndex < data.length) {
      main.render(data.reverse()[main.historyIndex++].body);
    }
    if (arrow === 'down' && data && main.historyIndex > 0) {
      main.render(data.reverse()[--main.historyIndex].body);
    }
  },
  render: function(str) {
    $(main.el).val(str);
  }
};

var tag = {
  el: '.tag',
  render: function(str) {
    $(tag.el).text(str);
  }
};

var app = {
  v: 'v2.0',
  init: function() {
    app.setContext(function(){
      app.addItems();
      main.focus();
    });
  },
  setContext: function(cb) {
    if (typeof chrome === 'object' && typeof chrome.storage === 'object') {
      db = chrome_store;
      app.ctx = 'chrome ext';
    } else {
      db = localStorage_store;
      app.ctx = 'browser';
    }
    cb();
  },
  createId: function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  },
  addItems: function() {
    db.fetch(list.addAll);
  },
  addItem: function(body) {
    var o = {
      body: body,
      id: app.createId()
    };
    db.add(o, list.addOne);
  },
  removeItem: function(el, id) {
    db.remove(el, id, list.remove);
  },
  updateItem: function(el, body, id) {
    db.update(el, body, id, list.blurInput);
  },
  history: function(arrow) {
    db.fetch(function(data){
      main.showHistory(arrow, data);
    });
  },
  filter: function(filterString) {
    list.empty();
    tag.render(filterString);
    main.reset();
    db.fetch(function(data){
      if (filterString && data.length > 0) {
        data = data.filter(function(o){
          return new RegExp(filterString.substr(1), 'i').test(o.body);
        });
      }
      list.addAll(data);
    });
  },
  cmd_url: function(body, cb) {
    var url;
    if (this.ctx === 'chrome ext') {
      chrome.tabs.query({'active':true, 'lastFocusedWindow':true}, function(tabs) {
        url = tabs[0].url;
        cb(url);
      });
    } else { // browser
      url = window.location.href;
      cb(url);
    }
    main.reset();
  },
  cmd_export: function() {
    db.fetch(function(data){
      if (data.length > 0) {
        data = data.map(function(o){
          return o.body + '\n';
        }).reverse();
        var d = new Date(),
            str = d.toJSON(),
            header = 'Monday ' + app.v + ' Export ' + str + '\n';
        data.unshift(header);
        data = data.join('');
        window.prompt("Copy to clipboard", data);
        main.reset();
      }
    });
  },
  cmd_drop: function() {
    var flag = window.confirm("Delete all data?");
    if (flag) {
      db.drop(function(){
        list.empty();
        main.reset();
        main.focus();
      });
    } else {
      main.reset();
    }
  }
};

// init
$(function(){
  app.init();

  // EVENT - events on main input
  $('#main').on('keyup', function(e){
    if (e.which === 38) {
      app.history('up');
      return;
    }
    if (e.which === 40) {
      app.history('down');
      return;
    }
    if (e.which === 13) {
      main.historyIndex = 0;
      var body = $(this).val().trim();

      if (/^\$url$/.test(body)) {
        app.cmd_url(body, function(data){
          app.addItem(data);
        });
        return;
      }
      if (/^\$export$/.test(body)) {
        app.cmd_export();
        return;
      }
      if (/^\$drop$/.test(body)) {
        app.cmd_drop();
        return;
      }
      if (/^#.+/.test(body) && !/\s/.test(body)) {
        app.filter(body);
        return;
      }
      if (/^!#$/.test(body)) {
        app.filter('');
        return;
      }
      if (body) {
        app.addItem(body);
        main.reset();
      }
    }
  });

  // EVENT - edit item in list
  $('.list').on('keyup', 'input', function(e){
    if (e.which === 13) {
      var body = $(this).val().trim(),
          id = $(this).data('id');

      if (body.toLowerCase() === 'done' || !body) {
        app.removeItem(this, id);
      } else {
        app.updateItem(this, body, id);
      }
      main.focus();
    }
  });
});
