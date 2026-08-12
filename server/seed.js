/**
 * Seed script — populates MongoDB with the existing mock data
 * Run: node server/seed.js
 */
require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const connectDB = require('./config/db');

const Concern = require('./models/Concern');
const Proposal = require('./models/Proposal');
const Project = require('./models/Project');
const Research = require('./models/Research');
const Collaboration = require('./models/Collaboration');
const University = require('./models/University');

const concerns = [
  {
    title: 'Broken streetlight on Mirpur 10',
    description: 'The main streetlight at the intersection of Mirpur 10 circle has been broken for over a month. This poses a safety hazard at night especially for pedestrians and cyclists.',
    category: 'Streetlights',
    status: 'under_review',
    votes: 142,
    location: 'Mirpur 10, Dhaka',
    authorName: 'Rahim Uddin',
    photos: [],
    updates: [
      { date: '2026-06-05', note: 'Assigned to City Corporation Ward 12 desk.', status: 'under_review' },
      { date: '2026-06-01', note: 'Concern reported by verified citizen.', status: 'submitted' },
    ],
  },
  {
    title: 'Large pothole near Dhanmondi Lake',
    description: 'There is a massive pothole on Rd-27, near Dhanmondi Lake entrance. Several motorcycles have already been damaged. The pothole is about 1 meter wide and very deep.',
    category: 'Roads & Potholes',
    status: 'resolved',
    votes: 289,
    location: 'Dhanmondi Road 27, Dhaka',
    authorName: 'Salma Begum',
    photos: [],
    updates: [
      { date: '2026-05-28', note: 'Pothole was patched by the road maintenance team.', status: 'resolved' },
      { date: '2026-05-18', note: 'Assigned to DNCC maintenance unit.', status: 'under_review' },
      { date: '2026-05-15', note: 'Concern reported by verified citizen.', status: 'submitted' },
    ],
  },
  {
    title: 'Garbage overflow at Banani market',
    description: 'The waste bins near Banani market are overflowing and garbage has spilled onto the sidewalk. This is creating unsanitary conditions and a terrible smell.',
    category: 'Waste & Sanitation',
    status: 'submitted',
    votes: 87,
    location: 'Banani Market, Dhaka',
    authorName: 'Kamal Hossain',
    photos: [],
    updates: [
      { date: '2026-06-10', note: 'Concern reported by verified citizen.', status: 'submitted' },
    ],
  },
  {
    title: 'Water logging in Gulshan 2 after rain',
    description: 'Every time it rains, Gulshan Avenue near Gulshan 2 circle gets severely waterlogged. The drainage system appears completely blocked. Cars and rickshaws get stuck.',
    category: 'Water & Drainage',
    status: 'under_review',
    votes: 203,
    location: 'Gulshan 2 Circle, Dhaka',
    authorName: 'Nasreen Akter',
    photos: [],
    updates: [
      { date: '2026-05-25', note: 'WASA engineers scheduled for site inspection.', status: 'under_review' },
      { date: '2026-05-20', note: 'Concern reported by verified citizen.', status: 'submitted' },
    ],
  },
  {
    title: 'Illegal parking blocking emergency exit',
    description: 'Vehicles are being illegally parked in front of the emergency exit of Dhaka Medical College Hospital. Ambulances cannot pass during peak hours.',
    category: 'Public Safety',
    status: 'resolved',
    votes: 175,
    location: 'Dhaka Medical College, Dhaka',
    authorName: 'Dr. Farhan Ali',
    photos: [],
    updates: [
      { date: '2026-05-17', note: 'Police deployed. No-parking signs installed.', status: 'resolved' },
      { date: '2026-05-12', note: 'Escalated to traffic police authority.', status: 'under_review' },
      { date: '2026-05-10', note: 'Concern reported by verified citizen.', status: 'submitted' },
    ],
  },
  {
    title: 'Diseased trees in Ramna Park need attention',
    description: 'Several large trees in Ramna Park appear to have disease affecting their branches. Dead branches have been falling. Risk of injury to park visitors.',
    category: 'Parks & Spaces',
    status: 'submitted',
    votes: 64,
    location: 'Ramna Park, Dhaka',
    authorName: 'Tahmina Islam',
    photos: [],
    updates: [
      { date: '2026-06-08', note: 'Concern reported by verified citizen.', status: 'submitted' },
    ],
  },
];

const proposals = [
  { title: 'Install solar street lights on Mirpur roads', authorName: 'Rahim', votes: 312, comments: 24, desc: 'Proposal to install 50 solar-powered LED streetlights along Mirpur Road 1-10 to reduce electricity costs and improve safety.', tags: ['Infrastructure', 'Energy', 'Safety'] },
  { title: 'Create dedicated cycling lanes in Dhanmondi', authorName: 'Salma', votes: 278, comments: 31, desc: 'Requesting dedicated cycling lanes along Dhanmondi Lake road to encourage eco-friendly transportation and reduce traffic.', tags: ['Transport', 'Environment'] },
  { title: 'Launch weekly waste collection schedule', authorName: 'Kamal', votes: 195, comments: 18, desc: 'A consistent, transparent waste collection schedule for each ward to reduce garbage overflow issues across the city.', tags: ['Sanitation', 'Planning'] },
  { title: 'Improve drainage before monsoon season', authorName: 'Nasreen', votes: 156, comments: 42, desc: 'Urgent proposal to clean and upgrade drainage canals across Dhaka before the June monsoon season begins.', tags: ['Drainage', 'Emergency'] },
];

