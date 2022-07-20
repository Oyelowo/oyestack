import chalk from 'chalk';
import inquirer from 'inquirer';

export async function promptSecretsDeletionConfirmations() {
    const deletePlainSecretsInput = 'deletePlainSecretsInput';
    const deleteUnsealedSecretManifestsOutput = 'deleteUnsealedSecretManifestsOutput';
    type Key = typeof deletePlainSecretsInput | typeof deleteUnsealedSecretManifestsOutput;
    const answers = await inquirer.prompt<Record<Key, boolean>>([
        {
            type: 'confirm',
            name: deletePlainSecretsInput,
            message: chalk.greenBright(
                '🆘Do you want to delete the plain secrets used for generating the sealed secrets? ‼️‼️‼️‼️'
            ),
            default: false,
        },
        {
            type: 'confirm',
            name: deleteUnsealedSecretManifestsOutput,
            message: chalk.greenBright(
                `🆘Do you want to delete the kubernetes secrets manifests generated?
        Note: These should never be pushed to git ‼️‼️‼️‼️`
            ),
            default: true,
        },
    ]);

    return answers;
}
