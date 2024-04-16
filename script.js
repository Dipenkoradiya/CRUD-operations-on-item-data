const AddItemForm = document.querySelector(".absoluteForm");
const EditItemForm = document.querySelector(".editAbsoluteForm");
const addButton = document.querySelector(".addbtn");
const addItemButton = document.querySelector(".addItembtn");
const clearItemButton = document.querySelector(".clearbtn");

const editButton = document.querySelector(".editButton");
const saveEditButton = document.querySelector(".saveEdit");

const deleteButton = document.querySelector(".deleteButton");

const cancelButton = document.querySelector(".cancelBtn");
const cancelEditButton = document.querySelector(".cancelEditBtn");
const table = document.querySelector(".itemTable");
const itemName = document.getElementById("itemName");
const itemCategory = document.getElementById("itemCategory");
const itemPrice = document.getElementById("itemPrice");
const itemAvailability = document.getElementById("itemAvailability");

const editItemName = document.getElementById("editItemName");
const editItemPrice = document.getElementById("editItemPrice");
const editItemAvailability = document.getElementById("editItemAvailability");

//--------------------- LOADING ALL DATA FROM LOCAL STORAGE -------------------------
const loadData = function () {
    table.innerHTML = ""; // Clear existing table content

    // Add table headers
    const tableHeaders = `
        <tr class="">
            <th>ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Availability</th>
            <th>Edit</th>
            <th>Delete</th>
        </tr>
    `;
    table.insertAdjacentHTML("beforeend", tableHeaders);
    let localStorageKeys = Object.keys(localStorage);
    for (let i in localStorageKeys) {
        let count = 1;
        let data = JSON.parse(localStorage.getItem(localStorageKeys[i]));
        for (let j in data) {
            let newId = data[j].category.toUpperCase() + count.toString().padStart(2, "0");

            count++;
            const markUp = `
            <tr>
                <td class="id">${newId}</td>
                <td class="name">${data[j].name}</td>
                <td class="category">${data[j].category}</td>
                <td class="price">${data[j].price}</td>
                <td class="availability">${data[j].availability}</td>
                <td>
                    <div class="btn btn-secondary editButton">Edit</div>
                </td>
                <td>
                    <div class=" deleteButton btn btn-danger">Delete</div>
                </td>
            </tr>
            `;

            table.insertAdjacentHTML("beforeend", markUp);
        }
    }
};
//---------------------- RETRIVING ID FROM CLASSNAME ----------------------
const getId = function (e, className) {
    if (e.target.classList.contains(className)) {
        const closestRow = e.target.closest("tr");
        const rowId = closestRow.querySelector(".id").innerText;
        const categoryFromId = rowId.substring(0, rowId.length - 2);
        return {
            closestRow: closestRow,
            rowId: rowId,
            categoryFromId: categoryFromId,
        };
    }
};

//--------------------- GETITEM AND SETITEM FUNCTION --------------------------
const getItemFromStorage = function (key) {
    return JSON.parse(localStorage.getItem(key));
};

const setItemToStorage = function (key, value) {
    localStorage.setItem(key, value);
};
//------------------- HIDE AND SHOW FORM FUNCTION --------------------
const formAction = function (formName, action) {
    formName.style.display = action;
};

//-------------- ASSIGNING AVAILABILITY -----------------------
const assignAvailability = function (checkWith) {
    let updatedAvailability = "";
    if (checkWith === "1") {
        updatedAvailability = "Available";
    } else {
        updatedAvailability = "Out of stock";
    }
    return updatedAvailability;
};
// Function to open confirmation modal with custom message and action
function openConfirmationModal(message, action) {
    $("#confirmationModal .modal-body").text(message); // Set message
    $("#confirmationModal").modal("show"); // Show modal

    document.getElementById("confirmAction").onclick = action;
}
let editNameError = document.querySelector(".editItemNameError");
let editPriceError = document.querySelector(".editItemPriceError");
let editAvailabilityError = document.querySelector(".editItemAvailabilityError");
//-------------- EDIT ITEMS --------------------
table.addEventListener("click", function (e) {
    e.preventDefault();
    if (e.target.classList.contains("editButton")) {
        const closestRow = e.target.closest("tr");
        const rowId = closestRow.querySelector(".id").innerText;
        const categoryFromId = rowId.substring(0, rowId.length - 2);
        let rowInfo = {
            closestRow: closestRow,
            rowId: rowId,
            categoryFromId: categoryFromId,
        };

        formAction(EditItemForm, "block");
        if (rowInfo) {
            let closestRowInfo = rowInfo.closestRow;

            // const closestRow = closestRowInfo;
            // const id = closestRowInfo.querySelector(".id").innerText;
            const name = closestRowInfo.querySelector(".name").innerText;
            const category = closestRowInfo.querySelector(".category").innerText;
            const price = closestRowInfo.querySelector(".price").innerText; // Remove the '/-' from the price
            const availability = closestRowInfo.querySelector(".availability").innerText;
            let editAvailability;
            if (availability === "Available") {
                editAvailability = "1";
            } else {
                editAvailability = "0";
            }
            document.getElementById("editItemName").value = name;
            document.getElementById("editItemCategory").value = category;
            document.getElementById("editItemPrice").value = price;
            document.getElementById("editItemAvailability").value = editAvailability;

            //EDIT AVAILABILITY CHANGE REMAINING///////////////////////////////////////////////////////////////////////////////////////////////
            saveEditButton.addEventListener("click", function (e) {
                e.preventDefault();
                if (name.length < 1) {
                    editNameError.textContent = "Please enter name !!!";
                } else if (price < 1) {
                    editPriceError.textContent = "Please enter valid price !!!";
                } else if (!(editAvailability === "1" || editAvailability === "0")) {
                    editAvailabilityError.textContent = "Please enter valid availability !!!";
                } else {
                    openConfirmationModal("Are you sure you want to edit this item?", function () {
                        const editname = editItemName.value;
                        const editprice = editItemPrice.value;
                        const editavailability = editItemAvailability.value;

                        if (editname.length < 1) {
                            alert("enter name");
                        } else if (!(editavailability === "1" || editavailability === "0")) {
                            alert("Please enter 0 or 1 in availability");
                        } else {
                            let itemIdNumber = rowInfo.rowId.slice(-2);
                            let category = rowInfo.categoryFromId;

                            let data = getItemFromStorage(category.toLowerCase());

                            const editedItemIndex = parseInt(itemIdNumber) - 1;

                            data[editedItemIndex].name = editname;
                            data[editedItemIndex].price = editprice;
                            if (editavailability === "1") {
                                data[editedItemIndex].availability = "Available";
                            } else if (editavailability === "0") {
                                data[editedItemIndex].availability = "Out of stock";
                            }
                            setItemToStorage(category.toLowerCase(), JSON.stringify(data));

                            formAction(EditItemForm, "none");
                            loadData();
                            $("#confirmationModal").modal("hide");
                        }
                        $("#confirmationModal").modal("hide");
                    });
                }
            });
        }
    }
});

