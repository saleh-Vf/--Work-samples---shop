let list_container = document.querySelector(".list-container");
let cssObj = window.getComputedStyle(list_container, null);
let root = document.querySelector(":root");
let rootObj = getComputedStyle(root);
let product_property = [];



// todo                   jquery                //

if ($(".list-container")[0].childNodes.length == 0) {
    container_empty();

}


set_top();
$(window).on("resize", set_top);
$(".add-cart-button").on("click", added_massage); // set style for BTN added 
$(".cart-icon").on("click", lowering_cart); // lowering Cart 
$(".add-cart-button").on("click", set_product); // creat Json and send it 

// get products of local and push to product_property


if (localStorage.getItem("products")) get_item_of_localStorage();

function get_item_of_localStorage() {
    JSON.parse(localStorage.getItem("products")).forEach(
        (obj) => {
            product_property.push(obj)
        }
    );
    get_product();
}

//----------------------------------- style code ------------------------------
function set_top() {
    let height_list = cssObj.getPropertyValue("height") // height of list 
    height_list = height_list.replace("px", "")
    root.style.setProperty("--top", `-${+height_list+200}px`);
    $(".alert").css("display", "flex");
}


function added_massage() {
    $(this).css({
        backgroundColor: "#22c55e",
        color: "#aef3d3"
    });
    $(this).html("added <i class='fa fa-check'></i> ");

    setTimeout(() => {
        $(this).removeAttr("style");
        $(this).html("<i class='fa fa-cart-arrow-down'></i> add to cart");
    }, 2000);
}

function lowering_cart() {
    $(".alert").toggleClass("toggle-top-down");
}
//--------------------------------------------------------------------------------






function set_product() {
    //   creat information of product      Image   Name   Price
    let container_item = $(this).parent().parent().parent();
    let product_image = container_item[0].childNodes[1].childNodes[1];
    let product_name = container_item[0].childNodes[3].childNodes[1].childNodes[1].innerHTML;
    let product_price = container_item[0].childNodes[3].childNodes[1].childNodes[3].innerHTML.replace("$", "");


    //check for new product for tath not be dublicate (by name!!)
    let check_repet = product_property.every(
        (obj) => {
            return obj.name != product_name;
        }
    );

    if (check_repet == true) creat_send_prodocts();

    function creat_send_prodocts(x) { //check repeat  = true
        let new_object = {
            number: 1,
            image_src: $(product_image).attr("src"),
            name: product_name,
            price: +product_price
        };
        product_property.push(new_object);
        localStorage.setItem("products", JSON.stringify(product_property));
        get_product();

    }
    get_product()
}

// get product of localStorage  and creat Element and push to cart 
function get_product() {

    $(".number-cart").text(product_property.length);
    $(".list-container").css("backgroundColor", "#eeededb2");


    let item = [];
    let bought_products_informations = JSON.parse(localStorage.getItem("products"));

    bought_products_informations.forEach(
        (bought_item) => {
            let strItem = `
                <div class="item">
                <div class="left-item">
    
                    <div class="image-item-container">
                        <img class="image-item" src="${bought_item.image_src}" alt="">
                    </div>
    
                    <div class="name-item-container">
                        <p class="name-item">${bought_item.name}</p>
                    </div>
    
                    <div class="number-item-container">
                        <p class="number-item" id="${bought_item.name}">${bought_item.number}</p>
                    </div>
                </div>
    
    
                <div class="right-item">
                    <div onclick="delete_item(this)"  id="${bought_item.name}" class="delete icon-hover"><i class="fa fa-trash"></i></div>
    
                    <div class="add-reduce-price">
                        <span  id="${bought_item.name}" onclick="plus_item(this)" class="add icon-hover"><i class="fa fa-angle-up"></i></span>
                        <p class="price-product">${bought_item.price * bought_item.number}$</p>
                        <span onclick="reduce_item(this)" id="${bought_item.name}"class="reduce icon-hover"><i class="fa fa-angle-down"></i></span>
                    </div>
                </div>
            </div> `;

            item.push(strItem);
        });

    let sum_item = item.concat("");
    $(".list-container").html(sum_item);

    if (!$(".list-container").text()) {
        container_empty()

    }


    set_top()


} //  get product and creat Element


function delete_item(element) {
    let sum = product_property.filter(
        (item) => {
            return item.name != element.id;
        }
    );

    product_property = sum;
    localStorage.setItem("products", JSON.stringify(product_property));

    get_product();
}


function plus_item(element) {
    product_property.forEach(
        (item) => {
            if (item.name == element.id) {

                item.number = +item.number + 1;
                // set in local storage ==>
                localStorage.setItem("products", JSON.stringify(product_property));

            }
        }
    );
    get_product();

}

function reduce_item(element) {

    product_property.forEach(
        (item) => {
            if (item.name == element.id) {
                item.number = +item.number - 1;
                // set in local storage ==>
                localStorage.setItem("products", JSON.stringify(product_property));

                if (item.number == 0) {
                    delete_item(element); // delete item if number == 0
                }
            }
        }
    );
    get_product();

}

function container_empty() {
    $(".list-container").html("<h3> empty! select a product </h3>");
    $(".list-container").css("backgroundColor", "#eeededf8");
}