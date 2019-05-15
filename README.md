# Faction C2 Console

This is the web interface for Faction C2. It is built using [Vue](https://vuejs.org/)

## Installing and Running
This is installed by default through the stanard [Faction Install Process](https://www.factionc2.com/docs/#installing-faction). You should only have to manually install this if you'd like to modify it.

To install this manually:

1. Clone the repo
2. `npm install`
3. `npm run serve`

This will start up a development server running the console

By default, in a development environment, the console expects to be able to contact the API at http://localhost:5000/api/v1/, which means you'll have to run the API locally. If you'd like to change this behavior, edit the `.env.development` file.