import { Form, useFetcher, useLoaderData } from "react-router-dom";
import { getContact, updateContact } from "../contacts";

export async function loader({params}) {
  const contact = await getContact(params.contactId);
  if(!contact) {
    throw new Response("", {
      status: 404,
      statusText: "Erro 404: Não encontrado",
    });
  }
  return { contact };
}

export async function action({ request, params }){
  let formData = await request.formData();
  return updateContact(params.contactId, {
    favorite: formData.get("favorite") === "true",
  });
}

export default function Contact() {
  const { contact } = useLoaderData();

  // contato de exemplo
  // const contact = {
  //   first: "Samuel",
  //   last: "Carvalho",
  //   avatar: "https://github.com/SamuraiSamuka.png",
  //   linkedin: "sam__dev_",
  //   notes: "Desenvolvedor full-stack em desenvolvimento",
  //   favorite: true,
  // };

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

        {/* link para o linkedin*/}
        {contact.linkedin && (
          <p>
            <a
              target="_blank"
              href={`${contact.linkedin}`}
            >
              {(contact.linkedin).substring(27)}
            </a>
          </p>
        )}

        {/* Notas, um status do contato */}
        {contact.notes && <p>{contact.notes}</p>}

        {/* Botões editar e deletar */}
        <div>
          <Form action="edit">
            <button type="submit">Editar</button>
          </Form>
          <Form
            method="post"
            action="destroy"
            onSubmit={(event) => {
              if (
                !confirm(
                  "Por favor confirme que você deseja deletar este contato."
                )
              ) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit">Deletar</button>
          </Form>
        </div>
      </div>
    </div>
  );
}

// Adiciona a funcionalidade de favoritar aos contatos
function Favorite({ contact }) {
  // yes, this is a `let` for later
  const fetcher = useFetcher();
  let favorite = contact.favorite;
  if(fetcher.formData){
    favorite = fetcher.formData.get("favorite") === "true"
  }

  return (
    <fetcher.Form method="post">
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
    </fetcher.Form>
  );
}