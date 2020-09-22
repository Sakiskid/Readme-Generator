const inquirer = require('inquirer');
const Choices = require('inquirer/lib/objects/choices');
const style = require('./styling');
inquirer.registerPrompt('selectLine', require('inquirer-select-line'));

//////////////////////////
// ANCHOR Prompt Questions
//////////////////////////

const confirmQuestion = {
    type: "confirm", 
    name: "confirm",
    message: style.confirm("Is this correct? "),
    default: true
}

const imageQuestions = [
    {
        name: "Image URL",
        message: style.textQuestion("Please input the URL or path of your display image: \n")
    },
    {
        name: "Image Alt",
        message: style.textQuestion("Please input alt text for your image: ")
    }
]

const deployedLinkQuestions = [
    {
        name: "Deployed Link",
        message: style.textQuestion("Please input the URL of your deployed application: ")
    }
]

const lastUpdatedDateQuestions = [
    {
        name: "Updated Date",
        message: style.textQuestion("Please input the date this project was last updated: ")
    }
]

const installationQuestions = [
    {
        name: "Installation Main",
        type: "list",
        message: style.textQuestion("Installation Instructions: "),
        choices: [
            {
                name: "ADD NEW",
                value: "new"
            },
            {
                name: "FINISH",
                value: "done"
            }
        ]
    },
    {
        name: "Installation New Line",
        type: "input",
        message: "Input new instruction: \n",
        when: (answers) => { // If the installation main value is new...
            if (answers["Installation Main"] === "new") {
                return true;
            } else return false;
        }
    },
    {
        name: "Edit Instruction",
        type: "list",
        message: "How would you like to edit this line?",
        when: (answers) => { // If the user chose to edit a line...
            if (answers["Installation Main"] !== "done" && answers["Installation Main"] !== "new") {
                return true;
            } else return false;
        },
        choices: [
            {
                name: "Cancel",
                value: "cancel",
            },
            {
                name: "Edit Text",
                value: "text",
            },
            {
                name: "Change order",
                value: "order",
            },
            {
                name: "Delete",
                value: "delete",
            },
        ]
    },
    {
        name: "Edit - Text",
        type: "input",
        message: "Please change text: ",
        when: (answers) => { if (answers["Edit Instruction"] === "text") return true; }
    },
    {
        name: "Edit - Order",
        type: "selectLine",
        message: "Please change order: ",
        when: (answers) => { if (answers["Edit Instruction"] === "order") return true; },
        choices: () => {
            let choices = installationQuestions[0].choices;
            let validChoices = choices.map(object => object.name);
            validChoices = validChoices.slice(1, choices.length - 1);
            console.log("SelectLine valid choices: ", validChoices);
            return validChoices;
        },
    },
    {
        name: "Edit - Delete",
        type: "confirm",
        message: style.confirm("Are you sure you want to delete this line?"),
        when: (answers) => { if (answers["Edit Instruction"] === "delete") return true; }
    },
]

const usageQuestions = [
    {
        name: "Usage",
        message: style.textQuestion("Please input usage information: ")
    }
]

const currentFeaturesQuestions = []

const plannedFeaturesQuestions = []

const liscenseQuestions = []

const contributingQuestions = []

const testsQuestions = []

const contactQuestions = []


/* NOTE: efficiency/readability upgrade!
-- Reduced EACH prompt code from 10+ lines to 1(!!) line of code each -- without sacrificing readability.

- You can see this in the exports for these prompts.

- Before I reworked this, each prompt was it's own async function, taking up 8 lines of code...
I decided to take a risk in the complexity of my knowledge to make my code more DRY (scary!)

- For the rework, I created a new constructor (Prompt), that takes in questions and desired format.
now, the getFormat functions take in arguments and return the desired function using rest operators! :D
All that I need to do in index.js is call this new object and start the prompt!
Awesome!!! :D
*/

//////////////////////////
// ANCHOR Prompt Formats
//////////////////////////

const br1 = "\n";
const br2 = "\n\n";

const getImageFormat = (...args) => {
    let imageAlt = args[0]["Image URL"];
    let imageURL = args[0]["Image Alt"];
    return `![${imageAlt}](${imageURL})` + br2;
}

const getDeployedLinkFormat = (...args) => {
    let deployedLink = args[0]["Deployed Link"];
    return `### [Click here to launch this application](${deployedLink})` + br2;
}

