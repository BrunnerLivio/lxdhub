import { Component, Inject, Injectable } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';

@Injectable()
export class DatabaseService {
    /**
     * Initializes the database service
     * @param connection The connection, which gets injected
     */
    constructor(@Inject('Connection') public connection: Connection) { }

    /**
     * Returns the repository of the given entity
     * @param entity The database entity to get the repository from
     */
    async getRepository<T>(entity: any): Promise<Repository<T>> {
        return this.connection.getRepository(entity);
    }

    /**
     * Closes the current connection, if it is
     * connected
     */
    async closeConnection() {
        const connection = (await this.connection);
        if (connection.isConnected) {
            await (await this.connection).close();
        }
    }
}
