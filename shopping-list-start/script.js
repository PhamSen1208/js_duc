const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');

//Add function

function addItem(e) {
    e.preventDefault(); //Prevent form from submitting normally

    const newItem = itemInput.value; 

    if(itemInput.value === '')
    {
        alert('Please enter an item');
        return;
    }
    else
    {
        const li = document.createElement('li');
        li.appendChild(document.createTextNode(newItem));
        itemList.appendChild(li);
        const deleteBtn = createButton('remove-item btn-link text-red');
        li.appendChild(deleteBtn);
        itemInput.value = '';
    }
}

function createButton(classes) 
{
    const button = document.createElement('button');
    button.className = classes;
    const icon = createIcon('fa-solid fa-xmark');
    button.appendChild(icon);
    return button;
}

function createIcon(classes)
{
    const icon = document.createElement('i');
    icon.className = classes;
    return icon;
}


//Event listener for form submission
itemForm.addEventListener('submit', addItem);

