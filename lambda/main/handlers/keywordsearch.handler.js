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

const KeywordSearchHandler = {
    canHandle({requestEnvelope}) {
        return isIntentRequestOfType(requestEnvelope, ElasticPathIntents.KEYWORD_SEARCH);
    },
    handle({responseBuilder, attributesManager, requestEnvelope}) {
        return new Promise((resolve, reject) => {
            if (requestEnvelope.request.intent.slots && requestEnvelope.request.intent.slots.SearchKeyword) {
                const keywords = requestEnvelope.request.intent.slots.SearchKeyword.value;
                Cortex.getCortexInstance()
                .getItemsByKeyword(keywords)
                .then((data) => {
                    let speech;
                    if (data && data.length > 0) {
                        const attributes = attributesManager.getSessionAttributes();
                        const searchResults = [];
                        data.forEach(item => searchResults.push(item._code[0].code));
                        attributes.requestedSku = data[0]._code[0].code;
                        attributes.searchResults = searchResults;
                        attributesManager.setSessionAttributes(attributes);
                        speech = SpeechAssets.searchResults(data.length, data[0]);
                    } else {
                        speech = SpeechAssets.itemNotFound();
                    }
                    resolve(responseBuilder
                        .speak(speech)
                        .reprompt(SpeechAssets.howElseCanIHelp())
                        .getResponse());
                })
                .catch((error) => reject(error));
            } else {
                resolve(responseBuilder
                    .speak(SpeechAssets.itemNotFound())
                    .reprompt(SpeechAssets.howElseCanIHelp())
                    .getResponse());
            }
        });
    }
};

module.exports = KeywordSearchHandler;
