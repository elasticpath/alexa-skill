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

const speechAssets = {
    greeting: 'Welcome to Vestri Motors: electric vehicles for the modern consumer!',
    description: 'Vestri Motors sells wheels, chargers, maintenance parts, and services for your electric car. The store also sells Vestri merchandise such as shirts, hats, and accessories.',
    sendoff: 'Thank you for shopping with vestri motors!  Talk to you again soon.'
};

function brandAssets() {}

brandAssets.prototype.greeting = function() {
    return speechAssets.greeting;
};

brandAssets.prototype.description = function() {
    return speechAssets.description;
};

brandAssets.prototype.sendoff = function() {
    return speechAssets.sendoff;
};

module.exports = new brandAssets();
