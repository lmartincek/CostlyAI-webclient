# CostlyAI - web client
This repo contains the client code for the [CostlyAI API](https://github.com/lmartincek/CostlyAI).

## What is CostlyAI?
**CostlyAI** is an AI-generated dataset that provides insights into the prices of everyday essentials, including:

- **Essential groceries**
- **Services**
- **Accommodation**
- **Gym memberships**

This dataset is designed to help **travelers**, **expats**, and **potential residents** understand the local cost of living in various locations. Whether you're planning a trip, considering a move, or just curious about expenses in different areas, CostlyAI has you covered.

## Setup
This project requires Node v18+ and npm v9+. Install them first.

- [Node.js](https://nodejs.org/en/)
- [NPM](https://www.npmjs.com/package/npm)

Clone the repository and install the dependencies.
```bash
git clone https://github.com/lmartincek/CostlyAI-webclient.git

cd swing-client

# Install dependencies
npm install

# Start the development server
npm run dev

# Build the project
npm run build
```

## ToDo / Work in Progress
- [ ] Show from what date is data being shown, if it's fresh let the user know about it
- [ ] Add loader while calling chat completion
- [ ] Add typing option to select inputs with suggestion set
- [ ] Add register/login
- [ ] Add customized data set option for auth user
