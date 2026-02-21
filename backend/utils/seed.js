const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Project = require('../models/Project');
const Skill = require('../models/Skill');
const Education = require('../models/Education');
const Blog = require('../models/Blog');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected for seeding...');

    // Clear existing data
    await Promise.all([
      User.deleteMany(),
      Project.deleteMany(),
      Skill.deleteMany(),
      Education.deleteMany(),
      Blog.deleteMany(),
    ]);
    console.log('🗑️  Cleared existing data');

    // ── Admin User ──────────────────────────────────────────────────────────
    await User.create({
      name: process.env.ADMIN_NAME || 'Admin',
      email: process.env.ADMIN_EMAIL || 'admin@portfolio.com',
      password: process.env.ADMIN_PASSWORD || 'Admin@123456',
    });
    console.log('👤 Admin user created');

    // ── Projects ─────────────────────────────────────────────────────────────
    await Project.insertMany([
      {
        title: 'E-Commerce Platform',
        description: 'A full-featured e-commerce web app with cart, payments, and admin panel. Built with MERN stack and Stripe integration.',
        techStack: ['React', 'Node.js', 'MongoDB', 'Express', 'Stripe'],
        liveUrl: 'https://example-ecommerce.vercel.app',
        githubUrl: 'https://github.com/yourusername/ecommerce',
        imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600',
        featured: true,
        order: 1,
      },
      {
        title: 'Task Management App',
        description: 'A Trello-like drag-and-drop task manager with real-time collaboration using WebSockets.',
        techStack: ['React', 'Socket.io', 'Node.js', 'PostgreSQL'],
        liveUrl: 'https://task-app-demo.netlify.app',
        githubUrl: 'https://github.com/yourusername/task-manager',
        imageUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600',
        featured: true,
        order: 2,
      },
      {
        title: 'Portfolio CMS',
        description: 'This very portfolio website! A CMS-driven developer portfolio with an admin panel to manage content dynamically.',
        techStack: ['React', 'Vite', 'Tailwind CSS', 'Node.js', 'MongoDB', 'JWT'],
        liveUrl: 'https://myportfolio.vercel.app',
        githubUrl: 'https://github.com/yourusername/portfolio-cms',
        imageUrl: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600',
        featured: false,
        order: 3,
      },
    ]);
    console.log('📦 Projects seeded');

    // ── Skills ──────────────────────────────────────────────────────────────
    await Skill.insertMany([
      { name: 'React', category: 'Frontend', level: 90, icon: '⚛️', order: 1 },
      { name: 'JavaScript', category: 'Frontend', level: 88, icon: '🟨', order: 2 },
      { name: 'Tailwind CSS', category: 'Frontend', level: 85, icon: '🎨', order: 3 },
      { name: 'TypeScript', category: 'Frontend', level: 75, icon: '🔷', order: 4 },
      { name: 'Node.js', category: 'Backend', level: 85, icon: '🟢', order: 1 },
      { name: 'Express.js', category: 'Backend', level: 82, icon: '🚂', order: 2 },
      { name: 'REST APIs', category: 'Backend', level: 88, icon: '🔌', order: 3 },
      { name: 'MongoDB', category: 'Database', level: 80, icon: '🍃', order: 1 },
      { name: 'PostgreSQL', category: 'Database', level: 70, icon: '🐘', order: 2 },
      { name: 'Docker', category: 'DevOps', level: 65, icon: '🐳', order: 1 },
      { name: 'Git & GitHub', category: 'Tools', level: 90, icon: '🐙', order: 1 },
      { name: 'VS Code', category: 'Tools', level: 95, icon: '💻', order: 2 },
    ]);
    console.log('🛠️  Skills seeded');

    // ── Education ─────────────────────────────────────────────────────────
    await Education.insertMany([
      {
        institution: 'University of Technology',
        degree: "Bachelor's Degree",
        fieldOfStudy: 'Computer Science',
        startYear: 2019,
        endYear: 2023,
        grade: 'GPA: 3.8 / 4.0',
        description: 'Focused on software engineering, algorithms, and data structures. Led the coding club.',
        order: 1,
      },
      {
        institution: 'Coursera / Meta',
        degree: 'Professional Certificate',
        fieldOfStudy: 'Meta Front-End Developer',
        startYear: 2023,
        endYear: 2023,
        grade: 'Completed with Distinction',
        description: 'Comprehensive certification covering React, UX/UI design, and front-end best practices.',
        order: 2,
      },
    ]);
    console.log('🎓 Education seeded');

    // ── Blog Posts ────────────────────────────────────────────────────────
    await Blog.create([
      {
        title: 'Getting Started with MERN Stack Development',
        excerpt: 'A comprehensive guide for beginners to get started with MongoDB, Express, React, and Node.js.',
        content: `# Getting Started with MERN Stack\n\nThe MERN stack is one of the most popular stacks for building full-stack web applications.\n\n## What is MERN?\n\n- **M**ongoDB - NoSQL database\n- **E**xpress.js - Backend framework\n- **R**eact - Frontend library\n- **N**ode.js - JavaScript runtime\n\n## Why MERN?\n\nUsing JavaScript across the full stack means you only need to learn one language. It's fast, flexible, and has a huge community.\n\n## Getting Started\n\nFirst, make sure you have Node.js installed. Then install MongoDB locally or use MongoDB Atlas for a cloud database.\n\nHappy coding! 🚀`,
        tags: ['MERN', 'React', 'Node.js', 'Beginner'],
        coverImage: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=600',
        published: true,
        readTime: 5,
      },
      {
        title: 'Mastering Tailwind CSS: Tips and Tricks',
        excerpt: 'Level up your Tailwind CSS skills with these advanced tips, custom configurations, and real-world patterns.',
        content: `# Mastering Tailwind CSS\n\nTailwind CSS has revolutionized the way we write styles for web applications.\n\n## Utility-First Approach\n\nInstead of writing custom CSS, you compose designs using utility classes directly in your HTML.\n\n## Key Tips\n\n1. Use the \`@apply\` directive sparingly\n2. Leverage JIT mode for smaller bundle sizes\n3. Create reusable components for repeated patterns\n4. Use responsive prefixes for mobile-first design\n\n## Custom Config\n\nExtend Tailwind's theme in \`tailwind.config.js\` to match your brand colors and typography.`,
        tags: ['CSS', 'Tailwind', 'Frontend', 'Design'],
        coverImage: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=600',
        published: true,
        readTime: 7,
      },
    ]);
    console.log('📝 Blog posts seeded');

    console.log('\n🎉 Seeding complete!');
    console.log('─────────────────────────────');
    console.log(`📧 Admin Email:    ${process.env.ADMIN_EMAIL || 'admin@portfolio.com'}`);
    console.log(`🔑 Admin Password: ${process.env.ADMIN_PASSWORD || 'Admin@123456'}`);
    console.log('─────────────────────────────');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedData();