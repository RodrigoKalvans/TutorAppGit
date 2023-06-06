# Set up AWS

As it is mentioned in the [`README`](../../README.md) file, this project uses AWS S3 tool to store images.

Follow the link and finish fully parts 1 and 2. Here is the link: [`https://medium.com/@louis_10840/how-to-interact-upload-files-get-files-with-amazon-s3-using-nextjs-app-fcbad408033b`](https://medium.com/@louis_10840/how-to-interact-upload-files-get-files-with-amazon-s3-using-nextjs-app-fcbad408033b). Note, that the guide was not created by us, the author is Louis Giron.

After you create an AWS IAM User, retrieve the Access key id and Secret access key, and add them the respectively to the environmental variables `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`.  

When you reach the second part when you need to create buckets, create two buckets the same way it is described in the article. Call one bucket `tcorvus-post-images-bucket` and the second one `tcorvus-profile-images-bucket`. Naming is important.

After you have create the IAM user, two S3 buckets, and added the access keys information to the envirnmental variable, you are done configuring AWS for this project.