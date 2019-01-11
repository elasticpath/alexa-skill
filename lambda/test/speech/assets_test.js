/**
 * Copyright © 2018 Elastic Path Software Inc. All rights reserved.
 *
 * This is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This software is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this license. If not, see
 *
 *     https://www.gnu.org/licenses/
 *
 *
 */

const assert = require('assert');
const assets = require('../../main/speech/assets');

describe('Assets', () => {
    
    describe('#nextItem', () => {
        it('Returns a string if argument is a string', () => {
            assert(typeof assets.nextItem('dummy string') === 'string');
        });

        it('Throws an error if argument is not a string', () => {
            assert.throws(
                () => {assets.nextItem();},
                "Doesn't throw an error with an empty argument");
            assert.throws(
                () => {assets.nextItem(null);},
                "Doesn't throw an error with a null argument");
            assert.throws(
                () => {assets.nextItem({});},
                "Doesn't throw an error with an object as argument");
            assert.throws(
                () => {assets.nextItem([]);},
                "Doesn't throw an error with an array argument");
            assert.throws(
                () => {assets.nextItem(Math.PI);},
                "Doesn't throw an error with a number argument");
        });

        it("Does not contain un-replaced <<substitution>> <<tags>>", () => {
            assert(!assets.nextItem('dummy string').match(/\<\<\w*\>\>/));
        });
    });

    describe('#previousItem', () => {
        it('Returns a string if argument is a string', () => {
            assert(typeof assets.previousItem('dummy string') === 'string');
        });

        it('Throws an error if argument is not a string', () => {
            assert.throws(
                () => {assets.previousItem();},
                "Doesn't throw an error with an empty argument");
            assert.throws(
                () => {assets.previousItem(null);},
                "Doesn't throw an error with a null argument");
            assert.throws(
                () => {assets.previousItem({});},
                "Doesn't throw an error with an object as argument");
            assert.throws(
                () => {assets.previousItem([]);},
                "Doesn't throw an error with an array argument");
            assert.throws(
                () => {assets.previousItem(Math.PI);},
                "Doesn't throw an error with a number argument");
        });

        it("Does not contain un-replaced <<substitution>> <<tags>>", () => {
            assert(!assets.previousItem('dummy string').match(/\<\<\w*\>\>/));
        });
    });

    describe('#specificItem', () => {
        it('Returns a string if argument is a string', () => {
            assert(typeof assets.specificItem('dummy string') === 'string');
        });

        it('Throws an error if argument is not a string', () => {
            assert.throws(
                () => {assets.specificItem();},
                "Doesn't throw an error with an empty argument");
            assert.throws(
                () => {assets.specificItem(null);},
                "Doesn't throw an error with a null argument");
            assert.throws(
                () => {assets.specificItem({});},
                "Doesn't throw an error with an object as argument");
            assert.throws(
                () => {assets.specificItem([]);},
                "Doesn't throw an error with an array argument");
            assert.throws(
                () => {assets.specificItem(Math.PI);},
                "Doesn't throw an error with a number argument");
        });

        it("Does not contain un-replaced <<substitution>> <<tags>>", () => {
            assert(!assets.specificItem('dummy string').match(/\<\<\w*\>\>/));
        });
    });

    describe('#searchResults', () => {

        const validItem = {name: 'test item'};

        it('Throws an error if numItems is not a number', () => {
            assert.throws(
                () => {assets.searchResults(undefined, validItem);},
                "Doesn't throw an error with an empty argument");
            assert.throws(
                () => {assets.searchResults(null, validItem);},
                "Doesn't throw an error with a null argument");
            assert.throws(
                () => {assets.searchResults({}, validItem);},
                "Doesn't throw an error with an object as argument");
            assert.throws(
                () => {assets.searchResults([], validItem);},
                "Doesn't throw an error with an array argument");
            assert.throws(
                () => {assets.searchResults('A string!', validItem);},
                "Doesn't throw an error with a number argument");
        });

        it('Throws an error if item is not an object', () => {
            assert.throws(
                () => {assets.searchResults(3, undefined);},
                "Doesn't throw an error with an empty argument");
            assert.throws(
                () => {assets.searchResults(3, null);},
                "Doesn't throw an error with a null argument");
            assert.throws(
                () => {assets.searchResults(3, []);},
                "Doesn't throw an error with an object as argument");
            assert.throws(
                () => {assets.searchResults(3, 'validItem');},
                "Doesn't throw an error with an array argument");
            assert.throws(
                () => {assets.searchResults(3, Math.PI);},
                "Doesn't throw an error with a number argument");
        });

        it("Throws an error if item doesn't have property 'name' of type string", () => {
            assert.throws(
                () => {assets.searchResults(3, {});},
                "Doesn't throw an error with an empty argument");
            assert.throws(
                () => {assets.searchResults(3, {name: null});},
                "Doesn't throw an error with a null argument");
            assert.throws(
                () => {assets.searchResults(3, {name: []});},
                "Doesn't throw an error with an object as argument");
            assert.throws(
                () => {assets.searchResults(3, {name: {}});},
                "Doesn't throw an error with an array argument");
            assert.throws(
                () => {assets.searchResults(3, {name: Math.PI});},
                "Doesn't throw an error with a number argument");
        })

        it("Does not throw an error if passed a number for 'numItems' and a valid item for argument 'item'", () => {
            assert.doesNotThrow(
                () => {assets.searchResults(3, validItem)},
                "Throws an error, even though passed valid parameters"
            );
            assert.doesNotThrow(
                () => {assets.searchResults(1, validItem)},
                "Throws an error, even though passed valid parameters"
            );
            assert.doesNotThrow(
                () => {assets.searchResults(0, validItem)},
                "Throws an error, even though passed valid parameters"
            );
        });

        it("Does not contain un-replaced <<substitution>> <<tags>>", () => {
            assert(!assets.searchResults(0, validItem).match(/\<\<\w*\>\>/));
            assert(!assets.searchResults(1, validItem).match(/\<\<\w*\>\>/));
            assert(!assets.searchResults(77, validItem).match(/\<\<\w*\>\>/));
        });
    });

    describe('#describeProduct', () => {

        it('Calls Assets.missingDescription() if argument "description" is not a string');

        it('Throws an error if argument "item" is not an object');

        it('Throws an error if argument "item" does not have property "displayName" of type string');

        it('Gracefully handles missing price information');
    });
});