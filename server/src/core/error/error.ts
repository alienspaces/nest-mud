export class DomainError extends Error {
    constructor(message: any) {
        super(message);
        this.name = 'DomainError';
    }
}

export class RepositoryError extends Error {
    constructor(message: any) {
        super(message);
        this.name = 'RepositoryError';
    }
}
