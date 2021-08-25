// Application
import { DungeonCharacterActionResolver } from './dungeon-character-action.resolver';

describe('DungeonCharacterActionResolver', () => {
    let resolver: DungeonCharacterActionResolver;

    beforeEach(async () => {
        resolver = new DungeonCharacterActionResolver();
    });

    describe('resolveCommand', () => {
        type TestCase = {
            name: string;
            sentence: string;
            expectCommand: string;
            expectSentence: string;
        };

        const testCases: TestCase[] = [
            {
                name: 'should resolve "move north"',
                sentence: 'move north',
                expectCommand: 'move',
                expectSentence: 'north',
            },
            {
                name: 'should resolve "move"',
                sentence: 'move',
                expectCommand: 'move',
                expectSentence: undefined,
            },
            {
                name: 'should resolve "look northeast"',
                sentence: 'look northeast',
                expectCommand: 'look',
                expectSentence: 'northeast',
            },
            {
                name: 'should resolve "look"',
                sentence: 'look',
                expectCommand: 'look',
                expectSentence: undefined,
            },
            {
                name: 'should resolve "equip large axe"',
                sentence: 'equip large axe',
                expectCommand: 'equip',
                expectSentence: 'large axe',
            },
            {
                name: 'should resolve "equip"',
                sentence: 'equip',
                expectCommand: 'equip',
                expectSentence: undefined,
            },
            {
                name: 'should resolve "stash green mermaid brain"',
                sentence: 'stash green mermaid brain',
                expectCommand: 'stash',
                expectSentence: 'green mermaid brain',
            },
            {
                name: 'should resolve "stash"',
                sentence: 'stash',
                expectCommand: 'stash',
                expectSentence: undefined,
            },
            {
                name: 'should not resolve "scratch head"',
                sentence: 'scratch head',
                expectCommand: undefined,
                expectSentence: undefined,
            },
        ];

        testCases.forEach((testCase) => {
            it(testCase.name, () => {
                const resolverSentence = resolver.resolveCommand(
                    testCase.sentence,
                );
                expect(resolverSentence.command).toEqual(
                    testCase.expectCommand,
                );
                expect(resolverSentence.sentence).toEqual(
                    testCase.expectSentence,
                );
            });
        });
    });
});
