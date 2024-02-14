const cl= console.log;

const cardContainer = document.getElementById('cardContainer');
const postForm = document.getElementById('postForm');
const titleControl = document.getElementById('title');
const contentControl= document.getElementById('content');
const userIdControl= document.getElementById('userId');
const loader= document.getElementById('loader');

const baseUrl= `https://jsonplaceholder.typicode.com`;
const postUrl= `${baseUrl}/posts/`;

let msgbody= null;
 
const onEdit= (ele) =>{
    cl(ele);
    let editId= ele.closest('.card').id;
    localStorage.setItem("editId", editId);
    let editUrl= `${baseUrl}/posts/${editId}`;
    makeApiCall("GET", editUrl);
    //here we get post obj & we want patch obj in form control

}


 const onDelete= (ele) => {
    Swal.fire({
        title: "Do you want to remove this post?",
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: "Yes",
        denyButtonText: `Don't remove`
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            cl(ele);
            let deleteId= ele.closest(".card").id;
            localStorage.setItem("deleteId", deleteId);
            let deleteUrl=  `${baseUrl}/posts/${deleteId}`;
            makeApiCall("DELETE", deleteUrl);
        } 
        Swal.fire({
            title:` Post is deleteded successfully !!!`,
            icon: `success`,
            timer: 2000
         })
      });
    
 }


const createCards= (arr) => {
    cardContainer.innerHTML= arr.map(obj =>{
        return `
            <div class="card mb-4" id="${obj.id}">
                <div class="card-header">
                    <h4 class="m-0">${obj.title}</h4>
                </div>
                <div class="card-body">
                    <p class="m-0">${obj.body}</p>
                </div>
                <div class="card-footer d-flex justify-content-between">
                    <button class="btn btn-primary" onclick="onEdit(this)">Edit</button>
                    <button class="btn btn-danger" onclick="onDelete(this)">Delete</button>
                </div>    
            </div>
           
        `
    }).join("");
   
}

 
const createSinglrCard= (obj) => {
    let card= document.createElement('div');
    card.className= "card mb-4";
    card.id = obj.id;
    card.innerHTML= 
                   `
                   <div class="card-header">
                      <h4 class="m-0">${obj.title}</h4>
                   </div>
                   <div class="card-body">
                       <p class="m-0">${obj.body}</p>
                   </div>
                   <div class="card-footer d-flex justify-content-between">
                       <button class="btn btn-primary" onclick="onEdit(this)">Edit</button>
                       <button class="btn btn-danger" onclick="onDelete(this)">Delete</button>
                   </div> 
                   `   
               cardContainer.append(card); 
             
             
}


const makeApiCall= (methodName, apiUrl, msgbody = null) => {  
    loader.classList.remove("d-none");
    let xhr= new XMLHttpRequest(); 
    xhr.open(methodName, apiUrl);
    xhr.send(JSON.stringify(msgbody));
    xhr.onload = function(){
        if(xhr.status >=200 && xhr.status <300){
        //    cl(xhr.response);
         let data= JSON.parse(xhr.response);
         //let post= JSON.parse(msgbody);
         if(methodName === "GET"){
            if(Array.isArray(data)){
            createCards(data);
            }else{

                cl(data);
                titleControl.value= data.title;
                contentControl.value= data.body;
                userIdControl.value= data.userId;  
                updateBtn.classList.remove('d-none');
                submitBtn.classList.add('d-none');

            }
         }else if(methodName === "POST"){

            msgbody.id = data.id;
            createSinglrCard(msgbody);
         }else if(methodName === "PATCH"){
            let card= [...document.getElementById(msgbody.id).children];
                 cl(card);
            card[0].innerHTML= `<h4 class="m-0">${msgbody.title}</h4>`;
            card[1].innerHTML= `<p class="m-0">${msgbody.body}</p>`; 
            postForm.reset()  
            Swal.fire({
                title: `Post is updated successfully !!!`,
                icon: `success`,
                timer: 2000
             })
         }else if(methodName === "DELETE"){
            let deleteId = localStorage.getItem("deleteId");
            let card = document.getElementById(deleteId); 
             card.remove();
            
         }
        }  
        loader.classList.add("d-none");
    }
    xhr.onerror= function(){
        loader.classList.add("d-none");
    }
}

 
 makeApiCall("GET", postUrl, null)
  
  const onSubmitPost= (eve) =>{
      eve.preventDefault();
      let postobj={
            title: titleControl.value,
            body : contentControl.value,
            userId: userIdControl.value
         }
           cl(postobj);
        postForm.reset();
     makeApiCall("POST", postUrl, postobj);
     Swal.fire({
        title: `Post is submited successfully !!!`,
        icon: `success`,
        timer: 2000
     })
    
}


 const onUpdatePost= () => {
    let updatedId = localStorage.getItem("editId");  
     let updatedObj={
        title: titleControl.value,
        body : contentControl.value,
        userId: userIdControl.value,
        id: updatedId
     }
     cl(updatedObj);
    //  let updatedId = localStorage.getItem("editId"); 
     let updatedUrl= `${baseUrl}/posts/${updatedId}`;
     makeApiCall("PATCH", updatedUrl, updatedObj);
     
      
     updateBtn.classList.add('d-none');
     submitBtn.classList.remove('d-none');

    
   
    
 }


postForm.addEventListener("submit", onSubmitPost);
updateBtn.addEventListener("click", onUpdatePost)