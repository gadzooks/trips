This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

https://claude.ai/chat/33b47702-4327-4212-87e4-4528d2c51f6e

https://github.com/gadzooks/trips/settings/secrets/actions
- VERCEL_TOKEN https://vercel.com/account/tokens
- 

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Google auth
- https://claude.ai/chat/a72892ac-0f69-45d4-9261-991755a748b1
- https://console.cloud.google.com/auth/clients/1040972231721-n24hlat7ttt9rmg0sj5p5ohcoealt1uq.apps.googleusercontent.com?invt=Abmmhg&organizationId=0&project=trip-planner-446905&inv=1
- https://support.google.com/cloud/answer/6158849?hl=en#public-and-internal&zippy=%2Cauthorized-domains%2Cpublic-and-internal-applications%2Cstep-create-a-new-client-secret
- https://claude.ai/chat/9667dd7c-633a-4a80-a1cd-87a5d4247264

```bash
# https://authjs.dev/getting-started/installation
# These are the environment values that are needed to be set for Google Auth
AUTH_GOOGLE_ID=<google client id>
AUTH_GOOGLE_SECRET=<google client secret>
AUTH_SECRET=<generate. see https://claude.ai/chat/a72892ac-0f69-45d4-9261-991755a748b1>
AUTH_URL=http://localhost:3000
AWS_ACCESS_KEY_ID=<aws access key with dynamodb permissions>
AWS_SECRET_ACCESS_KEY=<aws access key with dynamodb permissoin>
AWS_REGION=us-west-2
```

```json
{
  "user": {
    "name": "Amit",
    "email": "foobar@gmail.com",
    "image": "https://path/to/url"
  },
  "expires": "2025-02-12T06:56:09.152Z",
}

```

### DB schema
| Description | PK | SK | Attribute |
|------------|----|----|-----------|
| Trip 1 for user | CREATEDBY#useri | UUID7 tripId | Title, isPublic |
| Trip 2 for user | CREATEDBY#useri | UUID7 tripId | Title, isPublic |
| tags | TAG#PUBLIC#travel | UUID7 tripId | Owner, isPublic, title |
| Tags 2 | TAG#PUBLIC#utah | UUID7 tripId | Owner, isPublic, title |
| Public tags | TAG#PUBLIC | UUID tripId | Title, IsPublic |
| Shared user | SHAREDWITH#userB | UUID tripId1 | Title, isPublic |
| Shared user | SHAREDWITH#userB | UUID tripId2 | Title, isPulic |
| Trip By Id | TRIPID#UUID | METADATA | All attributes live here |
| Tags - private | TAG#PRIVATE#travel | UUID7 | Title, isPublic |
| Tags - private | TAG#PRIVATE#usa | UUID7 | Title, isPublic |