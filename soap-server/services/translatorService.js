const translate = require('@vitalets/google-translate-api');

const translatorService = {
  TranslatorService: {
    TranslatorPort: {
      translate: function(args, callback) {
        // Wyciągnij tekst i język z $value
        const text = args.text && args.text.$value;
        const targetLang = args.targetLang && args.targetLang.$value;

        console.log('Parsed text:', text);
        console.log('Parsed targetLang:', targetLang);

        if (!text || !targetLang) {
          console.error('Brak wymaganych parametrów: text lub targetLang');
          return callback(null, { translatedText: '[Error translating]' });
        }

        translate(text, { to: targetLang })
          .then(res => {
            console.log('Translate result:', res.text);
            callback(null, { translatedText: res.text });
          })
          .catch(err => {
            console.error('Błąd tłumaczenia:', err);
            callback(null, { translatedText: '[Error translating]' });
          });
      }
    }
  }
};

module.exports = translatorService;
