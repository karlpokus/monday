function id() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
}

var store = { // items: [{id, body}, {}..]
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
        item.add(o);
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

var item = {
  el: '.list',
  add: function(o) {
    var el = $('<input/>')
      .prop({type: 'text', value: o.body})
      .data('id', o.id);
    $(this.el).prepend(el);
  },
  remove: function(el) {
    $(el).remove();
  }
};

// init
$(function(){
  store.all();
  $('#main').focus();

  // EVENT - add sticky
  $('#main').on('keyup', function(e){
    if (e.which === 13) {
      var body = $(this).val().trim();
      if (body) {
        var o = {
          body: body,
          id: id()
        };
        item.add(o);
        store.add(o);
      }
      $(this).val('');
    }
  });

  // EVENT - edit sticky
  $('.list').on('keyup', 'input', function(e){
    if (e.which === 13) {
      var body = $(this).val().trim(),
          id = $(this).data('id');
      if (body.toLowerCase() === 'done' || !body) {
        item.remove(this);
        store.remove(id);
      } else {
        store.update(body, id);
        $(this).blur();
      }
      $('#main').focus();
    }
  });
});
