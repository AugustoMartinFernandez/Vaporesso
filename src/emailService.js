// emailService.js
import emailjs from 'emailjs-com';

emailjs.init("Wa_58ii1rp4mIx6dk"); // Sustituye "YOUR_USER_ID" por tu ID de usuario de EmailJS

export const sendEmail = async (emailData) => {
  try {
    const response = await emailjs.send(
      'service_pt92l3h', // Sustituye con tu ID de servicio
      'template_j1fqxcx', // Sustituye con tu ID de plantilla
      emailData,
      'Wa_58ii1rp4mIx6dk' // Sustituye con tu ID de usuario
    );
    console.log('Email enviado con éxito:', response);
  } catch (error) {
    console.error('Error al enviar el correo:', error);
  }
};
