#!/usr/bin/env node

const { Command } = require('commander');
const { spawn } = require('child_process');

const program = new Command();

program
  .name('terraform CLI')
  .description('CLI to run Terraform commands')
  .version('1.0.0');

function runTerraform(cmd, env) {
  console.log(`Running: terraform ${cmd} for environment: ${env}`);
  const envDir = `./infra/envs/${env}`; 
  const shellCommand = `cd ${envDir} && terraform ${cmd}`;

  const terraformProcess = spawn(shellCommand, {
    stdio: 'inherit',
    shell: true 
  });
  terraformProcess.on('exit', code => {
    if (code === 0) {
      console.log(`✅ terraform ${cmd} for ${env} completed successfully.`);
    } else {
      console.error(`❌ terraform ${cmd} for ${env} failed with exit code ${code}`);
      process.exit(code);
    }
  });
}

program
  .command('init')
  .description('Run terraform init')
  .requiredOption('-e, --env <environment>', 'Specify environment (required)')
  .action((options) => {
    runTerraform('init', options.env);
  });

program
  .command('plan')
  .description('Run terraform plan')
  .requiredOption('-e, --env <environment>', 'Specify environment (required)')
  .requiredOption('-t, --image-tag <tag>', 'Specify image tag (required)')
  .action((options) => {
    const cmd = `plan -var="image_tag=${options.imageTag}"`
    runTerraform(cmd, options.env);
  });

program
  .command('apply')
  .description('Run terraform apply (with optional auto-approve)')
  .requiredOption('-e, --env <environment>', 'Specify environment (required)')
  .requiredOption('-t, --image-tag <tag>', 'Specify image tag (required)')
  .option('--auto-approve', 'Enable auto-approve flag', false)
  .action((options) => {
    const cmd = options.autoApprove
      ? `apply -var="image_tag=${options.imageTag}" -auto-approve`
      : `apply -var="image_tag=${options.imageTag}"`;
    runTerraform(cmd, options.env);
  });

program
  .command('output')
  .description('Run terraform output')
  .requiredOption('-e, --env <environment>', 'Specify environment (required)')
  .action((options) => {
    runTerraform('output', options.env);
  });

program
  .command('destroy')
  .description('Run terraform destroy (with optional auto-approve)')
  .requiredOption('-e, --env <environment>', 'Specify environment (required)')
  .option('--auto-approve', 'Enable auto-approve flag', false)
  .action((options) => {
    const cmd = options.autoApprove ? 'destroy -auto-approve' : 'destroy';
    runTerraform(cmd, options.env);
  });

  program
  .command('output-all')
  .description('Run terraform output -json to get all outputs in JSON format')
  .requiredOption('-e, --env <environment>', 'Specify environment (required)')
  .action((options) => {
    runTerraform('output -json', options.env);
  });
  
program.parse(process.argv);