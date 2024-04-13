# Project Name

This project demonstrates a full-stack application deployment using AWS Cloud Development Kit (AWS CDK) and GitHub Actions. It includes a backend API powered by AWS Lambda and API Gateway, secured by Amazon Cognito, and a frontend application hosted on Amazon S3 and distributed via Amazon CloudFront.

## Architecture Overview

The application is divided into two main parts:
- **Backend**: Manages user authentication and provides a secured API endpoint.
- **Frontend**: A React application that interacts with the backend and is hosted as a static site on AWS.

### Backend Components

- **AWS Lambda**: Handles backend logic.
- **API Gateway**: Provides RESTful API endpoints.
- **Amazon Cognito**: Manages user authentication and authorization.

### Frontend Components

- **Amazon S3**: Hosts the static React application files.
- **Amazon CloudFront**: Distributes the website globally and provides HTTPS.

## Prerequisites

To deploy and run this project, you will need:
- AWS account with appropriate permissions.
- Node.js and npm installed.
- AWS CLI configured with your credentials.
- GitHub account for managing CI/CD pipeline.

## Setup Instructions

### Clone the Repository

Start by cloning this repository to your local machine:

```bash
git clone https://github.com/ghost9933/AWS-CDK-FileuploadAPP.git
cd AWS-CDK-FileuploadAPP
