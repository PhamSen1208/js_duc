const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const btnClear = document.getElementById('clear');
const filter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;

function onAddItemSubmit(e) {
    e.preventDefault(); //Prevent form from submitting normally

    const newItem = itemInput.value.trim(); 

    if(newItem === '')
    {
        alert('Please enter an item');
        return;
    }
    if(isEditMode)
    {
        const itemToEdit = itemList.querySelector('.edit-mode');
        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.classList.remove('edit-mode');
        itemToEdit.remove();
        isEditMode = false;
    }
    else 
    {
        if (checkIfItemExists(newItem)) 
        {
            alert('That item already exists!');
            return;
        }
    }
        addItemToStorage(newItem);
        addItemToDOM(newItem);
        checkUI();
}

function addItemToDOM(item)
{
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(item));
    const deleteBtn = createButton('remove-item btn-link text-red', 'fa-solid fa-xmark');
    li.appendChild(deleteBtn);
    itemList.appendChild(li);
    itemInput.value = '';
}

function addItemToStorage(item)
{
    let itemsFromStorage = getItemsFromStorage();
    if(localStorage.getItem('items') === null) 
    {
        itemsFromStorage = [];
    }
    else
    {
        itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    }
    itemsFromStorage.push(item);
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function getItemsFromStorage()
{
    let itemsFromStorage;   
    if(localStorage.getItem('items') === null) 
    {
        itemsFromStorage = [];
    }
    else
    {
        itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    }
    return itemsFromStorage;
}

function removeItem(e)
{
    if(e.target.parentElement.classList.contains('remove-item'))
    {
        if(confirm('Are you sure you want to delete this item?'))
        {
            const li = e.target.parentElement.parentElement;
            const itemText = li.firstChild.textContent; 
            itemList.removeChild(li);
            removeItemFromStorage(itemText);
            checkUI();
        }
    }
}

function removeItemFromStorage(item)
{
    let itemsFromStorage = getItemsFromStorage();
    itemsFromStorage = itemsFromStorage.filter(i => i != item);
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function onClickItem(e) {
    const li = e.target.closest('li'); // chọn thẻ li cha gần nhất
    if(!li) return; // nếu click ngoài li thì thôi
    setItemToEdit(li);
}


function setItemToEdit(item) {
    isEditMode = true;

    itemList.querySelectorAll('li').forEach((i) => i.classList.remove('edit-mode'));
    item.classList.add('edit-mode');

    formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
    formBtn.style.backgroundColor = '#228B22';
    itemInput.value = item.textContent.trim();
}

function checkIfItemExists(item) {
  const itemsFromStorage = getItemsFromStorage();
  return itemsFromStorage.includes(item);
}

function clearItems()
{
    while(itemList.firstChild) // clear all items
    {
        itemList.removeChild(itemList.firstChild);
    }
    localStorage.removeItem('items');
    checkUI();
}

function createButton(classes, iconClasses = 'fa-solid fa-xmark') 
{
    const button = document.createElement('button');
    // Explicitly set type to avoid submitting form when inside a <form>
    button.type = 'button';
    button.className = classes;
    const icon = createIcon(iconClasses);
    button.appendChild(icon);
    return button;
}

function createIcon(classes)
{
    const icon = document.createElement('i');
    icon.className = classes;
    return icon;
}

function editItem(e)
{
    // find the closest li (handles clicks on the icon or button)
    const li = e.target.closest('li');
    if(!li) return;
    setItemToEdit(li);
    // populate the input with the item text (firstChild is the text node)
    itemInput.value = li.firstChild.textContent.trim();
    itemInput.focus();
}

function filterItems(e)
{
    const items = itemList.querySelectorAll('li');
    const text = e.target.value.toLowerCase();
    items.forEach(item => {
        const itemName = item.firstChild.textContent.toLowerCase();
        if(itemName.indexOf(text) != -1)
        {
            item.style.display = 'flex';
        }
        else
        {
            item.style.display = 'none';
        }
        checkUI();
    });
}

function checkUI()
{
    const items = itemList.querySelectorAll('li');
    if(items.length === 0)
    {
        btnClear.style.display = 'none';
        filter.style.display = 'none';
    }
    else
    {
        btnClear.style.display = 'block';
        filter.style.display = 'block';
    }
}




//Event listener for form submission
itemForm.addEventListener('submit', onAddItemSubmit);
itemList.addEventListener('click', (e) => {
    const li = e.target.closest('li');
    if(!li) return;

    if(e.target.parentElement.classList.contains('remove-item')) {
        removeItem(e);
    } 
    else if(e.target.parentElement.classList.contains('edit-item')) {
        // Click vào nút edit
        setItemToEdit(li);
        itemInput.value = li.firstChild.textContent.trim();
        itemInput.focus();
    } 
    else {
        // Click vào phần còn lại của li
        setItemToEdit(li);
    }
});

btnClear.addEventListener('click', clearItems);
filter.addEventListener('input', filterItems);
document.addEventListener('DOMContentLoaded', () => {
    const itemsFromStorage = getItemsFromStorage();
    itemsFromStorage.forEach(item => addItemToDOM(item));
});
checkUI();
