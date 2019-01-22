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

const humanizerSettings = {
    positiveFillerFrequency: 0.7,
    appologyFillerFrequency: 0.5,
    umFrequency: 0.3
}

const speechAssets = {
    greeting: 'Welcome to Vestri Motors: electric vehicles for the modern consumer!',
    description: 'Vestri Motors sells wheels, chargers, maintenance parts, and services for your electric car. The store also sells Vestri merchandise such as shirts, hats, and accessories.',
    sendoff: 'Thank you for shopping with vestri motors!  Talk to you again soon.',
    foundItem: 'I found an item called <<itemName>>, would you like to add it to your cart? ',
    itemNotFound: [
        'I couldn\'t find that item in our store. ', 
        'I can\'t find that item. ', 
        'That item doesn\'t seem to be in our store. ',
        'It looks like we don\'t carry that. '
    ],
    addItemToCart: [
        'Would you like to add the item to your cart? ', 
        'Should I add that item to your cart? ', 
        'Do you want to add it to your cart? '
    ],
    itemsInCart: [
        'You have <<quantity>> <<items>> in your cart totalling <<total>>. ',
        'There are <<quantity>> <<items>> in your cart totalling <<total>>. ',
        'You have <<quantity>> <<items>> in your cart, your total is <<total>>. ',
        'There are <<quantity>> <<items>> in your cart, your total is <<total>>. '
    ],
    likeToCheckout: 'Would you like to use your default payment method and check out now? ',

    search: {
        results: {
            oneResult: [
                'I found just <<quantity>> item matching your search. ',
                'I only found <<quantity>> item matching your search. ',
                'I found <<quantity>> item that you might be interested in. ',
                'My search turned up <<quantity>> possible match. '
            ],
            manyResults: [
                'I found <<quantity>> items matching your search. ',
                'I found <<quantity>> items that you might be interested in. ',
                'Your search turned up <<quantity>> results. ',
                'My search turned up <<quantity>> possible matches. '
            ],
            topItem: [
                'The top match I found is <<itemName>>. ',
                'First, I found <<itemName>>. ',
                '<<itemName>> is the top match. '
            ],
            nextItem: [
                'The next item I found is <<itemName>>. ',
                'I also found <<itemName>>. ',
                'Next is the <<itemName>>. '
            ],
            previousItem: [
                'The last item was <<itemName>>. ',
                'That was the <<itemName>>. ',
                'That\'s the <<itemName>>. '
            ],
            specificItem: [
                'That\'s the <<itemName>>. '
            ]
        },
        nextOptions: [
            'I can add the item to your cart or tell you more about it.'
        ],
    },

    addedToCart: [
        'Great!  I\'ve added it to your cart. ', 
        'Ok!  I\'ve added it to your cart. ',
        'Alright, it\'s been added to your cart. '
    ],
    itemNotAvailable: [
        'That item\'s not in stock. ',
        'We\'re out of that right now. ',
        'I\'m out of those. '
    ],
    addedToWishlist: [
        'Great!  I\'ve added it to your wishlist. ', 
        'Ok!  I\'ve added it to your wishlist. ', 
        'Alright, it\'s been added to your wishlist. '
    ],
    movedToWishlist: [
        'Ok, I\'ve moved <<itemName>> to your wishlist. ',
        'Sure, <<itemName>> has been moved to your wishlist. ',
        'Alright, <<itemName>> has been moved to your wishlist. '
    ],
    movedToCart: [
        'Ok, I\'ve moved <<itemName>> to your cart. ',
        'Sure, <<itemName>> has been moved to your cart. ',
        'Alright, <<itemName>> has been moved to your cart. '
    ],
    removedFromCart: [
        'Ok, the item <<itemName>> has been removed from your cart. ', 
        'Alright, I\'ve removed <<itemName>> from your cart. ',
        'Ok, I\'ve removed <<itemName>> from your cart. '
    ],
    removedFromWishlist: [
        'Ok, the item <<itemName>> has been removed from your wishlist. ', 
        'Alright, I\'ve removed <<itemName>> from your wishlist. ', 
        'Ok, I\'ve removed <<itemName>> from your cart. '
    ],
    readyToCheckOut: [
        'Are you ready to check out? ',
        'Would you like to check out?',
        'Do you want to check out?'
    ],
    noItemsToCheckOut: [
        'There are no items in the cart to checkout. ',
        'You have nothing in your cart to checkout. ',
        'Your cart is empty, add some items first. '
    ],
    noItemsInCart: [
        'Your cart is empty, add some items first. '
    ],
    purchaseSuccess: [
        'Great!  Your purchase was successful. ',
        'Ok, your order has been placed. ',
        'Ok, I\'ve placed your order. '
    ],
    describeProduct: [
        'Here\'s what the description says: <<itemDescription>>; The <<itemName>> retails for <<itemPrice>>. ',
        'Here\'s the description: <<itemDescription>>; The <<itemName>> retails for <<itemPrice>>. ',
        'Here\'s the write-up: <<itemDescription>>; The <<itemName>> retails for <<itemPrice>>. '
    ],
    noProductToDescribe: 'I couldn\'t find a product to tell you about. ',

    somethingWentWrong: [
        'something went wrong. ',
        'that didn\'t work. '
    ],
    cartError: 'hmm, something went wrong, and your order could not be completed. ',
    cantReadCart: 'I\'m sorry, there was a problem reading your cart. ',
    helpMessage: 'I can help you search, shop, learn about our products, or manage your cart or wishlist.',
    unhandled: [
        'I don\'t know how to handle that request. Please try again', 
        'I\'m not sure how to handle that request. Please try again'
    ],
    prompts: {
        canIHelpYou: [
            'How can I help you? ', 
            'What can I do for you? ',
            'How may I assist you? '
        ],
        howElseCanIHelp: [
            'How else can I help you? ', 
            'What else can I do for you? ', 
            'How else may I assist you? '
        ],
        whatNext: [
            'What\'s next?',
            'What would you like to do? ',
            'What would you like to do next? ',
            'What can I do next? ',
            'What can I do for you? ',
            'What would you like me to do? '
        ]
    },
    fillers: {
        positive: [
            'Sure',
            'Not a problem',
            'You bet',
            'Alright',
            'Got it',
            'No problem',
            'Absolutely',
            'Definitely',
            'Right'
        ],
        neutral: [
            'Let\'s see',
            'Okay',
            'Well'
        ],
        appologetic: [
            'Uh-oh',
            'Sorry',
            'Oh'
        ],
        umm: [
            'Hmm',
            'Ummmm',
            'Mmm'
        ],
        punctuation: [
            '. ',
            ', ',
            '... ',
            ' - ',
            '! '
        ]
    }
};

