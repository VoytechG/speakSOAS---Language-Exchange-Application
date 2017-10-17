# speakSOAS - Language Exchange App
Cross platform mobile application with user account system, user searcher based on users’ languages to-learn and to-teach choices, and built-in text chat with picture sending.

Technologies: Ionic Cordova (TypeScript, AngularJS, HTML & CSS) and Google Firebase Authentication and Real Time Database; deployed for Android and iOS

![App Promotion Poster](https://github.com/VoytechG/speakSOAS---Language-Exchange-Application/blob/master/Screenshots/Poster.PNG "App Promotion Poster")

## Features 
### Account System (with Google Firebase authentication)
 - **Sign up with personal email address** (with sign-up validation email)
 - **Password recovery**
 - **Account credentials**: username, email address, up to 3 language to-learn and up to 3 to-teach choices; optional: gender, bio, profile picture

### User Searcher
User chooses a language they desire to learn (up right corner) and the app displays all users who have noted they can speak this language.
 - **Cross matches (stars)** - if user A wants to learn a language user B knows, and user B want to learn a language user A knows, both users can help each other with their language skills. Such a double match is denoted with a star.
 - **Chat and Profile Access** - clicking on profile picture opens user profile, clicking anywhere else on the user bar opens chat.
  
### Chat List
Displays a list of all users with whom a chat has been started.
 - **New Message** - the inscription 'NEW' denotes a new unread message. Messages are marked as read when the user enters the chat.
 - **Chat and Profile Access** - clicking on profile picture opens user profile, clicking anywhere else on the user bar opens chat.
   
### Chat
Automatically scrolls down the message list upon entering the page, allows for sending text messages and images.

 
