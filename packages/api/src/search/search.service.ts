import { Injectable } from '@nestjs/common';

import { SearchLiteral } from '.';
import { SearchDictionary } from './interfaces';

@Injectable()
/**
 * The search services provides methods,
 * which are search-related
 */
export class SearchService {
    private regex = new RegExp('(.*)=(.*)');

    /**
     * Returns the literal-key if the given queryKey is found in the alias list
     * of the dictionary
     * @param queryKey The key of the search-query-string
     * @param dictionaries The dictionaries to translate the aliases to the literal
     *
     * @example
     * dictionaries = [ { aliases: [ 'arch' ], searchLiteralKey: 'architecture' }];
     * getLiteralKey('arch', dictionaries) // returns 'architecture'
     */
    private getLiteralKey(queryKey: string, dictionaries: SearchDictionary[]): string {
        const dictionary = dictionaries
            .map(dict =>
                // Find dictionary, which any aliases is equal to
                // to the given queryKey of the dictionary
                dict.aliases.filter(alias => alias === queryKey).length ? dict : null)
            .find(dict => dict !== null);
        // Return its literal-key if found one, otherwise return null
        return dictionary ? dictionary.searchLiteralKey : null;
    }

    /**
     * Check if is advanced search
     * @param query The search query
     * @example
     * isAdvancedSearch('os=ubuntu') // true
     * isAdvancedSearch('ubuntu') // false
     */
    private isAdvancedSearch(query: string) {
        return this.regex.test(query);
    }

    /**
     * Transforms the query key-value-string into an object
     * @param queryObject The query object with the key, value seperated by a "="
     * @example
     * getKeyValue('os=ubuntu') // { os: 'ubuntu' }
     */
    private getKeyValue(queryObject: string) {
        const match = this.regex.exec(queryObject);
        return {
            key: match[1],
            value: match[2]
        };
    }

    /**
     * Returns a literal from an advanced search-query-string
     * @param query The advanced query string
     * @param dictionaries The dictionaries to translate the aliases to the literal
     *
     * @example
     * const dictionaries = [
     *  { aliases: [ 'os' ], searchLiteralKey: 'os' },
     *  { aliases: [ 'arch' ], searchLiteralKey: 'architecture' }
     * ];
     * getLiteralFromAdvancedQuery('os=ubuntu arch=amd64', dictionaries)
     * // returns { architecture: 'amd64', os: 'ubuntu'}
     */
    private getLiteralFromAdvancedQuery(query: string, dictionaries: SearchDictionary[]): SearchLiteral {
        const search = {} as SearchLiteral;
        query
            .split(' ')
            // Transform the query-split into and object
            .map(queryAttr => this.getKeyValue(queryAttr))
            .forEach(queryAttr => {
                // For each key-value pair, get the searchLiteralKey
                // from the dictionaries
                const key = this.getLiteralKey(queryAttr.key, dictionaries);
                if (key) {
                    search[key] = queryAttr.value;
                } else {
                    throw new TypeError('Given key is not valid');
                }
            });
        return search;
    }

    /**
     * Maps the query string key, values to the search literal
     * using the given dictionaries.
     * Returns null, if the
     * @param query The query string which you want to have the literal from
     * @param dictionaries The dictionaries to translate the aliases to the literal
     * @param defaultKey Optional key, which should be mapped if the query-string is not key=value
     */
    public getLiteral(query: string, dictionaries: SearchDictionary[], defaultKey?: string): SearchLiteral {
        // Make sure everything is lowercase
        query = query.toLocaleLowerCase();
        try {
            if (this.isAdvancedSearch(query)) {
                // Generate literal
                return this.getLiteralFromAdvancedQuery(query, dictionaries);
            } else if (defaultKey) {
                // Return literal with the given default-key
                return { [defaultKey]: query };
            }
        }
        catch (err) {
            // Throw error if there is an error
            throw new TypeError('Could not parse the search string');
        }
        // If is not advanced search and does not have
        // set a defaultkey, return empty object
        return {};
    }
}
