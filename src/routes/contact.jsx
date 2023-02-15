import { Form } from "react-router-dom";

export default function Contact() {
  // contato de exemplo
  const contact = {
    first: "Samuel",
    last: "Carvalho",
    avatar: "https://github.com/SamuraiSamuka.png",
    twitter: "sam__dev_",
    notes: "Não é porque as coisas são difíceis que não ousamos; é porque não ousamos que as coisas são difíceis.",
    favorite: true,
  };

  // Cria contatos
  return (
    <div id="contact">
      {/* Imagem do contato*/}
      <div>
        <img
          key={contact.avatar}
          src={contact.avatar || null}
        />
      </div>

      <div>
        {/* nome do contato + icone de favoritar */}
        <h1>
          {contact.first || contact.last ? (
            <>
              {contact.first} {contact.last}
            </>
          ) : (
            <i>No Name</i>
          )}{" "}
          <Favorite contact={contact} />
        </h1>

        {/* link para o twitter*/}
        {contact.twitter && (
          <p>
            <a
              target="_blank"
              href={`https://twitter.com/${contact.twitter}`}
            >
              {contact.twitter}
            </a>
          </p>
        )}

        {/* Notas, um status do contato */}
        {contact.notes && <p>{contact.notes}</p>}

        {/* Botões editar e deletar */}
        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>
          <Form
            method="post"
            action="destroy"
            onSubmit={(event) => {
              if (
                !confirm(
                  "Please confirm you want to delete this record."
                )
              ) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
}

// Adiciona a funcionalidade de favoritar aos contatos
function Favorite({ contact }) {
  // yes, this is a `let` for later
  let favorite = contact.favorite;
  return (
    <Form method="post">
      <button
        name="favorite"
        value={favorite ? "false" : "true"}
        aria-label={
          favorite
            ? "Remove from favorites"
            : "Add to favorites"
        }
      >
        {favorite ? "★" : "☆"}
      </button>
    </Form>
  );
}