const assets = function() {};

String.prototype.replaceAll = function(target, replacement) {
    return this.split(target).join(replacement);
};

let pickVariation = function(arrayOfResponses) {
    if (Array.isArray(arrayOfResponses)) {
        return arrayOfResponses[Math.floor(Math.random() * arrayOfResponses.length)]
    }
    else {
        return arrayOfResponses;
    }
}

// Formatting function to make sure the output works well with Alexa (makes sure there
// are spaces after periods, etc.)
let cleanOutput = function(output) {
    // This regex makes sure there's a space after periods, EXCEPT if followed by a number.
    output = ' ' + output.replaceAll(/(?!\.[\d\.])\./, ". ")
                .replaceAll('&', 'and')
                .replaceAll(/\s\s+/, " ") + ' ';
    return output;
}

assets.prototype.greeting = function() {
    return `${speechAssets.greeting} ${this.howElseCanIHelp()}`;
};

assets.prototype.description = function() {
    return speechAssets.description;
};

assets.prototype.sendoff = function() {
    return speechAssets.sendoff;
};

/*
 * PROMPTS
 */
assets.prototype.canIHelp = function() {
    return cleanOutput(
        pickVariation(speechAssets.prompts.canIHelpYou)
    );
};

assets.prototype.howElseCanIHelp = function() {
    return cleanOutput(
        pickVariation(speechAssets.prompts.howElseCanIHelp)
    );
};

assets.prototype.whatNext = function() {
    return cleanOutput(
        pickVariation(speechAssets.prompts.whatNext)
    );
}

/*
 * GENERIC ERROR MESSAGES
 */
assets.prototype.somethingWentWrong = function() {
    return cleanOutput(
        this.appologeticFiller()
        + pickVariation(speechAssets.somethingWentWrong)
        + this.howElseCanIHelp()
    );
};

assets.prototype.unhandled = function() {
    return cleanOutput(
        this.appologeticFiller()
        + pickVariation(speechAssets.unhandled)
        + this.howElseCanIHelp());
};

/*
 * HELP
 */
assets.prototype.helpMessage = function() { 
    return cleanOutput(
        speechAssets.helpMessage
        + this.whatNext()
    );
};

/*
 * SEARCH
 */
assets.prototype.nextItem = function(itemName) {
    if (typeof itemName != 'string') {
        throw new Error('assets.nextItem() expects a string. You passed ' + itemName);
    }
    
    let response = this.positiveFiller(0.65);
    try {
        response += pickVariation(speechAssets.search.results.nextItem);
        response = response.replace('<<itemName>>', itemName)
                 + this.whatNext();
    }
    catch (err) {
        console.log(err);
        response = this.somethingWentWrong();
    }
    return cleanOutput(response);
}

