# speakSOAS - Language Exchange App
Cross platform mobile social and communicator application, With user account system, user searcher based on users’ languages to-learn and to-teach choices and text chat with picture sending.

Application has been developed for SOAS, University of London by Wojciech Golaszewski and Federico Vignati. It's purpose is to encourage contacts between SOAS students and staff, thus integrating SOAS community even more and giving oppurtunities for SOASians to practice speaking languages they desire to learn.

**Technologies**: 
 - Ionic 3, Cordova (TypeScript, AngularJS, HTML & CSS); deployed for Android and iOS
 - Google Firebase (Authentication and Real Time Database)

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

![Screenshots](https://github.com/VoytechG/speakSOAS---Language-Exchange-Application/blob/master/Screenshots/ScrennshotCollage.png "Screenshot Collage")

## Deployment
1. Download and install [Node.js](https://nodejs.org/en/download/)
2. Follow [this guide](https://ionicframework.com/getting-started/) to initialise a blank Ionic app
3. Download this repository and copy all the files to your newly created app (replace duplicates)
4. Open node.js cli in your app's directory
5. Run npm install
6. Run ionic cordova platform add android 
or add ios if you are on Mac
7. Install (manually, from the terminal) all the missing plugins from this list (plugins folder):
 - cordova-plugin-camera
 - cordova-plugin-compat
 - cordova-plugin-console
 - cordova-plugin-device
 - cordova-plugin-fcm
 - cordova-plugin-splashscreen
 - cordova-plugin-statusbar
 - cordova-plugin-whitelist
 - cordova-plugin-x-toast
 - cordova-sqlite-storage
 - ionic-plugin-deploy
 - ionic-plugin-keyboard
 8. You are ready to go!
 

## Licences 
**The application's code is fully commented. You can feel free to use it, however it is requested to remove any SOAS associations (pictures, names etc).**
