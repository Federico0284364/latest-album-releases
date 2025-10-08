# Latest Albums App

This is a Next.js web application that allows users to discover and follow their favorite music artists, then see their latest album, EP, and single releases. The app integrates with Firestore as a database and Spotify API to fetch artist and album data.

## Features

- 🔑 User authentication via Google login  
- 🎵 Search for artists from Spotify's catalog  
- ❤️ **Follow/unfollow** artists to receive personalized updates  
- 📄 View a dedicated page with the **latest releases** (albums, EPs, singles) from followed artists  
- 📧 **Weekly email** with last week's new releases based on followed artists

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework for server-side rendering and serverless functions
- [Firestore](https://firebase.google.com/products/firestore) - NoSQL cloud database  
- [Spotify Web API](https://developer.spotify.com/documentation/web-api/) - Retrieve artist and album information  
- [Firebase Authentication](https://firebase.google.com/products/auth) - Google user login  
- [Cron-job.org](https://cron-job.org) - Scheduled API calls for automated email digests