assets.prototype.previousItem = function(itemName) {
    if (typeof itemName != 'string') {
        throw new Error('assets.previousItem() expects a string. You assed ' + itemName);
    }

    let response = this.positiveFiller(0.65);
    try {
        response += pickVariation(speechAssets.search.results.previousItem);
        response = response.replace('<<itemName>>', itemName)
                 + this.whatNext();
    }
    catch (err) {
        console.log(err);
        response = this.somethingWentWrong();
    }
    return cleanOutput(response);
}

assets.prototype.specificItem = function(itemName) {
    if (typeof itemName != 'string') {
        throw new Error('assets.specificItem() expects a string. You assed ' + itemName);
    }

    let response = this.positiveFiller();;
    try {
        response += pickVariation(speechAssets.search.results.specificItem);
        response = response.replace('<<itemName>>', itemName)
                 + this.whatNext();
    }
    catch (err) {
        console.log(err);
        response = this.somethingWentWrong();
    }
    return cleanOutput(response);
}

assets.prototype.searchResults = function(numItems, item) {
    if (typeof numItems != 'number' || typeof item != 'object') {
        throw new Error('Assets.searchResults(numItems, item) requires "numItems" to be a number'
                      + 'and "item" to be an object with property "name" of type string.');
    }
    
    var response = this.positiveFiller();
    try {
        if (numItems > 0) {
            response += numItems === 1
                     ? pickVariation(speechAssets.search.results.oneResult)
                     : pickVariation(speechAssets.search.results.manyResults);

            response += pickVariation(speechAssets.search.results.topItem)
                     + pickVariation(speechAssets.search.nextOptions)
                     + this.whatNext();
   
           response = response.replace('<<itemName>>', item.definition.displayName)
                              .replace('<<quantity>>', numItems);
        }
        else {
            response = this.noProductToDescribe();
        }
    }
    catch (err) {
        console.log(err);
        response = this.somethingWentWrong();
    }
    return cleanOutput(response);
};

assets.prototype.describeProduct = function(description, item) {
    var response = this.positiveFiller();
    response += pickVariation(speechAssets.describeProduct)
        .replace('<<itemDescription>>', description)
        .replace('<<itemName>>', item.definition.displayName)
        .replace('<<itemPrice>>', item.price.purchasePrice[0].display);

    return cleanOutput(response);
};

assets.prototype.noProductToDescribe = function() {
    return cleanOutput(
        this.appologeticFiller()
        + speechAssets.noProductToDescribe
        + this.howElseCanIHelp()
    );
};

assets.prototype.itemFound = function(itemName) {
    return cleanOutput(
        speechAssets.foundItem.replace('<<itemName>>', itemName)
    );
};

assets.prototype.itemNotFound = function() {
    var response = this.appologeticFiller()
                 + pickVariation(speechAssets.itemNotFound)
                 + this.howElseCanIHelp();
    return cleanOutput(response);
};

/*
 * CART
 */
assets.prototype.cartDescription = function(names, promotionName) {
    var speechResponse = 'You have '
        + ((names.length === 0) ? 'no' : names.length) 
        + ((names.length === 1) ? ' item ' : ' items ') + 'in your cart.  ';
    if (names.length > 0) {
        speechResponse += this.itemList(names);
        speechResponse += this.readyToCheckOut();
    } else {
        speechResponse += this.howElseCanIHelp();
    }
    return speechResponse;
};

assets.prototype.movedToCart = function(item) {
    var response;
    try {
        response = pickVariation(speechAssets.movedToCart)
                    .replace('<<itemName>>', item.name)
                    + this.howElseCanIHelp();
    }
    catch (err) {
        console.log(err);
    }

    return cleanOutput(response);
};

assets.prototype.itemNotAvailable = function() {
    var response = this.appologeticFiller()
                 + pickVariation(speechAssets.itemNotAvailable)
                 + this.howElseCanIHelp();
    return cleanOutput(response);
}

assets.prototype.itemList = function(items) {
    var numItems = 0;
    var itemList = '';
    for (var key in items) {
        if (items.hasOwnProperty(key)) {
            try {
                /* Note: The ordering of operations here is intentional. If
                there is an error getting appending the text to itemList, we
                don't want to increment numItems. */
                
                itemList += 'Item ' + (numItems + 1) + ': ' + items[key].name.replace('&', 'and') + '; ';
                numItems++;
            }
            catch (err) {
                console.log(
                    'Error building item list.\n'
                    + 'Error: ' + JSON.stringify(err)
                    + '\nItems: ' + JSON.stringify(items)
                );
            }
        }
    }
    return itemList.replace(/; $/, '. ');
};

