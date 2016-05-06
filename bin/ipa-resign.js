#!/usr/bin/env node
'use strict';

const Codesign = require('../');
const conf = require('minimist')(process.argv.slice(2), {
  boolean: ['replace', 'identities']
});

const options = {
  file: conf._[0] || 'undefined',
  outfile: conf.output,
  entitlement: conf.entitlement,
  bundleid: conf.bundleid,
  identity: conf.identity,
  mobileprovision: conf.mobileprovision,
  replaceipa: conf.replace
};

const cs = new Codesign(options);

if (conf.identities) {
  cs.getIdentities((err, ids) => {
    if (err) {
      cs.logError(err, ids);
    } else {
      ids.forEach((id) => {
        console.log(id.hash, id.name);
      });
    }
  });
} else if (conf.h || conf.help || conf._.length === 0) {
  const cmd = process.argv[1].split('/').pop();
  console.error(
`Usage:

  ${cmd} [--output new.ipa] [--identities] [--identity id] \\
    [--mobileprovision file] [--bundleid id] [--replace] [input-ipafile]

  --identities              List local codesign identities
  --identity 1C4D1A..       Specify hash-id of the identity to use
  --replace                 Replace the input IPA file with the resigned one
  --output [APP.IPA]        Path to the output IPA filename
  --bundleid [BUNDLEID]     Change the bundleid when repackaging
  --mobileprovision [FILE]  Specify the mobileprovision file to use
  [input-ipafile]           Path to the IPA file to resign

Example:

  ${cmd} --replace --identity AD71EB42BC289A2B9FD3C2D5C9F02D923495A23C \\
    --mobileprovision embedded.mobileprovision --bundleid com.nowsecure.TestApp ./foo.ipa
`);
} else {
  cs.signIPA((err, data) => {
    if (err) {
      cs.logError(data);
      process.exit(1);
    }
    console.log('IPA is now signed.');
  });
}
