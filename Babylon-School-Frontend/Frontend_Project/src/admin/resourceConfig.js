export const resources = {
  programs: {
    label: 'Programmes',
    endpoint: '/programs',
    image: true,
    fields: [
      ['title', 'Title'],
      ['slug', 'Slug (optional)'],
      ['shortDescription', 'Short description'],
      ['description', 'Full description', 'textarea'],
      ['duration', 'Duration'],
      ['level', 'Level'],
      ['eligibility', 'Eligibility'],
    ],
  },
  news: {
    label: 'News',
    endpoint: '/news',
    image: true,
    fields: [
      ['title', 'Title'],
      ['slug', 'Slug (optional)'],
      ['shortDescription', 'Short description'],
      ['content', 'Content', 'textarea'],
      ['author', 'Author'],
      ['category', 'Category'],
    ],
  },
  events: {
    label: 'Events',
    endpoint: '/events',
    image: true,
    fields: [
      ['title', 'Title'],
      ['slug', 'Slug (optional)'],
      ['shortDescription', 'Short description'],
      ['description', 'Description', 'textarea'],
      ['eventDate', 'Event date', 'date'],
      ['startTime', 'Start time'],
      ['endTime', 'End time'],
      ['location', 'Location'],
      ['category', 'Category'],
    ],
  },
  notices: {
    label: 'Notices',
    endpoint: '/notices',
    fields: [
      ['title', 'Title'],
      ['slug', 'Slug (optional)'],
      ['shortDescription', 'Short description'],
      ['content', 'Content', 'textarea'],
      ['category', 'Category'],
    ],
  },
  gallery: {
    label: 'Gallery',
    endpoint: '/gallery',
    image: true,
    fields: [
      ['title', 'Title'],
      ['description', 'Description', 'textarea'],
      ['category', 'Category'],
      ['album', 'Album'],
    ],
  },
  faculty: {
    label: 'Faculty',
    endpoint: '/faculty',
    image: true,
    fields: [
      ['name', 'Name'],
      ['designation', 'Designation'],
      ['department', 'Department'],
      ['qualification', 'Qualification'],
      ['bio', 'Biography', 'textarea'],
      ['email', 'Email', 'email'],
      ['phone', 'Phone'],
    ],
  },
  facility: {
    label: 'Facilities',
    endpoint: '/facility',
    image: true,
    fields: [
      ['title', 'Title'],
      ['description', 'Description', 'textarea'],
      ['icon', 'Icon name'],
      ['displayOrder', 'Display order', 'number'],
    ],
  },
  achievements: {
    label: 'Achievements',
    endpoint: '/achievements',
    image: true,
    fields: [
      ['title', 'Title'],
      ['description', 'Description', 'textarea'],
      ['year', 'Year', 'number'],
      ['category', 'Category'],
      ['displayOrder', 'Display order', 'number'],
    ],
  },
  testimonials: {
    label: 'Testimonials',
    endpoint: '/testimonials',
    image: true,
    fields: [
      ['name', 'Name'],
      ['designation', 'Designation'],
      ['message', 'Testimonial', 'textarea'],
    ],
  },
  faqs: {
    label: 'FAQs',
    endpoint: '/faqs',
    fields: [
      ['question', 'Question'],
      ['answer', 'Answer', 'textarea'],
      ['category', 'Category'],
      ['displayOrder', 'Display order', 'number'],
    ],
  },
  careers: {
    label: 'Careers',
    endpoint: '/careers',
    fields: [
      ['title', 'Title'],
      ['description', 'Description', 'textarea'],
      ['location', 'Location'],
      ['type', 'Employment type'],
      ['department', 'Department'],
      ['closingDate', 'Closing date', 'date'],
    ],
  },
}

export const singletons = {
  // home: {
  //   label: 'Home Page',
  //   endpoint: '/home',
  //   schema: {
  //     hero: [
  //       ['title', 'Title'],
  //       ['subtitle', 'Subtitle'],
  //       ['description', 'Description', 'textarea'],
  //       ['buttonText', 'Button Text'],
  //       ['buttonLink', 'Button Link'],
  //     ],
  //     cta: [
  //       ['title', 'Title'],
  //       ['description', 'Description', 'textarea'],
  //       ['buttonText', 'Button Text'],
  //       ['buttonLink', 'Button Link'],
  //     ],
  //   },
  // },
  settings: {
    label: 'Site Settings',
    endpoint: '/settings',
    schema: {
      root: [
        ['schoolName', 'Site Name'],
        ['shortDescription', 'Short Description', 'textarea'],
        ['email', 'Email', 'email'],
        ['phone', 'Phone'],
        ['address', 'Address', 'textarea'],
      ],
      socialLinks: [
        ['facebook', 'Facebook URL'],
        ['instagram', 'Instagram URL'],
        ['youtube', 'YouTube URL'],
        ['twitter', 'Twitter URL'],
        ['linkedin', 'LinkedIn URL'],
      ],
    },
  },
}