const getLastUpdatedDateFormat = (...args) => {
    let lastUpdatedDate = args[0]["Updated Date"];
    return `### **Last Updated**: ${lastUpdatedDate}` + br1;
}

const getInstallationFormat = (...args) => {
    // TODO add installation format
}

const getUsageFormat = (...args) => {
    let usage = args[0]["Usage"];
    return `## **Usage**: ${usage}` + br1;
}

const getCurrentFeaturesFormat = (...args) => {
    
}

const getPlannedFeaturesFormat = (...args) => {

}

const getLiscenseFormat = (...args) => {
    
}

const getContributingFormat = (...args) => {
    
}

const getTestsFormat = (...args) => {
    
}

const getContactFormat = (...args) => {
    
}

//////////////////////////
// ANCHOR Prompt Functions
//////////////////////////

async function installationPrompt() {
    // FIXME ordering & text editing... it's a mess
    let answers = await inquirer.prompt(installationQuestions) // Start prompt
    let installationMainAnswer = answers["Installation Main"];
    let choices = installationQuestions[0].choices;
    
    // If the user chose to add a new line:
    if(answers["Installation New Line"]) { 
        let newLineName = answers["Installation New Line"];
        let newLine = {
            name: newLineName,
            value: newLineName,
        }
        choices.splice(choices.length - 1, 0, newLine);
        addOrderNumbers();
        await installationPrompt();
    }

    if(installationMainAnswer) {}

    if(answers["Edit Instruction"]) {
        if(answers["Edit Instruction"] === "cancel") {
            console.info("Canceled.");
        }
        if(answers["Edit Instruction"] === "delete") {
            if(answers["Edit - Delete"] === true) { choices.splice(installationMainAnswer, 1); }
            addOrderNumbers();
        }
        if(answers["Edit Instruction"] === "order") {
            let validChoices = answers["Edit - Order"]; // This is the valid choices from the order question, not including the "new" and "finish" options
            let instruction = choices.splice(installationMainAnswer, 1);
            choices.splice(answers["Edit - Order"] + 1, 0, instruction[0]);
            console.log(`Order info... instruction ${instruction[0]} || edit - order answer + 1: ${answers["Edit - Order"] + 1}`)
            addOrderNumbers();
        }
        if(answers["Edit Instruction"] === "text") {
            let newText = answers["Edit - Text"];
            let choice = choices.find(element => {
                if (element["value"] == installationMainAnswer) {
                    return element;
                }
                console.log(element);
            })
            // console.log(choices[0]);
            // console.log("choices: ", choices);
            // console.log(installationMainAnswer);
            choice["name"] = newText;
            addOrderNumbers();
        }
        await installationPrompt();
    }

    function addOrderNumbers() {
        let validChoices = choices.slice(1, choices.length - 1);
        let i = 1;
        for(choice in validChoices) {
            let value = validChoices[choice]["value"];
            validChoices[choice]["name"] = `${i}. ${value}`;
            i++;
        }
    }
}

function Prompt(questions, format) {
    this.questions = questions;
    this.format = format;
    this.startPrompt = async function () {
        let answers = await inquirer.prompt(questions);
        confirmPrompt(answers);
    }
}

async function confirmPrompt(answers) {
        // Get the confirm answer, check if it's right!. Restart if confirm is false!
        for (answer in answers) {
            console.info(answer + ": " + answers[answer]);
        }
        let confirmObject = await inquirer.prompt(confirmPrompt);
        if(confirmObject.confirm) {
            return this.format(answers);
        } else {
            return this.startPrompt();
        }
}

// Prompt Exports

exports.image = new Prompt(imageQuestions, getImageFormat);
exports.deployedLink = new Prompt(deployedLinkQuestions, getDeployedLinkFormat);
exports.lastUpdatedDate = new Prompt(lastUpdatedDateQuestions, getLastUpdatedDateFormat);
exports.usage = new Prompt(usageQuestions, getUsageFormat);
// exports.currentFeatures = 
exports.plannedFeatures = 
exports.liscense = 
exports.contributing = 
exports.tests = 
exports.contact = 

// Special Case Prompt Exports

let installation = new Prompt(installationQuestions, getInstallationFormat);
installation.startPrompt = async function () { await installationPrompt(); }
exports.installation = installation;