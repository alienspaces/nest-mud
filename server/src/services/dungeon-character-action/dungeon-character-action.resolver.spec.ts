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
            expectWords: string[];
        };

        const testCases: TestCase[] = [
            {
                name: 'should resolve "move north"',
                sentence: 'move north',
                expectCommand: 'move',
                expectWords: ['north'],
            },
            {
                name: 'should resolve "move"',
                sentence: 'move',
                expectCommand: 'move',
                expectWords: undefined,
            },
            {
                name: 'should resolve "look northeast"',
                sentence: 'look northeast',
                expectCommand: 'look',
                expectWords: ['northeast'],
            },
            {
                name: 'should resolve "look"',
                sentence: 'look',
                expectCommand: 'look',
                expectWords: undefined,
            },
            {
                name: 'should resolve "equip large axe"',
                sentence: 'equip large axe',
                expectCommand: 'equip',
                expectWords: ['large', 'axe'],
            },
            {
                name: 'should resolve "equip"',
                sentence: 'equip',
                expectCommand: 'equip',
                expectWords: undefined,
            },
            {
                name: 'should resolve "stash green mermaid brain"',
                sentence: 'stash green mermaid brain',
                expectCommand: 'stash',
                expectWords: ['large', 'axe'],
            },
            {
                name: 'should resolve "stash"',
                sentence: 'stash',
                expectCommand: 'stash',
                expectWords: undefined,
            },
            {
                name: 'should not resolve "scratch head"',
                sentence: 'scratch head',
                expectCommand: undefined,
                expectWords: undefined,
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
                expect(resolverSentence.words).toEqual(testCase.expectWords);
            });
        });
    });
});
