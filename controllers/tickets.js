const AxiosProvider = require('../config/axios');
const Currency = require('../utils/currency');
const { ucwords } = require('../utils/strings');

const TicketModel = (ticket) => {
  return {
    id: ticket.id,
    title: ticket.title,
    category: ucwords(ticket.category),
    normal_day: Currency.IDR(ticket.normal_day),
    weekend_day: Currency.IDR(ticket.weekend_day),
    created_at: ticket.created_at,
    updated_at: ticket.updated_at,
  };
};

// Function allow only number
function toNumber(value) {
  return parseInt(value.replace(/\D/g, ''));
}

// view tickets
const tickets = async (request, response, next) => {
  const search = undefined;
  let _tickets = await AxiosProvider.get(`tickets`).then((tickets) =>
    tickets.data.map((tkt) => TicketModel(tkt))
  );

  response.render('../views/pages/ticket/index', {
    title: 'Tiket',
    name: 'Daftar Tiket',
    tickets: _tickets,
    keyword: search != undefined ? search : '',
    notification: request.flash('notification'),
  });
};

const editView = async (request, response, next) => {
  const { id } = request.params;

  const _ticket = await AxiosProvider.get(`tickets/${id}`).then(
    (ticket) => ticket.data
  );

  if (_ticket.length == 0) {
    response.redirect('/tickets');
  } else {
    response.render('../views/pages/ticket/edit', {
      title: 'Edit Tiket',
      name: 'Edit Tiket',
      ticket: TicketModel(_ticket),
      notification: request.flash('notification'),
    });
  }
};

const update = async (request, response, next) => {
  const { id } = request.params;
  const { normal_day, weekend_day } = request.body;

  let notif = {
    type: null,
    message: null,
  };

  if (notif.message == null) {
    await AxiosProvider.put(`tickets/${id}`, {
      normal_day: toNumber(normal_day),
      weekend_day: toNumber(weekend_day),
    })
      .then(() => {
        notif.type = 'success';
        notif.message = 'Berhasil memperbarui tiket';
      })
      .catch((error) => {
        console.log(error);
        notif.type = 'danger';
        notif.message = error.errors.message;
      });
  }

  request.flash('notification', {
    type: notif.type,
    message: notif.message,
  });

  response.redirect(`/tickets/edit/${id}`);
};

module.exports = {
  tickets,
  editView,
  update,
};
