function showUserInfo(user) {
  document.getElementById('auth-section').classList.add('hidden');
  document.getElementById('user-info').classList.remove('hidden');

  document.getElementById('user-pic').src = user.picture;
  document.getElementById('user-email').textContent = user.email;
}

function resetUI() {
  document.getElementById('auth-section').classList.remove('hidden');
  document.getElementById('user-info').classList.add('hidden');
}

document.getElementById('signin-btn').addEventListener('click', () => {
  chrome.identity.getAuthToken({ interactive: true }, function (token) {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError.message);
      alert("Error signing in.");
    } else {
      fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { 'Authorization': 'Bearer ' + token }
      })
      .then(res => res.json())
      .then(userInfo => {
        chrome.storage.local.set({ userInfo });
        showUserInfo(userInfo);
      });
    }
  });
});

document.getElementById('signout-btn').addEventListener('click', () => {
  chrome.identity.getAuthToken({ interactive: false }, function (token) {
    if (token) {
      chrome.identity.removeCachedAuthToken({ token }, function () {
        chrome.storage.local.remove('userInfo');
        resetUI();
      });
    } else {
      resetUI();
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get('userInfo', (result) => {
    if (result.userInfo) {
      showUserInfo(result.userInfo);
    }
  });
});
