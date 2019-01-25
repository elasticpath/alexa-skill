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

const Product = function() {};

/**
 * Builds a Product domain object from a Cortex JSON response (either String, or
 * pre-parsed JSON). Gracefully handles missing zoom data from all elements.
 * 
 * NOTE: Does NOT guarantee that any elements are present.
 */
Product.fromCortexJson = function(json) {
    const product     = new Product();

    product.uri          = findUriFromJson(json);
    product.code         = findProductCode(json);
    product.definition   = findProductDefinition(json);
    product.availability = findProductAvailability(json);
    product.price        = findProductPrice(json);

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

function findProductCode(data) {
    return (data._code) ? data._code[0].code : null;
}

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
}

function findProductPrice(data) {
    const priceObj = {};
    if (data._price) {
        priceObj.purchasePrice = data._price[0]['purchase-price'];
        priceObj.listPrice = data._price[0]['list-price'];
    }
    return priceObj;
}

function findProductAvailability(data) {
    return (data._availability) ? data._availability[0].state : null;
}

module.exports  = Product;
