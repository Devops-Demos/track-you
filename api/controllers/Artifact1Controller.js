/**
 * Artifact1Controller
 *
 * @description :: Server-side logic for managing Artifact1s
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
import {
  result
} from 'lodash';

module.exports = {

  getAll: function (req, res) {
    Artifact1.find({}, function (err, data) {
      res.json(data);
    });
  },

  getSummary: function (req, res) {
    if (!req.isAuthenticated()) {
      return res.json({
        status: 'error',
        message: 'User not Authenticated.'
      });
    }

    if (!req.param || !req.param('initiativeId')) {
      res.status(400)
        .json({
          status: 'initiativeId is required'
        });
      return;
    }

    Artifact1.findOne({
        initiativeId: req.param('initiativeId')
      })
      .populate('initiativeId')
      .then(function (data) {
        if (result(data, 'initiativeId') && typeof data.initiativeId === 'object') {
          data.initiativeId.isEditable = data.initiativeId.owner === req.user.id;
        }
        res.json(data);
      });
  }

};