assets.prototype.addedToCart = function() {
    return cleanOutput(
        pickVariation(speechAssets.addedToCart)
        + this.howElseCanIHelp()
    );
};

assets.prototype.removedFromCart = function(item) {
    var ret = pickVariation(speechAssets.removedFromCart)
            .replace('<<itemName>>', item);
    return cleanOutput(ret);
};

assets.prototype.addToCartQuery = function() {
    return cleanOutput(
        this.positiveFiller()
        + pickVariation(speechAssets.addItemToCart)
    );
};

assets.prototype.cartError = function() {
    return cleanOutput(
        this.appologeticFiller()
        + speechAssets.cartError
    );
};

assets.prototype.cantReadCart = function() {
    return cleanOutput(
        this.appologeticFiller()
        + speechAssets.cantReadCart
    );
};

/*
 * WISHLIST
 */
assets.prototype.describeWishlist = function(items) {
    var numItems = items.length;
    var itemList = this.itemList(items);
    var response =  'Your wishlist has ' + numItems + ((numItems === 1) ? ' item ' : ' items ') + ' in it. ';
    response += itemList;
    return response;
};

assets.prototype.addedToWishlist = function() {
    return cleanOutput(
        pickVariation(speechAssets.addedToWishlist)
        + this.howElseCanIHelp()
    );
};

assets.prototype.movedToWishlist = function(item) {
    var ret = pickVariation(speechAssets.movedToWishlist)
            .replace('<<itemName>>', item);
            + this.howElseCanIHelp();
            
    return cleanOutput(ret);
};

assets.prototype.removedFromWishlist = function(item) {
    var ret = pickVariation(speechAssets.removedFromWishlist)
            .replace('<<itemName>>', item);
    return cleanOutput(ret);
};

/*
 * CHECKOUT
 */
assets.prototype.likeToCheckout = function() {
    return cleanOutput(speechAssets.likeToCheckout);
};

assets.prototype.readyToCheckOut = function() {
    return cleanOutput(
        pickVariation(speechAssets.readyToCheckOut)
    );
};

assets.prototype.noItemsToCheckOut = function() {
    return cleanOutput(
        pickVariation(speechAssets.noItemsToCheckOut)
        + this.howElseCanIHelp()
    );
};


assets.prototype.emptyCart = function() {
    return cleanOutput(
        pickVariation(speechAssets.noItemsInCart)
        + this.howElseCanIHelp()
    );
};

assets.prototype.fullCheckoutMessage = function(quantity, total) {
    var itemString = (quantity === 1) ? ' item ' : ' items ';
    var checkoutString = speechAssets.itemsInCart[Math.floor(Math.random() * speechAssets.itemsInCart.length)]
        .replace('<<quantity>>', quantity)
        .replace('<<items>>', itemString)
        .replace('<<total>>', total);
    return checkoutString + ' ' + speechAssets.likeToCheckout;
};

assets.prototype.purchaseSuccess = function() {
    return cleanOutput(
        pickVariation(speechAssets.purchaseSuccess)
        + this.howElseCanIHelp()
    );
};

/*
 * FILLERS
 * For humanizing sentences
 */
assets.prototype.ummFiller = function(frequencyAdjustment) {
    let chance = humanizerSettings.umFrequency;
    if (!Number.isNaN(frequencyAdjustment)) {
        chance *= frequencyAdjustment;
    }

    let response = '<prosody rate="slow">';
    if (Math.random() <= chance) {
        response += pickVariation(speechAssets.fillers.umm)
                 + pickVariation(speechAssets.fillers.punctuation);
    }
    response += '</prosody>';
    return response;
}

assets.prototype.positiveFiller = function(frequencyAdjustment) {
    let chance = humanizerSettings.positiveFillerFrequency;
    if (!Number.isNaN(frequencyAdjustment)) {
        chance *= frequencyAdjustment;
    }

    let response = '<prosody rate="fast">';
    if (Math.random() <= chance) {
        response += this.ummFiller()
                 + pickVariation(speechAssets.fillers.positive.concat(speechAssets.fillers.neutral))
                 + pickVariation(speechAssets.fillers.punctuation);
    }
    response += '</prosody>';
    return response;
}

assets.prototype.appologeticFiller = function(frequencyAdjustment) {
    let chance = humanizerSettings.appologyFillerFrequency;
    if (!Number.isNaN(frequencyAdjustment)) {
        chance *= frequencyAdjustment;
    }

    let response = '';
    if (Math.random() <= chance) {
        response += this.ummFiller()
                 + pickVariation(speechAssets.fillers.appologetic.concat(speechAssets.fillers.neutral))
                 + pickVariation(speechAssets.fillers.punctuation);
    }
    return response;
}

module.exports = new assets();