var inquirer = require('inquirer');
var Mocha = require('mocha');
var fs = require('fs');
var habitat = require('habitat');
var config = require('./config');
var deploy = require('./build/deploy');

var validRegions = ['us-east-1', 'us-west-2', 'us-west-1', 'eu-west-1', 'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1', 'sa-east-1'];

var mocha = new Mocha({repoter: 'spec'});
mocha.addFile('test/environment.js');

config.load();

var questions = [
    {
        type: 'input',
        name: 'REGION',
        message: 'What region is your AWS bucket? e.g. us-east-1',
        validate: function (val) {
            return validRegions.indexOf(val) > -1 || 'Please enter a valid region, e.g. us-east-1, us-west-2';
        }
    },
    {
        type: 'input',
        name: 'BUCKET',
        message: 'What is the name of your bucket?'
    },
    {
        type: 'input',
        name: 'ACCESS_KEY_ID',
        message: 'What is your ACCESS_KEY_ID?'
    },
    {
        type: 'input',
        name: 'SECRET_ACCESS_KEY',
        message: 'What is your SECRET_ACCESS_KEY?'
    },
    {
        type: 'input',
        name: 'PUBLISH_URL',
        message: 'What is the URL root of your s3 bucket?'
    },
    {
        type: 'input',
        name: 'MAKEDRIVE_ENDPOINT_WITH_AUTH',
        message: 'What is the endpoint for makedrive?'
    }
].map(function (question) {
    question.default = habitat.get(question.name) || question.default;
    return question;
});

function runTests() {
    mocha.run(function (errCount) {
        if (errCount) {
           return console.log('Hm, looks like your configuration has some errors. Check your keys and do npm run config again when you\'re ready');
        }
        inquirer.prompt({
            type: 'confirm',
            name: 'deploy',
            message: 'Do you want to intialize your bucket (You should do this when updating the "webmaker" dependency)?',
            default: true
        }, function (answer) {
            if (!answer.deploy) {
                return console.log('Ok! Your configuration is all set.');
            }
            deploy(function (err) {
                if (err) throw err;
                console.log('Hurray! Your upload is done.');
            });
        });
    });
}

function runConfigure(overwrite) {
    inquirer.prompt(questions, function (answers) {
        var envString = '';
        for (var key in answers) {
            envString += key + '=' + answers[key] + '\n';
        }
        function writeFile(str) {
            fs.writeFile('.env', str, function (err) {
                if (err) throw err;
                runTests();
            });
        }
        if (overwrite) {
            writeFile(envString);
        } else {
            fs.readFile('.env', {encoding: 'utf8'}, function (err, data) {
                if (err) throw err;
                data = data + '\n' + envString;
                writeFile(data);
            });
        }
    });
}

fs.stat('.env', function (err, data) {
    if (err && err.code === 'ENOENT'){
        runConfigure(true);
    }
    else if (data) {
        inquirer.prompt({
            type: 'confirm',
            name: 'which',
            message: 'You already have a .env file - do you want to overwrite it?',
            default: false
        }, function (answer) {
            runConfigure(answer.which);
        });
    }
    else {
        throw err;
    }
});
