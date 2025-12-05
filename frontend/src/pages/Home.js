import React from 'react';

const Home = () => {
  const categories = [
    {
      title: 'Cooling System',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDhhf2s7bFASkvetkwpg5b0bxEHsT_Dy9KmpopFXJqffZrFteIjse1BAcKeEVE5gKERSV1lvvyJBcfk8ewfaEUKfU8XPkeoLSiBzLHkqBZ4YSvnv-Vlj2jLBA8b0hSxV0pxnBcIn9Mp1WMegNuiaeF2WzOrAXq7UhUQLLWyeH9HttKsmkKw5wcoYeAk3AJAka_HazwQezaMWCz0V7q6pLQ3_GRlkimhXauQd7SagNOxMNg7zlXgpkQI-Eetb8uaXlHXqIWjnqswPTIk'
    },
    {
      title: 'Steering System',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBQpQ4MSL238L6KtWxBZvt51_2Tjn8g3hgrBC-w9JUnKm-M5_R2TcojCwHnt45szjw8i8usmj-ZEfu5tQ1vsdxhgbxabcTwHwf6pWyKHEtnlmxNB7RUTYBTxlCH_saYHN0HPsmjoIC5EV_wq5OZvxcd3I103OhGqIWVebsh9vlaZYrYeKeUeETtTIlew6Q8JBabFuU34tnBwt9HxmQlFDQn39M8ghwIeYcGDaKDTrdDjKjKaNo-YeAIRB2i0374QyzwP5Ct1b5w162'
    },
    {
      title: 'Body and Cabin',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB909jqOrfPyCOzNwqOwY_gOus6qfYPRWS0SMuIeh1EGTIifsWulwozmNtxYJnuCf8KvK4ivbemaC_6KTJL194TBZb1Q9oicpKc7Bs19eVmhtAIZFJD_8zCFL9-gAMfKTk0Toq9z4Ah7E8WKwMXSKaX4_U2IlgCGE3oFIQ15pu6pNXCdetfguEYceKILnIDRNmEYHAlVj2MoKOq06Mc3s2Jf8tzRAgyDvLiqKMjhyo_7GXK6AP1AqfkKp_YCGh9GJrobFHs_D3B13uW'
    },
    {
      title: 'Air Spring & Shocks',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYVtzDLGiyu7MgUwJCaIZu1HTNz733ftKGMtL9kphQIIxoTy8cvcvHWT1r5c6cUkx5MWUHCXdqPCc4Wl7p06kKSPHIoaMm_D76B5Bh_8gptNFhbRuSurjI0KE7HTBupadAm4Pcgltmo11yBJjz8sOyDrovZPUgNa95jVa4DrIIz9kBDtZPs7fXiTQsqWw1NIZDHhzqCXLvx5W2G95Hazwu_bjTmT32WwjATIs5mFwetnGFy8vco2q0BH_OqXrI54sG-vJd_zN7li3R'
    },
    {
      title: 'Air Brake & Wheel',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBviyaeWwi0hfOqgPhpV2-TE1PF8BNPXzwbV2f9rz-F-YJqBTJW9TZ_6IbAL5z_HigcQACqdegD38e_TVFfZQRDP1QaGo1yJnzP-ifgEjEMhoaEhpdtzdxb3Obmp69cao-89MmaEUnEY6MFtoel-ZDtL0Vhew3CVGggZCJkxEoMT-QbCFCPgp5H7FcEBZj6cD84resiGoJleN5rlRTf-rMOQokDYSEtGSu1Kq9EWjgOqLDaR4s3nthf2nEBieAgutlPcR2t-Buy1gvZ'
    },
    {
      title: 'Chrome & Stainless',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA1wWzLBUmQPj0Ephcv1dVyv9KYEE2PQFWCXUMNu_047cbXEy8ik8GRdV3_3RSY8Rthc8WZzhvAueLmlzty3UqXtesvQj4zKFxWKqW-FRtaBJD_fA0vMQNa9X83OI6uFVGYJemCp7_0olKz7cG2igVgkGpLrUoXNOVdrpGhPVnxWTuUuRzRlKpGKNkHw_dG9TfV3yoIrMdnppza3fIIOS36PukpP9m7ml8-vRRji3VoB0sb8S7dIAhGF76HjNbR-oo3G-KAH7SfPicY'
    }
  ];

  return React.createElement(
    'div',
    { className: 'w-full' },
    // Search Bar Section
    React.createElement(
      'div',
      { className: 'mt-4 md:mt-6 w-full max-w-4xl mx-auto px-4' },
      React.createElement(
        'div',
        { className: 'flex w-full flex-1 items-stretch rounded-lg h-12 md:h-14 shadow-sm' },
        React.createElement(
          'div',
          { className: 'text-slate-500 flex bg-white items-center justify-center pl-3 md:pl-4 rounded-l-lg border-r-0' },
          React.createElement('span', { className: 'material-symbols-outlined text-xl md:text-2xl' }, 'search')
        ),
        React.createElement('input', {
          className: 'form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 focus:outline-0 focus:ring-2 focus:ring-primary/50 border-none bg-white focus:border-none h-full placeholder:text-slate-500 px-3 md:px-4 rounded-l-none border-l-0 pl-2 text-sm md:text-base font-normal leading-normal',
          placeholder: 'Search parts...',
          type: 'text'
        })
      )
    ),
    // Hero Section
    React.createElement(
      'div',
      {
        className: 'relative w-full h-[300px] sm:h-[400px] md:h-[500px] mt-4 md:mt-8 rounded-lg md:rounded-xl overflow-hidden text-white bg-cover bg-center',
        style: { backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBviyaeWwi0hfOqgPhpV2-TE1PF8BNPXzwbV2f9rz-F-YJqBTJW9TZ_6IbAL5z_HigcQACqdegD38e_TVFfZQRDP1QaGo1yJnzP-ifgEjEMhoaEhpdtzdxb3Obmp69cao-89MmaEUnEY6MFtoel-ZDtL0Vhew3CVGggZCJkxEoMT-QbCFCPgp5H7FcEBZj6cD84resiGoJleN5rlRTf-rMOQokDYSEtGSu1Kq9EWjgOqLDaR4s3nthf2nEBieAgutlPcR2t-Buy1gvZ')" }
      },
      React.createElement('div', { className: 'absolute inset-0 bg-black/60' }),
      React.createElement(
        'div',
        { className: 'relative h-full flex flex-col items-center justify-center text-center px-4 sm:px-6 md:px-8' },
        React.createElement('h1', { className: 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight' }, 'Heavy-Duty Parts for the Long Haul'),
        React.createElement('p', { className: 'mt-3 md:mt-4 max-w-2xl text-sm sm:text-base md:text-lg text-white/90 px-2' }, 'Your one-stop shop for reliable, high-performance truck parts. Keep your fleet running strong with our extensive inventory.'),
        React.createElement(
          'div',
          { className: 'mt-6 md:mt-8 w-full max-w-2xl px-4 sm:px-0' },
          React.createElement(
            'div',
            { className: 'flex justify-center w-full sm:w-auto' },
            React.createElement(
              'button',
              { className: 'flex min-w-[120px] sm:min-w-[140px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 md:h-12 px-5 md:px-6 bg-primary text-white text-sm md:text-base font-bold leading-normal tracking-[0.015em]' },
              React.createElement('span', { className: 'truncate' }, 'Shop All Parts')
            )
          )
        )
      )
    ),

    // Product Categories
    React.createElement(
      'div',
      { className: 'bg-gray-200 rounded-lg md:rounded-xl shadow-lg p-4 md:p-6 mt-4' },
      React.createElement('h2', { className: 'text-slate-900 text-xl md:text-2xl font-bold leading-tight tracking-[-0.015em] px-2 md:px-4 pb-3 pt-3 md:pt-5' }, 'PRODUCT CATEGORIES'),
      React.createElement(
        'div',
        { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 p-2 md:p-4' },
        categories.map((category, index) =>
          React.createElement(
            'div',
            { key: index, className: 'flex flex-col gap-2 md:gap-3 pb-3 group cursor-pointer' },
            React.createElement('div', {
              className: 'w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg overflow-hidden transform group-hover:scale-95 transition-transform duration-300',
              style: { backgroundImage: `url('${category.image}')` }
            }),
            React.createElement('p', { className: 'text-slate-900 text-sm md:text-base font-medium leading-normal pt-1 md:pt-2' }, category.title)
          )
        )
      )
    ),

    // Partner Section
    React.createElement(
      'div',
      { className: 'mt-8 md:mt-12 mb-6 md:mb-8' },
      React.createElement('h2', { className: 'text-slate-900 text-xl md:text-2xl font-bold leading-tight tracking-[-0.015em] px-2 md:px-4 pb-3 pt-3 md:pt-5' }, 'PARTNER'),
      React.createElement(
        'div',
        { className: 'bg-gray-200 rounded-lg md:rounded-xl shadow-lg p-4 md:p-6 mt-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-6' },
        React.createElement(
          'div',
          { className: 'flex items-center gap-4 md:gap-6' },
          React.createElement('img', {
            alt: 'Eagle Truck Parts logo',
            className: 'h-20 md:h-28 w-auto object-contain',
            src: '/Eagle_Transparent.png'
          }),
          React.createElement(
            'div',
            null,
            React.createElement('h3', { className: 'text-lg md:text-xl font-bold text-slate-900' }, 'Eagle Truck Parts')
          )
        ),
        React.createElement(
          'div',
          { className: 'flex flex-col gap-2 md:gap-3 text-left md:text-right text-xs md:text-sm text-slate-600 w-full md:w-auto' },
          React.createElement(
            'div',
            { className: 'flex items-center md:justify-end gap-2 md:gap-3' },
            React.createElement('span', { className: 'material-symbols-outlined text-slate-400 text-lg md:text-xl md:order-2' }, 'location_on'),
            React.createElement('span', { className: 'break-all md:break-normal' }, '415 E 31 Street Anderson, IN 46016')
          ),
          React.createElement(
            'div',
            { className: 'flex items-center md:justify-end gap-2 md:gap-3' },
            React.createElement('span', { className: 'material-symbols-outlined text-slate-400 text-lg md:text-xl md:order-2' }, 'call'),
            React.createElement('span', null, '917-293-3704')
          ),
          React.createElement(
            'div',
            { className: 'flex items-center md:justify-end gap-2 md:gap-3' },
            React.createElement('span', { className: 'material-symbols-outlined text-slate-400 text-lg md:text-xl md:order-2' }, 'mail'),
            React.createElement('span', { className: 'break-all md:break-normal' }, 'punjabtruckrepair@gmail.com')
          )
        )
      )
    )
  );
};

export default Home;
