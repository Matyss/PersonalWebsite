document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const status = document.getElementById('formStatus');
    
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Validate form fields
      if (!form.checkValidity()) {
        status.textContent = 'Please fill out all required fields correctly.';
        status.style.color = 'red';
        return;
      }
  
      // Skip reCAPTCHA validation on localhost
      if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        const recaptchaResponse = grecaptcha.getResponse();
        if (!recaptchaResponse) {
          status.textContent = 'Please complete the reCAPTCHA verification.';
          status.style.color = 'red';
          return;
        }
      }
      
      status.textContent = 'Sending your message...';
      status.style.color = '#000';
      status.style.marginTop = '20px';
      status.style.padding = '10px';
  
      // Use placeholders for EMAILJS variables
      emailjs.sendForm('', '', form)
        .then(function() {
          status.textContent = 'Message sent successfully! I\'ll get back to you soon.';
          status.style.color = 'green';
          status.style.marginTop = '20px';
          status.style.padding = '10px';
          form.reset();
        }, function(error) {
          status.textContent = 'Failed to send message. Please try again or email me directly at mateusz.szymajda@gmail.com';
          status.style.color = 'red';
          status.style.marginTop = '20px';
          status.style.padding = '10px';
          console.error('EmailJS Error:', error);
        });
    });
  });