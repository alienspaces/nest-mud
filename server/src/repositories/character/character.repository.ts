import { DatabaseService } from '@/common/database/database.service';
import { Injectable } from '@nestjs/common';

// Application
import { Character } from '@/interfaces/character.interface';
import { Repository } from '../repository';

@Injectable()
export class CharacterRepository extends Repository {
    constructor(private databaseService: DatabaseService) {
        super('character', {} as Character);
    }

    async getOne(id: string): Promise<Character> {
        const client = await this.databaseService.connect();
        const { rows } = await client.query(
            'SELECT * FROM character WHERE id = $1',
            [id],
        );
        if (rows.length != 1) {
            return;
        }
        return rows[0] as Character;
    }

    async insertOne(data: Character): Promise<Character> {
        const client = await this.databaseService.connect();
        const insertSQL = this.buildInsertSQL();
        return null;
    }
}
