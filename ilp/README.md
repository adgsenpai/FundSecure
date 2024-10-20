# FundSecure: Secure and Anonymous Fundraising Platform

![FundSecure Logo](public/logo.webp) <!-- Replace with your actual logo -->

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [System Architecture](#system-architecture)
  - [High-Level Architecture](#high-level-architecture)
  - [Component Description](#component-description)
- [Database Design](#database-design)
  - [Tables and Relationships](#tables-and-relationships)
  - [Database Schema](#database-schema)
- [User Flows](#user-flows)
  - [Onboarding and Validation](#onboarding-and-validation)
  - [Creating Events/Projects](#creating-eventsprojects)
  - [Tipping/Sponsoring](#tipponsoring)
  - [Unlocking Exclusive Content](#unlocking-exclusive-content)
- [User Interface Design](#user-interface-design)
  - [Login Screen](#login-screen)
  - [Signup Screen](#signup-screen)
  - [Dashboard](#dashboard)
  - [Create Project Screen](#create-project-screen)
  - [Project Page](#project-page)
  - [Tip/Sponsor Screen](#tip-sponsor-screen)
  - [Exclusive Content Unlocked](#exclusive-content-unlocked)
  - [Leaderboard](#leaderboard)
  - [Landing Page](#landing-page)
  - [Search Functionality](#search-functionality)
  - [Pagination](#pagination)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Local Setup](#local-setup)
  - [Using Docker](#using-docker)
- [Running the Application](#running-the-application)
  - [Running Locally](#running-locally)
  - [Running with Docker Compose](#running-with-docker-compose)
- [Environment Variables](#environment-variables)
- [API Integrations](#api-integrations)
  - [Interledger Open Payments API](#interledger-open-payments-api)
  - [Sanctions API](#sanctions-api)
- [Security and Compliance](#security-and-compliance)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)

---

## Introduction

FundSecure is a secure and anonymous fundraising platform designed to facilitate AI-powered events for fundraising or project funding. Inspired by platforms like Patreon, FundSecure enhances user experience by offering features such as anonymous tipping and cryptocurrency support, ensuring both flexibility and privacy for users.

## Features

- **Secure Payments with Interledger**: Seamless, cross-network micropayments ensuring instant and secure donations.
- **High-Performance Ledger**: Utilizes TigerBeetleDB to handle millions of transactions per second with real-time tracking.
- **Anonymous Transactions**: Protects user privacy by allowing anonymous payments.
- **Scalable Microservices**: Docker-based architecture ensures effortless scalability.
- **Seamless Integration with Rafiki Wallet**: Provides a secure and user-friendly interface for managing funds.
- **Robust Database Management**: Powered by Prisma and PostgreSQL for data integrity and efficient handling.
- **Unique Project Pages**: Customizable project pages with unique links.
- **Leaderboards**: Displaying anonymous profiles and contribution amounts.
- **AI-Powered Events**: Enhancing user engagement and content creation.

## Technologies Used

- **Frontend**: [Next.js](https://nextjs.org/)
- **Backend**: Node.js with Express
- **Database**: PostgreSQL managed via [Prisma ORM](https://www.prisma.io/)
- **Payments**: [Interledger Open Payments API](https://interledger.org/)
- **Containerization**: [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)
- **AI Integration**: Custom AI solutions for event management and content generation
- **Wallet Integration**: [Rafiki Wallet](https://wallet.interledger-test.dev/) *(Replace with actual URL)*

## System Architecture

### High-Level Architecture

![Architecture Diagram](https://mermaid.ink/svg/pako:eNp1k0Fv2zAMhf8KoZMHdOvdhwLJggEB2i5LNuziCyfRLhdb8ii6WFD0v0-2VyCGVZ8s8X1P4iP0YmxwZEoT6c9A3tKOsRHsKg_p61GULffoFX5EkvXuFwleyTsoHumvfvodP6w1W7TnSbI57DPlw3F_ethA8fX4kKuGqI3Q6ds9FLttRvCdG5Itkba020JxTy6tM7oj1nxm-IltSwrFAS8deR3vO2vH_j7e3a0bKmFjLcUI9eCdIEf2DfQtah3kf05rKDkt2i7hNPzqWMEFj8rB3yr3M7zQJe46j4ThM4EK-oh25EDGQUWd2WvtiC7DSrQGWeKOFLmN-aPzWZZwJBvELXzYQzuV807vpV3CQcKUZj9vwTMj7FN6cm33Hr6O9XPwNUv3Zpe_TW6oj0G5vkxjh1BDHKYhV97cmI6kQ3bpVbyMfpXRJ-qoMmX6dSjnylT-Nelw0HC6eGtKlYFujISheTJljW1Mq6F3qG_vaZa8_gOV8SUm) <!-- Replace with your actual diagram -->

### Component Description

- **Web Client**: The frontend interface built with Next.js where users interact with the platform.
- **Backend API**: Handles business logic, user authentication, and communication with external APIs.
- **Interledger Open Payments API**: Facilitates payments and transactions across different cryptocurrencies.
- **Payment Rails**: The underlying cryptocurrency networks used for transactions.
- **Database**: PostgreSQL database managed via Prisma ORM for data persistence.
- **AI Services**: AI-powered services enhancing event management and content creation.
- **Identity Verification Service**: Integrates with Sanctions API for user onboarding and validation.

 

## User Flows

### Onboarding and Validation

1. **Sign Up**: User signs up on the platform.
2. **Identity Validation**: System triggers the Sanctions API for identity verification.
3. **Validation Result**:
   - **Success**: User can create projects.
   - **Failure**: User is notified and cannot proceed until resolved.

### Creating Events/Projects

1. **Access Creation Page**: Authenticated user navigates to the 'Create Project' page.
2. **Fill Details**: User inputs project title, description, and other relevant details.
3. **Submit**: Upon submission, the system generates a unique project page and link.

### Tipping/Sponsoring

1. **Visit Project Page**: Anonymous user visits a specific project page.
2. **Select Currency and Amount**: User chooses a cryptocurrency and enters the tip amount.
3. **Optional Message**: User can add a custom message.
4. **Process Payment**: Payment is processed via the Interledger API.
5. **Confirmation**: User receives confirmation of the successful tip.

### Unlocking Exclusive Content

1. **Tip Threshold**: After tipping, the system checks if the amount meets the threshold for exclusive content.
2. **Content Access**: If eligible, exclusive content is unlocked for the user.

 
## Installation

### Prerequisites

Ensure you have the following installed on your system:

- **Node.js**: [Download Node.js](https://nodejs.org/en/)
- **Docker**: [Install Docker](https://www.docker.com/get-started)
- **Docker Compose**: [Install Docker Compose](https://docs.docker.com/compose/install/)
- **Git**: [Install Git](https://git-scm.com/downloads)

### Local Setup

1. **Clone the Repository**

   ```bash
   git clone https://github.com/ADGSTUDIOS/InterledgerHackathon.git
   cd InterledgerHackathon
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Set Up Environment Variables**

   Create a `.env` file in the root directory and add the following variables:

   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/fundsecure
   INTERLEDGER_API_KEY=your_interledger_api_key
   SANCTIONS_API_KEY=your_sanctions_api_key
   RAFIKI_WALLET_API_KEY=your_rafiki_wallet_api_key
   ```

   *Replace the placeholder values with your actual configuration details.*

4. **Run Database Migrations**

   Ensure PostgreSQL is running and execute:

   ```bash
   npx prisma migrate dev --name init
   ```

### Using Docker

1. **Build the Docker Image**

   ```bash
   docker-compose build
   ```

2. **Run the Docker Container**

   ```bash
   docker-compose up
   ```

   The application will be accessible at [http://localhost:3000](http://localhost:3000).

## Running the Application

### Running Locally

1. **Start the Development Server**

   ```bash
   npm run dev
   ```

2. **Access the Application**

   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Running with Docker Compose

1. **Build the Docker Image**

   ```bash
   docker-compose build
   ```

2. **Start the Application**

   ```bash
   docker-compose up
   ```

3. **Access the Application**

   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Stop the Application**

   Press `CTRL + C` in the terminal where Docker Compose is running, then execute:

   ```bash
   docker-compose down
   ```

## Environment Variables

Create a `.env` file in the root directory and define the following environment variables:

```env
# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/fundsecure

# API Keys
INTERLEDGER_API_KEY=your_interledger_api_key
SANCTIONS_API_KEY=your_sanctions_api_key
RAFIKI_WALLET_API_KEY=your_rafiki_wallet_api_key

# Next.js Configuration
NEXT_PUBLIC_API_URL=https://api.fundsecure.com
```

*Ensure that sensitive information like API keys is kept secure and not committed to version control.*

## API Integrations

### Interledger Open Payments API

- **Purpose**: Facilitates payments and transactions across different cryptocurrencies.
- **Usage**:
  - Handle micropayments from donors.
  - Ensure secure and instant transactions.
- **Configuration**:
  - Set `INTERLEDGER_API_KEY` in your `.env` file.
  - Utilize the Interledger SDK or REST API for integration.

### Sanctions API

- **Purpose**: Validates user identities against global sanctions lists to ensure compliance.
- **Usage**:
  - Validate user sign-ups.
  - Prevent fraudulent activities.
- **Configuration**:
  - Set `SANCTIONS_API_KEY` in your `.env` file.
  - Integrate API calls during the onboarding process.

## Security and Compliance

- **AML/KYC Compliance**: Ensure all transactions comply with Anti-Money Laundering (AML) and Know Your Customer (KYC) regulations.
- **Secure Communication**: Use HTTPS for all communications to protect data in transit.
- **Authentication**: Implement secure authentication mechanisms, such as JWTs and password hashing.
- **Data Protection**: Encrypt sensitive data at rest and in transit.
- **Regular Audits**: Conduct regular security audits and code reviews to identify and mitigate vulnerabilities.

## Future Enhancements

- **Expand Cryptocurrency Support**: Add more cryptocurrencies to cater to a broader audience.
- **Mobile Application**: Develop mobile apps for iOS and Android to increase accessibility.
- **Enhanced AI Integration**: Utilize AI for personalized content recommendations and event management.
- **Advanced Analytics**: Provide users with detailed analytics on their fundraising campaigns.
- **Localization**: Support multiple languages to reach a global audience.
- **Social Features**: Implement social sharing and community-building features to enhance user engagement.
