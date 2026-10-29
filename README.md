# Latest Albums App

[English](#english) · [Italiano](#italiano)

## English

This is a Next.js web application that allows users to discover and follow their favorite music artists, then see their latest album, EP, and single releases. The app integrates with Firestore as a database and Spotify API to fetch artist and album data.

### Features

- 🔑 User authentication via Google login
- 🎵 Search for artists from Spotify's catalog
- ❤️ **Follow/unfollow** artists to receive personalized updates
- 📄 View a dedicated page with the **latest releases** (albums, EPs, singles) from followed artists
- 📧 **Weekly email** with last week's new releases based on followed artists

### Tech Stack

- [Next.js](https://nextjs.org/) - React framework for server-side rendering and serverless functions
- [Firestore](https://firebase.google.com/products/firestore) - NoSQL cloud database
- [Spotify Web API](https://developer.spotify.com/documentation/web-api/) - Retrieve artist and album information
- [Firebase Authentication](https://firebase.google.com/products/auth) - Google user login
- [Cron-job.org](https://cron-job.org) - Scheduled API calls for automated email digests

---

## Italiano

Questa è un'applicazione web Next.js che permette agli utenti di scoprire e seguire i propri artisti musicali preferiti, per poi vedere le loro ultime uscite tra album, EP e singoli. L'app si integra con Firestore come database e con le API di Spotify per recuperare i dati di artisti e album.

### Funzionalità

- 🔑 Autenticazione utente tramite login con Google
- 🎵 Ricerca di artisti nel catalogo di Spotify
- ❤️ **Segui/smetti di seguire** gli artisti per ricevere aggiornamenti personalizzati
- 📄 Pagina dedicata con le **ultime uscite** (album, EP, singoli) degli artisti seguiti
- 📧 **Email settimanale** con le nuove uscite della settimana scorsa, in base agli artisti seguiti

### Stack tecnologico

- [Next.js](https://nextjs.org/) - Framework React per il rendering lato server e le funzioni serverless
- [Firestore](https://firebase.google.com/products/firestore) - Database cloud NoSQL
- [Spotify Web API](https://developer.spotify.com/documentation/web-api/) - Recupero delle informazioni su artisti e album
- [Firebase Authentication](https://firebase.google.com/products/auth) - Login utente con Google
- [Cron-job.org](https://cron-job.org) - Chiamate API pianificate per l'invio automatico dei riepiloghi via email
