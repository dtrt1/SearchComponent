function SearchComponent(options) {
  this.el = options.el;
  this.ajaxURL = options.ajaxURL;
  this.id = 'search_component_' + options.index;

  this.doSearch = this.doSearch.bind(this);
  this.handleChange = this.handleChange.bind(this);
  this.removeQuery = this.removeQuery.bind(this);

  this.renderSearchComponent();

  this.container = this.el.find('.container');
  this.button = this.el.find('.search-button').prop("disabled",true);
  this.input = this.el.find('.search-string');
  this.inputContainer = this.el.find('.input-container');
  this.cross = this.el.find('.delete-container');

  this.addEventListeners();
};

SearchComponent.prototype.handleChange = function() {
  var query = this.input.val();
  if (query.length) {
    this.cross.show();
    this.button.prop("disabled",false);
  } else {
    this.cross.hide();
    this.button.prop("disabled",true);
  }
  var re = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/);
  if (query.length > 3 && re.test(query)) {
    this.renderSuggestions();
  } else {
    this.removeSuggestions();
  }
};

SearchComponent.prototype.doSearch = function() {
  $.ajax({
    type: 'POST',
    url: this.ajaxURL,
    data: {
      query: this.input.val(),
      id: this.id
    }
  });
};

SearchComponent.prototype.renderSearchComponent = function() {
  var template = $('#search-template').text();
  this.el.append(template);
};

SearchComponent.prototype.removeSuggestions = function () {
  this.container.find('.suggestions-container').remove();
}

SearchComponent.prototype.renderSuggestions = function() {
  if (this.container.find('.suggestions-container').length == 0) {
    var template = $('#suggestions-template').text();
    this.container.append(template);
  }
  var parsedURL = new URL(this.input.val());

  var searchURL = 'http://super-analytics.com?suggestionType=<suggestionType>&query=<query>';

  this.container.find('.phrase-container').html(this.createLink(
    searchURL.replace('<suggestionType>', 'original').replace('<query>', this.input.val()),
    this.input.val()
  ));

  this.container.find('.domain-container').html(this.createLink(
    searchURL.replace('<suggestionType>', 'domain').replace('<query>', parsedURL.hostname),
    parsedURL.hostname
  ));

  var linkWithoutProtocol = this.input.val().replace(parsedURL.protocol, '');

  this.container.find('.url-container').html(this.createLink(
    searchURL.replace('<suggestionType>', 'href').replace('<query>', linkWithoutProtocol),
    linkWithoutProtocol
  ));
};

SearchComponent.prototype.createLink = function(link, text) {
  return $('<a href="' + link + '">' + text + '</a>');
}

SearchComponent.prototype.removeQuery = function() {
  this.input.val('');
  this.handleChange();
};

SearchComponent.prototype.addEventListeners = function() {
  this.button.click(this.doSearch);
  this.input.keyup(this.handleChange);
  this.input.change(this.handleChange);
  this.cross.click(this.removeQuery)
}