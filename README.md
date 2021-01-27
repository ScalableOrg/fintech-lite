# fintech-lite
I had an idea to built a basic digital bannk on a series of livestreams, so this repository is where all the code will live.

## Disclaimer
All the code here may not exactly be _production ready_. I'm building this during livestreams, so I'm doing just enough for people to get the concepts.

## Getting Started

1. You need to have [Node.js](https://nodejs.org/en/download) and [MySQL](https://dev.mysql.com/downloads/mysql/) installed. 
2. Install project dependencies by running `npm install`.
3. Create a `.env` file in the root directory and add your databae details. It should have the following properties:
- DATABASE_HOST=
- DATABASE_USERNAME=
- DATABASE_PASSWORD=
- DATABASE_NAME=
- DATABASE_PORT=
4. Run the migrations to create database tables by running `npm run migrate`.
5. You can create two users by calling the `createUser` function in `app.js` with the `username` and `password` arguments. Something like this:

```
createUser('johndoe', 'doedoe').then(console.log).catch(console.log);
createUser('johnlol', 'lololo').then(console.log).catch(console.log)
```
This will generate records in both the `users` table as well as `accounts` table. 

6. You can go ahead to test each transaction function.


## Branches
Branches are prperly named and created per feature. So to see the code for a particular feature, you can switch to the corresponding branch in the UI.
## Contributions

### Feature Requests
You can suggest a feature by creating an issue and adding the label `request` to it.