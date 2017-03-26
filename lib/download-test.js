'use strict';

const url = require('url');
const request = require('request');
const unzip = require('unzip');


let getExportOptions = function(_url, username, password) {
  return {
    "url": url.parse(_url),
    "method": 'GET',
    "headers": {
      'Authorization': "Basic " + new Buffer(username + ":" + password).toString("base64")
    }
  }
};


module.exports = function (jiraUrl, username, password, keys, filter, target) {

  if(!jiraUrl.endsWith('/')) {
    jiraUrl = jiraUrl + '/';
  }
  if(keys) {
    jiraUrl = jiraUrl + `rest/raven/1.0/export/test?keys=${keys.toString().replace(',',';')}&fz=true`;
  } else if(filter) {
    jiraUrl  = jiraUrl + `rest/raven/1.0/export/test?filter=${filter}&fz=true`;
  } else {
    throw "Selection critera unknown.";
  }

  let options = getExportOptions(jiraUrl, username, password);


  log.debug("Downloading feature from: " + jiraUrl);
  log.debug("Username: " + username);

  request(options)
    .on('error', e => { reject(e)})
    .pipe(unzip.Extract({ path: target }))
    .on('close', () => {
      log.info("Jira features exported successfully.");
    })
    .on('error', (desc) => {
      log.error("Error downloading features: " + desc);
  })
};

