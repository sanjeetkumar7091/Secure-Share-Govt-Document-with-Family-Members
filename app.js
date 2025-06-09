import { auth, firestore, storage } from './firebase-config.js';
// Logger module as a global object
const Logger = {
  log: function(message) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${message}`);
  },
  error: function(message) {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] ERROR: ${message}`);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // UI elements
  const registerForm = document.getElementById('register-form');
  const registerEmail = document.getElementById('register-email');
  const registerPassword = document.getElementById('register-password');
  const registerBtn = document.getElementById('register-btn');

  const otpVerification = document.getElementById('otp-verification');
  const otpCodeInput = document.getElementById('otp-code');
  const verifyOtpBtn = document.getElementById('verify-otp-btn');

  const loginForm = document.getElementById('login-form');
  const loginEmail = document.getElementById('login-email');
  const loginPassword = document.getElementById('login-password');
  const loginBtn = document.getElementById('login-btn');

  const userSection = document.getElementById('user-section');
  const userEmailSpan = document.getElementById('user-email');
  const logoutBtn = document.getElementById('logout-btn');

  const docFileInput = document.getElementById('doc-file');
  const uploadDocBtn = document.getElementById('upload-doc-btn');
  const docsList = document.getElementById('docs-list');

  const shareDocSection = document.getElementById('share-doc-section');
  const shareEmailInput = document.getElementById('share-email');
  const shareDocBtn = document.getElementById('share-doc-btn');

  let currentUser = null;
  let confirmationResult = null;
  let selectedDocId = null;

  // Initialize reCAPTCHA verifier for OTP
  // Removed reCAPTCHA verifier initialization on register button as it is unnecessary for email/password registration

  // Register user with email and password and send OTP
  registerBtn.addEventListener('click', async () => {
    const email = registerEmail.value.trim();
    const password = registerPassword.value.trim();
    if (!email || !password) {
      alert('Please enter email and password');
      return;
    }
    try {
      // Create user with email and password
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      currentUser = userCredential.user;
      Logger.log(`User registered: ${email}`);

      // Send OTP to phone number (assuming phone number is email for demo)
      // For real phone OTP, phone number input and verification needed
      // Here we simulate OTP verification step
      registerForm.style.display = 'none';
      otpVerification.style.display = 'block';
      loginForm.style.display = 'none';
      Logger.log('OTP verification started');
    } catch (error) {
      Logger.error(`Registration error: ${error.message}`);
      alert(`Registration failed: ${error.message}`);
    }
  });

  // Verify OTP (simulated)
  verifyOtpBtn.addEventListener('click', () => {
    const otp = otpCodeInput.value.trim();
    if (otp === '123456') { // Simulated OTP check
      Logger.log('OTP verified successfully');
      otpVerification.style.display = 'none';
      userSection.style.display = 'block';
      userEmailSpan.textContent = currentUser.email;
      loadUserDocuments();
    } else {
      Logger.error('Invalid OTP entered');
      alert('Invalid OTP. Please try again.');
    }
  });

  // Login user
  loginBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const email = loginEmail.value.trim();
    const password = loginPassword.value.trim();
    if (!email || !password) {
      alert('Please enter email and password');
      return;
    }
    try {
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      currentUser = userCredential.user;
      Logger.log(`User logged in: ${email}`);
      loginForm.style.display = 'none';
      registerForm.style.display = 'none';
      otpVerification.style.display = 'none';
      userSection.style.display = 'block';
      userEmailSpan.textContent = currentUser.email;
      loadUserDocuments();
    } catch (error) {
      Logger.error(`Login error: ${error.message}`);
      alert(`Login failed: ${error.message}`);
    }
  });

  // Logout user
  logoutBtn.addEventListener('click', async () => {
    try {
      await auth.signOut();
      Logger.log('User logged out');
      currentUser = null;
      userSection.style.display = 'none';
      registerForm.style.display = 'block';
      loginForm.style.display = 'none';
      otpVerification.style.display = 'none';
    } catch (error) {
      Logger.error(`Logout error: ${error.message}`);
      alert(`Logout failed: ${error.message}`);
    }
  });

  // Upload document
  uploadDocBtn.addEventListener('click', async () => {
    const file = docFileInput.files[0];
    if (!file) {
      alert('Please select a document to upload');
      return;
    }
    if (!currentUser) {
      alert('User not logged in');
      return;
    }
    try {
      const storageRef = storage.ref();
      const userDocsRef = storageRef.child(`documents/${currentUser.uid}/${file.name}`);
      const snapshot = await userDocsRef.put(file);
      const downloadURL = await snapshot.ref.getDownloadURL();

      // Save document metadata in Firestore
      const docRef = await firestore.collection('documents').add({
        ownerId: currentUser.uid,
        fileName: file.name,
        url: downloadURL,
        sharedWith: [],
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      Logger.log(`Document uploaded: ${file.name} by user ${currentUser.email}`);
      loadUserDocuments();
    } catch (error) {
      Logger.error(`Upload error: ${error.message}`);
      alert(`Upload failed: ${error.message}`);
    }
  });

  // Load user's documents
  async function loadUserDocuments() {
    docsList.innerHTML = '';
    if (!currentUser) return;
    try {
      const querySnapshot = await firestore.collection('documents')
        .where('ownerId', '==', currentUser.uid)
        .get();
      querySnapshot.forEach(doc => {
        const data = doc.data();
        const li = document.createElement('li');
        li.textContent = data.fileName;

        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'doc-actions';

        const shareBtn = document.createElement('button');
        shareBtn.textContent = 'Share';
        shareBtn.addEventListener('click', () => {
          selectedDocId = doc.id;
          shareDocSection.style.display = 'block';
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', async () => {
          try {
            await firestore.collection('documents').doc(doc.id).delete();
            const storageRef = storage.ref(`documents/${currentUser.uid}/${data.fileName}`);
            await storageRef.delete();
            Logger.log(`Document deleted: ${data.fileName} by user ${currentUser.email}`);
            loadUserDocuments();
          } catch (error) {
            Logger.error(`Delete error: ${error.message}`);
            alert(`Delete failed: ${error.message}`);
          }
        });

        actionsDiv.appendChild(shareBtn);
        actionsDiv.appendChild(deleteBtn);
        li.appendChild(actionsDiv);
        docsList.appendChild(li);
      });
    } catch (error) {
      Logger.error(`Load documents error: ${error.message}`);
      alert(`Failed to load documents: ${error.message}`);
    }
  }

  // Share document with family member
  shareDocBtn.addEventListener('click', async () => {
    const shareEmail = shareEmailInput.value.trim();
    if (!shareEmail) {
      alert('Please enter an email to share with');
      return;
    }
    if (!selectedDocId) {
      alert('No document selected to share');
      return;
    }
    try {
      // Get user by email to share with
      const usersQuery = await firestore.collection('users')
        .where('email', '==', shareEmail)
        .get();
      if (usersQuery.empty) {
        alert('User to share with not found');
        return;
      }
      const shareUserId = usersQuery.docs[0].id;

      // Update document sharedWith array
      const docRef = firestore.collection('documents').doc(selectedDocId);
      await docRef.update({
        sharedWith: firebase.firestore.FieldValue.arrayUnion(shareUserId)
      });
      Logger.log(`Document shared with ${shareEmail} by user ${currentUser.email}`);
      shareDocSection.style.display = 'none';
      shareEmailInput.value = '';
    } catch (error) {
      Logger.error(`Share error: ${error.message}`);
      alert(`Share failed: ${error.message}`);
    }
  });

  // Monitor auth state changes
  auth.onAuthStateChanged(user => {
    if (user) {
      currentUser = user;
      registerForm.style.display = 'none';
      loginForm.style.display = 'none';
      otpVerification.style.display = 'none';
      userSection.style.display = 'block';
      userEmailSpan.textContent = user.email;
      loadUserDocuments();
      Logger.log(`User auth state changed: logged in as ${user.email}`);
    } else {
      currentUser = null;
      userSection.style.display = 'none';
      registerForm.style.display = 'block';
      loginForm.style.display = 'none';
      otpVerification.style.display = 'none';
      Logger.log('User auth state changed: logged out');
    }
  });
});
