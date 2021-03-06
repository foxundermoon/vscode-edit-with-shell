
const ShellCommandService = require('../../lib/shell-command-service');

describe('ShellCommandService', () => {

    it('Runs a given command and collects the command output', () => {
        const childProcess = {
            spawn: sinon.stub().returns('COMMAND')
        };
        const processRunner = {
            run: sinon.stub().returns(Promise.resolve('COMMAND_OUTPUT'))
        };
        const shellCommandExecContext = {
            env: {SOME_ENV_VAR: '...'},
            getCwd: stubWithArgs(['FILE_PATH'], 'COMMAND_EXEC_DIR')
        };

        const service = new ShellCommandService({childProcess, processRunner, shellCommandExecContext});
        const params = {
            command: 'COMMAND_STRING',
            input: 'SELECTED_TEXT',
            filePath: 'FILE_PATH'
        };
        return service.runCommand(params).then(output => {
            expect(output).to.eql('COMMAND_OUTPUT');
            expect(childProcess.spawn).to.have.been.calledWith(
                'COMMAND_STRING',
                {
                    cwd: 'COMMAND_EXEC_DIR',
                    env: {SOME_ENV_VAR: '...'},
                    shell: true
                }
            );
            expect(processRunner.run).to.have.been.calledWith('COMMAND', 'SELECTED_TEXT');
        });
    });

    it('does not give an input to the command if no text is selected in the editor', () => {
        const childProcess = {
            spawn: sinon.stub().returns('COMMAND')
        };
        const processRunner = {
            run: sinon.stub().returns(Promise.resolve('COMMAND_OUTPUT'))
        };
        const shellCommandExecContext = {
            env: {SOME_ENV_VAR: '...'},
            getCwd: stubWithArgs(['FILE_PATH'], 'COMMAND_EXEC_DIR')
        };

        const service = new ShellCommandService({childProcess, processRunner, shellCommandExecContext});
        const params = {
            command: 'COMMAND_STRING',
            filePath: 'FILE_PATH'
        };
        return service.runCommand(params).then(output => {
            expect(output).to.eql('COMMAND_OUTPUT');
            expect(childProcess.spawn).to.have.been.calledWith(
                'COMMAND_STRING',
                {
                    cwd: 'COMMAND_EXEC_DIR',
                    env: {SOME_ENV_VAR: '...'},
                    shell: true
                }
            );
            expect(processRunner.run).to.have.been.calledWith('COMMAND');
        });
    });

    it('throws an error if command failed', () => {
        const childProcess = {
            spawn: sinon.stub().returns('COMMAND')
        };
        const processRunner = {
            run: sinon.stub().returns(Promise.reject(new Error('UNEXPECTED_ERROR')))
        };
        const shellCommandExecContext = {
            env: {SOME_ENV_VAR: '...'},
            getCwd: stubWithArgs(['FILE_PATH'], 'COMMAND_EXEC_DIR')
        };

        const service = new ShellCommandService({childProcess, processRunner, shellCommandExecContext});
        const params = {
            command: 'COMMAND_STRING',
            filePath: 'FILE_PATH'
        };
        return service.runCommand(params).then(
            throwError,
            e => {
                expect(e).to.be.an('error');
                expect(e.message).to.eql('UNEXPECTED_ERROR');
            }
        );
    });

});
