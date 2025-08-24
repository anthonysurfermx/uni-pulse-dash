# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/421c89cd-fec3-416d-ac44-aae91ad5d036

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/421c89cd-fec3-416d-ac44-aae91ad5d036) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- GraphQL (for swap data)
- Web3 integration (wagmi, viem)

## Features

### Swap Data Integration
The application now includes a GraphQL integration to fetch swap data from the Uniswap indexer:

- **GraphQL Endpoint**: `https://indexer.bigdevenergy.link/bb1a9fc/v1/graphql`
- **Swap History Panel**: Displays recent swaps for connected wallets
- **Real-time Data**: Shows swap amounts, tokens, timestamps, and pool information
- **Demo Mode**: Falls back to mock data when the GraphQL endpoint is unavailable

### Wallet Integration
- Connect your wallet to automatically fetch swap data
- View swap history for any Ethereum address
- Real-time updates when wallet connection changes

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/421c89cd-fec3-416d-ac44-aae91ad5d036) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