const projects = [
  { name: 'Mirpur Road Resurfacing Phase II', owner: 'DNCC Road Division', status: 'In Progress', statusClass: 'badge-success', progress: 72, deadline: '2026-09-30', allocated: '৳2.4Cr', spent: '৳1.7Cr', category: 'In Progress' },
  { name: 'Gulshan Drainage Canal Upgrade', owner: 'WASA Dhaka', status: 'Planning', statusClass: 'badge-info', progress: 18, deadline: '2026-12-31', allocated: '৳5.1Cr', spent: '৳0.9Cr', category: 'Planning' },
  { name: 'Dhanmondi Lake Revitalization', owner: 'DNCC Parks', status: 'Completed', statusClass: 'badge-neutral', progress: 100, deadline: '2026-04-15', allocated: '৳1.2Cr', spent: '৳1.18Cr', category: 'Completed' },
  { name: 'Ramna Park Solar Lighting', owner: 'DNCC Energy', status: 'In Progress', statusClass: 'badge-success', progress: 55, deadline: '2026-08-15', allocated: '৳0.8Cr', spent: '৳0.44Cr', category: 'In Progress' },
  { name: 'Old Dhaka Drainage Network', owner: 'DSCC Engineering', status: 'Planning', statusClass: 'badge-info', progress: 8, deadline: '2027-03-01', allocated: '৳8.7Cr', spent: '৳0.7Cr', category: 'Planning' },
  { name: 'Mohakhali Flyover Repair', owner: 'RHD Dhaka', status: 'Completed', statusClass: 'badge-neutral', progress: 100, deadline: '2026-03-01', allocated: '৳3.5Cr', spent: '৳3.48Cr', category: 'Completed' },
];

const researchProblems = [
  { title: 'AI-Powered Flood Prediction for Dhaka Urban Areas', ministry: 'Ministry of Water Resources', grant: '৳12L', applicants: 7, desc: 'Develop a machine learning model using satellite imagery and sensor data to predict urban flood events in Dhaka 48 hours in advance.', tags: ['AI/ML', 'Climate', 'Urban'] },
  { title: 'Air Quality Monitoring Network Design', ministry: 'Ministry of Environment', grant: '৳8.5L', applicants: 4, desc: 'Design and deploy a low-cost IoT-based air quality monitoring network for 20 strategic locations across Dhaka.', tags: ['IoT', 'Environment', 'Health'] },
  { title: 'Solid Waste Management Optimization in Dhaka', ministry: 'DNCC', grant: '৳15L', applicants: 11, desc: 'Develop a route optimization algorithm and real-time tracking system for garbage collection vehicles in Dhaka city corporation areas.', tags: ['Logistics', 'Smart City'] },
  { title: 'Pothole Detection via Computer Vision', ministry: 'Ministry of Road Transport', grant: '৳6L', applicants: 9, desc: 'Build a real-time pothole detection system using smartphone cameras and computer vision for automatic reporting and prioritization.', tags: ['Computer Vision', 'Infrastructure'] },
];

const threads = [
  { title: 'Mirpur Road Repair Coordination', messages: 34, participants: 12, desc: 'Joint thread between DNCC engineers, local residents, and traffic police to coordinate the Mirpur 1-10 road repair schedule.', active: true },
  { title: 'Gulshan Drainage System Overhaul', messages: 28, participants: 9, desc: 'Collaborative workspace for WASA engineers and environmental experts to plan the Gulshan drainage upgrade.', active: true },
  { title: 'Ramna Park Beautification Project', messages: 19, participants: 15, desc: 'Community-driven thread for planning Ramna Park revitalization with DNCC Parks division and landscape architects.', active: true },
];

const universities = [
  { name: 'BUET — Bangladesh University of Engineering & Technology', location: 'Dhaka', impact: 4850, solved: 28, research: 14 },
  { name: 'University of Dhaka', location: 'Dhaka', impact: 4120, solved: 22, research: 11 },
  { name: 'BRAC University', location: 'Dhaka', impact: 3680, solved: 19, research: 9 },
  { name: 'Jahangirnagar University', location: 'Savar, Dhaka', impact: 2940, solved: 15, research: 7 },
  { name: 'North South University', location: 'Dhaka', impact: 2510, solved: 13, research: 6 },
  { name: 'Khulna University of Engineering & Technology', location: 'Khulna', impact: 1980, solved: 11, research: 5 },
];

async function seed() {
  await connectDB();
  console.log('🌱 Seeding database...');

  // Clear existing data
  await Promise.all([
    Concern.deleteMany({}),
    Proposal.deleteMany({}),
    Project.deleteMany({}),
    Research.deleteMany({}),
    Collaboration.deleteMany({}),
    University.deleteMany({}),
  ]);

  // Insert data
  await Concern.insertMany(concerns);
  console.log(`   ✅ ${concerns.length} concerns`);

  await Proposal.insertMany(proposals);
  console.log(`   ✅ ${proposals.length} proposals`);

  await Project.insertMany(projects);
  console.log(`   ✅ ${projects.length} projects`);

  await Research.insertMany(researchProblems);
  console.log(`   ✅ ${researchProblems.length} research problems`);

  await Collaboration.insertMany(threads);
  console.log(`   ✅ ${threads.length} collaboration threads`);

  await University.insertMany(universities);
  console.log(`   ✅ ${universities.length} universities`);

  console.log('\n🎉 Seed complete!');
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seed error:', err);
  process.exit(1);
});
