# Deployment Guide

## 🚀 Quick Deployment Options

### 1. GitHub Pages (Free)
```bash
# Push your code to GitHub repository
git add .
git commit -m "Deploy modern portfolio"
git push origin main

# Enable GitHub Pages in repository settings
# Your site will be available at: https://username.github.io
```

### 2. Netlify (Free)
1. Drag and drop the `modern-portfolio` folder to Netlify
2. Or connect your GitHub repository
3. Instant deployment with custom domain support

### 3. Vercel (Free)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd modern-portfolio
vercel

# Follow the prompts for configuration
```

### 4. Local Development
```bash
# Using Python (built-in)
cd modern-portfolio
python -m http.server 8000
# Open http://localhost:8000

# Using Node.js live-server
npm install -g live-server
cd modern-portfolio
live-server --port=8000
# Opens automatically in browser
```

## 📝 Pre-Deployment Checklist

### Content Updates
- [ ] Update personal information in `index.html`
- [ ] Replace placeholder images in `assets/` folder
- [ ] Update project details and links
- [ ] Modify social media links
- [ ] Update contact information

### Configuration
- [ ] Review `js/config.js` for customization
- [ ] Update SEO meta tags
- [ ] Set correct favicon
- [ ] Verify all links work

### Optimization
- [ ] Compress images (use tools like TinyPNG)
- [ ] Test on mobile devices
- [ ] Check loading performance
- [ ] Validate HTML and CSS

## 🎯 Custom Domain Setup

### GitHub Pages
1. Add `CNAME` file with your domain
2. Configure DNS A records:
   - `185.199.108.153`
   - `185.199.109.153`
   - `185.199.110.153`
   - `185.199.111.153`

### Netlify
1. Add custom domain in site settings
2. Configure DNS to point to Netlify

### Vercel
1. Add domain in project settings
2. Configure DNS as instructed

## 🔧 Performance Tips

- Keep images under 1MB
- Use WebP format when possible
- Enable gzip compression
- Minimize HTTP requests
- Use CDN for assets

## 🚨 Common Issues

### Images not loading
- Check file paths are correct
- Ensure images are in `assets/` folder
- Verify image file extensions

### Animations not working
- Check JavaScript console for errors
- Ensure all JS files are loaded
- Verify Intersection Observer support

### Mobile responsiveness
- Test on actual devices
- Use browser dev tools
- Check viewport meta tag

## 📞 Support

If you encounter issues:
1. Check the browser console for errors
2. Verify all files are uploaded correctly
3. Test locally first before deploying
4. Contact: rushabhbhalgat123@gmail.com

---
Happy deploying! 🎉
