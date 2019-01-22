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

let Product = function() {};

/**
 * Builds a Product domain object from a Cortex JSON response (either String, or
 * pre-parsed JSON). Gracefully handles missing zoom data from all elements.
 * 
 * NOTE: Does NOT guarantee that any elements are present.
 */
Product.fromCortexJson = function(json) {
    let itemJson    = convertToObj(json);
    let product     = new Product();

    product.uri          = findUriFromJson(itemJson);
    product.code         = findProductCode(itemJson);
    product.definition   = findProductDefinition(itemJson);
    product.availability = findProductAvailability(itemJson);
    product.price        = findProductPrice(itemJson);
    product.category     = null; // TODO: Fill this out later.

    // FYI: This makes more Cortex calls
    product.bundles      = findProductBundles(itemJson);

    return product;
}

/**
 * Returns true if the availability is set to 'AVAILABLE'
 * @return {boolean} True if availability === available.
 */
Product.prototype.isAvailable = function() {
    return this.availability === 'AVAILABLE'
};

/*
 * ***********************************************
 * P A R S I N G   H E L P E R   F U N C T I O N S
 * ***********************************************
 */
function findUriFromJson(data) {
    try {
        return data.self.href.split('?')[0];
    } catch (err) {
        return null;
    }
}

function findProductCode(itemJson) {
    const data = convertToObj(itemJson);
    return (data._code) ? data._code[0].code : null;
};

function findProductDefinition(itemJson) {
    const definition = {
        displayName: null,
        details: []
    };
    if (itemJson._definition) {
        definition.displayName = itemJson._definition[0]['display-name'];
        definition.details = itemJson._definition[0].details;
    }

    return definition;
};

function findProductPrice(data) {
    const priceObj = {};
    if (data._price) {
        priceObj.purchasePrice = data._price[0]['purchase-price'];
        priceObj.listPrice = data._price[0]['list-price'];
    }
    return priceObj;
};

function findProductAvailability(data) {
    data = convertToObj(data);
    return (data._availability) ? data._availability[0].state : null;
};

function findProductBundles(data) {
    data = convertToObj(data);
    if (data._definition && data._definition._components) {
        const bundles = data._definition[0]._components[0]._element;
        createBundleArray(bundles).then(
            (bundle) => {
                return bundle;
            });
    } else {
        // bundle doesn't exist for item
        return null;
    }
};

function createBundleArray(bundles) {
    return new Promise((resolve, reject) => {
        const bundleArray = [];
        bundles.forEach((bundle) => {
            const quantity = bundle.quantity;
            const displayName = bundle['display-name'];
            const details = bundle.details;

            const elementObj = {
                quantity,
                displayName,
                details,
            };
            bundleArray.push(elementObj);
        });
        resolve(bundleArray);
    });
};

function convertToObj(data) {
    if (typeof data === 'string') {
        return JSON.parse(data);
    }
    return data;
};

module.exports  = Product;
