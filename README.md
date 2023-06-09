# Setting up a project

Before running the project and using the app, there is a list of ENV variables that are required in order for the application to run. Create the local .env file in the root directory first. In this section you can find how to create or get the environmental variables.

List of environmetal variables that are required:
<code>

MONGODB_URI=`mongodb+srv://<username>:<password>@cluster0.0jp3cpr.mongodb.net/<database-name>?retryWrites=true&w=majority`

NEXTAUTH_SECRET=`<generated_nextauth_secret>`

AWS_ACCESS_KEY_ID=`<aws_access_key_id>`
AWS_SECRET_ACCESS_KEY=`<aws_secret_key>`

MAILER_API_KEY=`<api_key_mailerlite>`

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=`<publishable_key>`

NEXT_PUBLIC_STRIPE_SECRET_KEY=`<public_stripe_secret>`

NEXT_PUBLIC_STRIPE_WEBHOOK_SECRET=`<secret>`

PAYMENT_LINK=`<payment_link>`

NEXT_PUBLIC_BASE_URL=`<base_url>`

GOOGLE_USER=`<email_address>`

GOOGLE_APP_PASSWORD=`<generated_app_password>`
</code>

## MongoDB

 This project uses MongoDB database to store all the information. In order to be able to connect to it, you firstly need to create an account ([`create account link`](https://www.mongodb.com/cloud/atlas/lp/try4?utm_source=bing&utm_campaign=search_bs_pl_evergreen_atlas_core_prosp-brand_gic-null_emea-nl_ps-all_desktop_eng_lead&utm_term=mongodb%20atlas&utm_medium=cpc_paid_search&utm_ad=p&utm_ad_campaign_id=415204547&adgroup=1214960818278103&msclkid=7ff4724ad48e1951e3dd1635ce5db860)) and then set up your database on mongodb website. To set up a database, please follow the [`instructions`](https://www.mongodb.com/docs/atlas/tutorial/deploy-free-tier-cluster/) created by MongoDB (please click Atlas UI to see the instructions that you need). As it is indicated at the Next steps section of the above instructions, you need to add the IP address to the IP list. Please, do so by following this [`instructions`](https://www.mongodb.com/docs/atlas/security/add-ip-address-to-list/). After previous steps are done, you need to create the user for your database. You can follow [`this link`](https://www.mongodb.com/docs/atlas/tutorial/create-mongodb-user-for-cluster/) and follow the instructions there. Once everything is done, add `MONGODB_URI` evirinmental variable. This variable has the link to connect to the database. The link has placeholders that should be replaced with username and password of the user you created in the last step, and database name. The URI: `mongodb+srv://<username>:<password>@cluster0.0jp3cpr.mongodb.net/<database-name>?retryWrites=true&w=majority`

## NextAuth

NextAuth is the authentication tool that provides simplicity in developing the authentication system. It is used in this project, and in order for it to work `NEXTAUTH_SECRET` is required. Therefore, you need to generate the secret key by using any third-party websites (e.g. [`https://generate-secret.vercel.app/32`](https://generate-secret.vercel.app/32)), or if you have GitBash (Git) installed in your system, you can generate the secret key by pasting the following command in GitBash: `openssl rand -base64 32`

## AWS

This project uses AWS, and in particular the file storage solution AWS S3. It is used to store and retrieve all the images that users of this social media platform upload. In order for this project to communicate to AWS, two environmetal variables are needed: `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`. Both of them can be retrieved from the personal account on AWS. The insruction on how to do that can be found here: [`Set up AWS`](./docs/aws/setup-aws.md).

More information about AWS access keys can be found here: [`https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html`](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html)

## MailerLight

This third-party service is used for subcribing the users to the newsletters and later on sending the marketing emails to those users. Please, open the account on [`their website`](https://www.mailerlite.com/).

After you have openned the account and logged in, go to the following link to generate the API key, so that this project can communicate with MailerLight. The link: [`https://dashboard.mailerlite.com/integrations/api`](https://dashboard.mailerlite.com/integrations/api). Generate a new token, and then copy it and add to the environmental variable `MAILER_API_KEY`.

## Stripe

To handle the payments, this project makes use of Stripe. The information how to set up stripe for this project can be found in [`this document`](./docs/stripe-documentation/stripe.md).

## Base URL

There is an environmental variable called `NEXT_PUBLIC_BASE_URL` that needs to have the base url of a website (for example `https://tcorvus.com`). This env variable is required to generate the link that will be sent with email verification and password reset emails, so that users can be redirected back to a website.

## Gmail

In this project, Gmail is used to send email verification and password reset emails to users.

To set this up, add the email address that the emails will be sent from to `GOOGLE_USER` environmental variable (for example `GOOGLE_USER=noreply@email.com`).

The next step would be generating the app password, so that this project can access and send emails using the indicated email address. To do so, please follow the [`instructions`](https://support.google.com/accounts/answer/185833?hl=en) from Google on how to generate the App password. Once you do that, copy it and add to `GOOGLE_APP_PASSWORD` evironmental variable.

That is it! If you have followed the instructions that are described above, you should be able to successfully run this project.

# How to start the development server
First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```


This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.
