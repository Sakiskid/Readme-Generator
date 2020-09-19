exports.imageName = "Image";
exports.linkName = "Deployed Link";
exports.updatedDateName = "Last Updated Date";
exports.tableOfContentsName = "Table of Contents";
exports.installationName = "Installation";
exports.usageName = "Usage";
exports.currentFeaturesName = "Current Features";
exports.plannedFeaturesName = "Planned Features";
exports.liscenseName = "Liscense";
exports.contributingName = "Contributing";
exports.testsName = "Tests";
exports.questionsName = "Questions";

exports.getImageFormat = (imageURL, imageAlt) => {
    return `![${imageAlt}](${imageURL})`;
}

exports.getDeployedLinkFormat = (deployedLink) => {
    return  `### [Deployed Link](${deployedLink})`;
}