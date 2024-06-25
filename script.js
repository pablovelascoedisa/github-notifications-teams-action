const axios = require("axios");

const ghContext = JSON.parse(process.env.CONTEXT)
const teamsLink = process.env.TEAMS;

const eventType = ghContext.issue ? "issue" : ghContext.pull_request ? "pr" : "generic"

const generateMessageActions = () => {

    if (eventType === "issue") {
        return [
            {
                "type": "Action.OpenUrl",
                "title": "Check Issue",
                "url": ghContext.issue.html_url,
                "role": "button"
            }
        ]
    }
    if (eventType === "pr") {
        return [
            {
                "type": "Action.OpenUrl",
                "title": "Check PR",
                "url": ghContext.pull_request._links.html.href,
                "role": "button"
            },
            {
                "type": "Action.OpenUrl",
                "title": "PR commits",
                "url": ghContext.pull_request._links.html.href + '/commits',
                "role": "button"
            },
            {
                "type": "Action.OpenUrl",
                "title": "PR changes",
                "url": ghContext.pull_request._links.html.href + '/files',
                "role": "button"
            }
        ]
    }
}

const generateMessageFooter = () => {
    let footer = {
        "type": "FactSet",
        "facts": [
            { "title": "📁 Repo: ", "value": ghContext.repository.name },
            { "title": "🧑‍💻 Author: ", "value": eventType === "issue" ? ghContext.issue.user.login : ghContext.pull_request.user.login }

        ]
    }

    if (eventType !== "issue" && ghContext.pull_request.requested_reviewers.length > 0) {

        const requestedReviewers = ghContext.pull_request.requested_reviewers;
        const reviewers = requestedReviewers.map(reviewer => reviewer.login).join(', ');

        footer.facts.push({
            title: "🔎 Reviewers: ",
            value: reviewers
        });

    }

    return footer
}

const generateMessageBody = () => {
    let body = {
        "type": "TextBlock",
        "text": process.env.CUSTOM_BODY ? process.env.CUSTOM_BODY : eventType === "issue" ? ghContext.issue.body : ghContext.pull_request.body,
        "wrap": true
    }
    return body
}

const generateMessageTitle = () => {

    let cardTitle = process.env.CUSTOM_TITLE ? process.env.CUSTOM_TITLE : eventType === "issue" ? '🛠️ Issue : ' + ghContext.issue.title : '🚀 PR: ' + ghContext.pull_request.title

    let title = {
        "type": "ColumnSet",
        "columns": [
            {
                "type": "Column",
                "items": [
                    {
                        "type": "TextBlock",
                        "size": "Medium",
                        "weight": "Bolder",
                        "text": cardTitle,
                        "style": "heading",
                        "wrap": true
                    }
                ],
                "width": "stretch",
                "horizontalAlignment": "Left",
                "verticalContentAlignment": "Center"
            }
        ],
        "horizontalAlignment": "Left",
        "spacing": "None"
    }
    return title;
}

const generateMessageImages = () => {
    return {
        "type": "Image",
        "url": ghContext.action === "opened" ? 'https://raster.shields.io/badge/Opened-green.png' : 'https://raster.shields.io/badge/Closed-red.png',
        "altText": "Alt text"
    }
}

const generateMessage = () => {

    let cardSummary = ""

    if (process.env.CUSTOM_TITLE) {
        cardSummary = process.env.CUSTOM_TITLE
    } else {
        cardSummary = eventType === "issue" ? '🛠️ Issue : ' + ghContext.issue.title : '🚀 PR: ' + ghContext.pull_request.title
    }
    let msg = {
        "type": "message",
        "summary": cardSummary,
        "attachments": [
            {
                "contentType": "application/vnd.microsoft.card.adaptive",
                "contentUrl": null,
                "content": {
                    "type": "AdaptiveCard",
                    "version": "1.2",
                    "body": [
                        generateMessageTitle(),
                        generateMessageBody(),
                        process.env.SHOW_GIT_FOOTER && eventType !== "generic" ? generateMessageFooter() : null,
                        process.env.SHOW_GIT_STATUS && eventType !== "generic" ? generateMessageImages() : null
                    ].filter(item => item !== null),
                    "actions": generateMessageActions(),
                    "version": "1.5"
                }
            }
        ]
    }

    return msg
}


teamsLink
    ? axios.post(teamsLink, generateMessage())
        .catch(error => { console.error(error) })
    : console.log("Configure Teams webhook link")
