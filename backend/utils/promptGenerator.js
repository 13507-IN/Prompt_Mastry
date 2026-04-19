// Utility to generate world-class prompts from project data

function generatePrompt(projectData) {
  const {
    projectName,
    projectType,
    projectType_custom,
    useAI,
    colorPalette,
    colorPalette_custom,
    navbarPosition,
    navbarPosition_custom,
    pageCount,
    pageCount_custom,
    framework,
    framework_custom,
    uiLibrary,
    uiLibrary_custom,
    dbProvider,
    dbProvider_custom,
    ormChoice,
    ormChoice_custom,
    authRequired,
    authRequired_custom,
    apiType,
    apiType_custom,
    runtime,
    runtime_custom,
    deploymentPlatform,
    deploymentPlatform_custom,
    additionalFeatures,
    additionalFeatures_custom
  } = projectData;

  let prompt = `# 🚀 COMPREHENSIVE PROJECT DEVELOPMENT BRIEF\n\n`;
  prompt += `## PROJECT: ${projectName || 'Untitled Project'}\n\n`;
  prompt += `---\n\n`;

  // PROJECT OVERVIEW
  prompt += `## 📋 PROJECT OVERVIEW\n\n`;
  prompt += `**Project Type:** ${projectType || 'Not specified'}\n`;
  if (projectType_custom) {
    prompt += `**Details:** ${projectType_custom}\n`;
  }
  prompt += `**AI Integration Required:** ${useAI ? '✅ Yes - Include AI features' : '❌ No AI features needed'}\n`;
  prompt += `**Project Name:** ${projectName || 'To be determined'}\n\n`;

  // FRONTEND REQUIREMENTS
  if (projectType === 'web' || projectType === 'hybrid') {
    prompt += `---\n\n`;
    prompt += `## 🎨 FRONTEND REQUIREMENTS\n\n`;
    
    prompt += `### Design & UI\n`;
    prompt += `- **Color Palette:** ${colorPalette || 'Not specified'}\n`;
    if (colorPalette_custom) {
      prompt += `  - Custom Details: ${colorPalette_custom}\n`;
    }
    prompt += `- **Navbar Position:** ${navbarPosition || 'Top'}\n`;
    if (navbarPosition_custom) {
      prompt += `  - Specifications: ${navbarPosition_custom}\n`;
    }
    prompt += `- **Number of Pages:** ${pageCount || 1} pages\n`;
    if (pageCount_custom) {
      prompt += `  - Pages/Sections: ${pageCount_custom}\n`;
    }
    
    prompt += `\n### Technology Stack\n`;
    prompt += `- **Framework:** ${framework || 'Not specified'}\n`;
    if (framework_custom) {
      prompt += `  - Preferences: ${framework_custom}\n`;
    }
    prompt += `- **UI Library:** ${uiLibrary || 'Not specified'}\n`;
    if (uiLibrary_custom) {
      prompt += `  - Specifications: ${uiLibrary_custom}\n`;
    }
    
    prompt += `\n### Design Standards\n`;
    prompt += `- Responsive design (mobile-first approach)\n`;
    prompt += `- Cross-browser compatibility\n`;
    prompt += `- Accessibility (WCAG 2.1 AA standards)\n`;
    prompt += `- Performance optimization (Core Web Vitals)\n`;
    prompt += `- Smooth animations and transitions\n\n`;
  }

  // BACKEND REQUIREMENTS
  if (projectType === 'api' || projectType === 'hybrid' || projectType === 'web') {
    prompt += `---\n\n`;
    prompt += `## ⚙️ BACKEND REQUIREMENTS\n\n`;
    
    prompt += `### Technology Stack\n`;
    prompt += `- **Runtime:** ${runtime || 'Not specified'}\n`;
    if (runtime_custom) {
      prompt += `  - Preferences: ${runtime_custom}\n`;
    }
    prompt += `- **Database:** ${dbProvider || 'Not specified'}\n`;
    if (dbProvider_custom) {
      prompt += `  - Specifications: ${dbProvider_custom}\n`;
    }
    prompt += `- **ORM/Query Builder:** ${ormChoice || 'Not specified'}\n`;
    if (ormChoice_custom) {
      prompt += `  - Requirements: ${ormChoice_custom}\n`;
    }
    
    prompt += `\n### API Specification\n`;
    prompt += `- **API Type:** ${apiType || 'REST API'}\n`;
    if (apiType_custom) {
      prompt += `  - Details: ${apiType_custom}\n`;
    }
    prompt += `- **Authentication:** ${authRequired ? '✅ Required' : '❌ Not required'}\n`;
    if (authRequired_custom) {
      prompt += `  - Method: ${authRequired_custom}\n`;
    }
    
    prompt += `\n### Backend Standards\n`;
    prompt += `- RESTful API design principles\n`;
    prompt += `- Proper HTTP status codes\n`;
    prompt += `- Comprehensive error handling\n`;
    prompt += `- Input validation and sanitization\n`;
    prompt += `- Rate limiting and throttling\n`;
    prompt += `- CORS configuration\n`;
    prompt += `- Security headers (CSP, X-Frame-Options, etc.)\n`;
    prompt += `- SQL injection prevention\n`;
    prompt += `- CSRF protection\n\n`;
  }

  // ADDITIONAL FEATURES
  prompt += `---\n\n`;
  prompt += `## ✨ ADDITIONAL FEATURES & REQUIREMENTS\n\n`;
  
  if (additionalFeatures && additionalFeatures.length > 0) {
    prompt += `### Requested Features\n`;
    const featureMap = {
      payments: '💳 Payment Integration (Stripe/PayPal)',
      email: '📧 Email Service',
      sms: '📱 SMS Notifications',
      notifications: '🔔 Real-time Push Notifications',
      analytics: '📊 User Analytics & Tracking',
      seo: '🔍 SEO Optimization',
      cdn: '⚡ CDN for Media/Static Assets',
      testing: '🧪 Unit & Integration Testing'
    };
    
    additionalFeatures.forEach(feature => {
      prompt += `- ${featureMap[feature] || feature}\n`;
    });
  }
  
  if (additionalFeatures_custom) {
    prompt += `\n### Custom Requirements\n`;
    prompt += `- ${additionalFeatures_custom}\n`;
  }
  
  prompt += `\n### General Requirements\n`;
  prompt += `- Comprehensive logging and monitoring\n`;
  prompt += `- Error tracking (Sentry or similar)\n`;
  prompt += `- Performance monitoring\n`;
  prompt += `- Database backups\n`;
  prompt += `- Caching strategy (Redis/Memcached)\n`;
  prompt += `- CDN integration\n\n`;

  // DEPLOYMENT
  prompt += `---\n\n`;
  prompt += `## 🚀 DEPLOYMENT\n\n`;
  prompt += `- **Platform:** ${deploymentPlatform || 'Not specified'}\n`;
  if (deploymentPlatform_custom) {
    prompt += `- **Details:** ${deploymentPlatform_custom}\n`;
  }
  prompt += `- **Environment:** Production-ready with staging environment\n`;
  prompt += `- **SSL/TLS:** Enforced HTTPS\n`;
  prompt += `- **Zero-downtime deployments:** Required\n\n`;

  // CODE QUALITY & STANDARDS
  prompt += `---\n\n`;
  prompt += `## 📝 CODE QUALITY & STANDARDS\n\n`;
  prompt += `### Development Practices\n`;
  prompt += `- Follow industry best practices and design patterns\n`;
  prompt += `- DRY (Don't Repeat Yourself) principle\n`;
  prompt += `- SOLID principles for OOP\n`;
  prompt += `- Clean code practices\n`;
  prompt += `- Meaningful variable and function names\n\n`;

  prompt += `### Documentation\n`;
  prompt += `- Comprehensive code comments\n`;
  prompt += `- README with setup instructions\n`;
  prompt += `- API documentation\n`;
  prompt += `- Architecture documentation\n`;
  prompt += `- Database schema documentation\n\n`;

  prompt += `### Version Control\n`;
  prompt += `- Semantic versioning\n`;
  prompt += `- Meaningful commit messages\n`;
  prompt += `- Branch protection rules\n`;
  prompt += `- Code review process\n\n`;

  // DELIVERABLES
  prompt += `---\n\n`;
  prompt += `## 📦 FINAL DELIVERABLES\n\n`;
  prompt += `✅ Fully functional, production-ready application\n`;
  prompt += `✅ Responsive design across all devices\n`;
  prompt += `✅ Comprehensive API documentation\n`;
  prompt += `✅ Database schema with migration files\n`;
  prompt += `✅ Environment configuration setup\n`;
  prompt += `✅ Deployment instructions\n`;
  prompt += `✅ Setup guide for developers\n`;
  prompt += `✅ Security best practices implemented\n`;
  prompt += `✅ Performance optimized\n`;
  prompt += `✅ Error handling and validation\n`;
  prompt += `✅ Test coverage (unit & integration tests)\n`;
  prompt += `✅ Monitoring and logging setup\n\n`;

  // TECHNICAL GUIDELINES
  prompt += `---\n\n`;
  prompt += `## 🎯 TECHNICAL GUIDELINES\n\n`;
  prompt += `### Security\n`;
  prompt += `- Input validation on all user inputs\n`;
  prompt += `- Output encoding to prevent XSS\n`;
  prompt += `- Prepared statements for database queries\n`;
  prompt += `- Password hashing (bcrypt/Argon2)\n`;
  prompt += `- Environment variables for secrets\n`;
  prompt += `- Regular security audits\n\n`;

  prompt += `### Performance\n`;
  prompt += `- Database query optimization\n`;
  prompt += `- Caching strategy implementation\n`;
  prompt += `- Code splitting and lazy loading\n`;
  prompt += `- Image optimization\n`;
  prompt += `- Minification and compression\n`;
  prompt += `- Load testing and profiling\n\n`;

  prompt += `### Testing\n`;
  prompt += `- Unit tests for core logic\n`;
  prompt += `- Integration tests for API endpoints\n`;
  prompt += `- E2E tests for critical flows\n`;
  prompt += `- Test coverage minimum 80%\n`;
  prompt += `- Automated testing in CI/CD\n\n`;

  // INSTRUCTIONS
  prompt += `---\n\n`;
  prompt += `## 📋 INSTRUCTIONS\n\n`;
  prompt += `1. **Analyze** the requirements carefully\n`;
  prompt += `2. **Plan** the architecture and project structure\n`;
  prompt += `3. **Setup** project dependencies and configuration\n`;
  prompt += `4. **Implement** core features first\n`;
  prompt += `5. **Test** thoroughly at each stage\n`;
  prompt += `6. **Document** as you code\n`;
  prompt += `7. **Optimize** performance and security\n`;
  prompt += `8. **Deploy** with proper CI/CD\n\n`;

  prompt += `---\n\n`;
  prompt += `## 🎓 SUCCESS CRITERIA\n\n`;
  prompt += `✓ All requirements implemented and working\n`;
  prompt += `✓ Code is clean, maintainable, and well-documented\n`;
  prompt += `✓ Application is responsive and performant\n`;
  prompt += `✓ Security best practices are followed\n`;
  prompt += `✓ Tests pass with good coverage\n`;
  prompt += `✓ Ready for production deployment\n`;
  prompt += `✓ Easy to deploy and maintain\n\n`;

  prompt += `---\n\n`;
  prompt += `**Generated with ✨ Prompt Mastery - Build Better Projects with Better Prompts**`;

  return prompt;
}

module.exports = { generatePrompt };