//--------------- DELETE ITEMS -----------------
table.addEventListener("click", function (e) {
    if (e.target.classList.contains("deleteButton")) {
        openConfirmationModal("Are you sure you want to delete this item?", function () {
            console.log(e.target);
            const closestRow = e.target.closest("tr");
            const rowId = closestRow.querySelector(".id").innerText;
            const categoryFromId = rowId.substring(0, rowId.length - 2);
            let rowInfo = {
                closestRow: closestRow,
                rowId: rowId,
                categoryFromId: categoryFromId,
            };
            if (rowInfo) {
                let itemIdNumber = +rowInfo.rowId.slice(-2);
                let category = rowInfo.categoryFromId;

                let data = getItemFromStorage(category.toLowerCase());

                data.splice(itemIdNumber - 1, 1);

                setItemToStorage(category.toLowerCase(), JSON.stringify(data));
                loadData();
            }
            $("#confirmationModal").modal("hide");
        });
    }
});

addButton.addEventListener("click", function () {
    formAction(AddItemForm, "block");
});

const addNameError = document.querySelector(".addItemNameError");
const addCategoryError = document.querySelector(".addItemCategoryError");
const addPriceError = document.querySelector(".addItemPriceError");
const addAvailabilityError = document.querySelector(".addItemAvailabilityError");

//--------------- ADD ITEMS ------------------------
addItemButton.addEventListener("click", function (e) {
    e.preventDefault();
    let inputData = {
        name: itemName.value,
        category: itemCategory.value,
        price: itemPrice.value,
        availability: itemAvailability.value,
    };
    if (inputData.name.length < 1) {
        addNameError.textContent = "Please enter name !!!";
    } else if (inputData.category.length < 1) {
        addCategoryError.textContent = "Please enter category !!!";
    } else if (inputData.price < 1) {
        addPriceError.textContent = "Please enter valid price !!!";
    } else if (!(inputData.availability === "1" || inputData.availability === "0")) {
        addAvailabilityError.textContent = "Please enter valid availability !!!";
    } else {
        openConfirmationModal("Are you sure you want to add this item?", function () {
            let update = assignAvailability(inputData.availability);

            let updatedInputData = {
                name: itemName.value,
                category: itemCategory.value,
                price: itemPrice.value,
                availability: update,
            };
            let existing = getItemFromStorage(updatedInputData.category);

            if (existing === null) {
                existing = [updatedInputData];
            } else {
                existing.push(updatedInputData);
            }
            setItemToStorage(updatedInputData.category, JSON.stringify(existing));
            loadData();
            // displayModal(exampleModal, exampleModal, "hello", "This is message");
            formAction(AddItemForm, "none");
            $("#confirmationModal").modal("hide");
        });
    }
});

cancelButton.addEventListener("click", function () {
    itemName.value = "";
    itemCategory.value = "";
    itemPrice.value = "";
    itemAvailability.value = "";

    addNameError.textContent = "";
    addCategoryError.textContent = "";
    addPriceError.textContent = "";
    addAvailabilityError.textContent = "";

    formAction(AddItemForm, "none");
});

cancelEditButton.addEventListener("click", function (e) {
    formAction(EditItemForm, "none");
});

clearItemButton.addEventListener("click", function () {
    openConfirmationModal("Are you sure you want to clear all items?", function () {
        localStorage.clear();
        $("#confirmationModal").modal("hide");
    });
});

loadData();
