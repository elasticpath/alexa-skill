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
const { ElasticPathIntents, PROD_DESCRIPTION } = require('../constants');

const DescribeProductHandler = {
    canHandle({requestEnvelope}) {
        return isIntentRequestOfType(requestEnvelope, ElasticPathIntents.DESCRIBE_PRODUCT);
    },
    handle({responseBuilder, attributesManager}) {
        return new Promise((resolve, reject) => {
            const attributes = attributesManager.getSessionAttributes();
            if (attributes.requestedSku) {
                Cortex.getCortexInstance()
                .then((cortex) => cortex.getItemBySku(attributes.requestedSku))
                .then((item) => {
                    item.definition.details.forEach((detail) => {
                        if (detail.name === PROD_DESCRIPTION) {
                            const description = detail['display-value'].slice(0, detail['display-value'].indexOf('.'))
                            resolve(responseBuilder
                                .speak(SpeechAssets.describeProduct(description, item))
                                .reprompt(SpeechAssets.addToCartQuery())
                                .getResponse());
                        }
                    });
                })
                .catch(error => reject(error))
            } else {
                resolve(responseBuilder
                    .speak(SpeechAssets.noProductToDescribe())
                    .reprompt(SpeechAssets.howElseCanIHelp())
                    .getResponse());
            }
        });
    }
}

module.exports = DescribeProductHandler;