export const environment = {
  production: true,
  firebase: {
    apiKey: '${{ secrets.FIREBASE_API_KEY_SPIRALVERSE }}',
    authDomain: 'spiralverse.firebaseapp.com',
    projectId: 'spiralverse',
    storageBucket: 'spiralverse.appspot.com',
    messagingSenderId: '${{ secrets.FIREBASE_MESSAGING_SENER_ID_SPIRALVERSE }}',
    appId: '${{ secrets.FIREBASE_APP_ID_SPIRALVERSE }}',
    measurementId: '${{ secrets.FIREBASE_MEASUREMENT_ID_SPIRALVERSE }}'
  }

};
