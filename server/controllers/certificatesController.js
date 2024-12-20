const Certificate = require('../models/certificate'); // Import model chứng chỉ
const Users = require('../models/userModel');
const Course = require('../models/courseModel');

exports.getAllCertificates = async (req, res) => {
    try {
        const certificates = await Certificate.findAll({
            attributes: ['id', 'user_id', 'course_id', 'certificate_code', 'issue_date', 'status'],
          });
          
  
      res.status(200).json({
        status: 'success',
        results: certificates.length,
        data: {
          certificates,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: 'error',
        message: error.message || 'Some error occurred while retrieving certificates.',
      });
    }
  };


exports.createCertificate = async (req, res) => {
    const { user_id, course_id, certificate_code, issue_date, status } = req.body;

    if (!user_id || !course_id || !certificate_code) {
        return res.status(400).json({ error: 'User ID, Course ID, and Certificate Code are required' });
    }

    try {
        const newCertificate = await Certificate.create({
            user_id,
            course_id,
            certificate_code,
            issue_date,
            status
        });

        res.status(201).json({
            status: 'success',
            data: {
                certificate: newCertificate
            }
        });
    } catch (err) {
        res.status(500).send({
            status: 'error',
            message: err.message || 'Some error occurred while creating the certificate.'
        });
    }
};

exports.updateCertificate = async (req, res) => {
    const { id } = req.params;
    const { user_id, course_id, certificate_code, issue_date, status } = req.body;

    try {
        const certificate = await Certificate.findByPk(id);
        if (!certificate) {
            return res.status(404).json({
                status: 'error',
                message: 'Certificate not found'
            });
        }

        certificate.user_id = user_id || certificate.user_id;
        certificate.course_id = course_id || certificate.course_id;
        certificate.certificate_code = certificate_code || certificate.certificate_code;
        certificate.issue_date = issue_date || certificate.issue_date;
        certificate.status = status || certificate.status;

        await certificate.save();
        res.status(200).json({
            status: 'success',
            data: {
                certificate
            }
        });
    } catch (err) {
        res.status(500).send({
            status: 'error',
            message: err.message || 'Some error occurred while updating the certificate.'
        });
    }
};

exports.deleteCertificate = async (req, res) => {
    const { id } = req.params;
    try {
        const certificate = await Certificate.findByPk(id);
        if (!certificate) {
            return res.status(404).json({
                status: 'error',
                message: 'Certificate not found'
            });
        }
        await certificate.destroy();
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(500).send({
            status: 'error',
            message: err.message || 'Some error occurred while deleting the certificate.'
        });
    }
};
