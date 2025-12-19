import React from 'react';

const ContactUs = () => {
  const [formData, setFormData] = React.useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    file: null
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitStatus, setSubmitStatus] = React.useState({ type: '', message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      file: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });

    try {
      const response = await fetch('https://sandybrown-squirrel-472536.hostingersite.com/api/contact.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message
        })
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Server returned non-JSON response:', text);
        throw new Error('Server error - please check server logs');
      }

      const data = await response.json();

      if (data.success) {
        setSubmitStatus({
          type: 'success',
          message: 'Thank you for contacting us! We will get back to you within 1 business day.'
        });
        // Reset form
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          file: null
        });
      } else {
        setSubmitStatus({
          type: 'error',
          message: data.message || 'Failed to send message. Please try again.'
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'An error occurred. Please try again later.'
      });
      console.error('Contact form error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return React.createElement(
    'div',
    { className: 'min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8' },
    React.createElement(
      'div',
      { className: 'max-w-5xl mx-auto' },
      
      // Header Section
      React.createElement(
        'div',
        { className: 'text-center mb-12' },
        React.createElement(
          'h1',
          { className: 'text-4xl font-bold text-gray-900 mb-4' },
          'Contact FLEET X PARTS'
        ),
        React.createElement(
          'p',
          { className: 'text-lg text-gray-600 max-w-3xl mx-auto' },
          'Need help with a part, fitment, pricing, or an order? Send us a message and our team will get back to you as soon as possible. For the fastest support, please include your VIN (last 8 digits is okay) and the part number if you have it.'
        )
      ),
      
      // Contact Info and Form Container
      React.createElement(
        'div',
        { className: 'grid grid-cols-1 lg:grid-cols-3 gap-8' },
        
        // Contact Information Sidebar
        React.createElement(
          'div',
          { className: 'lg:col-span-1' },
          React.createElement(
            'div',
            { className: 'bg-white rounded-lg shadow-md p-6 sticky top-4' },
            React.createElement(
              'h2',
              { className: 'text-2xl font-semibold text-gray-900 mb-6' },
              'Contact Information'
            ),
            
            // Email
            React.createElement(
              'div',
              { className: 'mb-6' },
              React.createElement(
                'div',
                { className: 'flex items-center mb-2' },
                React.createElement(
                  'svg',
                  { className: 'w-5 h-5 text-blue-600 mr-3', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
                  React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' })
                ),
                React.createElement(
                  'h3',
                  { className: 'font-semibold text-gray-900' },
                  'Email'
                )
              ),
              React.createElement(
                'a',
                { href: 'mailto:support@fleetxusa.com', className: 'text-blue-600 hover:text-blue-800 ml-8' },
                'support@fleetxusa.com'
              )
            ),
            
            // Business Hours
            React.createElement(
              'div',
              { className: 'mb-6' },
              React.createElement(
                'div',
                { className: 'flex items-center mb-2' },
                React.createElement(
                  'svg',
                  { className: 'w-5 h-5 text-blue-600 mr-3', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
                  React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' })
                ),
                React.createElement(
                  'h3',
                  { className: 'font-semibold text-gray-900' },
                  'Business Hours'
                )
              ),
              React.createElement(
                'p',
                { className: 'text-gray-600 ml-8' },
                'Mon–Fri 9:00 AM–6:00 PM ET'
              )
            ),
            
            // Physical Address
            React.createElement(
              'div',
              { className: 'mb-6' },
              React.createElement(
                'div',
                { className: 'flex items-center mb-2' },
                React.createElement(
                  'svg',
                  { className: 'w-5 h-5 text-blue-600 mr-3', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
                  React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' }),
                  React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M15 11a3 3 0 11-6 0 3 3 0 016 0z' })
                ),
                React.createElement(
                  'h3',
                  { className: 'font-semibold text-gray-900' },
                  'Address'
                )
              ),
              React.createElement(
                'div',
                { className: 'text-gray-600 ml-8' },
                React.createElement('p', null, '415 E 31 Street'),
                React.createElement('p', null, 'Anderson, IN 46016')
              )
            ),
            
            // Phone
            React.createElement(
              'div',
              null,
              React.createElement(
                'div',
                { className: 'flex items-center mb-2' },
                React.createElement(
                  'svg',
                  { className: 'w-5 h-5 text-blue-600 mr-3', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
                  React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' })
                ),
                React.createElement(
                  'h3',
                  { className: 'font-semibold text-gray-900' },
                  'Phone'
                )
              ),
              React.createElement(
                'a',
                { href: 'tel:917-293-3704', className: 'text-blue-600 hover:text-blue-800 ml-8' },
                '917-293-3704'
              )
            )
          )
        ),
        
        // Contact Form
        React.createElement(
          'div',
          { className: 'lg:col-span-2' },
          React.createElement(
            'div',
            { className: 'bg-white rounded-lg shadow-md p-8' },
            React.createElement(
              'h2',
              { className: 'text-2xl font-semibold text-gray-900 mb-6' },
              'Send Us a Message'
            ),
            
            React.createElement(
              'form',
              { onSubmit: handleSubmit, className: 'space-y-6' },
              
              // Full Name
              React.createElement(
                'div',
                null,
                React.createElement(
                  'label',
                  { htmlFor: 'fullName', className: 'block text-sm font-medium text-gray-700 mb-2' },
                  'Full Name ',
                  React.createElement('span', { className: 'text-red-500' }, '*')
                ),
                React.createElement('input', {
                  type: 'text',
                  id: 'fullName',
                  name: 'fullName',
                  required: true,
                  value: formData.fullName,
                  onChange: handleChange,
                  className: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors',
                  placeholder: 'John Doe'
                })
              ),
              
              // Email and Phone Row
              React.createElement(
                'div',
                { className: 'grid grid-cols-1 md:grid-cols-2 gap-6' },
                
                // Email
                React.createElement(
                  'div',
                  null,
                  React.createElement(
                    'label',
                    { htmlFor: 'email', className: 'block text-sm font-medium text-gray-700 mb-2' },
                    'Email ',
                    React.createElement('span', { className: 'text-red-500' }, '*')
                  ),
                  React.createElement('input', {
                    type: 'email',
                    id: 'email',
                    name: 'email',
                    required: true,
                    value: formData.email,
                    onChange: handleChange,
                    className: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors',
                    placeholder: 'john@example.com'
                  })
                ),
                
                // Phone
                React.createElement(
                  'div',
                  null,
                  React.createElement(
                    'label',
                    { htmlFor: 'phone', className: 'block text-sm font-medium text-gray-700 mb-2' },
                    'Phone Number ',
                    React.createElement('span', { className: 'text-red-500' }, '*')
                  ),
                  React.createElement('input', {
                    type: 'tel',
                    id: 'phone',
                    name: 'phone',
                    required: true,
                    value: formData.phone,
                    onChange: handleChange,
                    className: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors',
                    placeholder: '(123) 456-7890'
                  })
                )
              ),
              
              // Subject
              React.createElement(
                'div',
                null,
                React.createElement(
                  'label',
                  { htmlFor: 'subject', className: 'block text-sm font-medium text-gray-700 mb-2' },
                  'Subject ',
                  React.createElement('span', { className: 'text-red-500' }, '*')
                ),
                React.createElement('input', {
                  type: 'text',
                  id: 'subject',
                  name: 'subject',
                  required: true,
                  value: formData.subject,
                  onChange: handleChange,
                  className: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors',
                  placeholder: 'How can we help you?'
                })
              ),
              
              // Message
              React.createElement(
                'div',
                null,
                React.createElement(
                  'label',
                  { htmlFor: 'message', className: 'block text-sm font-medium text-gray-700 mb-2' },
                  'Message ',
                  React.createElement('span', { className: 'text-red-500' }, '*')
                ),
                React.createElement('textarea', {
                  id: 'message',
                  name: 'message',
                  required: true,
                  value: formData.message,
                  onChange: handleChange,
                  rows: 6,
                  className: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none',
                  placeholder: 'Please include your VIN (last 8 digits is okay) and the part number if you have it...'
                })
              ),
              
              // File Upload
              React.createElement(
                'div',
                null,
                React.createElement(
                  'label',
                  { htmlFor: 'file', className: 'block text-sm font-medium text-gray-700 mb-2' },
                  'Upload (Optional)',
                  React.createElement('span', { className: 'text-gray-500 text-xs ml-2' }, '- photos of the part/label/damage/invoice')
                ),
                React.createElement('input', {
                  type: 'file',
                  id: 'file',
                  name: 'file',
                  onChange: handleFileChange,
                  accept: 'image/*,.pdf',
                  className: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100'
                })
              ),
              
              // Important Note
              React.createElement(
                'div',
                { className: 'bg-yellow-50 border border-yellow-200 rounded-lg p-4' },
                React.createElement(
                  'p',
                  { className: 'text-sm text-yellow-800' },
                  React.createElement('span', { className: 'font-semibold' }, 'Note: '),
                  'Please do not include sensitive payment information (full card numbers) in your message.'
                )
              ),
              
              // Success/Error Message
              submitStatus.message && React.createElement(
                'div',
                {
                  className: submitStatus.type === 'success'
                    ? 'bg-green-50 border border-green-200 rounded-lg p-4'
                    : 'bg-red-50 border border-red-200 rounded-lg p-4'
                },
                React.createElement(
                  'p',
                  {
                    className: submitStatus.type === 'success'
                      ? 'text-sm text-green-800'
                      : 'text-sm text-red-800'
                  },
                  submitStatus.message
                )
              ),
              
              // Submit Button
              React.createElement(
                'button',
                {
                  type: 'submit',
                  disabled: isSubmitting,
                  className: 'w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed'
                },
                isSubmitting ? 'Sending...' : 'Send Message'
              ),
              
              // Response Time
              React.createElement(
                'p',
                { className: 'text-sm text-gray-600 text-center' },
                'Response time: We typically respond within 1 business day.'
              )
            )
          )
        )
      )
    )
  );
};

export default ContactUs;
