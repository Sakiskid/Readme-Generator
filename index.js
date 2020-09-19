const fs = require("fs");
const inquirer = require('inquirer');
const util = require('util');
const consts = require('./consts');
const prompts = require("./prompts");

const writeFileAsync = util.promisify(fs.writeFile);
const appendFileAsync = util.promisify(fs.appendFile);

async function startPrompt() {
    let optionsSections = [];

    await inquirer
        .prompt([
            {
                name: "sectionsPrimary",
                type: "checkbox",
                message: "What sections would you like to include in your README?",
                choices: [
                    consts.imageName, consts.linkName, consts.updatedDateName, consts.tableOfContentsName
                ]
            },
            {
                name: "sectionsSecondary",
                type: "checkbox",
                message: "Sections continued...",
                choices: [
                    consts.installationName, consts.usageName, consts.currentFeaturesName, consts.plannedFeaturesName
                ]
            },
            {
                name: "sectionsTertiary",
                type: "checkbox",
                message: "Sections continued...",
                choices: [
                    consts.liscenseName, consts.contributingName, consts.testsName, consts.questionsName
                ]
            }
        ])
        .then( (answers) => {
            // Put all of the answers together
            for (let answer in answers) {
                optionsSections = optionsSections.concat(answers[answer]);
            }
        })
        .then( () => {
            handleSectionCreation(optionsSections)
        })
        .catch ((err) => {
            console.error("ERROR! || ", err);
        }) 
}

async function handleSectionCreation(sections){
    let formattedSectionsToDisplay = [];

    for(sectionName in sections) {
        let thisSectionName = sections[sectionName];
        let thisSectionFormatted = "";

        switch(thisSectionName) {
            case consts.imageName:
                await prompts.image()
                .then((answers) => {
                    thisSectionFormatted = consts.getImageFormat(answers.imageURL, answers.imageAlt);
                })
                break;
            case consts.linkName:
                await prompts.deployedLink()
                .then((answers) => {
                    thisSectionFormatted = consts.getDeployedLinkFormat(answers.deployedLink);
                })
                break;
            case consts.imageName:
                break;
            case consts.imageName:
                break;
            case consts.imageName:
                break;
            case consts.imageName:
                break;
            case consts.imageName:
                break;
            case consts.imageName:
                break;
            case consts.imageName:
                break;
            case consts.imageName:
                break;
        }

        formattedSectionsToDisplay.push(thisSectionFormatted);
    }

    writeToFile(formattedSectionsToDisplay);
}

function writeToFile(formattedSectionsToDisplay) {
    // Clear file
    writeFileAsync("./README.md", "");

    for (formattedSection in formattedSectionsToDisplay) {
        appendFileAsync("./README.md", formattedSectionsToDisplay[formattedSection]);
    };
}

startPrompt();