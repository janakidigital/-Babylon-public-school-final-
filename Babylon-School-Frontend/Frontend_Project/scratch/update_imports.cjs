const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');

const componentMappings = {
  // common
  'Header': 'common',
  'Footer': 'common',
  'SchoolLogo': 'common',
  'PageBanner': 'common',
  'EmptyState': 'common',
  // home
  'HeroSection': 'home',
  'StatisticsSection': 'home',
  'ProgramsSection': 'home',
  'WhyChooseUsSection': 'home',
  'StudentLifeSection': 'home',
  'HighlightsSection': 'home',
  'TestimonialsSection': 'home',
  'NoticesSection': 'home',
  'ContactSection': 'home',
  'AboutSection': 'home',
  // shared
  'ArticleLayout': 'shared',
  'ContentCards': 'shared',
  'TeacherGrid': 'shared'
};

const pageMappings = {
  'AboutPage': 'About',
  'AboutPossibilities': 'About',
  'AboutStats': 'About',
  'AboutFaculty': 'About',
  'AboutFaq': 'About',
  'AboutStory': 'About',
  
  'AcademicsPage': 'Academics',
  'CoursesPage': 'Academics',
  'CourseDetailsPage': 'Academics',
  
  'StudentLifePage': 'StudentLife',
  
  'EventsPage': 'Events',
  'EventDetailsPage': 'Events',
  
  'NoticesPage': 'Notices',
  
  'BlogPage': 'Blog',
  'BlogGridOnePage': 'Blog',
  'BlogGridTwoPage': 'Blog',
  'BlogDetailsPage': 'Blog',
  
  'TeamPage': 'Team',
  'TeacherProfilePage': 'Team',
  'BecomeTeacherPage': 'Team',
  
  'AdmissionsPage': 'Admissions',
  'FacilitiesPage': 'Facilities',
  'GalleryPage': 'Gallery',
  'AchievementsPage': 'Achievements',
  'FaqPage': 'FAQ',
  'ContactPage': 'Contact',
  
  'LoginPage': 'Auth',
  'SignupPage': 'Auth',
  'ForgotPasswordPage': 'Auth',
  
  'DashboardPage': 'Dashboard'
};

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? 
      walk(dirPath, callback) : callback(dirPath);
  });
}

walk(srcDir, (filePath) => {
  if (!filePath.endsWith('.js') && !filePath.endsWith('.jsx')) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  
  // 1. Fix component imports: replace ".../components/X" with ".../components/folder/X"
  for (const [comp, folder] of Object.entries(componentMappings)) {
    // Regex to match imports from anywhere ending in components/CompName
    const regex = new RegExp(`(['"])(.*?)/components(?:/template|/about)?/${comp}(['"])`, 'g');
    content = content.replace(regex, `$1$2/components/${folder}/${comp}$3`);
    
    // Also match components that were in the root of components imported like './Header' if they are now in common but being imported from pages
    // Actually, pages are now one level deeper (e.g. pages/About/AboutPage.jsx), so their imports need to go up one level.
    // If a page used to have '../components/Header', we changed it to '../components/common/Header' above, but it needs to be '../../components/common/Header'.
  }
  
  // For files inside pages/ folder (which are now one level deeper, e.g. pages/About/AboutPage.jsx)
  // We need to fix ALL relative imports (../ or ./) by prepending an extra '../' if they point to outside the new subfolder.
  // Wait, if it's in pages/About/AboutPage.jsx and it imported '../components/common/Header', it now needs to be '../../components/common/Header'.
  if (filePath.includes(path.join('src', 'pages', path.sep)) && filePath.split(path.sep).length > 4) {
    // It's inside a subfolder of pages.
    // Replace '../components' with '../../components'
    content = content.replace(/(['"])\.\.\/components\//g, `$1../../components/`);
    // Replace '../lib' with '../../services'
    content = content.replace(/(['"])\.\.\/lib\//g, `$1../../services/`);
    // Replace '../assets' with '../../assets'
    content = content.replace(/(['"])\.\.\/assets\//g, `$1../../assets/`);
    // Replace '../data' with '../../data'
    content = content.replace(/(['"])\.\.\/data\//g, `$1../../data/`);
  }
  
  // 2. Fix api.js imports (lib/api -> services/api)
  content = content.replace(/(['"])(.*?)\/lib\/api(['"])/g, `$1$2/services/api$3`);
  
  // 3. Fix components importing other components that moved
  // e.g. Header.jsx in common/ importing SchoolLogo from './SchoolLogo' -> still valid.
  // but if it imported HeroSection from './HeroSection', it needs to be '../home/HeroSection'.
  for (const [comp, folder] of Object.entries(componentMappings)) {
      // In a component file, if it imports another component from './Comp'
      const regex = new RegExp(`(['"])\\.\\/${comp}(['"])`, 'g');
      if (content.match(regex)) {
         // Determine current file's folder
         const currentFolder = path.basename(path.dirname(filePath));
         if (['common', 'home', 'shared'].includes(currentFolder)) {
             if (currentFolder !== folder) {
                 content = content.replace(regex, `$1../${folder}/${comp}$2`);
             }
         }
      }
  }

  // 4. Fix pages importing pages or components importing pages (rare but possible)
  // 5. Update index imports if any (like from '../pages/AboutPage')
  for (const [page, folder] of Object.entries(pageMappings)) {
      const regex = new RegExp(`(['"])(.*?)/pages/${page}(['"])`, 'g');
      content = content.replace(regex, `$1$2/pages/${folder}/${page}$3`);
  }
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated ' + filePath);
  }
});
console.log('Finished updating imports.');
