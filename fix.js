const fs = require('fs');
const path = require('path');

// Helper to replace text in file
function replaceInFile(filepath, regex, replacement) {
  if (fs.existsSync(filepath)) {
    let content = fs.readFileSync(filepath, 'utf8');
    content = content.replace(regex, replacement);
    fs.writeFileSync(filepath, content);
    console.log('Fixed', filepath);
  } else {
    console.log('Not found:', filepath);
  }
}

// 1. API routes params issue
const apiFiles = [
  'app/api/records/[id]/route.ts',
  'app/api/prescriptions/[id]/route.ts',
  'app/api/appointments/[id]/route.ts',
  'app/api/doctors/[id]/route.ts',
  'app/api/patients/[id]/route.ts'
];
apiFiles.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    // Replace { params }: { params: { id: string } } with context: any
    content = content.replace(/\{ params \}: \{ params: \{ id: string \} \}/g, 'context: any');
    // Replace params.id with (await context.params).id
    content = content.replace(/params\.id/g, '(await context.params).id');
    fs.writeFileSync(file, content);
    console.log('Fixed API route:', file);
  }
});

// 2. app/actions/dashboard.ts implicit any
let dashPath = 'app/actions/dashboard.ts';
if (fs.existsSync(dashPath)) {
  let dash = fs.readFileSync(dashPath, 'utf8');
  dash = dash.replace(/\(p =>/g, '(p: any) =>');
  dash = dash.replace(/p =>/g, '(p: any) =>');
  dash = dash.replace(/a =>/g, '(a: any) =>');
  dash = dash.replace(/d =>/g, '(d: any) =>');
  dash = dash.replace(/r =>/g, '(r: any) =>');
  fs.writeFileSync(dashPath, dash);
  console.log('Fixed dashboard.ts implicit any');
}

// 3. app/api/auth/[...nextauth]/route.ts role error
let authPath = 'app/api/auth/[...nextauth]/route.ts';
if (fs.existsSync(authPath)) {
  let auth = fs.readFileSync(authPath, 'utf8');
  auth = auth.replace('token.role = user.role', 'token.role = (user as any).role');
  fs.writeFileSync(authPath, auth);
  console.log('Fixed NextAuth role');
}

// 4. components/home/Hero.tsx asChild error
let heroPath = 'components/home/Hero.tsx';
if (fs.existsSync(heroPath)) {
  let hero = fs.readFileSync(heroPath, 'utf8');
  hero = hero.replace(/\s+asChild/g, ''); // Remove asChild completely
  fs.writeFileSync(heroPath, hero);
  console.log('Fixed Hero asChild');
}

// 5. app/dashboard/patients/page.tsx missing FiEdit2
let patientsPath = 'app/dashboard/patients/page.tsx';
if (fs.existsSync(patientsPath)) {
  let patients = fs.readFileSync(patientsPath, 'utf8');
  if (!patients.includes('FiEdit2')) {
    patients = patients.replace('import { FiUsers, FiSearch, FiMoreVertical, FiCalendar, FiClock, FiPhone, FiMail, FiUser, FiActivity } from "react-icons/fi";', 'import { FiUsers, FiSearch, FiMoreVertical, FiCalendar, FiClock, FiPhone, FiMail, FiUser, FiActivity, FiEdit2 } from "react-icons/fi";');
  }
  fs.writeFileSync(patientsPath, patients);
  console.log('Fixed FiEdit2 import in patients');
}
