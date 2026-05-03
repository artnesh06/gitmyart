# Product Overview

Gitmyart is a multi-chain NFT staking and raffle platform. Users connect a wallet, stake NFTs from curated collections, earn points over time, and enter raffles using various chain-native tokens.

## Core Features

- **Multi-chain support**: Cosmos (ATOM), MegaETH, and Ethereum — users switch chains via a selector in the top bar
- **NFT staking**: Soft-stake NFTs (no on-chain transaction) into collections to earn points; staked NFTs have an HP stat that decays over time and can be restored by "feeding"
- **Raffles**: Token-gated raffle system where users buy entries with chain-specific tokens; winners are drawn automatically when raffles expire
- **Leaderboard**: Global and per-chain rankings based on staking points, refreshed by a background cron job
- **Collections**: Browsable NFT collections with staking stats, floor prices, and reward rates
- **Charity coins**: A dedicated ticker section for charity-themed tokens

## Current State

The app is a working demo with seed data and dummy wallet login (no real on-chain integration). Coin prices and some UI data are hardcoded. The frontend is a single-page app served by the Express backend.
