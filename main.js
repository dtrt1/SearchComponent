
$(function() {

  var containers = $('.search-container');

  containers.each(function(index, container) {
    new SearchComponent({
      el: $(container),
      ajaxURL: 'http://super‑analytics.com',
      index: index
    });
  });

});
