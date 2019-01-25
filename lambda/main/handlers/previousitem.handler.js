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

const PreviousItemHandler = {
    canHandle({requestEnvelope}) {
        return isIntentRequestOfType(requestEnvelope, ElasticPathIntents.PREVIOUS_ITEM);
    },
    handle({responseBuilder, attributesManager}) {
        return new Promise((resolve, reject) => {
            const attributes = attributesManager.getSessionAttributes();
            let index = attributes.searchResults.indexOf(attributes.requestedSku);
            if (index > 0) {
                attributes.requestedSku = attributes.searchResults[--index];
                attributesManager.setSessionAttributes(attributes);
                Cortex.getCortexInstance()
                .then((cortex) => cortex.getItemBySku(attributes.requestedSku))
                .then((item) => {
                    resolve(responseBuilder
                        .speak(SpeechAssets.previousItem(item.definition.displayName))
                        .reprompt(SpeechAssets.canIHelp())
                        .getResponse());
                })
                .catch(error => reject(error));
            } else {
                resolve(responseBuilder
                    .speak(`That's all I have right now. ${SpeechAssets.whatNext()}`)
                    .reprompt(SpeechAssets.canIHelp())
                    .getResponse());
            }
        })
    }
};

module.exports = PreviousItemHandler;
