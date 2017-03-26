#!/usr/bin/env node
'use strict';

let fs = require('fs');
let log4js = require('log4js');
let minimist = require('minimist');
let validUrl = require('valid-url');
let downloadTest = require('./lib/download-test');
let uploadResult = require('./lib/upload-results');

global.log = log4js.getLogger();

let showUsage = function () {
  console.log("Usage:");
  console.log("  xRayConnect download-test \<jira-url\> [--keys=\<keys\>|--filterId=\<filterId\>] [--username=\<username\>] [--password=\<password\>] [--target] [-v]");
  console.log("  xRayConnect upload-result \<jira-url\> <path-to-cucumber-report-json\>  [--username=\<username\>] [--password=\<password\>] [-v]");
  console.log();
  console.log(" -h                      Shows this help");
  console.log(" --keys=\<keys\>           A String containing a list of Xray issue keys separated by \";\"");
  console.log(" --filterId=\<filterId\>   An Integer that represents the filter id");
  console.log(" --username=\<username\>   User for connecting to JIRA API");
  console.log(" --password=\<password\>   Password for connecting to JIRA API");
  console.log(" --target=\<target path\>  Target path for downloading features");
  console.log()
  console.log();

};

let main = function main(options) {

  let command = options._[0];
  let jiraUrl = options._[1];
  let report = options._[2];
  let username = options.username;
  let password = options.password;

  if(validUrl.isUri(jiraUrl)) {
    let baseUrl = jiraUrl + '/rest/raven/1.0/';
    switch(command) {
      case 'download-test':
        let target = options.target  || 'features';
        downloadTest(jiraUrl, username, password, options.keys, options.filter, target);
        break;
      case 'upload-result':
        if(report.endsWith(".json") && fs.existsSync(report)) {
          uploadResult(jiraUrl, report, username, password);
        } else {
          console.log("Error. Invalid cucumber report.");
          console.log();
          showUsage();
          exit(1);
        }
        break;
      default:
        showUsage();
        exit(1);
    }
  } else {
    showUsage();
  }

};

if (require.main === module) {

  let options = minimist(process.argv.slice(2));
  if(options.v) {
    log.setLevel('DEBUG');
  } else {
    log.setLevel('ERROR');
  }
  if(options.h) {
    showUsage();
  } else {
    main(options);
  }

}