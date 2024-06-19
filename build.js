const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return reject(error);
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return reject(new Error(stderr));
      }
      console.log(`stdout: ${stdout}`);
      resolve(stdout);
    });
  });
}

async function build() {
  try {
    const srcDir = './src';
    const distDir = './dist';

    // Create the dist directory if it doesn't exist
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir);
    }

    // Get all files in the src directory
    const files = fs.readdirSync(srcDir);

    for (const file of files) {
      const fileExtension = path.extname(file);
      const srcFilePath = path.join(srcDir, file);

      if (fileExtension === '.ts' || fileExtension === '.js') {
        console.log(`Building ${srcFilePath} to ${distDir}...`);
        await runCommand(`bun build ${srcFilePath} --outdir ${distDir}`);
        console.log(`Successfully built ${srcFilePath}`);
      } else {
        console.log(`Copying ${srcFilePath} to ${distDir}...`);
        fs.copyFileSync(srcFilePath, path.join(distDir, file));
        console.log(`Successfully copied ${srcFilePath}`);
      }
    }
  } catch (error) {
    console.error('Build process failed:', error);
  }
}

build();
