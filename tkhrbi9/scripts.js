const postsContainer = document.getElementById('postsContainer');

// Load posts from localStorage when the page loads
window.onload = function() {
    loadPosts();
}

function submitPost() {
    const postContent = document.getElementById('postContent').value;
    const imageUpload = document.getElementById('imageUpload').files[0];
    
    if (!postContent && !imageUpload) {
        alert('Please enter some content or upload an image.');
        return;
    }

    const post = {
        content: postContent,
        image: imageUpload ? URL.createObjectURL(imageUpload) : null,
        comments: []
    };

    // Save the new post to localStorage
    let posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts.push(post);
    localStorage.setItem('posts', JSON.stringify(posts));
    
    // Add the new post to the page
    addPostToPage(post);
    
    document.getElementById('postContent').value = '';
    document.getElementById('imageUpload').value = '';
}

function addPostToPage(post, index) {
    const postElement = document.createElement('div');
    postElement.className = 'post';
    postElement.dataset.index = index; // Store index to identify which post to delete

    const postContentDiv = document.createElement('div');
    postContentDiv.textContent = post.content;
    postElement.appendChild(postContentDiv);

    if (post.image) {
        const img = document.createElement('img');
        img.src = post.image;
        postElement.appendChild(img);
    }

    // Create delete button for the post
    const deletePostButton = document.createElement('button');
    deletePostButton.textContent = 'Delete Post';
    deletePostButton.className = 'delete-post';
    deletePostButton.onclick = function() {
        deletePost(postElement);
    }
    postElement.appendChild(deletePostButton);

    const commentsDiv = document.createElement('div');
    commentsDiv.className = 'comments';
    
    const commentForm = document.createElement('div');
    commentForm.className = 'comment-form';
    const commentTextarea = document.createElement('textarea');
    commentTextarea.placeholder = 'Write a comment...';
    const commentButton = document.createElement('button');
    commentButton.textContent = 'Comment';
    commentButton.onclick = function() {
        addComment(commentTextarea.value, commentsDiv, index);
        commentTextarea.value = '';
    }
    commentForm.appendChild(commentTextarea);
    commentForm.appendChild(commentButton);
    postElement.appendChild(commentForm);
    postElement.appendChild(commentsDiv);

    postsContainer.appendChild(postElement);

    // Load comments
    post.comments.forEach(comment => {
        addCommentToPage(comment, commentsDiv);
    });
}

function addComment(commentText, commentsDiv, postIndex) {
    if (commentText.trim()) {
        const comment = {
            text: commentText,
        };
        addCommentToPage(comment, commentsDiv);

        // Save the comment in localStorage
        let posts = JSON.parse(localStorage.getItem('posts')) || [];
        if (posts[postIndex]) {
            posts[postIndex].comments.push(commentText);
            localStorage.setItem('posts', JSON.stringify(posts));
        }
    }
}

function addCommentToPage(comment, commentsDiv) {
    const commentElement = document.createElement('div');
    commentElement.className = 'comment';
    
    const commentTextDiv = document.createElement('div');
    commentTextDiv.textContent = comment.text;
    commentElement.appendChild(commentTextDiv);

    // Create delete button for the comment
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'delete-comment';
    deleteButton.onclick = function() {
        deleteComment(commentElement, commentsDiv);
    }

    commentElement.appendChild(deleteButton);
    commentsDiv.appendChild(commentElement);
}

function deleteComment(commentElement, commentsDiv) {
    commentsDiv.removeChild(commentElement);

    // Update localStorage after deletion
    let posts = JSON.parse(localStorage.getItem('posts')) || [];
    const postIndex = Array.from(postsContainer.children).indexOf(commentsDiv.parentNode);
    if (posts[postIndex]) {
        const commentText = commentElement.querySelector('div').textContent;
        posts[postIndex].comments = posts[postIndex].comments.filter(comment => comment !== commentText);
        localStorage.setItem('posts', JSON.stringify(posts));
    }
}

function deletePost(postElement) {
    postsContainer.removeChild(postElement);

    // Update localStorage after deletion
    let posts = JSON.parse(localStorage.getItem('posts')) || [];
    const postIndex = postElement.dataset.index;
    if (postIndex !== undefined) {
        posts.splice(postIndex, 1);
        localStorage.setItem('posts', JSON.stringify(posts));
    }
}

function loadPosts() {
    let posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts.forEach((post, index) => addPostToPage(post, index));
}
