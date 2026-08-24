const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');

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

  // Fix components deeper: Header.jsx, Footer.jsx, etc. need to go up one more level for context, lib, data, assets, hooks
  if (filePath.includes(path.join('src', 'components', path.sep)) && filePath.split(path.sep).length > 4) {
    // they were moved from components/ to components/folder/
    content = content.replace(/(['"])\.\.\/context\//g, `$1../../context/`);
    content = content.replace(/(['"])\.\.\/lib\//g, `$1../../lib/`);
    content = content.replace(/(['"])\.\.\/data\//g, `$1../../data/`);
    content = content.replace(/(['"])\.\.\/assets\//g, `$1../../assets/`);
    content = content.replace(/(['"])\.\.\/hooks\//g, `$1../../hooks/`);
  }

  // Fix pages deeper for hooks, context, etc.
  if (filePath.includes(path.join('src', 'pages', path.sep)) && filePath.split(path.sep).length > 4) {
    content = content.replace(/(['"])\.\.\/hooks\//g, `$1../../hooks/`);
    content = content.replace(/(['"])\.\.\/context\//g, `$1../../context/`);
  }

  // Restore lib/format and lib/media since only api moved to services
  // Any page that had '../lib' converted to '../../services/' for format/media needs to be '../../lib/'
  content = content.replace(/(['"])\.\.\/\.\.\/services\/(format|media)(['"])/g, `$1../../lib/$2$3`);
  content = content.replace(/(['"])\.\.\/services\/(format|media)(['"])/g, `$1../lib/$2$3`);
  
  // Also any component that had '../lib' converted? No, the first script only did that for pages.
  
  // Fix context/SiteContext.jsx using '../lib/api' -> '../services/api'
  if (filePath.endsWith('SiteContext.jsx') || filePath.endsWith('AdminPage.jsx')) {
    content = content.replace(/(['"])\.\.\/lib\/api(['"])/g, `$1../services/api$2`);
  }

  // Fix AcademicsPage.jsx importing components directly from '../components/' instead of '../../components/folder/'
  // Because my first script only matched `../components/folder/X` if it was already that? No, it matched `../components/X` and maybe missed something?
  // Let's replace any remaining `../components/PageBanner` with `../../components/common/PageBanner` in pages/
  if (filePath.includes(path.join('src', 'pages', path.sep))) {
     // Common components
     ['Header', 'Footer', 'SchoolLogo', 'PageBanner', 'EmptyState'].forEach(comp => {
         content = content.replace(new RegExp(`(['"])\\.\\./components/${comp}(['"])`, 'g'), `$1../../components/common/${comp}$2`);
     });
     // Home components
     ['HeroSection', 'StatisticsSection', 'ProgramsSection', 'WhyChooseUsSection', 'StudentLifeSection', 'HighlightsSection', 'TestimonialsSection', 'NoticesSection', 'ContactSection', 'AboutSection'].forEach(comp => {
         content = content.replace(new RegExp(`(['"])\\.\\./components/${comp}(['"])`, 'g'), `$1../../components/home/${comp}$2`);
     });
     // Shared components
     ['ArticleLayout', 'ContentCards', 'TeacherGrid'].forEach(comp => {
         content = content.replace(new RegExp(`(['"])\\.\\./components/template/${comp}(['"])`, 'g'), `$1../../components/shared/${comp}$2`);
     });
  }

  // Fix AboutStory import in AboutPage.jsx
  if (filePath.endsWith('AboutPage.jsx')) {
    content = content.replace(/(['"])\.\.\/\.\.\/components\/about\/AboutStory(['"])/g, `$1./AboutStory$2`);
    content = content.replace(/(['"])\.\.\/components\/about\/AboutStory(['"])/g, `$1./AboutStory$2`);
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed ' + filePath);
  }
});
console.log('Finished fixing imports.');
