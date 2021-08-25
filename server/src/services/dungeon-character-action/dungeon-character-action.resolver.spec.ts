import * as faker from 'faker';

// Application
import {
    DungeonCharacterActionResolver,
    ResolverRecords,
} from './dungeon-character-action.resolver';
import {
    DungeonCharacterRepositoryRecord,
    DungeonLocationRepositoryRecord,
    DungeonMonsterRepositoryRecord,
    DungeonObjectRepositoryRecord,
    DungeonCharacterActionRepositoryRecord,
} from '@/repositories';

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

    describe('resolveMoveAction', () => {
        type TestCase = {
            name: string;
            sentence: string;
            records: ResolverRecords;
            expectDungeonCharacterActionRecord: DungeonCharacterActionRepositoryRecord;
        };

        const testCases: TestCase[] = [
            {
                name: 'should resolve "north" with "move north"',
                sentence: 'north',
                records: {
                    character: {
                        id: 'ef052d03-c8a5-4d86-b1c5-253ca29d99b9',
                        name: faker.name.firstName(),
                        dungeon_id: '6f8b385c-5cae-44a6-bb2f-76d30b660788',
                        dungeon_location_id:
                            'fb696f4a-fb81-4d6a-a3ef-e6cb8ea3ea47',
                    },
                    location: {
                        id: 'fb696f4a-fb81-4d6a-a3ef-e6cb8ea3ea47',
                        dungeon_id: '6f8b385c-5cae-44a6-bb2f-76d30b660788',
                        name: 'Dark Room',
                        description: faker.lorem.sentence(),
                        north_dungeon_location_id:
                            'ced19f54-8a73-4d33-90ed-b92ea30407bd',
                    },
                },
                expectDungeonCharacterActionRecord: {
                    dungeon_id: '6f8b385c-5cae-44a6-bb2f-76d30b660788',
                    dungeon_location_id: 'fb696f4a-fb81-4d6a-a3ef-e6cb8ea3ea47',
                    dungeon_character_id:
                        'ef052d03-c8a5-4d86-b1c5-253ca29d99b9',
                    action: 'move north',
                    target_dungeon_location_id:
                        'ced19f54-8a73-4d33-90ed-b92ea30407bd',
                },
            },
            {
                name: 'should resolve "north and look" with "move north"',
                sentence: 'north and look',
                records: {
                    character: {
                        id: 'ef052d03-c8a5-4d86-b1c5-253ca29d99b9',
                        name: faker.name.firstName(),
                        dungeon_id: '6f8b385c-5cae-44a6-bb2f-76d30b660788',
                        dungeon_location_id:
                            'fb696f4a-fb81-4d6a-a3ef-e6cb8ea3ea47',
                    },
                    location: {
                        id: 'fb696f4a-fb81-4d6a-a3ef-e6cb8ea3ea47',
                        dungeon_id: '6f8b385c-5cae-44a6-bb2f-76d30b660788',
                        name: 'Dark Room',
                        description: faker.lorem.sentence(),
                        north_dungeon_location_id:
                            'ced19f54-8a73-4d33-90ed-b92ea30407bd',
                    },
                },
                expectDungeonCharacterActionRecord: {
                    dungeon_id: '6f8b385c-5cae-44a6-bb2f-76d30b660788',
                    dungeon_location_id: 'fb696f4a-fb81-4d6a-a3ef-e6cb8ea3ea47',
                    dungeon_character_id:
                        'ef052d03-c8a5-4d86-b1c5-253ca29d99b9',
                    action: 'move north',
                    target_dungeon_location_id:
                        'ced19f54-8a73-4d33-90ed-b92ea30407bd',
                },
            },
            {
                name: 'should not resolve "northeast" with "move north"',
                sentence: 'northeast',
                records: {
                    character: {
                        id: 'ef052d03-c8a5-4d86-b1c5-253ca29d99b9',
                        name: faker.name.firstName(),
                        dungeon_id: '6f8b385c-5cae-44a6-bb2f-76d30b660788',
                        dungeon_location_id:
                            'fb696f4a-fb81-4d6a-a3ef-e6cb8ea3ea47',
                    },
                    location: {
                        id: 'fb696f4a-fb81-4d6a-a3ef-e6cb8ea3ea47',
                        dungeon_id: '6f8b385c-5cae-44a6-bb2f-76d30b660788',
                        name: 'Dark Room',
                        description: faker.lorem.sentence(),
                        north_dungeon_location_id:
                            'ced19f54-8a73-4d33-90ed-b92ea30407bd',
                    },
                },
                expectDungeonCharacterActionRecord: {
                    dungeon_id: '6f8b385c-5cae-44a6-bb2f-76d30b660788',
                    dungeon_location_id: 'fb696f4a-fb81-4d6a-a3ef-e6cb8ea3ea47',
                    dungeon_character_id:
                        'ef052d03-c8a5-4d86-b1c5-253ca29d99b9',
                    action: undefined,
                    target_dungeon_location_id: undefined,
                },
            },
            {
                name: 'should resolve "into northeast room" with "move northeast"',
                sentence: 'into northeast room',
                records: {
                    character: {
                        id: 'ef052d03-c8a5-4d86-b1c5-253ca29d99b9',
                        name: faker.name.firstName(),
                        dungeon_id: '6f8b385c-5cae-44a6-bb2f-76d30b660788',
                        dungeon_location_id:
                            'fb696f4a-fb81-4d6a-a3ef-e6cb8ea3ea47',
                    },
                    location: {
                        id: 'fb696f4a-fb81-4d6a-a3ef-e6cb8ea3ea47',
                        dungeon_id: '6f8b385c-5cae-44a6-bb2f-76d30b660788',
                        name: 'Dark Room',
                        description: faker.lorem.sentence(),
                        north_dungeon_location_id:
                            'ced19f54-8a73-4d33-90ed-b92ea30407bd',
                        northeast_dungeon_location_id:
                            'e7e17ea8-3104-4198-a3eb-27a4330be0b4',
                    },
                },
                expectDungeonCharacterActionRecord: {
                    dungeon_id: '6f8b385c-5cae-44a6-bb2f-76d30b660788',
                    dungeon_location_id: 'fb696f4a-fb81-4d6a-a3ef-e6cb8ea3ea47',
                    dungeon_character_id:
                        'ef052d03-c8a5-4d86-b1c5-253ca29d99b9',
                    action: 'move northeast',
                    target_dungeon_location_id:
                        'e7e17ea8-3104-4198-a3eb-27a4330be0b4',
                },
            },
        ];

        testCases.forEach((testCase) => {
            it(testCase.name, () => {
                const dungeonCharacterActionRecord = resolver.resolveMoveAction(
                    testCase.sentence,
                    testCase.records,
                );
                expect(dungeonCharacterActionRecord).toEqual(
                    testCase.expectDungeonCharacterActionRecord,
                );
            });
        });
    });
});
