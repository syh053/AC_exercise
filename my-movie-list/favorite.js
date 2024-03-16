const movies_lists = "https://webdev.alphacamp.io/"
const movies_get = movies_lists + "api/movies/"
const poster_url = movies_lists + "posters/"



const dataPanel = document.querySelector("#data-panel")


function creat_movies(datas) {


    dataPanel.innerHTML = ``

    for (const ele of datas) {
        const img_url = `${poster_url + ele.image}`

        dataPanel.innerHTML += `
        <div class="col-md-3">
            <div class="mb-2">
                <div class="card mb-4">
                    <img src="${img_url}"
                        class="card-img-top border border-2 shadow p-3 bg-body rounded" alt="Movie Poster">
                    <div class="card-body d-flex justify-content-center align-items-center" style="height: 80px">
                        <h5 class="card-title">${ele.title}</h5>
                    </div>
                    <div class="card-footer">
                        <button type="button" class="btn btn-primary btn-show-movie" data-bs-toggle="modal"
                            data-bs-target="#movieModal" data-id="${ele.id}">more</button>
                        <button type="button" class="btn btn-danger" data-id="${ele.id}">X</button>
                    </div>
                </div>
            </div>
        </div>`
    }

}


// dataPanel = document.querySelector("#data-panel")   //選出DOM節點

// 設置點擊事件
dataPanel.addEventListener("click", function show_description(event) {

    //設置 id ，!!dataset功能重要!!
    const id = Number(event.target.dataset.id)

    //點擊 more 按鍵
    if (event.target.matches(".btn-show-movie")) {

        //選出DOM節點
        const modal_title = document.querySelector("#movie-modal-title") // tittle
        const modal_date = document.querySelector("#movie-modal-date")  // date
        const modal_description = document.querySelector("#movie-modal-description") // description
        const modal_img = document.querySelector("#movie-modal-image img") // img

        //將上述 DOM 依序帶入資料
        axios.get(movies_get + id)
            .then((response) => {
                const data = response.data.results
                modal_title.innerHTML = data.title
                modal_date.innerHTML = data.release_date
                modal_description.innerHTML = data.description
                modal_img.src = poster_url + data.image
            })
            .catch(error => console.log(error))
    } else if (event.target.matches(".btn-danger")) {

        const favorite_movies = JSON.parse(localStorage.getItem("favorite_Movies"))
        const index = favorite_movies.findIndex(movie => movie.id === id)

        //刪除元素
        favorite_movies.splice(index, 1)

        // 重新 setItem 到 localStorage
        localStorage.setItem("favorite_Movies", JSON.stringify(favorite_movies))

        // 重整渲染頁面
        creat_movies(favorite_movies)
    }


})


const movies = JSON.parse(localStorage.getItem("favorite_Movies")) || []

creat_movies(movies)

