// Application
import { DungeonCharacterActionResolver } from './dungeon-character-action.resolver';

describe('DungeonCharacterActionResolver', () => {
    let resolver: DungeonCharacterActionResolver;

    beforeEach(async () => {
        resolver = new DungeonCharacterActionResolver();
    });

    describe('resolveSentence', () => {
        it('should resolve move actions', () => {
            const resolverSentence = resolver.resolveSentence('move north');
            expect(resolverSentence.action).toEqual('move');
            expect(resolverSentence.words).toEqual(['north']);
        });
    });
});
