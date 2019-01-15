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

'use strict';

const Alexa = require('alexa-sdk');
const Cortex = require('./cortex.js');
const states = require('./states/states.js');
const SessionConstants = require('./states/session-states.js');
const SessionState = SessionConstants.SessionState;

const user = process.env['CORTEX_USER'];
const pass = process.env['CORTEX_PASSWORD'];
const cortexUrl = process.env['CORTEX_URL'];
const scope = process.env['CORTEX_SCOPE'].toLowerCase();

/** brand assets */
const BrandAssets = require('./branding/' + scope + '/assets.js');

/**
 * main entrypoint for the skill
 */
exports.handler = function (event, context) {
    var alexa = Alexa.handler(event, context);

    Cortex.createCortexInstance(user, pass, cortexUrl, scope)
        .then((cortex) => {
            states.forEach((state) => {
                alexa.registerHandlers(state.handler(cortex, BrandAssets));
            });
            alexa.registerHandlers(newSessionHandler);
            alexa.execute();
        }).catch((err) =>
            console.log(err)
        );
};

/**
 * handler for new sessions.
 * serves as an entrypoint to the state machine.
 */
const newSessionHandler = {

    'NewSession': function () {
        this.handler.state = SessionState.SESSION_LAUNCH;
        this.emitWithState('LaunchRequest');
    },

    'SessionEndedRequest': function () {
        this.response.speak('Thanks for shopping at Vestri Motors!');
        this.emit(':responseReady');
    }

}; 
