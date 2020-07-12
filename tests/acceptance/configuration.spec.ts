import 'reflect-metadata'
import {Autofixture} from 'ts-autofixture/dist/src'
import fs from 'fs'
import {mocked} from 'ts-jest/utils'
import {App, appContainer} from '../../src/app'
import registerDependencies from '../../src/registerDependencies'

jest.mock('fs')
const mockedFileSystem = mocked(fs, true)

describe('Configuration', () => {
    const fixture = new Autofixture()

    beforeEach(() => {
        const exampleWebsite = {url: '', alias: ''}
        const exampleConfiguration = {websites: exampleWebsite}
        const configuration = fixture.create(exampleConfiguration)
        mockedFileSystem.readFileSync.mockReturnValue(JSON.stringify(configuration))

        appContainer.reset()
        registerDependencies(appContainer)

        appContainer.register('fileSystem', {useValue: mockedFileSystem})
    })

    it('Reports an error when a configuration file isn\'t found or specified', () => {
        mockedFileSystem.existsSync.mockReturnValue(false)

        expect(() => appContainer.resolve(App))
            .toThrowError('Configuration file has not been found or specified.')
    })

    it('Loads \'config.json\'', () => {
        // mockedFileSystem.existsSync.mockReturnValue(true)
        // appContainer.resolve(App)

        // expect(fs.readFileSync).toHaveBeenCalledWith('./config.json')
    })

    it('Loads configuration from a filename specified in the arguments', () => {
        // const expectedFileName = fixture.create({value: ''}).value

        // mockedFileSystem.existsSync.mockReturnValue(true)
        // appContainer.register('argv', {useValue: ['ignored', 'ignored', expectedFileName]})

        // appContainer.resolve(App)

        // expect(mockedFileSystem.readFileSync).toHaveBeenCalledWith(expectedFileName)
    })
})
