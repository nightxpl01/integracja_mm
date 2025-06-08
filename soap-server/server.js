const soap = require('soap');
const express = require('express');
const fs = require('fs');
const translatorService = require('./services/translatorService');

const app = express();
const wsdl = fs.readFileSync('./translator.wsdl', 'utf8');

app.listen(8001, () => {
  const wsdlPath = '/translator';
  soap.listen(app, wsdlPath, translatorService, wsdl);
  console.log(`SOAP TranslatorService running at http://localhost:8001${wsdlPath}?wsdl`);
});
