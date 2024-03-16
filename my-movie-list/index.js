const movies_lists = "https://webdev.alphacamp.io/"
const movies_get = movies_lists + "api/movies/"
const poster_url = movies_lists + "posters/"
const movie_per_page = 12


const viewMode = {

    cardMode : "cardMode",
    listMode: "listMode",

}



const movies = []
let filter_movies = []


const html_content = document.querySelector("#data-panel")
const dataPanel = document.querySelector("#data-panel")   //選出DOM節點
const search_form = document.querySelector("#search-form")
const search_input = document.querySelector("#search-input")
const buttonMode = document.querySelector(".mode-switch")




// 點擊卡片介面
buttonMode.addEventListener("click", (event) => {

    const modeSelected = event.target

    if (modeSelected.matches("#card-mode")) {

        controller.mode_status = viewMode.cardMode

    } else if (modeSelected.matches("#list-mode")) {

        controller.mode_status = viewMode.listMode 

    }  
    
    view.creat_movies(get_movies_page(1))
    set_paginator(movies.length)
    
})


const controller = {

    mode_status : viewMode.cardMode

}



const view = {

    creat_movies(datas) {

        if (controller.mode_status === viewMode.cardMode) {


            html_content.innerHTML = ``

            for (const ele of datas) {
                const img_url = `${poster_url + ele.image}`

                html_content.innerHTML += `
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
                                <button type="button" class="btn btn-info bg-body-tertiary border border-0">
                                <i class="fa-solid fa-heart btn-add-favorite fs-3" data-id="${ele.id}"></i>
                                </button>
                            </div>
                        </div>`
            }

            html_content.innerHTML += `
                    </div>
                </div>
            `

        } else if (controller.mode_status === viewMode.listMode) {

            html_content.innerHTML = `<ul class="list-group  border-top border-black">`

            for (const ele of datas) {
                html_content.innerHTML += `
                <li class="list-group-item fs-4 border-bottom border-black d-flex align-items-center my-0" style="height: 6.5vh;">
                    <h3 class="d-inline list-title" style="min-width: 60vw;">${ele.title}</h3>
                    <div class="card-footer d-inline position-absolute end-0">
                        <button type="button" class="btn btn-primary btn-show-movie" data-bs-toggle="modal"
                            data-bs-target="#movieModal" data-id="${ele.id}">more</button>
                        <button type="button" class="btn btn-info btn-add-favorite" data-id="${ele.id}">+</button>
                    </div>
                </li>
            `
            }

            html_content.innerHTML += `
            </ul>
        `
        }
    },   
}





//建立分頁
function set_paginator(total) {

    paginator.innerHTML = ``
    const pages = Math.ceil(total / movie_per_page) //計算需要幾個頁數，若有餘數則無條件進位

    for (page = 1; page <= pages; page++) {
        paginator.innerHTML += `<li class="page-item"><a class="page-link" data-page="${page}" href="#">${page}</a></li>`
    }
}




//回傳指定頁數的電影清單，利用slice()擷取元素
function get_movies_page(page) {
    const data = filter_movies.length > 0 ? filter_movies : movies

    const start_index = (page - 1) * movie_per_page
    const end_index = start_index + movie_per_page

    return data.slice(start_index, end_index)
}


//設置分頁器點擊事件
paginator.addEventListener("click", function onPaginatorClick(event) {
    if (event.target.tagName !== "A") return
    const page = Number(event.target.dataset.page)
    view.creat_movies(get_movies_page(page))
})





// 設置電影 more & + 點擊事件
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

        //點擊 + 按鍵
    } else if (event.target.matches(".btn-add-favorite")) {

        console.log(event.target.dataset.id)

        const favorite_movies = JSON.parse(localStorage.getItem("favorite_Movies")) || []

        const movie = movies.find(movie => movie.id === id)

        // console.log(favorite_movies.length)

        //若 favorite 清單資料重複則跳出對面視窗告知已新增
        if (favorite_movies.some(movie => movie.id === id)) {

            alert("已新增至清單")

        } else {

            favorite_movies.push(movie)

            localStorage.setItem("favorite_Movies", JSON.stringify(favorite_movies))

        }
    }
})


// 設置 search 事件
search_form.addEventListener("keyup", function onSearchFormSubmit(event) {

    event.preventDefault() //防止遊覽器自動重新整理頁面

    const keyward = search_input.value.toLowerCase().trim()

    //建立正規表達式
    const regex = /[^A-Za-z0-9_]/g

    if (keyward.length === 0) {

        console.log(movies.length)
        filter_movies = []
        set_paginator(movies.length)
        view.creat_movies(get_movies_page(1))

        
        //檢查是否為特殊字元
    } else if (regex.test(keyward)) {

        return alert("不得輸入特殊符號!")


    } else {
        // 用關鍵字篩選 movies
        filter_movies = movies.filter((movie) => movie.title.toLowerCase().includes(keyward))

        if (filter_movies.length === 0) return alert("查無電影名稱")

        // 用 filter_movies 重新渲染網頁
        view.creat_movies(get_movies_page(1))
        set_paginator(filter_movies.length)

    }
})


axios.get(movies_get)
    .then((response) => {
        movies.push(...response.data.results)

        view.creat_movies(get_movies_page(1))
        set_paginator(movies.length)
        
    })
    .catch(error => console.log(error))

