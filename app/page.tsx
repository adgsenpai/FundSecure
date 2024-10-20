import Card from "@/components/home/card";
import Image from "next/image";
import React from "react";

export default function Home() {
  return (
    <>
      {/* Header Section */}
      <div className="z-10 w-full max-w-xl px-5 xl:px-0 mx-auto text-center">
        <div
          className="mx-auto mb-5 flex max-w-fit animate-fade-up items-center justify-center space-x-2 overflow-hidden rounded-full bg-green-100 px-7 py-2 transition-colors hover:bg-green-200"
        >
          {/* Green Background Badge */}
          <p className="text-sm font-semibold text-[#2a9d8f]">
            Introducing FundSecure
          </p>
        </div>
        <h1
          className="animate-fade-up bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-sfPro text-4xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm [text-wrap:balance] md:text-7xl md:leading-[5rem]"
          style={{ animationDelay: "0.15s", animationFillMode: "forwards" }}
        >
          Empower Your Fundraising Efforts
        </h1>
        <p
          className="mt-6 animate-fade-up text-center text-gray-500 opacity-0 font-inter [text-wrap:balance] md:text-xl"
          style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
        >
          Secure, Anonymous, and Real-Time Solutions to Manage and Grow Your Fundraising Campaigns Effortlessly.
        </p>
        <div
          className="mx-auto mt-6 flex animate-fade-up items-center justify-center space-x-5 opacity-0"
          style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}
        >
          <a
            href="/create-gig"
            className="rounded bg-green-500 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-green-600 transition-colors"
          >
            Create Gig
          </a>
          <a
            href="/sponsor-showcase"
            className="rounded bg-white px-6 py-3 text-sm font-semibold text-green-500 shadow hover:bg-gray-100 transition-colors"
          >
            Sponsor Gig
          </a>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="my-10 grid w-full max-w-screen-xl animate-fade-up grid-cols-1 gap-5 px-5 md:grid-cols-3 xl:px-0 mx-auto">
        {features.map(({ title, description, demo }, index) => (
          <Card
            key={index}
            title={title}
            description={description}
            demo={demo}
          />
        ))}
      </div>

      {/* How It Works Section */}
      <div id="how-it-works" className="py-16 bg-gray-50">
        <div className="container mx-auto px-5 text-center">
          <h2 className="text-3xl font-sfPro font-bold text-green-800 md:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-green-600 font-inter md:text-lg">
            A seamless process from sign-up to managing your funds securely.
          </p>
          <div className="mt-12 flex justify-center">
            <img
              alt="Workflow Diagram"
              src="https://mermaid.ink/svg/pako:eNp1k0Fv2zAMhf8KoZMHdOvdhwLJggEB2i5LNuziCyfRLhdb8ii6WFD0v0-2VyCGVZ8s8X1P4iP0YmxwZEoT6c9A3tKOsRHsKg_p61GULffoFX5EkvXuFwleyTsoHumvfvodP6w1W7TnSbI57DPlw3F_ethA8fX4kKuGqI3Q6ds9FLttRvCdG5Itkba020JxTy6tM7oj1nxm-IltSwrFAS8deR3vO2vH_j7e3a0bKmFjLcUI9eCdIEf2DfQtah3kf05rKDkt2i7hNPzqWMEFj8rB3yr3M7zQJe46j4ThM4EK-oh25EDGQUWd2WvtiC7DSrQGWeKOFLmN-aPzWZZwJBvELXzYQzuV807vpV3CQcKUZj9vwTMj7FN6cm33Hr6O9XPwNUv3Zpe_TW6oj0G5vkxjh1BDHKYhV97cmI6kQ3bpVbyMfpXRJ-qoMmX6dSjnylT-Nelw0HC6eGtKlYFujISheTJljW1Mq6F3qG_vaZa8_gOV8SUm"
              className="rounded-lg shadow-lg"              
            />
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div id="signup" className="py-16 bg-green-500">
        <div className="container mx-auto px-5 text-center">
          <h2 className="text-3xl font-sfPro font-bold text-white md:text-4xl">
            Ready to Start Fundraising?
          </h2>
          <p className="mt-4 text-lg font-inter text-white md:text-xl">
            Join thousands of users who are successfully raising funds securely and anonymously.
          </p>

        </div>
      </div>
    </>
  );
}

const features = [
  {
    title: "Secure Payments with Interledger",
    description:
      "Leverage the power of the Interledger Payments Protocol for seamless, cross-network micropayments, ensuring your donations reach you instantly and securely.",
    demo: (
      <div className="flex items-center justify-center">
        <Image alt="Interledger Payments" src="/interledger-logo.svg" width={100} height={100}
        unoptimized={true}
        />
      </div>
    ),
  },
  {
    title: "High-Performance Ledger",
    description:
      "Utilize TigerBeetleDB to handle millions of transactions per second, providing real-time tracking and transparency for all your fundraising activities.",
    demo: (
      <div className="flex items-center justify-center">
        <Image alt="TigerBeetleDB Ledger" src="/tigerbeetle-logo.png" width={100} height={100} 
        unoptimized={true}
        />
      </div>
    ),
  },
  {
    title: "Anonymous Transactions",
    description:
      "Protect your privacy with anonymous payments, allowing donors and recipients to engage without sharing personal information.",
    demo: (
      <div className="flex items-center justify-center">
        <Image alt="Anonymous Transactions" src="/wallet-solid.svg" width={100} height={100}
            unoptimized={true} 
        />
      </div>
    ),
  },
  {
    title: "Scalable Microservices",
    description:
      "Our Docker-based microservice architecture ensures that the platform scales effortlessly to accommodate growing user bases and transaction volumes.",
    demo: (
      <div className="flex items-center justify-center">
        <Image alt="Scalable Microservices" src="/docker-logo.png" width={100} height={100} />
      </div>
    ),
  },
  {
    title: "Seamless Integration with Rafiki Wallet",
    description:
      "Manage your funds effortlessly with Rafiki Wallet integration, providing a secure and user-friendly interface for all your transactions.",
    demo: (
      <div className="flex items-center justify-center">
        <Image alt="Rafiki Wallet" src="/rafiki-logo.jpg" width={100} height={100} />
      </div>
    ),
  },
  {
    title: "Robust Database Management",
    description:
      "Powered by Prisma and PostgreSQL, our platform ensures data integrity, type safety, and efficient data handling for all your fundraising needs.",
    demo: (
      <div className="flex items-center justify-center">
        <Image alt="Prisma PostgreSQL" src="/prisma.svg" width={100} height={100} />
      </div>
    ),
  },
];
