const os = require("os");

const { name } = require("./package.json");

const downloadReleases = require('download-github-release');
const { platform } = require('node:os');


const supportedPlatforms = [
  {
    TYPE: "Linux",
    TARGET: "linux-amd64"
  }
];

const getPlatform = () => {
  const type = os.type();
  const architecture = os.arch();

  for (let index in supportedPlatforms) {
    let supportedPlatform = supportedPlatforms[index];
    if (
      type === supportedPlatform.TYPE
    ) {
      return supportedPlatform.TARGET;
    }
  }

  error(
    `Platform with type "${type}" and architecture "${architecture}" is not supported by ${name}.\nYour system must be one of the following:\n\n${cTable.getTable(
      supportedPlatforms
    )}`
  );
};

function filterRelease(release) {
    return release.name == "0.1.0";
}
  
const binaryName = getPlatform()
function filterAsset(asset) {
    console.log(asset.name)
    return asset.name.indexOf(binaryName) >= 0;
}

var user = 'gefyrahq';
var repo = 'gefyra-ext';
var outputdir = __dirname;

downloadReleases(user, repo, outputdir, filterRelease, filterAsset, false)
  .then(function() {
    console.log('All done!');
  })
  .catch(function(err) {
    console.error(err.message);
  });