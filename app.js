const inquirer = require('inquirer');
const generateSite = require('./utils/generate-site.js');
const generatePage = require('./src/page-template.js');
const { writeFile, copyFile } = require('./utils/generate-site.js');

// const pageHTML = generatePage(name, github);


// fs.writeFile('index.html', generatePage(name, github), err =>{
//     if(err) throw err; 

//     console.log('Portfolio Complete! Check out index.html to see the output!');
// });

const promptUser = () => {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'What is your name?(Required)',
            validate: nameInput => {
                if(nameInput){
                    return true;
                }
                else{
                    console.log('Please enter your name!!!');
                    return false;
                }
            }            
        },
        {
            type: 'input',
            name: 'github',
            message: 'Enter your GitHub Username(Required)',
            validate: gitInput => {
                if(gitInput){
                    return true;
                }
                else{
                    console.log('Please enter your GitHub Username!!!');
                    return false;
                }
            }
        },
        {
            type: 'confirm',
            name: 'confirmAbout',
            message: 'Would you like to enter some information about yourself for an "About" section?',
            default: true
        },
        {
            type: 'input',
            name: 'about',
            message: 'Provide some information about yourself:',
            when: ({ confirmAbout}) => {
                if(confirmAbout){
                    return true;
                }
                else{
                    return false;
                }
            }
        }
    ]);
};

const promptProject = portfolioData => {
    
   
    console.log(`
    =================
    Add a New Project
    =================
    `);

    // If there's no 'projects' array property, create one 
    if (!portfolioData.projects) {
        portfolioData.projects = [];
    }

        return inquirer.prompt([
            {
                type:'input',
                name: 'name',
                message: 'What is the name of your project?(Required)',
                validate: projectName => {
                    if(projectName){
                        return true;
                    }
                    else {
                        console.log('Please give your project a name!!!');
                        return false;
                    }
                }
            },
            {
                type: 'input',
                name: 'description',
                message: 'Provide a description of the project (Required)',
                validate: projectDesc => {
                    if(projectDesc){
                        return true;
                    }
                    else{
                        console.log('Please give your project a description!!!');
                        return false;
                    }
                }
            },
            {
                type: 'checkbox',
                name: 'languages',
                message: 'What did you use to build this project? (Check all that apply)',
                choices: ['Javascript', 'HTML', 'CSS', 'ES6', 'jQuery', 'Bootstrap', 'Node']
            },
            {
                type: 'input',
                name: 'link',
                message: 'Enter the Github link to your project. (Required)'
            },
            {
                type: 'confirm',
                name: 'feature',
                message: 'Would you like to feature this project?',
                default: false
            },
            {
                type: 'confirm',
                name: 'confirmAddProject',
                message: 'Would you like to add another project',
                default: false
            }
        ])
        .then(projectData => {
            portfolioData.projects.push(projectData);

            if (projectData.confirmAddProject){
                return promptProject(portfolioData);
            }
            else {
                return portfolioData;
            }
        });        
};

promptUser()
    .then(promptProject)
    .then(portfolioData => {
        return generatePage(portfolioData);
    })
    .then (pageHTML =>{
        return writeFile(pageHTML);
    })
    .then(writeFileResponse =>{
        console.log(writeFileResponse);
        return copyFile();
    })
    .then(copyFileResponse => {
        console.log(copyFileResponse);
    })
    .catch(err => {
        console.log(err);
    });
