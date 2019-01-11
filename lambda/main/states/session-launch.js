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

const SessionConstants = require('./session-states.js');
const SessionState = SessionConstants.SessionState;
const AmazonIntent = SessionConstants.AmazonIntent;
const SpeechAssets = require('../speech/assets.js');

var Alexa = require('alexa-sdk');

/**
 * Entrypoint for the skill.
 * When a new session is launched, the handler defined in index.js
 * sends us here
 */
module.exports.handler = (cortex, brandAssets) => Alexa.CreateStateHandler(SessionState.SESSION_LAUNCH, {
    /**
     * speaks a greeting and sends us to the "default" browsing state
     */
    'LaunchRequest': function () {
        this.response.speak(brandAssets.greeting() + SpeechAssets.helpMessage()).listen(SpeechAssets.canIHelp());
        this.handler.state = SessionState.BROWSING;
        this.emit(':responseReady');
    },

    'SessionEndedRequest' : function() {
        console.log('Session ended with reason: ' + this.event.request.reason);
    },
    'AMAZON.StopIntent' : function() {
        this.handler.state = SessionState.SESSION_END;
        this.emitWithState(AmazonIntent.STOP);
    },
    'AMAZON.HelpIntent' : function() {
        this.response.speak(speechAssets.helpMessage());
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent' : function() {
        this.handler.state = SessionState.SESSION_END;
        this.emitWithState(AmazonIntent.CANCEL);
    },
    'Unhandled' : function() {
        this.response.speak(speechAssets.unhandled());
        this.emit(':responseReady');
    }
});
