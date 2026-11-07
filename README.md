# Hub | HAKYE

The web client for **MediaHub** for sharing images. Users can post images, follow people, save posts into private or public collections, and search for posts, collections and users.

The API this project is based on is [MediaHub API](https://github.com/hakye05/hub-media-api) (Spring Boot + PostgreSQL + Cloudflare R2).

## Table of Contents
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Routes](#routes)
- [Authentication](#authentication)
- [Uploads](#uploads)
- [NOTE](#conventions)

## Tech Stack

- **Framework:** Next.js 16, App Router, Cache Components, `src/` directory
- **Language:** TypeScript
- **UI:** React 19, Tailwind CSS
- **Backend:** Spring Boot: [MediaHub API](../mediahub-api)

## Features

**Accounts**
- Sign up and log in from overlay modals on top of the home page, with no separate auth pages
- Short-lived access token in memory, refresh token in an `HttpOnly` cookie, rotated on every refresh
- Guests can browse, search and view posts without signing in

**Profiles**
- Public profile with avatar, banner, bio and follower/following counts
- Default gradient banner until you upload your own
- Edit-profile modal with two tabs:
    - **Profile**: username, display name, gender, bio, avatar
    - **Account**: email and password
- Banner upload from a pencil button that appears when you hover your own banner
- Profile tabs: **Posts**, **Collections**, **Saved**
- Share profile copies the profile link

**Posts**
- "+ Create" in the navbar opens an upload modal: image first, then title (required), description and Publish
- Masonry grid on the home feed and on profiles (6 columns down to 2)
- Dedicated post page with author details, image, title and description
- Copy link and download buttons; save is the only interaction (no likes)
- Authors can edit or delete their own posts

**Saving & collections**
- Saving a post opens a picker: private **Saved** row, your collections, and a "Create collection" row
- Collections are created in a modal with a **Make private** toggle
- Public collections are visible to anyone; private ones respond `404` to everyone but the owner
- Collection page with a Cosmos-style header, copy link, delete (owner only) and an in-collection search bar

**Social**
- Follow and unfollow from the profile page and the post page
- Followers/Following modal with tabs and search; each row shows avatar, name, `@username` and a follow button
- **Following** feed of posts from accounts you follow, as bordered cards with the author's avatar, title, description and image, and a follow/unfollow button
- **For You** returns to the home feed

**Search**
- One search page for users, posts (title and description) and public collections
- Search inside followers/following lists and inside a collection's posts

## Routes

| Route | Auth | Description |
| --- | :---: | --- |
| `/` | optional | Home feed (masonry grid) and landing hero for guests |
| `/following` | Bearer | Feed of posts from accounts you follow |
| `/search?q=` | optional | Search users, posts and collections |
| `/post/[id]` | optional | Post view: author, image, copy link, download, save, edit |
| `/[username]` | optional | Profile, **Posts** tab |
| `/[username]/collections` | optional | Profile, **Collections** tab (owner sees private ones too) |
| `/[username]/saved` | owner | Profile, **Saved** tab (visible only to the owner) |
| `/[username]/collection/[id]` | optional | Collection detail and its posts |

The three profile tabs share one layout, `app/[username]/(profile)/layout.tsx`. It renders the banner, avatar and info once, so switching tabs only swaps the content below and doesn't reload the profile header.

## Authentication

1. Login or register returns an access token in the response body. The refresh token arrives as an `HttpOnly` cookie.
2. The access token is kept in memory by `AuthProvider` and sent as `Authorization: Bearer …`.
3. When it expires, the client calls `POST /api/auth/refresh` with `credentials: "include"` and the API rotates the refresh token.
4. Logout calls `POST /api/auth/logout`, which revokes the whole token family.

Public pages work for guests. When a token is present, responses include viewer-specific fields (`savedByViewer`, `isFollowing`).

## Uploads

Avatars, banners and posts all follow the same flow:

1. `POST /api/uploads` with `{ kind, contentType, size }` returns a presigned R2 URL.
2. The browser `PUT`s the file to that URL, with the same `Content-Type`.
3. `POST /api/uploads/{id}/complete` verifies and finalizes the upload.
4. The returned `uploadId` is attached to the post, avatar or banner.

| Kind | Max size | Types |
| --- | --- | --- |
| `AVATAR` | 400 KB | JPEG, PNG, WebP |
| `BANNER` | 10 MB | JPEG, PNG, WebP |
| `POST` | 10 MB | JPEG, PNG, WebP |

## NOTE

Global state lives in three providers wrapped around the app in `layout.tsx`:

- **`AuthProvider`**: current user and access token
- **`CreatedPostsProvider`**: lets newly published posts appear in the feed and profile without a refetch
- **`SavePostProvider`**: controls the save-to-collection picker from anywhere

## Related

- **[MediaHub API](https://github.com/hakye05/hub-media-api)**: Spring Boot backend this app consumes