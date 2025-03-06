![Browserflow Logo](https://s3-eu-west-1.amazonaws.com/tpd/logos/675a07be8d2cf551a4f539e0/0x0.png)

# Browserflow for LinkedIn

The **Browserflow Node** allows you to automate LinkedIn interactions using the Browserflow API. This node provides a variety of operations to interact with LinkedIn profiles, scrape data, send connection invites, and more.

You can get an API key by registering for a free 7-day trial [here](https://browserflow.io/n8n).

---

## Features

- **Check Connection**: Check the connection status of a LinkedIn profile.
- **Get Profile Data**: Retrieve data from a LinkedIn profile.
- **Send Connection Invite**: Send a connection invite to a LinkedIn profile (with an optional message).
- **Get Chat History**: Retrieve chat history from a LinkedIn conversation.
- **Scrape Profiles from Search**: Scrape LinkedIn profiles based on search criteria (e.g., category, search term, location).
- **Scrape Profiles from Post Comments**: Scrape profiles from LinkedIn post comments and reactions.
- **Send Message**: Send a direct message to a LinkedIn profile (with a mandatory message).

---

## Node Operations

### 1. Check Connection
- **LinkedIn URL**: The LinkedIn profile URL to check the connection status.
- **Endpoint**: `/linkedin-check-connection-status`

### 2. Get Profile Data
- **LinkedIn URL**: The LinkedIn profile URL to retrieve data.
- **Endpoint**: `/linkedin-profile-data`

### 3. Send Connection Invite
- **LinkedIn URL**: The LinkedIn profile URL to send a connection invite.
- **Add Message**: Toggle to include a custom message.
- **Message**: Optional message to include in the invite.
- **Endpoint**: `/linkedin-connection-invite`

### 4. Get Chat History
- **LinkedIn URL**: The LinkedIn profile URL to retrieve chat history.
- **Endpoint**: `/linkedin-get-chat-history`

### 5. Scrape Profiles from Search
- **Category**: The category to scrape (persons or companies).
- **Search Term**: The search term to use for scraping.
- **Number of Pages**: The number of pages to scrape.
- **City**: The city to filter the search results.
- **Country**: The country to filter the search results.
- **Endpoint**: `/linkedin-scrape-profiles-from-search`

### 6. Scrape Profiles from Post Comments
- **Post URL**: The URL of the LinkedIn post to scrape profiles from.
- **Add Comments**: Toggle to include comments in the scrape results.
- **Comments Offset**: The number of comments to skip.
- **Comments Limit**: The maximum number of comments to scrape.
- **Add Reactions**: Toggle to include reactions in the scrape results.
- **Reactions Offset**: The number of reactions to skip.
- **Reactions Limit**: The maximum number of reactions to scrape.
- **Endpoint**: `/linkedin-scrape-profiles-from-post-comments`

### 7. Send Message
- **LinkedIn URL**: The LinkedIn profile URL to send a message.
- **Message**: The message to send (mandatory).
- **Endpoint**: `/linkedin-send-message`

---

## Example Workflows

### Example 1: Send a Connection Invite
1. Add the **Browserflow Node** to your workflow.
2. Set the operation to **Send Connection Invite**.
3. Provide the LinkedIn profile URL.
4. Optionally, enable **Add Message** and provide a custom message.
5. Execute the workflow to send the connection invite.

### Example 2: Scrape Profiles from Search
1. Add the **Browserflow Node** to your workflow.
2. Set the operation to **Scrape Profiles from Search**.
3. Provide the search criteria (e.g., category, search term, location).
4. Execute the workflow to scrape profiles based on the search criteria.

### Example 3: Send a Direct Message
1. Add the **Browserflow Node** to your workflow.
2. Set the operation to **Send Message**.
3. Provide the LinkedIn profile URL and the message.
4. Execute the workflow to send the message.

---