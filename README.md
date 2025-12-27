# XDAS Git School

A free, open-source educational website that teaches Git from zero to practical usage. Built with vanilla HTML, CSS, and JavaScript — no frameworks, no build tools, no external dependencies.

![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

## Features

- **Step-by-Step Lessons** - Learn Git concepts from the basics to advanced workflows
- **Interactive Playground** - Practice Git commands in a browser-based terminal simulator
- **Comprehensive Cheatsheet** - Quick reference for all essential Git commands
- **Dark Mode** - Easy on the eyes with automatic theme detection
- **Fully Responsive** - Works great on desktop, tablet, and mobile
- **Accessible** - Built with accessibility in mind (WCAG compliant)
- **No Dependencies** - Pure HTML, CSS, and vanilla JavaScript

## Who Is This For?

- Absolute beginners who have never used Git
- Students learning version control for the first time
- Early-career developers new to Git and GitHub
- Anyone who wants to understand Git fundamentals

## Project Structure

```
xdas-git-school/
├── index.html          # Landing page
├── learn.html          # Interactive lessons
├── playground.html     # Git command simulator
├── cheatsheet.html     # Quick reference guide
├── assets/
│   ├── css/
│   │   └── style.css   # All styles (GitHub-inspired design)
│   ├── js/
│   │   └── app.js      # All JavaScript functionality
│   └── images/
│       └── diagrams/   # Visual diagrams (if any)
├── README.md           # This file
└── LICENSE             # MIT License
```

## Getting Started

### Option 1: View Online

Visit the live site at: `https://xdas-research.github.io/xdas-git-school/`

### Option 2: Run Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/xdas-research/xdas-git-school.git
   ```

2. **Navigate to the project**
   ```bash
   cd xdas-git-school
   ```

3. **Open in browser**

   Simply open `index.html` in your web browser. No server required!

   Or use a local server for the best experience:

   ```bash
   # Using Python 3
   python -m http.server 8000

   # Using Node.js (npx)
   npx serve

   # Using PHP
   php -S localhost:8000
   ```

   Then visit `http://localhost:8000`

## Deploying to GitHub Pages

1. Fork this repository (or push to your own GitHub account)
2. Go to repository Settings
3. Click on "Settings" tab
4. Navigate to "Pages" in the sidebar
5. Configure GitHub Pages
   - Under "Source", select "Deploy from a branch"
   - Select main branch and / (root) folder
   - Click "Save"
6. Wait for deployment
7. GitHub will automatically build and deploy your site
8. Your site will be available at `https://[username].github.io/xdas-git-school/`

### Custom Domain (Optional)

Add a CNAME file to the repository root with your domain:

```
learn.yourdomain.com
```

Configure DNS settings with your domain provider.

## Lessons Included

- What is Git? - Introduction to version control
- Installing Git - Setup on Windows, macOS, and Linux
- git init - Creating your first repository
- git status - Understanding repository state
- git add - Staging changes
- git commit - Saving snapshots
- git log - Viewing history
- Branches - Parallel development
- Merge vs Rebase - Combining branches
- GitHub Basics - Remote repositories and collaboration

## Playground Commands

The interactive playground supports these commands:

| Command          | Description                  |
|------------------|------------------------------|
| git init         | Initialize a new repository  |
| git status       | Show working tree status     |
| git add <file>   | Stage specific file          |
| git add .        | Stage all files              |
| git commit -m "msg" | Commit with message        |
| git log          | Show commit history          |
| git branch       | List branches                |
| help             | Show available commands      |
| clear            | Clear terminal               |

## Design System

The site uses a GitHub-inspired design with:

- Light/Dark themes with system preference detection
- Accessible color contrast (WCAG AA compliant)
- Responsive breakpoints at 1024px, 768px, and 480px
- CSS Custom Properties for easy theming
- Mobile-first approach with progressive enhancement

### Color Palette

| Purpose   | Light     | Dark      |
|-----------|-----------|-----------|
| Background| #ffffff   | #0d1117   |
| Surface   | #f6f8fa   | #161b22   |
| Border    | #d0d7de   | #30363d   |
| Primary   | #1f883d   | #238636   |
| Accent    | #0969da   | #58a6ff   |
| Text      | #1f2328   | #e6edf3   |

## Contributing

Contributions are welcome! Here's how you can help:

- Report bugs - Open an issue describing the problem
- Suggest features - Open an issue with your idea
- Submit PRs - Fork, make changes, and submit a pull request

### Development Guidelines

- Keep the zero-dependency philosophy
- Maintain accessibility standards
- Test on multiple browsers and devices
- Write clear, commented code
- Follow existing code style

### Adding a New Lesson

- Add the lesson content in `learn.html` following the existing format
- Add navigation links in the sidebar
- Update the lesson count in relevant places
- Test the lesson navigation

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Opera (latest)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by the amazing Git documentation
- Design influenced by GitHub's UI
- Built for the developer community

## Contact

- Organization: XDAS Research
- GitHub: @xdas-research
- Issues: Report a bug
- Built with love by XDAS Research

```