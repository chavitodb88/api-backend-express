
const { response } = require("express");
const Event = require("../models/Event");

const getEvents = async (req, res = response) => {
    const events = await Event.find()
        .populate('user', 'name');
    res.json({
        ok: true,
        events
    });
};

const createEvent = async (req, res = response) => {

    try {
        const eventDB = new Event(req.body);
        eventDB.user = req.uid;

        const event = await eventDB.save();
        res.json({
            ok: true,
            event
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error: Contacta con tu administrador",
        });
    }
};

const updateEvent = async (req, res = response) => {
    try {
        const eventId = req.params.id;
        const uid = req.uid;
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({
                ok: false,
                msg: "Evento no existe",
            });
        }

        if (event.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: "No tienes permisos para editar un evento que no es tuyo",
            });
        }

        const newEvent = {
            ...req.body,
            user: uid
        }

        const eventUpdated = await Event.findByIdAndUpdate(eventId, newEvent, { new: true });

        res.json({
            ok: true,
            event: eventUpdated
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error: Contacta con tu administrador",
        });
    }
};

const deleteEvent = async (req, res = response) => {
    try {
        const eventId = req.params.id;
        const uid = req.uid;
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({
                ok: false,
                msg: "Evento no existe",
            });
        }

        if (event.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: "No tienes permisos para eliminar un evento que no es tuyo",
            });
        }

        await Event.findByIdAndDelete(eventId)

        res.json({ ok: true });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error: Contacta con tu administrador",
        });
    }
};

module.exports = {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent
};
