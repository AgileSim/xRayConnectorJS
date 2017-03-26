'use strict';

const url = require('url');
const request = require('request');
const fs = require('fs');

let getTestImportOptions = function(jiraUrl, username, password) {
  return {
    "url": jiraUrl,
    "method": 'POST',
    "headers": {
      'Authorization': "Basic " + new Buffer(username + ":" + password).toString("base64"),
      'Content-Type': 'application/json'
    }
  }
};

module.exports = function (jiraUrl, report, username, password) {

  if(jiraUrl.endsWith('/')) {
    jiraUrl = jiraUrl + 'rest/raven/1.0/import/execution/cucumber';
  } else {
    jiraUrl = jiraUrl + '/rest/raven/1.0/import/execution/cucumber';
  }

  let options = getTestImportOptions(jiraUrl, username, password);

  log.debug("Importing test results... ");
  log.debug("Url " + jiraUrl);
  log.debug("Report: " + report);
  log.debug("User: " + username);

  fs.readFile(report, (err, reportData) => {
    if(err) {
      throw "Error importing test results. Can not read report.";
      exit(1);
    } else {
      options.body = reportData;
      request(options)
        .on('error', e => { log.error("Error uploading test results: " + e);})
        .on('response', (res) => {
          log.info(`Test result imported with status: <${res.statusCode}>.`);
        })
    }
  })
};


