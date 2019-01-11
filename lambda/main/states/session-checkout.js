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

const Alexa = require('alexa-sdk');
const SessionConstants = require('./session-states.js');
const SessionState = SessionConstants.SessionState;
const AmazonIntent = SessionConstants.AmazonIntent;

const SpeechAssets = require('../speech/assets.js');


module.exports.handler = (cortex) => Alexa.CreateStateHandler(SessionState.CHECKOUT, {

    'CheckOutIntent': function () {
        cortex.getShoppingCartQuantity().then((quantity) => {
            cortex.getShoppingCartTotal().then((total) => {
                if (quantity > 0) {
                    this.response.speak(SpeechAssets.fullCheckoutMessage(quantity, total.display))
                        .listen(SpeechAssets.likeToCheckout());
                    this.emit(':responseReady');
                } else {
                    this.handler.state = SessionState.BROWSING;
                    this.response.speak(SpeechAssets.noItemsToCheckOut())
                        .listen(SpeechAssets.howElseCanIHelp());
                    this.emit(':responseReady');
                }

            })
            .catch((err) => {
                this.response.speak(SpeechAssets.somethingWentWrong())
                    .listen(SpeechAssets.howElseCanIHelp());
                this.emit(':responseReady');
            });
        }).catch((err) => {
            console.log(err);
            this.handler.state = SessionState.BROWSING;
            this.response.speak(SpeechAssets.somethingWentWrong())
                .listen(SpeechAssets.howElseCanIHelp());
            this.emit(':responseReady');
        });
    },

    'KeywordSearchIntent': function() {
        this.handler.state = SessionState.BROWSING;
        this.emitWithState('KeywordSearchIntent');
    },

    'AMAZON.YesIntent': function () {
        cortex.cortexCheckout().then((data) => {
            this.handler.state = SessionState.BROWSING;
            this.response.speak(SpeechAssets.purchaseSuccess())
                .listen(SpeechAssets.howElseCanIHelp());
            this.emit(':responseReady');
        }).catch((err) => {
            var extraInfo = " ";
            if (err.type == "needinfo") {
                extraInfo += err['debug-message'];
            }

            this.response
                .speak(SpeechAssets.cartError() + extraInfo)
                .listen(SpeechAssets.howElseCanIHelp());
            this.emit(':responseReady');
        });
    },

    'AMAZON.NoIntent': function () {
        this.handler.state = SessionState.BROWSING;
        this.response.speak('Okay!  ' + SpeechAssets.howElseCanIHelp())
            .listen(SpeechAssets.howElseCanIHelp());
        this.emit(':responseReady');
    },

    'AMAZON.StopIntent': function () {
        this.handler.state = SessionState.SESSION_END;
        this.emitWithState(AmazonIntent.STOP);
    },
    'AMAZON.HelpIntent': function () {
        this.response.speak('Say yes to check out, or no to continue shopping.  Are you ready to check out?').listen('Are you ready to check out?');
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.handler.state = SessionState.SESSION_END;
        this.emitWithState(AmazonIntent.CANCEL);
    },
    'Unhandled': function () {
        this.response.speak(SpeechAssets.unhandled()).listen(SpeechAssets.howElseCanIHelp());
        this.emit(':responseReady');
    }
});
