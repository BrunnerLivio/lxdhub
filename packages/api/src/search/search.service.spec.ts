import { Test } from '@nestjs/testing';

import { SearchDictionary, SearchService } from '../search';

/**
 * Test cases for the search service
 */
describe('SearchService', () => {
    let searchService: SearchService;

    beforeEach(async done => {
        // Mock Search Module
        const module = await Test.createTestingModule({
            providers: [
                SearchService
            ]
        }).compile();

        // Get the searchservice in the Testing Module Context
        searchService = module.get<SearchService>(SearchService);
        done();
    });

    describe('getLiteral', () => {
        let searchDitionary: SearchDictionary[];
        beforeEach(() => {
            searchDitionary = [
                {
                    aliases: [
                        'os'
                    ],
                    searchLiteralKey: 'distribution'
                },
                {
                    aliases: [
                        'arch'
                    ],
                    searchLiteralKey: 'architecture'
                }
            ];
        });

        it('should transform correctly "os=ubuntu arch=64"', () => {
            const literal = searchService.getLiteral('os=ubuntu arch=64', searchDitionary);
            expect(literal.distribution).toBe('ubuntu');
            expect(literal.architecture).toBe('64');
        });

        it('should transform correctly "abc" into default key', () => {
            const literal = searchService.getLiteral('anc', searchDitionary, 'default');
            expect(literal.default).toBe('anc');
        });

        it('should transform correctly "abc" into empty object', () => {
            const literal = searchService.getLiteral('anc', searchDitionary);
            expect(literal).toEqual({});
        });

        it('should throw an exception when using unknwon keys "abc=1"', () => {
            expect(() => searchService.getLiteral('abc=1', searchDitionary)).toThrowError(TypeError);
        });

        it('should throw an error "abc=="', () => {
            expect(() => searchService.getLiteral('abc==', searchDitionary)).toThrowError(TypeError);
        });

    });
});
