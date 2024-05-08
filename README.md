# TWITTER-X CLONE

<p align="center">
<img alt='/' src="/screenshots/home.png" width="900px" height="auto"/>
</p>

Key Features:

- 🤖 Follow / Unfollow users
- 📈 Create and edit posts
- 🦾 Customize your profile
- 💎 Daisy UI for a clean UI
- 📱 Full responsiveness for all devices
- 🔒 JWT Authentication
- 📦 MongoDB database
- 📺 NX for monorepo build system


### Prerequisites

**Node version 14.x**

### Cloning the repository

```shell
git clone https://github.com/DracoR22/Twitter-X-Clone
```

### Install packages

```shell
pnpm install
```

### Start the app

```shell
pnpm dev
```

## Available commands

Running commands with npm `pnpm [command]`

| command | description                              |
| :------ | :--------------------------------------- |
| `dev`   | Starts a development instance of the app |
| `build` | Build all workspaces projects            |
| `lint`  | Check lint for all projects              |
| `nx build @twiiter-clone/web` | Build the web project           |
| `nx build @twiiter-clone/api` | Build the api project           |