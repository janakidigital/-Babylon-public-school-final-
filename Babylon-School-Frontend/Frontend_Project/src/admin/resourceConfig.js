export const resources = {
  programs: {
    label: "Programmes",
    endpoint: "/programs",
    image: true,
    fields: [
      ["title", "Title"],
      ["slug", "Slug (optional)"],
      ["shortDescription", "Short description"],
      ["description", "Full description", "textarea"],
      ["duration", "Duration"],
      ["level", "Level"],
      ["eligibility", "Eligibility"],
    ],
  },

  news: {
    label: "News/Blog",
    endpoint: "/news",
    image: true,
    fields: [
      ["title", "Title"],
      ["slug", "Slug (optional)"],
      ["shortDescription", "Short description"],
      ["content", "Content", "textarea"],
      ["author", "Author"],
      ["category", "Category"],
    ],
  },

  events: {
    label: "Events",
    endpoint: "/events",
    image: true,
    fields: [
      ["title", "Event Name"],
      ["slug", "Slug (optional)"],
      ["shortDescription", "Short description"],
      ["description", "Description", "textarea"],
      ["eventDate", "Event date", "date"],
      ["startTime", "Start time"],
      ["endTime", "End time"],
      ["location", "Location"],
      ["category", "Category"],
    ],
  },

  notices: {
    label: "Notices",
    endpoint: "/notices",
    file: true,
    fileField: "attachment",
    fileAccept: ".pdf,application/pdf,image/*",
    fileLabel: "Attachment (PDF / Image)",
    fields: [
      ["title", "Title"],
      ["slug", "Slug (optional)"],
      ["shortDescription", "Short description"],
      ["content", "Content", "textarea"],
      ["category", "Category"],
      ["publishedAt", "Published date", "date"],
      ["isPublished", "Published", "checkbox"],
      ["isFeatured", "Featured", "checkbox"],
    ],
  },

  gallery: {
  label: "Gallery",
  endpoint: "/gallery",
  image: true,
  multiple: true,
  fields: [
    ["title", "Title"],
    [
      "type",
      "Type",
      "select",
      ["Photos", "Videos"],
    ],
    ["description", "Description", "textarea"],
    ["videoUrls", "Video URLs", "textarea"],
  ],
},

  faculty: {
    label: "Our Team",
    endpoint: "/faculty",
    image: true,
    fields: [
      ["name", "Name"],
      [
        "category",
        "Category",
        "select",
        [
          "BOARD OF DIRECTORS",
          "ADMINISTRATION",
          "COORDINATORS",
          "HOD",
          "FACULTIES",
          "ACCOUNT & FINANCE",
          "ECA / CCA",
          "CAFETERIA",
          "TRANSPORT",
        ],
      ],
      ["designation", "Designation"],
      ["department", "Department"],
      ["qualification", "Qualification", "textarea"],
      ["bio", "Biography", "textarea"],
      ["email", "Email", "email"],
      ["phone", "Phone"],
      ["displayOrder", "Display order", "number"],
    ],
  },

  facility: {
    label: "Facilities",
    endpoint: "/facility",
    image: true,
    fields: [
      ["title", "Title"],
      ["description", "Description", "textarea"],
      ["icon", "Icon name"],
      ["displayOrder", "Display order", "number"],
    ],
  },

  achievements: {
    label: "Achievements",
    endpoint: "/achievements",
    image: true,
    fields: [
      ["title", "Title"],
      ["description", "Description", "textarea"],
      ["year", "Year", "number"],
      ["category", "Category"],
      ["displayOrder", "Display order", "number"],
    ],
  },

  testimonials: {
    label: "Testimonials",
    endpoint: "/testimonials",
    image: true,
    fields: [
      ["name", "Name"],
      ["designation", "Designation"],
      ["message", "Testimonial", "textarea"],
    ],
  },

  faqs: {
    label: "FAQs",
    endpoint: "/faqs",
    fields: [
      ["question", "Question"],
      ["answer", "Answer", "textarea"],
      ["category", "Category"],
      ["displayOrder", "Display order", "number"],
    ],
  },

  careers: {
    label: "Careers",
    endpoint: "/careers",
    fields: [
      ["title", "Title"],
      ["description", "Description", "textarea"],
      ["location", "Location"],
      ["type", "Employment type"],
      ["department", "Department"],
      ["closingDate", "Closing date", "date"],
    ],
  },

  // In resources.downloads (or whatever the key is)
  downloads: {
    label: "Downloads",
    endpoint: "/downloads", // adjust if different
    file: true,
    fileField: "file", // or "attachment" — match what your API expects
    fileLabel: "PDF / Document",
    fileAccept: ".pdf,application/pdf",
    fields: [
      ["title", "Title", "text"],
      [
        "category",
        "Category",
        "select",
        [
          "Babylon_Buds",
          "Parents Portal",
          "Calendar",
          "Syllabus",
          "Administrative",
          "Others",
        ],
      ],
      ["description", "Description", "textarea"],
      // keep any other existing fields (slug, etc.)
    ],
  },

  // ===== NEW: Multiple Posters =====
  posters: {
    label: "Posters",
    endpoint: "/posters",
    image: true,
    fields: [
      ["title", "Title (optional)"],
      ["link", "Link (optional)"],
      ["isActive", "Show on website", "checkbox"],
      ["displayOrder", "Display order", "number"],
    ],
  },
};

export const singletons = {
  settings: {
    label: "Site Settings",
    endpoint: "/settings",
    schema: {
      root: [
        ["schoolName", "Site Name"],
        ["shortDescription", "Short Description", "textarea"],
        ["email", "Email", "email"],
        ["phone", "Phone"],
        ["address", "Address", "textarea"],
      ],
    },
  },
};
