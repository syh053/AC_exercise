// 建立 api 網址
const url = "https://user-list.alphacamp.io/api/v1/users/"

//選定 dom 節點
const html_content = document.querySelector("#data-panel")


function creat_users(datas) {

    html_content.innerHTML = ``

    // 逐一遍歷陣列
    datas.forEach(ele => {

        // 無照片的資料將跳過
        if (ele.avatar !== null) {

            html_content.innerHTML += `
                <div class="border-0 col-md-1 mb-3">
                    <div class="card border-0">
                        <img src=${ele.avatar}
                            class="card-img-top border border-2" alt="user poster" data-bs-toggle="modal" data-bs-target="#exampleModal" data-id="${ele.id}">
                        <div class="card-body d-flex pt-0 ps-0" style="height: 30px">
                            <h5 class="card-title ms-0">${ele.name}</h5>
                        </div>
                    </div>
                </div>
            `
        }

    });
}


// 建立點擊事件，並帶入 modal 資訊
const data_panel = document.querySelector("#data-panel")


data_panel.addEventListener("click", function show_description(event) {

    if (event.target.matches("img")) {

        const user_id = event.target.dataset.id

        axios.get(url + user_id)
            .then((response) => {
                console.log(response.data.avatar)
                const data = response.data
                document.querySelector("#user-modal-image img").src = data.avatar
                document.querySelector("#user-modal-id").innerHTML = `id : ${user_id}`
                document.querySelector("#user-modal-name").innerHTML = `name : ${data.name}`
                document.querySelector("#user-modal-surname").innerHTML = `surname : ${data.surname}`
                document.querySelector("#user-modal-email").innerHTML = `email : \n${data.email}`
                document.querySelector("#user-modal-gender").innerHTML = `gender : ${data.gender}`
                document.querySelector("#user-modal-age").innerHTML = `age : ${data.age}`
                document.querySelector("#user-modal-region").innerHTML = `region : ${data.region}`
                document.querySelector("#user-modal-birthday").innerHTML = `birthday : ${data.birthday}`
            })


    }
})





// 建立users清單
const users = []

// axios串接資列後放進users
axios.get(url)
    .then((response) => {
        users.push(...response.data.results)
        creat_users(users)
    })

