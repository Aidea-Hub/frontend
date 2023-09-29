## Aidea Hub

Try it out on: [https://aidea-hub.netlify.app/](https://aidea-hub.netlify.app/)

### Contributors

1. [Marcus Tang Xin Kye](https://github.com/MarcusTXK) | A0217934Y

   - Created frontend pages for users to view, search, vote, like and sort other ideas generated by the community or their own previously generated ideas
   - Implemented content generation for an idea, for sections such as product capabilities and competitive landscape.
   - Frontend:
     - Pages: Login, Inspiration, Search, Past Ideas, Liked, Settings, Policy and ToS pages
     - Other features: Google Analytics for pages and events, Themes, Idea image generation, Deployment
   - Backend:
     - firebase functions: generateIdeaContent, generateNewIdeaImage, likeIdea, voteIdea, login, updateUserSettings
     - content generation functions: generateReflection (Generats content, Reflect and criticizes them, Improves them), generateResearch (performs research on DuckDuckGo and Wikipedia )

2. [Taufiq Bin Abdul Rahman](https://github.com/tau-bar) | A0218081L
   - Created frontend pages for users to enter their problem, page for users to view the 4 generated ideas, and the full idea page to display the full idea content
   - Implemented 4 different idea generation methods, which are used for the generation of ideas given a problem
   - Frontend:
      - Pages: Home Page, Idea Generation Page, Full Idea Page (with realtime updates)
   - Backend:
      - Firebase Functons: generateIdeas
      - Content Generation Functions: generateIdea1, generateIdea2, generateIdea3, generateIdea4  

3. [Albert Ariel Widiaatmaja](https://github.com/albertarielw) | A0237848M
  - Created initial design for backend and database functions
  - Created frontend pages for landing page and subscription page for users to subsribe to AideaHub Plus
  - Implement backend functions for user subscription to premium features
  - Frontend:
     - Pages: Landing Page, Subscription Page
  - Backend:
     - Firebase Functions: subscribe, scheduleMonthlyTopupOfCredits, callback function for users who stop payment

### Setup for local testing

1. Git clone the following repositories:
   - [frontend](https://github.com/Aidea-Hub/frontend)
   - [cloud functions](https://github.com/Aidea-Hub/backend)
   - [ai cloud functions](https://github.com/Aidea-Hub/ai-backend)

Note: the following steps will be for setting up of frontend. For the other repositories, following their respective README.md instructions to run locally.

2. Setup `.env` for frontend. You will need to create a firebase project and add the following to the `.env` file

```
REACT_APP_GOOGLE_CLIENT_ID=

REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_SENDER_ID=
REACT_APP_FIREBASE_APP_ID=
REACT_APP_FIREBASE_MEASUREMENT_ID=

REACT_APP_CLOUD_FUNCTION_PROD_URL=
REACT_APP_CLOUD_FUNCTION_DEV_URL=
```

3. Run frontend locally

```
cd frontend
npm run start
```

### Resources used/referred to

- [Chakra UI](https://chakra-ui.com/)
- [Chakra Templates](https://chakra-templates.dev/)
- [Open AI API endpoints](https://platform.openai.com/docs/api-reference)
- [Langchain](https://python.langchain.com/docs/get_started/introduction)
- [langchain_experimental.smart_llm.base](https://api.python.langchain.com/en/latest/_modules/langchain_experimental/smart_llm/base.html#SmartLLMChain)
