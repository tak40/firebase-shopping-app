import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://playground-2b535-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")
const separatorEl = document.getElementById("separator")

addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value
    if(inputValue) {    
        push(shoppingListInDB, inputValue)
        clearInputField()
    }

    if (shoppingListEl.children.length > 0) {
        separatorEl.classList.remove("hidden");
    } else {
        separatorEl.classList.add("hidden");
    }

})


onValue(shoppingListInDB, function(snapshot) { 

    if (snapshot.exists()) {
        let shoppingListArray = Object.entries(snapshot.val())

        clearShoppingListEl()

        for (let i = 0; i < shoppingListArray.length; i++) {
            let currentItem = shoppingListArray[i]
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]

            appendItemToList(currentItem)
    }   
    } else {
        shoppingListEl.innerHTML = '<p class="empty-list-message">No items in shopping list</p>'
    } 

})

function clearInputField() {
    inputFieldEl.value = ""
}

function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}

function appendItemToList(item) {
    let itemID = item[0]
    let itemValue = item[1]

    let newEl = document.createElement("li")

    newEl.textContent = itemValue

    newEl.addEventListener("dblclick", function() {
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
        remove(exactLocationOfItemInDB)

        if (shoppingListEl.children.length <= 1) {
            separatorEl.classList.add("hidden");
        }
    })

    shoppingListEl.append(newEl)
}
