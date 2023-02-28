import { Form, useLoaderData, redirect, useNavigate } from "react-router-dom";
import { updateContact } from "../contacts";

export async function action({request, params}) {
    const formData = await request.formData(); // Seleciona os dados da requisição relativos ao formulário.
    console.log("1 -> ", formData, formData.get("first"))
    const updates = Object.fromEntries(formData); // Converte os dados da requisição em um objeto
    console.log("2 -> ", updates)
    await updateContact(params.contactId, updates);
    return redirect(`/contacts/${params.contactId}`);
}

export default function EditContact() {
  const contact = useLoaderData();
  const navigate = useNavigate();

  return (
    <Form method="post" id="contact-form">
      <p>
        <span>Nome</span>
        <input
          placeholder="Primeiro nome"
          aria-label="First name"
          type="text"
          name="first"
          defaultValue={contact.first}
        />
        <input
          placeholder="Sobrenome"
          aria-label="Last name"
          type="text"
          name="last"
          defaultValue={contact.last}
        />
      </p>
      <label>
        <span>LinkedIn</span>
        <input
          type="text"
          name="linkedin"
          placeholder="https://www.linkedin.com/in/usuario"
          defaultValue={contact.linkedin}
        />
      </label>
      <label>
        <span>URL da foto</span>
        <input
          placeholder="https://example.com/avatar.jpg"
          aria-label="Avatar URL"
          type="text"
          name="avatar"
          defaultValue={contact.avatar}
        />
      </label>
      <label>
        <span>Notas</span>
        <textarea
          name="notes"
          defaultValue={contact.notes}
          rows={6}
        />
      </label>
      <p>
        <button type="submit">Salvar</button>
        <button 
          type="button"
          onClick={() => {
            navigate(-1);
          }}
        >Cancelar</button>
      </p>
    </Form>
  );
}