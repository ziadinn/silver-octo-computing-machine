
# AWS Workshop

## Prerequisites
- AWS account
- Our demo repo cloned locally
- AWS console in **us-east-1**

https://github.com/user-attachments/assets/c8fbe74a-87da-4d38-ae7c-48275e5c949d

## Deploying our App

### Step One: Creating a DynamoDB table
For this step, we'll be creating a DynamoDB table where we can store our visitor count.

1. Go to your AWS console and visit the DynamoDB page
2. Click on the "Create table" button
3. Name the table `visitors`
    1. This name has to be exactly `visitors` for the backend to work, this includes the casing
4. Set the partition key to `id` with a data type of `String`
5. Click on the "Create table" button

https://github.com/user-attachments/assets/d4ad413b-5b25-4a73-bd4e-f7e73d9fd893

Our table is now created!

## Step Two: Adding an initial visitor count
For this step, we'll be adding an initial visitor count to our table.

1. Go to your DynamoDB console and visit the `visitors` table
2. Click on the "Actions" button and select "Create item"
3. Switch to "JSON view" and add the following JSON to the item:

```
{
  "id": { "S": "visitorCount" },
  "count": { "N": "0" }
}
```

4. Click on the "Create item" button

https://github.com/user-attachments/assets/35a936c6-c4e2-4432-9968-27a80c789f69

Our visitor count is now set to 0!

## Step Three: Starting up our EC2 backend
For this step, we'll be setting up our backend to connect to our DynamoDB table.

1. Go to your EC2 console and visit the "Instances" page
2. Click on the "Launch instance" button
3. We'll be using the defaults for most of the options, but make sure to select the "t2.micro" instance type
4. On the "Key Pair" section, you can create a new key pair
    1. This will download a file that you can use to connect to your instance. Keep this for later!
5. On the "Network settings" section, click on the "Edit" button
    1. The default security should allow all traffic for SSH, HTTP, and HTTPS. 
6. Click on "Add security group rule"
7. Set the "Type" to "Custom TCP" and set the "Port Range" set to 3000
    1. Set the source to `0.0.0.0/0` to allow all IP addresses
    2. This will allow us to connect to our backend from our local machine
8. Click on the "Launch" button

https://github.com/user-attachments/assets/149b1c37-174b-482a-a3ef-af64925c909c

Our EC2 instance should now be running!

## Step Four: Giving our EC2 instance access to our DynamoDB table
For this step, we'll be giving our EC2 instance access to our DynamoDB table.

1. Go to the IAM console, click on the "Roles" tab on the left side of the screen
2. Click on the "Create role" button
3. For the "Trusted entity type", select "AWS service" with EC2 as the use-case
4. Click on the "Next" button
5. Search for "AmazonDynamoDBFullAccess" and select it
6. Give it a name, e.g. "EC2DynamoDBAccess"
7. Click on the "Create role" button
8. Go to the EC2 console and visit the "Instances" page
9. Right click on your instance and click on "Modify IAM role" in the "Security" section
10. Select the "EC2DynamoDBAccess" role and click on the "Apply" button

Our EC2 instance should now have access to our DynamoDB table!

## Step Five: Deploying our backend
For this step, we'll be deploying our backend to our EC2 instance.

1. Go to the EC2 console and visit the "Instances" page
2. Right click on your instance and click on the "Connect" button
   1. We'll want to connect using the key pair we created earlier
3. Click on the SSH client and follow the steps to connect to your instance
    1. EC2 will give you the commands needed to connect to your instance
    2. [If you're using Windows, you might need to do some extra steps to get the key pair to work](https://learn.microsoft.com/en-us/windows/terminal/tutorials/ssh)
4. Once you're connected, we're going to want to clone our repo and install the dependencies

```bash
sudo yum update && sudo yum install git
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash && source ~/.bashrc && nvm install --lts
git clone https://github.com/ziadinn/silver-octo-computing-machine.git
cd silver-octo-computing-machine/backend
npm i
```

5. We can run our backend with:

```bash
npm run prod
```

Our backend is now deployed!

**Note:** This will run on port 3000 in our backend, and will terminate if we stop the process. There are ways to persist our backend, but for now, this will work.

## Step Six: Deploying our frontend
For this step, we'll be deploying our frontend to an S3 bucket.

**Note:** This part will be done on your local machine.

1. To connect our frontend to our backend, we'll need to update the `API_URL` variable in our `web/src/App.tsx` file.
2. Go to your EC2 console and visit the "Instances" page
3. Click on the instance you created earlier and copy the public IPv4 address at the bottom of the page
4. Update the `API_URL` variable in our `web/src/App.tsx` file with the following:

**IMPORTANT:** You need to replace `<INSERT_YOUR_EC2_PUBLIC_IP>` with the public IPv4 address of your EC2 instance and have the `http://` prefix.

```tsx
const API_URL = IS_PROD ? "http://<INSERT_YOUR_EC2_PUBLIC_IP>:3000" : "http://localhost:3000";
```

4. Build our frontend

```bash
cd web
npm i
npm run build
```

5. Go to your S3 console and visit the "Buckets" page
6. Click on the "Create bucket" button
7. Name your bucket anything you want
    1. This name must be unique, since all buckets are globally unique
8. Most of the defaults should be good, but we'll want to disable the "Block all public access" option
9. Click on the "Create bucket" button
10. Once the bucket is created, click on it to open the bucket page
11. Go to the "Properties" tab
12. We'll scroll down to the "Static website hosting" section
    1. Click on the "Edit" button
    2. Enable "Hosting"
    3. Set the "Hosting type" to "Host a static website"
    4. Set the "Index document" to `index.html`
    5. Click on the "Save" button
13. Go to the "Permissions" tab
14. We'll go to the "Bucket Policy" section and add the following policy:

**IMPORTANT:** In the resource, you need to replace `${YOUR_BUCKET_NAME}` with the name of your bucket.
Example: `arn:aws:s3:::my-bucket/*`

Be sure to remove the dollar sign and curly braces from the resource.

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::${YOUR_BUCKET_NAME}/*"
        }
    ]
}
```

15. Go back to your bucket page
16. Click on the "Upload" button on the page
17. Click on the "Add files" button and select all the files in the `dist/` folder
18. Click on the "Upload" button to upload the files to your bucket
19. Once the files are uploaded, you can visit your app at `http://<your-bucket-name>.s3-website-us-east-1.amazonaws.com`

Our frontend is now deployed!

## Step Seven: Cleaning up
For this step, we'll be cleaning up the resources we've created.

1. Go to the EC2 console and visit the "Instances" page
2. Right click on your instance and click on the "Terminate" button
3. Click on the "Terminate" button to delete your instance
4. Go to the S3 console and visit the "Buckets" page
5. Select your bucket by clicking on the circle on the left side of your Bucket
6. Click on the "Delete bucket" button
7. Go to the DynamoDB console and visit the "Tables" page
8. Select your table by clicking on the box on the left side of your Table
9. Click on the "Delete table" button to delete your table
