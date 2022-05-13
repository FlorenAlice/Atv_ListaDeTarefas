const inputDescription = document.getElementById('item');
const btn = document.getElementById('btn');
const list = document.getElementById('list');
const listFinished = document.getElementById('listFinished');

let div;
let btnDelete;
let btnUpdate;
let btnFinish;
let li;

const Add = async () => {
    const myNewObject = new Parse.Object('tarefas');
    myNewObject.set('Descricao', inputDescription.value);
    myNewObject.set('Concluida', false);
    try {
        const result = await myNewObject.save();
        location.reload();
    } catch (error) {
        alert('preencha os campos de Descrição!')
        console.error('Error while creating tarefas: ', error);
    }
};


const ShowList = async () => {
    const tarefas = Parse.Object.extend('tarefas');
    const query = new Parse.Query(tarefas);

    try {
        const results = await query.find();
        for (const object of results) {
            const id = object.id
            const Descricao = object.get('Descricao')
            const Concluida = object.get('Concluida')

            li = document.createElement('li');
            btnFinish = document.createElement('button')
            btnFinish.innerText = 'Concluída'
            li.innerHTML = `${Descricao}`;
            btnDelete = document.createElement('button')
            btnUpdate = document.createElement('button')
            btnUpdate.innerText = 'Editar'
            btnDelete.innerText = 'Apagar'
            if(Concluida){
                listFinished.appendChild(li);
            }else{
                list.appendChild(li);
                list.appendChild(btnFinish);
                list.appendChild(btnDelete);
                list.appendChild(btnUpdate);
            }

            btnDelete.onclick = async function DeleteItem() {
                const query = new Parse.Query('tarefas');
                try {

                    const object = await query.get(id);
                    try {
                        const response = await object.destroy();
                        alert('Item deletado com sucesso!')
                        location.reload();
                    } catch (error) {
                        console.error('Error while deleting ParseObject', error);
                    }
                } catch (error) {
                    console.error('Error while retrieving ParseObject', error);
                }
            }

            btnUpdate.onclick = async function UpdateItem() {
                const query = new Parse.Query(tarefas);
                try {
                    let newDescription = window.prompt('Digite a nova descrição!')

                    const object = await query.get(id);
                    object.set('Descricao', newDescription);
                    try {
                        const response = await object.save();
                        alert('Descrição editada!')
                        location.reload();
                    } catch (error) {
                        console.error('Error while updating tarefas', error);
                    }
                } catch (error) {
                    console.error('Error while retrieving object tarefas', error);
                }
            }

            btnFinish.onclick = async function finish() {
                const query = new Parse.Query(tarefas);
                try {
                    const object = await query.get(id);
                    object.set('Concluida', true);
                    try {
                        if(Concluida == false){
                            const response = await object.save();
                            location.reload();
                        }
                    } catch (error) {
                        console.error('Error while updating tarefas', error);
                    }
                } catch (error) {
                    console.error('Error while retrieving object tarefas', error);
                }
            }

        }
    } catch (error) {
        console.error('Error while fetching tarefas', error);
    }
}

btn.onclick = Add;
ShowList();