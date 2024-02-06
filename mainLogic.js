const baseUrl = 'https://tarmeezacademy.com/api/v1';

function setupUI() {
	const token = localStorage.getItem('token');

	const loginDiv = document.getElementById('logged-in-div');
	const logoutDiv = document.getElementById('logout-div');

	// add button
	const addButton = document.getElementById('add-btn');

	if (token == null) {
		// user is guest (not logged in)
		if (addButton != null) {
			addButton.style.setProperty('display', 'none', 'important');
		}
		loginDiv.style.setProperty('display', 'flex', 'important');
		logoutDiv.style.setProperty('display', 'none', 'important');
	} else {
		// user is guest (not logged in)
		if (addButton != null) {
			addButton.style.setProperty('display', 'block', 'important');
		}
		loginDiv.style.setProperty('display', 'none', 'important');
		logoutDiv.style.setProperty('display', 'flex', 'important');

		let user = getCurrentUser();
		// To get the profile name in backend using data
		document.getElementById('nav-username').innerHTML = user.username;
		// To get the profile image in backend using data
		document.getElementById('nav-user-image').src = user.profile_image;
	}
}

function loginBtnClicked() {
	const username = document.getElementById('username-input').value;
	const password = document.getElementById('password-input').value;

	const params = {
		username: username,
		password: password,
	};
	const url = `${baseUrl}/login`;

	axios.post(url, params).then(response => {
		// console.log(response.data);
		localStorage.setItem('token', response.data.token);
		localStorage.setItem('user', JSON.stringify(response.data.user));

		// To close the login windows
		const modal = document.getElementById('login-modal');
		const modalInstance = bootstrap.Modal.getInstance(modal);
		modalInstance.hide();
		showAlert('logged in successfuly', 'success');
		setupUI();
	});
}

function registerBtnClicked() {
	const name = document.getElementById('register-name-input').value;
	const username = document.getElementById('register-username-input').value;
	const password = document.getElementById('register-password-input').value;
	const image = document.getElementById('register-image-input').files[0];

	let formData = new FormData();
	formData.append('name', name);
	formData.append('username', username);
	formData.append('password', password);
	formData.append('image', image);

	const headers = {
		'Content-Type': 'multiple/form-data',
	};
	const url = `${baseUrl}/register`;

	axios
		.post(url, formData, {
			headers: headers,
		})
		.then(response => {
			console.log(response);

			localStorage.setItem('token', response.data.token);
			localStorage.setItem('user', JSON.stringify(response.data.user));

			// To close the login windows
			const modal = document.getElementById('register-modal');
			const modalInstance = bootstrap.Modal.getInstance(modal);
			modalInstance.hide();
			showAlert('New User Registred successfuly', 'success');
			setupUI();
		})
		.catch(error => {
			const message = error.response.data.message;
			showAlert(message, 'danger');
		});
}

function logout() {
	localStorage.removeItem('token');
	localStorage.removeItem('user');
	showAlert('logged out successfuly', 'success');
	setupUI();
}

function getCurrentUser() {
	let user = null;
	const storageUser = localStorage.getItem('user');

	if (storageUser != null) {
		user = JSON.parse(storageUser);
	}
	return user;
}

function showAlert(customMessage, type) {
	const alertPlaceholder = document.getElementById('success-alert');
	const appendAlert = (message, type) => {
		const wrapper = document.createElement('div');
		wrapper.innerHTML = [
			`<div class="alert alert-${type} alert-dismissible" role="alert">`,
			`   <div>${message}</div>`,
			'   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
			'</div>',
		].join('');

		alertPlaceholder.append(wrapper);
	};

	appendAlert(customMessage, type);

	// todo:  alert hide
	setTimeout(() => {
		const alertHide = bootstrap.Alert.getOrCreateInstance('#success-alert');
		// alertHide.close()
	}, 2000);
}
