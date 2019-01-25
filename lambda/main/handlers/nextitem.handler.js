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

const NextItemHandler = {
    canHandle({requestEnvelope}) {
        return isIntentRequestOfType(requestEnvelope, ElasticPathIntents.NEXT_ITEM);
    },
    handle({responseBuilder, attributesManager}) {
        return new Promise((resolve, reject) => {
            const attributes = attributesManager.getSessionAttributes();
            let index = attributes.searchResults.indexOf(attributes.requestedSku);
            if (index < attributes.searchResults.length - 1) {
                let currentItemSku = attributes.searchResults[++index];
                attributes.requestedSku = currentItemSku;
                attributesManager.setSessionAttributes(attributes);
                Cortex.getCortexInstance()
                .then((cortex) => cortex.getItemBySku(currentItemSku))
                .then((item) => {
                    resolve(responseBuilder
                        .speak(SpeechAssets.nextItem(item.definition.displayName))
                        .reprompt(SpeechAssets.canIHelp())
                        .getResponse());
                })
                .catch(err => reject(err));
            }
            else {
                resolve(responseBuilder
                    .speak(`That's all I have right now. ${SpeechAssets.whatNext()}`)
                    .reprompt(SpeechAssets.canIHelp())
                    .getResponse());
            }
        })
    }
};

module.exports = NextItemHandler;