const url = "https://jsonplaceholder.typicode.com/posts";

const loadingElement = document.querySelector("#loading"); 
const postsContainer = document.querySelector("#posts-container"); 

const postPage = document.querySelector("#post"); 
const postContainer = document.querySelector("#post-container"); 
const commentsContainer = document.querySelector("#comments-container");

const commentForm = document.querySelector("#comment-form") 
const emailInput = document.querySelector("#email");
const bodyInput = document.querySelector("#body");
// Get id from URL
const urlSearchParams = new URLSearchParams(window.location.search); 
const postId = urlSearchParams.get("id");


// Get all posts 

async function getAllPosts() { // requisição dos dados
    const response = await fetch(url); 

    console.log(response); 

    const data = await response.json(); // recebe os dados

    console.log(data); 

    loadingElement.classList.add("hide"); 

    data.map((post) => { // projetando os dados no post.html

        const div = document.createElement("div"); // criando os elementos da pagina post.html
        const title = document.createElement("h2"); 
        const body = document.createElement("p"); 
        const link = document.createElement("a"); 

        title.innerText = post.title;  // alterando para os dados da api
        body.innerText = post.body; 
        link.innerText = "Ler";
        link.setAttribute("href", `/post.html?id=${post.id}`); 

        div.appendChild(title); // colocando os dados na div
        div.appendChild(body);  
        div.appendChild(link);

       postsContainer.appendChild(div); 
    });
} 

// Get individual post 

async function getPost(id) {

    const [responsePost, responseComments] = await Promise.all([
        fetch(`${url}/${id}`), 
        fetch(`${url}/${id}/comments`)
    ]); 

    const dataPost = await responsePost.json(); 

    const dataComments = await responseComments.json(); 

    loadingElement.classList.add("hide"); 
    postPage.classList.remove("hide"); 

    const title = document.createElement("h1"); 
    const body = document.createElement("p");  

    title.innerText = dataPost.title; 
    body.innerText = dataPost.body; 

    postContainer.appendChild(title); 
    postContainer.appendChild(body); 

    console.log(dataComments);

    dataComments.map((comment) => {
        createComment(comment);
    })
} 

function createComment(comment) { //exibe os comentarios postados

    const div = document.createElement("div"); 
    const email = document.createElement("h3");
    const commentBody = document.createElement("p");

    email.innerText = comment.email;
    commentBody.innerText = comment.body; 

    div.appendChild(email); 
    div.appendChild(commentBody); 

    commentsContainer.appendChild(div);
}

// INSERT a comment
 async function postComment(comment) {

   const response = await fetch(`${url}/${postId}/comments`, {
        method: "POST", 
        body: comment, 
        headers: {
             "content-type": "application/json", 
        }
    }); 

    const data = await response.json(); 
    createComment(data);

} 

async function postComment(comment) {
    const response = await fetch(url, {
      method: "POST",
      body: comment,
      headers: {
        "Content-type": "application/json",
      },
    });
  
    const data = await response.json();
  
    createComment(data);
  }

if (!postId) {
    getAllPosts();
} else {
    getPost(postId); 


    commentForm.addEventListener("submit", (e) => {
        e.preventDefault(); 
        
        let comment = {
            email: emailInput.value, 
            body: bodyInput.value, 
            
        };
        comment = JSON.stringify(comment);

        postComment(comment);
    });
} 
