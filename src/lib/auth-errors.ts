export const getFriendlyErrorMessage = (errorCode: string): string => {
  if (!errorCode) return "Authentication service is currently unavailable. Please ensure environment variables are configured.";
  
  switch (errorCode) {
    case "auth/invalid-email":
      return "That email address doesn't look right. Check for typos.";
    case "auth/user-disabled":
      return "This account has been disabled. Contact support if you think this is a mistake.";
    case "auth/user-not-found":
      return "We couldn't find an account with that email. Try signing up!";
    case "auth/wrong-password":
      return "Incorrect password. Try again or reset it.";
    case "auth/email-already-in-use":
      return "An account already exists with this email. Try logging in instead.";
    case "auth/operation-not-allowed":
      return "Sign-in is currently disabled. Please try again later.";
    case "auth/weak-password":
      return "Your password is too weak. Use at least 6 characters with numbers and symbols.";
    case "auth/popup-closed-by-user":
      return "Sign-in was cancelled. Please try again.";
    case "auth/network-request-failed":
      return "Network error. Check your connection and try again.";
    case "auth/too-many-requests":
      return "Too many failed attempts. Please wait a few minutes and try again.";
    default:
      return "Something went wrong. Please try again.";
  }
};
