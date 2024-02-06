let currentPage = 1;
let lastPage = 1;

// Infinit scroll
window.addEventListener('scroll', function () {
	// const endOfPage = window.innerHeight + window.pageYOffset >= document.body.offsetHeight;
	// console.log(currentPage, lastPage);
	// if (endOfPage && currentPage < lastPage) {
	//   currentPage = currentPage * 100 + 1
	//   getPosts(false, currentPage)
	// }
});

setupUI();
getPosts();

function getPosts(reload = true, page = 1) {
	axios.get(`${baseUrl}/posts?limit=5&page=${page}`).then(response => {
		const posts = response.data.data;

		lastPage = response.data.meta.last_page;
		if (reload == true) {
			document.getElementById('posts').innerHTML = '';
		}

		for (post of posts) {
			const author = post.author;
			let postTitle = '';

			if (post.title != null) {
				postTitle = post.title;
			}

			let content = `
         
          <div class="card shadow my-3">
            <div class="card-header">
              <img class="rounded-circle border border-3" src="${
								author.profile_image
							}" alt=""
                style="width: 40px; height: 40px;">
              <b>@${author.username}</b>

              <button class="btn btn-secondary" style='float: right;' onclick="editPostBtnClicked('${encodeURIComponent(
								JSON.stringify(post),
							)}')" id=>edit</button>

            </div>
            <div class="card-body" onclick="postClicked(${
							post.id
						})" style="cursor: pointer">
              <img class="w-100" src="${post.image}" alt="">
              <h6 class="mt-1" style="color: rgba(128, 128, 128, 0.89);">
                ${post.created_at}
              </h6>
              <h5>${postTitle}</h5>

              <p>
                ${post.body}
              </p>

              <hr>

              <div>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen"
                  viewBox="0 0 16 16">
                  <path
                    d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z" />
                </svg>
                <span>
                  (${post.comments_count}) Comments

                  <span id="post-tags-${post.id}">
                    
                    </span>
                </span>
              </div>
            </div>

            <!-- POST -->

          </div>
          
        `;

			document.getElementById('posts').innerHTML += content;

			const currentPostTagsId = `post-tags-${post.id}`;
			document.getElementById(currentPostTagsId).innerHTML = '';

			// Searching in post the tags elements
			for (tag of post.tags) {
				console.log('This this the tag element', tag.name);
				let tagsContent = `
              <button class="btn btn-sm rounded-5" style="background-color: gray; color:white"> ${tag.name} </button>     
                   `;
				document.getElementById(currentPostTagsId).innerHTML += tagsContent;
			}
		}
	});
}

function postClicked(postId) {
	window.location = `postDetails.html?postId=${postId}`;
}

function CreateNewpostClicked() {
	let postId = document.getElementById('post-id-input').value;
	let isCreate = postId == null || postId == '';

	const title = document.getElementById('post-title-input').value;
	const body = document.getElementById('post-body-input').value;
	const image = document.getElementById('post-image-input').files[0];
	const token = localStorage.getItem('token');
	let formData = new FormData();
	formData.append('body', body);
	formData.append('title', title);
	formData.append('image', image);
	// const params = {
	//   "body": body,
	//   "title": title

	// }

	let url = ``;

	const headers = {
		'Content-Type': 'multiple/form-data',
		authorization: `Bearer ${token}`,
	};

	if (isCreate) {
		url = `${baseUrl}/posts`;
		axios
			.post(url, formData, {
				headers: headers,
			})
			.then(response => {
				const modal = document.getElementById('create-post-modal');
				const modalInstance = bootstrap.Modal.getInstance(modal);
				modalInstance.hide();
				showAlert('New Post Has Been Created', 'success');
				getPosts();
			})
			.catch(error => {
				const message = error.response.data.message;
				showAlert(message, 'danger');
			});
	} else {
		url = `${baseUrl}/posts/${postId}`;
		axios
			.put(url, formData, {
				headers: headers,
			})
			.then(response => {
				const modal = document.getElementById('create-post-modal');
				const modalInstance = bootstrap.Modal.getInstance(modal);
				modalInstance.hide();
				showAlert('New Post Has Been Created', 'success');
				getPosts();
			})
			.catch(error => {
				const message = error.response.data.message;
				showAlert(message, 'danger');
			});
	}
}

function editPostBtnClicked(postObject) {
	let post = JSON.parse(decodeURIComponent(postObject));

	console.log(post);
	// return

	document.getElementById('post-id-input').value = post.id;
	document.getElementById('post-modal-title').innerHTML = 'Edit Post';
	document.getElementById('post-title-input').value = post.title;
	document.getElementById('post-body-input').value = post.body;
	let postModal = new bootstrap.Modal(
		document.getElementById('create-post-modal'),
		{},
	);
	postModal.toggle();
}
