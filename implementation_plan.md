# Email/Password Authentication Flow

This plan outlines how we will introduce Email/Password login to give users an alternative to Google Sign-In, while ensuring they never lose their anonymous Kanban data.

## Goal
Build a beautiful, unified Authentication Modal that supports both Email/Password (Sign Up / Sign In) and Google Sign-In, seamlessly linking any chosen method to the existing anonymous session.

## User Review Required

> [!IMPORTANT]
> Please review the Auth Modal approach. Since the user starts anonymously to test the app, any "Sign Up" action must technically be an **account link** in Firebase so their 10 jobs aren't wiped out.
> 
> You must ensure **Email/Password Authentication** is enabled in your Firebase Console > Authentication > Sign-in method.

## Proposed Changes

### 1. Unified Authentication Modal (`components/AuthModal.tsx`)
Instead of directly triggering the Google popup from the Sidebar, we will create a dedicated `AuthModal`.
- **Top Section:** A form with `Email` and `Password` inputs.
- **Toggle:** A simple link to switch between "Create Account" and "Sign In".
- **Divider:** "Or continue with"
- **Bottom Section:** The "Sign in with Google" button.

### 2. Firebase Linking Logic (`lib/firebase.ts` & Modal)
- We will import `EmailAuthProvider`, `linkWithCredential`, `signInWithEmailAndPassword`, and `createUserWithEmailAndPassword` from Firebase.
- **If signing up:** We will take the email/password, generate an `EmailAuthProvider.credential`, and use `linkWithCredential(auth.currentUser, credential)`. This merges their anonymous session into a real email account.
- **If returning user (logging in):** We will use standard `signInWithEmailAndPassword`. *(Note: This replaces the anonymous session with their old data, which is correct for returning users).*

### 3. UI Updates
- **Sidebar:** Change the "Sign in with Google" button to a generic "Sign In / Sign Up" button that opens the `AuthModal`.
- **SaveProgressModal (10-job rule):** Change its primary action to open the new `AuthModal` rather than directly invoking Google.

## Verification Plan

### Manual Verification
1. I will open the Auth Modal from the sidebar.
2. I will enter a test email/password to create an account.
3. I will verify in the Firebase Console that the user was created and upgraded from anonymous.
4. I will verify the Google button still functions as expected.
