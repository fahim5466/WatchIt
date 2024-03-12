#!/usr/bin/env node

const debounce = require('lodash.debounce');
const chokidar = require('chokidar');
const program = require('caporal');
const fs = require('fs');
const { spawn } = require('child_process');
const chalk = require('chalk');

program.version('0.0.1')
       .argument('[filename]', 'Name of the file to execute')
       .action(async ({filename}) => {
            filename = filename || 'index.js';
            try{
                // Check if file exists and can be accessed.
                await fs.promises.access(filename);
            }catch(err){
                throw new Error(`Could not access file ${filename}`);
            }

            let spawnedProcess;
            const start = debounce(() => {
                if(spawnedProcess){
                    spawnedProcess.kill();
                }
                console.log(chalk.green('>>> Starting process...'));
                spawnedProcess = spawn('node', [filename], { stdio: 'inherit' });
            }, 100);
            
            chokidar.watch('.')
                    .on('add', start)
                    .on('change', start)
                    .on('unlink', start);
       });
program.parse(process.argv);