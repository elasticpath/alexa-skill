# Reference Alexa Skill Quick Start Guide

## Table of Contents

  * Reference Alexa Skill
      * [Documentation Introduction](#documentation-introduction)
  * [Overview](#overview)
  * [Setting up the Skill](#setting-up-the-skill)
      * [Prerequisites](#prerequisites)
      * [Deploying the Skill to AVS](#deploying-the-the-skill-to-avs)
      * [Setting up the Lambda](#setting-up-the-lambda)
      * [Setting up a Development Environment](#setting-up-a-development-environment)
  * [Project Structure](#project-structure)
  * [Intents Reference](#intents-reference)
  * [Terms And Conditions](#terms-and-conditions)

## Reference Alexa Skill

### Documentation Introduction

This document provides guidelines to setup and configure the Reference Alexa Skill. However, this document is not a primer for JavaScript and is intended for professionals who are familiar with the following technologies:

  * [Nodejs](https://nodejs.org/en/)
  * [AWS Lambda Functions](https://aws.amazon.com/lambda/)
  * [Alexa Voice Services](https://developer.amazon.com/alexa-voice-service)

## Overview

The Reference Alexa Skill is a flexible IoT skill, which communicates with Elastic Path’s RESTful e-commerce API, Cortex API. Through the Cortex API, the skill uses the e-commerce capabilities provided by Elastic Path Commerce and interacts with data in a RESTful manner.

## Setting up the Skill

### Prerequisites

Ensure that the following software are installed:

*  [Git](https://git-scm.com/downloads)
*  [Node.js](https://nodejs.org/en/download/)
* A publicly available Cortex API endpoint.
* A publicly available [Account Linking Server](https://github.com/elasticpath/)
* A valid [Amazon Web Services (AWS) Account](https://console.aws.amazon.com)
* A valid [Amazon Developer Account](https://developer.amazon.com)

### Deploying the the Skill to AVS

1. Clone or pull the `alexa-skill` repository.

2. In the Alexa Developer Console, create a Custom, Self-Hosted skill.

3. Select the Start From Scratch template.

4. Select the JSON Editor from menu on the left, under Interaction Model.

5. Drag the `models/en-US.json` file into the JSON Editor.

6. Build the Model.

7. Select the Endpoint link from the menu on the left.

8. Enter the ARN for the Lambda you create in the [Setting up the Lambda](#setting-up-the-lambda) section, or an HTTPS endpoint where your skill is being hosted.

9. Save Endpoints.

10. Select Test from the header menu.

11. Select Development from the *Skill testing is enabled in* dropdown.

12.  You can now begin testing.

### Setting up the Lambda

1. Clone or pull the `alexa-skill` repository.

2. Navigate to the `alexa-skill/lambda/main`.

3. To install dependencies, run the `npm install  --production` command.

4. Zip up the contents of the current directory, including the `node_modules` folder.

5. In AWS, create a Lambda function with an Alexa Skills Kit trigger.  Currently, only the following AWS regions support Alexa Skills Kit triggers:
  * Asia Pacific (Tokyo)
  * EU (Ireland)
  * US East (N. Virginia)
  * US West (Oregon)

6. Enter the Skill ID from the Alexa Skill in the Configure Triggers input

7. Upload the zip file you created to your Lambda

8. Create an environment variable called `CORTEX_URL` that points to a publicly available Cortex endpoint.

9. Save the function.

### Setting up a Development Environment

Local development is enabled using the [alexa-skill-local](https://www.npmjs.com/package/alexa-skill-local) module.

1. You must complete the [Deploying the Skill to AVS](#deploying-the-the-skill-to-avs) section before developing locally.

2. Clone or pull the `alexa-skill` repository.

3. Run the `cd lambda/main` command.

4. Modify the `asl-config.json` file, replacing the placeholder `skillId` value with your Alexa Skill ID.

5. Run the `npm install` command to install depenedencies.

6. Create an environment variable called `CORTEX_URL` that points to a publicly available Cortex endpoint, or a valid Elastic Path development environment. For more information, see
[The Starting Construction Guide](https://developers.elasticpath.com/commerce/construction-home).

7. Run the `npm start` command to start the `alexa-skill-local` server.

8. In a browser, navigate to `localhost:3001` to link your local development environment to your Amazon Skill.

9. Take note the `ngrok` URL from the command line output.

10. In a browser, navigate to the Endpoint link under your Alexa skill.

11. Select HTTPS enpoint.

12. Enter the URL from Step 8.

13. Save Endpoints.

14. New sessions will be directed to your local skill. Changes will be hotswapped, and local Node debuggers can be attached.

## Project Structure

The lambda function lives under `lambda/main`.

You will find the Interaction Model for the skill under `models/en-US.json`.  For more information on the Interaction Model, visit the [Alexa Developer Documentation](https://developer.amazon.com/docs/custom-skills/create-the-interaction-model-for-your-skill.html)

## Intents Reference

Below is a quick table of the intents the skill uses, the actions they represent, and some sample phrases you might use to trigger them. If you are relaying any errors found to the developers, it may be helpful to tell them which intent triggered the error.

For a complete list of sample phrases, check the [Interaction Model](./models/en-US.json).

| Action                    | Sample Utterance                          | Intent Name                                           |
| ------------------------- | ----------------------------------------- | ----------------------------------------------------- |
| About Store               | "What do you sell?"                       | `DescribeStoreIntent`                                 |
| Search                    | "Search for {item}"                       | `KeywordSearchIntent`                                 |
| Next                      | "Next item"                               | `NextItemIntent`                                      |
| Previous                  | "Previous item"                           | `PreviousItemIntent`                                  |
| Describe Current Product  | "Tell me more about that"                 | `DescribeProductIntent` / `DescribeListedProductIntent` |
| Add to Cart               | "Add that to my cart"                     | `AddToCartIntent`                                     |
| Add to Wishlist           | "Add that to my wishlist"                 | `AddToWishlistIntent`                                 |
| Explore Cart              | "What's in my cart?"                      | `GetCartIntent`                                       |
| Explore Wishlist          | "What's in my wishlist?"                  | `GetWishlistIntent`                                   |
| Move to Wishlist          | "Move item two to my wishlist"            | `MoveToWishlistIntent`                                |
| Move to Cart              | "Move item three to my cart"              | `MoveToCartIntent`                                    |
| Remove from Cart          | "Remove item number three from my cart"   | `RemoveFromCartIntent`                                |
| Remove from Wishlist      | "Remove item number one from my wishlist" | `RemoveFromWishlistIntent`                            |
| Checkout                  | "I'd like to check out"                   | `CheckOutIntent`                                      |

In addition to these, the Alexa Reference Skill incorporates several out of the box Alexa intents.

| Action                    | Sample Utterance                          | Intent Name                                           |
| ------------------------- | ----------------------------------------- | ----------------------------------------------------- |
| Yes                       | "Yes"                                     | `AMAZON.YesIntent`                                    |
| No                        | "No"                                      | `AMAZON.NoIntent`                                     |
| Help                      | "Help / What are my options?"             | `AMAZON.HelpIntent`                                   |
| Exit                      | "Alexa, stop / exit"                      | `AMAZON.StopIntent`                                   |
| Cancel                    | "Cancel"                                 | `AMAZON.CancelIntent`                                 |

## Terms And Conditions

- Any changes to this project must be reviewed and approved by the repository owner. For more information about contributing, see the [Contribution Guide](https://github.com/elasticpath/alexa-skill/blob/master/.github/CONTRIBUTING.md).
- For more information about the license, see [GPLv3 License](https://github.com/elasticpath/alexa-skill/blob/master/LICENSE).
