// Resource data for the application
export const resourceData = [
  {
    id: 1,
    type: "PDF",
    title: "Academic Writing Guide for Research Papers",
    category: "Study Skills",
    description: "Guide for academic writing and research papers with templates and citation examples.",
    downloads: 128,
    fileSize: "2.4 MB",
    dateAdded: "2025-04-25T14:30:00",
    author: {
      name: "Prof. Sarah Ahmed",
      avatar: "https://i.pravatar.cc/150?img=32"
    },
    tags: ["writing", "research", "academic", "citation"],
    imageUrl: "https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 2,
    type: "Video",
    title: "Research Methods Workshop (Video)",
    category: "Workshops",
    description: "A hands-on workshop on research methods and best practices for thesis writing.",
    downloads: 73,
    fileSize: "1.2 GB",
    dateAdded: "2025-04-21T09:00:00",
    author: {
      name: "Dr. Ali Hassan",
      avatar: "https://i.pravatar.cc/150?img=11"
    },
    tags: ["video", "research", "workshop"],
    imageUrl: "https://images.unsplash.com/photo-1503676382389-4809596d5290?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 3,
    type: "Web",
    title: "Citation Styles Comparison",
    category: "Reference",
    description: "A web resource comparing APA, MLA, and Chicago citation styles for academic writing.",
    downloads: 201,
    fileSize: "Web Link",
    dateAdded: "2025-04-15T16:45:00",
    author: {
      name: "Noura Khalid",
      avatar: "https://i.pravatar.cc/150?img=29"
    },
    tags: ["citation", "styles", "reference"],
    imageUrl: "https://images.unsplash.com/photo-1464983953574-0892a716854b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 4,
    type: "PDF",
    title: "Linear Algebra Solutions (PDF)",
    category: "Mathematics",
    description: "Complete solutions for the Linear Algebra course final exam.",
    downloads: 89,
    fileSize: "3.1 MB",
    dateAdded: "2025-04-10T11:20:00",
    author: {
      name: "Dr. Youssef Omar",
      avatar: "https://i.pravatar.cc/150?img=16"
    },
    tags: ["math", "algebra", "solutions"],
    imageUrl: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 5,
    type: "Video",
    title: "Exam Revision Techniques (Video)",
    category: "Study Skills",
    description: "Tips and tricks for effective exam revision, presented by top students.",
    downloads: 55,
    fileSize: "800 MB",
    dateAdded: "2025-03-30T10:00:00",
    author: {
      name: "Layla Mansour",
      avatar: "https://i.pravatar.cc/150?img=45"
    },
    tags: ["revision", "exams", "video"],
    imageUrl: "https://images.unsplash.com/photo-1460518451285-97b6aa326961?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
  },
];

export const resourceTypes = ["All", "PDF", "Video", "Web"];
export const categories = ["All", ...Array.from(new Set(resourceData.map(r => r.category)))];
