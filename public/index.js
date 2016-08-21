var list = {
  el: '.list',
  newItem: function(o) {
    return $('<input/>')
      .prop({type: 'text', value: o.body})
      .data('id', o.id);
  },
  newId: function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  },
  add: function(o) {
    var el = this.newItem(o);
    $(this.el).prepend(el);
  },
  remove: function(el) {
    $(el).remove();
  }
};

// init
$(function(){
  db.all();
  $('#main').focus();

  // EVENT - add sticky
  $('#main').on('keyup', function(e){
    if (e.which === 13) {
      var body = $(this).val().trim();
      if (body) {
        var o = {
          body: body,
          id: list.newId()
        };
        list.add(o);
        db.add(o);
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
        list.remove(this);
        db.remove(id);
      } else {
        db.update(body, id);
        $(this).blur();
      }
      $('#main').focus();
    }
  });
});
