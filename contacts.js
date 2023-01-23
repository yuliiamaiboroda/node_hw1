const fsp = require("fs/promises");
const path = require("path");
const { nanoid } = require("nanoid");

const contactsPath = path.join(__dirname, "./db/contacts.json");

const updateContactList = async (contacts) =>
  await fsp.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

async function getListContacts() {
  const contacts = await fsp.readFile(contactsPath);
  const result = JSON.parse(contacts);
  return result;
}

async function getContactById(contactId) {
  const contacts = await getListContacts();

  const contact = contacts.find((cont) => cont.id === contactId);
  if (!contact) {
    throw new Error("The contact is not found");
  }
  return contact;
}

async function removeContact(contactId) {
  const contacts = await getListContacts();

  const index = contacts.findIndex((contact) => contact.id === contactId);
  if (index === -1) {
    throw new Error("The contact is not found");
  }

  contacts.splice(index, 1);

  await updateContactList(contacts);

  return contacts[index];
}

async function addContact(name, email, phone) {
  const contacts = await getListContacts();

  const newContact = {
    id: nanoid(),
    name,
    email,
    phone,
  };

  contacts.push(newContact);
  await updateContactList(contacts);
}

module.exports = {
  getListContacts,
  getContactById,
  removeContact,
  addContact,
};
