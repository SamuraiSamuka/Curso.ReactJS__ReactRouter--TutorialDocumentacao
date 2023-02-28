import localforage from "localforage"; // Uma biblioteca JS para armazenamento de dados no navegador
import { matchSorter } from "match-sorter"; // Algoritmo de classificação de resultados
import sortBy from "sort-by"; // Algoritmo de ordenação simples

// Retona 0 ou mais contatos, a partir de um termo de pesquisa
export async function getContacts(query) {
  await fakeNetwork(`getContacts:${query}`);
  let contacts = await localforage.getItem("contacts"); 
  if (!contacts) {
    let id = Math.random().toString(36).substring(2, 9);
    let contact = { id, createdAt: Date.now() };
    Object.assign(contact, {
      first: "Samuel",
      last: "Carvalho",
      avatar: "https://github.com/SamuraiSamuka.png",
      linkedin: "https://www.linkedin.com/in/samuel-silva-de-carvalho/",
      notes: "Desenvolvedor full-stack em desenvolvimento",
      favorite: true,
    })
    contacts = [ contact ]
    set(contacts)
  }; // Caso contatos seja nulo ele recebe um array vazio

  if (query) {
    contacts = matchSorter(contacts, query, { keys: ["first", "last"] }); // busca os resultados
  }
  return contacts.sort(sortBy("last", "createdAt")); // ordena os resultados
}

// Cria um contato
export async function createContact() {
  await fakeNetwork(); // simula o tempo de resposta de uma requisição
  let id = Math.random().toString(36).substring(2, 9); // gera um id aleatório
  let contact = { id, createdAt: Date.now() }; // cria o contato e atribui o id e a data e hora atuais.
  let contacts = await getContacts(); // pega todos os contatos
  contacts.unshift(contact); // adiciona o novo contato como o primeiro elemento do array.
  await set(contacts); // Salva no DB.
  return contact; // Retorna o contato criado
}

// Retorna, caso exista, o contato com id correspondente
export async function getContact(id) {
  await fakeNetwork(`contact:${id}`); // simula o tempo de resposta de uma requisição
  let contacts = await localforage.getItem("contacts"); // pega todos contatos da base de dados, que é na verdade o local storage do navegador;
  let contact = contacts.find(contact => contact.id === id); // encontra o contato que dá match no id
  return contact ?? null; // retorna o contanto caso ele exista, caso contrário retorn null
}

// Atualiza um contato
export async function updateContact(id, updates) {
  await fakeNetwork(); // simula o tempo de resposta de uma requisição
  let contacts = await localforage.getItem("contacts"); // Pega os contatos do DB.
  let contact = contacts.find(contact => contact.id === id); // Encontra o contato que vai ser modificado
  if (!contact) throw new Error("No contact found for", id); // Caso não seja encontrado nenhum contato lança um erro.
  Object.assign(contact, updates); // atribui as mudanças ao contato atual, fazendo um 'merge' dos dois objetos.
  await set(contacts); // Salva no DB
  return contact; // Retorna o contato atualizado
}

// Deleta um contato
export async function deleteContact(id) {
  let contacts = await localforage.getItem("contacts"); // Pega todos os contatos no DB.
  let index = contacts.findIndex(contact => contact.id === id); // Encontra a posição no array do contato com o id informado
  if (index > -1) {
    contacts.splice(index, 1); // a partir da posição do contato, remove 1 contato, o próprio.
    await set(contacts); // Salva no DB
    return true; // Caso o contato exista, retorna verdadeiro
  }
  return false; // Caso o contato não exista, retorna falso
}

// Função que salva dados no DB
function set(contacts) {
  return localforage.setItem("contacts", contacts);
}

// fake a cache so we don't slow down stuff we've already seen
let fakeCache = {};

// Simula a espera de uma requisição ao servidor, mas só para requisições novas
// Algoritmo atrasa-lado, tem a função de atrasar a respota
async function fakeNetwork(key) {
  if (!key) {
    fakeCache = {};
  }

  if (fakeCache[key]) {
    return;
  }

  fakeCache[key] = true;
  return new Promise(res => {
    setTimeout(res, Math.random() * 800);
  });
}