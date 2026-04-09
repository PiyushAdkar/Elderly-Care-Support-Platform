const Contact = require("../models/Contact");
const { sendSuccess, sendError } = require("../utils/apiResponse");

// ─── Get all contacts ─────────────────────────────────────────────────────────
const getContacts = async (req, res, next) => {
  try {
    const { type, isPrimary } = req.query;
    const filter = { userId: req.user._id };

    if (type) filter.type = type;
    if (isPrimary !== undefined) filter.isPrimary = isPrimary === "true";

    const contacts = await Contact.find(filter).sort({ isPrimary: -1, name: 1 });
    return sendSuccess(res, 200, "Contacts fetched.", contacts);
  } catch (err) {
    next(err);
  }
};

// ─── Get single contact ───────────────────────────────────────────────────────
const getContact = async (req, res, next) => {
  try {
    const contact = await Contact.findOne({ _id: req.params.id, userId: req.user._id });
    if (!contact) return sendError(res, 404, "Contact not found.");
    return sendSuccess(res, 200, "Contact fetched.", contact);
  } catch (err) {
    next(err);
  }
};

// ─── Add contact ──────────────────────────────────────────────────────────────
const addContact = async (req, res, next) => {
  try {
    const contact = await Contact.create({ ...req.body, userId: req.user._id });
    return sendSuccess(res, 201, "Contact added.", contact);
  } catch (err) {
    next(err);
  }
};

// ─── Update contact ───────────────────────────────────────────────────────────
const updateContact = async (req, res, next) => {
  try {
    const contact = await Contact.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!contact) return sendError(res, 404, "Contact not found.");
    return sendSuccess(res, 200, "Contact updated.", contact);
  } catch (err) {
    next(err);
  }
};

// ─── Delete contact ───────────────────────────────────────────────────────────
const deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!contact) return sendError(res, 404, "Contact not found.");
    return sendSuccess(res, 200, "Contact deleted.");
  } catch (err) {
    next(err);
  }
};

module.exports = { getContacts, getContact, addContact, updateContact, deleteContact };
