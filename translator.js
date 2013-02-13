// Generated by CoffeeScript 1.4.0
var root;

Meteor._TranslatorService = (function() {

  function _TranslatorService(locale) {
    var resolveParams, retrieveMessage,
      _this = this;
    Meteor.setLocale(locale);
    resolveParams = function(message, params) {
      var key, regexp, value;
      for (key in params) {
        value = params[key];
        regexp = new RegExp('\\{\\{' + key + '\\}\\}', 'g');
        message = message.replace(regexp, value);
      }
      return message;
    };
    retrieveMessage = function(messageId) {
      var language, message, messageParts, messages, territory, _ref;
      messageParts = messageId.split('.');
      messageId = messageParts.pop();
      messages = Meteor.i18nMessages;
      while (messageParts.length) {
        messages = messages[messageParts.shift()];
        if (!_.isObject(messages)) {
          throw Error('services.translator.missingMessageNamespace');
        }
      }
      message = messages[messageId];
      if (message == null) {
        throw Error('services.translator.missingMessage');
      }
      if (_.isString(message)) {
        return message;
      }
      locale = Session.get('_TranslatorService.locale') || '';
      _ref = locale.split('_'), language = _ref[0], territory = _ref[1];
      message = message[language];
      if (_.isString(message)) {
        return message;
      }
      if (_.isString(message != null ? message[territory] : void 0)) {
        return message[territory];
      }
      if (_.isString(message != null ? message["default"] : void 0)) {
        return message["default"];
      }
      throw Error('services.translator.unknownMessageFormat');
    };
    this.translate = function(messageId, params) {
      var errorMessage, errorMessageId, message;
      if (params == null) {
        params = {};
      }
      try {
        message = retrieveMessage(messageId);
        return resolveParams(message, params);
      } catch (translationError) {
        errorMessageId = translationError.message;
        errorMessage = (function() {
          try {
            return resolveParams(retrieveMessage(errorMessageId), {
              messageId: messageId
            });
          } catch (e) {
            return ("Translation Error: Cannot resolve error\nmessage '" + errorMessageId + "' while translating '" + messageId + "'").replace(/\n/, ' ');
          }
        })();
        console.log(errorMessage);
        return '###' + messageId + '###';
      }
    };
  }

  return _TranslatorService;

})();

Meteor.setLocale = function(locale) {
  return Session.set('_TranslatorService.locale', locale);
};

Meteor.getLocale = function(locale) {
  return Session.get('_TranslatorService.locale');
};

Meteor._TranslatorService = new Meteor._TranslatorService('en_US');

Meteor.i18nMessages = {
  services: {
    translator: {
      missingMessageNamespace: "Translation error: The message namespace of \"{{messageId}}\" cannot\nbe resolved.".replace(/\n/, ' '),
      missingMessage: "Translation error: The translation message \"{{messageId}}\" is\nmissing in its message namespace.".replace(/\n/, ' '),
      unknownMessageFormat: 'Translation error: Unknown message format for "{{messageId}}".'
    }
  }
};

root = typeof exports !== "undefined" && exports !== null ? exports : this;

root.__ = Meteor._TranslatorService.translate;
