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

const Cortex = require('../cortex');
const SpeechAssets = require('../speech/assets');
const { isIntentRequestOfType } = require('../utils');
const { ElasticPathIntents } = require('../constants');

const GetWishlistHandler = {
    canHandle({requestEnvelope}) {
        return isIntentRequestOfType(requestEnvelope, ElasticPathIntents.GET_WISLIST);
    },
    handle({responseBuilder, attributesManager}) {
        return new Promise((resolve, reject) => {
            Cortex.getCortexInstance()
            .then((cortex) => cortex.getWishlistItems())
            .then((items) => {
                const attributes = attributesManager.getSessionAttributes();
                const orderedWishlist = [];
                for (const item of items) {
                        orderedWishlist.push({
                            name: item.definition.displayName,
                            code: item.code,
                            movetocartform: item.movetocartform,
                        });
                }
                attributes.orderedWishlist = orderedWishlist;
                attributesManager.setSessionAttributes(attributes);
                resolve(responseBuilder
                    .speak(SpeechAssets.describeWishlist(attributes.orderedWishlist))
                    .reprompt(SpeechAssets.howElseCanIHelp())
                    .getResponse());
            })
            .catch((err) => reject(err));
        });
    }
}

module.exports = GetWishlistHandler;
