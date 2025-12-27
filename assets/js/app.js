/**
 * XDAS Git School - Main JavaScript Application
 * 
 * This file handles all interactive functionality for the Git School website:
 * - Theme toggling (dark/light mode)
 * - Mobile navigation
 * - Git playground simulator
 * - Code block copy functionality
 * - Cheatsheet search
 * - Lesson navigation state
 * 
 * @author XDAS Research
 * @license MIT
 */

(function() {
  'use strict';

  // ============================================
  // Configuration & Constants
  // ============================================
  
  const CONFIG = {
    THEME_KEY: 'xdas-git-school-theme',
    COMPLETED_LESSONS_KEY: 'xdas-git-school-completed',
    DEFAULT_THEME: 'light'
  };

  // ============================================
  // Theme Management
  // ============================================
  
  const ThemeManager = {
    /**
     * Initialize theme based on saved preference or system preference
     */
    init() {
      const savedTheme = localStorage.getItem(CONFIG.THEME_KEY);
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const theme = savedTheme || (systemPrefersDark ? 'dark' : CONFIG.DEFAULT_THEME);
      
      this.setTheme(theme);
      this.bindEvents();
    },

    /**
     * Set the active theme
     * @param {string} theme - 'light' or 'dark'
     */
    setTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem(CONFIG.THEME_KEY, theme);
    },

    /**
     * Toggle between light and dark themes
     */
    toggle() {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      this.setTheme(newTheme);
    },

    /**
     * Bind click events to theme toggle buttons
     */
    bindEvents() {
      const toggleButtons = document.querySelectorAll('.theme-toggle');
      toggleButtons.forEach(btn => {
        btn.addEventListener('click', () => this.toggle());
      });

      // Listen for system theme changes
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem(CONFIG.THEME_KEY)) {
          this.setTheme(e.matches ? 'dark' : 'light');
        }
      });
    }
  };

  // ============================================
  // Mobile Navigation
  // ============================================
  
  const MobileNav = {
    init() {
      const toggle = document.querySelector('.mobile-menu-toggle');
      const nav = document.querySelector('.main-nav');
      
      if (toggle && nav) {
        toggle.addEventListener('click', () => {
          nav.classList.toggle('active');
          toggle.setAttribute('aria-expanded', nav.classList.contains('active'));
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
          if (!toggle.contains(e.target) && !nav.contains(e.target)) {
            nav.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
          }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') {
            nav.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
          }
        });
      }
    }
  };

  // ============================================
  // Code Block Copy Functionality
  // ============================================
  
  const CodeCopy = {
    init() {
      const copyButtons = document.querySelectorAll('.code-copy-btn');
      
      copyButtons.forEach(btn => {
        btn.addEventListener('click', async () => {
          const codeBlock = btn.closest('.code-block');
          const code = codeBlock.querySelector('pre').textContent;
          
          try {
            await navigator.clipboard.writeText(code);
            const originalText = btn.textContent;
            btn.textContent = 'Copied!';
            btn.classList.add('copied');
            
            setTimeout(() => {
              btn.textContent = originalText;
              btn.classList.remove('copied');
            }, 2000);
          } catch (err) {
            console.error('Failed to copy:', err);
            btn.textContent = 'Failed';
            setTimeout(() => {
              btn.textContent = 'Copy';
            }, 2000);
          }
        });
      });
    }
  };

  // ============================================
  // Git Playground Simulator
  // ============================================
  
  const GitPlayground = {
    // Virtual file system state
    state: {
      initialized: false,
      branch: 'main',
      stagedFiles: [],
      modifiedFiles: ['README.md', 'index.html', 'style.css'],
      commits: [],
      workingDirectory: '/my-project'
    },

    // Command definitions with handlers
    commands: {
      'help': {
        description: 'Show available commands',
        handler: function() {
          return `Available commands:
  git init        - Initialize a new Git repository
  git status      - Show the working tree status
  git add <file>  - Add file(s) to staging area
  git add .       - Add all files to staging area
  git commit -m   - Record changes to the repository
  git log         - Show commit logs
  git branch      - List branches
  clear           - Clear the terminal
  help            - Show this help message

Try typing a command to see what happens!`;
        }
      },
      
      'clear': {
        description: 'Clear terminal',
        handler: function(playground) {
          playground.clearOutput();
          return null;
        }
      },

      'git init': {
        description: 'Initialize repository',
        handler: function(playground) {
          if (playground.state.initialized) {
            return `Reinitialized existing Git repository in ${playground.state.workingDirectory}/.git/`;
          }
          playground.state.initialized = true;
          playground.updateStatusIndicator();
          return `Initialized empty Git repository in ${playground.state.workingDirectory}/.git/

Hint: Your repository is now ready! Try 'git status' to see your files.`;
        }
      },

      'git status': {
        description: 'Show status',
        handler: function(playground) {
          if (!playground.state.initialized) {
            return 'fatal: not a git repository (or any of the parent directories): .git';
          }

          let output = `On branch ${playground.state.branch}\n`;
          
          if (playground.state.commits.length === 0) {
            output += '\nNo commits yet\n';
          }
          
          if (playground.state.stagedFiles.length > 0) {
            output += '\nChanges to be committed:\n';
            output += '  (use "git restore --staged <file>..." to unstage)\n';
            playground.state.stagedFiles.forEach(file => {
              output += `\t${'\x1b[32m'}new file:   ${file}${'\x1b[0m'}\n`;
            });
          }
          
          const unstaged = playground.state.modifiedFiles.filter(
            f => !playground.state.stagedFiles.includes(f)
          );
          
          if (unstaged.length > 0) {
            output += '\nUntracked files:\n';
            output += '  (use "git add <file>..." to include in what will be committed)\n';
            unstaged.forEach(file => {
              output += `\t${'\x1b[31m'}${file}${'\x1b[0m'}\n`;
            });
          }
          
          if (playground.state.stagedFiles.length === 0 && unstaged.length === 0) {
            output += '\nnothing to commit, working tree clean';
          }
          
          return output;
        }
      },

      'git add': {
        description: 'Stage files',
        handler: function(playground, args) {
          if (!playground.state.initialized) {
            return 'fatal: not a git repository (or any of the parent directories): .git';
          }

          if (!args || args.length === 0) {
            return `Nothing specified, nothing added.
hint: Maybe you wanted to say 'git add .'?`;
          }

          const fileArg = args.join(' ');
          
          if (fileArg === '.') {
            // Add all files
            const newFiles = playground.state.modifiedFiles.filter(
              f => !playground.state.stagedFiles.includes(f)
            );
            playground.state.stagedFiles.push(...newFiles);
            return `Added ${newFiles.length} file(s) to staging area.

Hint: Use 'git status' to see staged files, then 'git commit -m "message"' to commit.`;
          } else {
            // Add specific file
            if (playground.state.modifiedFiles.includes(fileArg)) {
              if (!playground.state.stagedFiles.includes(fileArg)) {
                playground.state.stagedFiles.push(fileArg);
                return `Added '${fileArg}' to staging area.`;
              } else {
                return `'${fileArg}' is already staged.`;
              }
            } else {
              return `fatal: pathspec '${fileArg}' did not match any files`;
            }
          }
        }
      },

      'git commit': {
        description: 'Commit changes',
        handler: function(playground, args) {
          if (!playground.state.initialized) {
            return 'fatal: not a git repository (or any of the parent directories): .git';
          }

          if (playground.state.stagedFiles.length === 0) {
            return `nothing to commit, working tree clean

Hint: Use 'git add <file>' or 'git add .' to stage changes first.`;
          }

          // Parse commit message
          const argsStr = args.join(' ');
          let message = '';
          
          if (argsStr.startsWith('-m')) {
            // Extract message from quotes
            const match = argsStr.match(/-m\s*["']([^"']+)["']/);
            if (match) {
              message = match[1];
            } else {
              // Try without quotes
              const noQuoteMatch = argsStr.match(/-m\s+(.+)/);
              if (noQuoteMatch) {
                message = noQuoteMatch[1];
              }
            }
          }

          if (!message) {
            return `error: switch 'm' requires a value
Usage: git commit -m "your message here"`;
          }

          // Create commit
          const commitHash = playground.generateHash();
          const commit = {
            hash: commitHash,
            message: message,
            files: [...playground.state.stagedFiles],
            date: new Date().toISOString()
          };
          
          playground.state.commits.unshift(commit);
          const filesCommitted = playground.state.stagedFiles.length;
          playground.state.stagedFiles = [];

          return `[${playground.state.branch} ${commitHash.substring(0, 7)}] ${message}
 ${filesCommitted} file(s) changed

Hint: Use 'git log' to see your commit history.`;
        }
      },

      'git log': {
        description: 'Show commits',
        handler: function(playground) {
          if (!playground.state.initialized) {
            return 'fatal: not a git repository (or any of the parent directories): .git';
          }

          if (playground.state.commits.length === 0) {
            return 'fatal: your current branch does not have any commits yet';
          }

          let output = '';
          playground.state.commits.forEach((commit, index) => {
            output += `commit ${commit.hash}`;
            if (index === 0) {
              output += ` (HEAD -> ${playground.state.branch})`;
            }
            output += '\n';
            output += `Author: You <you@example.com>\n`;
            output += `Date:   ${new Date(commit.date).toLocaleString()}\n\n`;
            output += `    ${commit.message}\n\n`;
          });

          return output.trim();
        }
      },

      'git branch': {
        description: 'List branches',
        handler: function(playground) {
          if (!playground.state.initialized) {
            return 'fatal: not a git repository (or any of the parent directories): .git';
          }

          return `* ${playground.state.branch}

Hint: You're on the '${playground.state.branch}' branch. In a real project, you might have multiple branches!`;
        }
      }
    },

    /**
     * Initialize the playground
     */
    init() {
      this.terminal = document.querySelector('.playground-terminal');
      if (!this.terminal) return;

      this.output = this.terminal.querySelector('.playground-output');
      this.input = this.terminal.querySelector('.playground-input');
      this.statusIndicator = document.querySelector('.status-indicator .status-dot');
      this.statusText = document.querySelector('.status-indicator .status-text');

      this.bindEvents();
      this.printWelcome();
      this.updateStatusIndicator();
    },

    /**
     * Bind event listeners
     */
    bindEvents() {
      // Input handling
      this.input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.executeCommand(this.input.value);
          this.input.value = '';
        }
      });

      // Clear button
      const clearBtn = document.querySelector('[data-action="clear"]');
      if (clearBtn) {
        clearBtn.addEventListener('click', () => this.clearOutput());
      }

      // Reset button
      const resetBtn = document.querySelector('[data-action="reset"]');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => this.reset());
      }

      // Help command clicks
      const helpCommands = document.querySelectorAll('.help-command');
      helpCommands.forEach(cmd => {
        cmd.addEventListener('click', () => {
          const command = cmd.querySelector('.help-command-name').textContent;
          this.input.value = command;
          this.input.focus();
        });
      });

      // Focus input when clicking terminal
      this.terminal.addEventListener('click', (e) => {
        if (!e.target.closest('button')) {
          this.input.focus();
        }
      });
    },

    /**
     * Print welcome message
     */
    printWelcome() {
      this.printLine('Welcome to the Git Playground! 🎮', 'info');
      this.printLine('Practice Git commands in a safe, simulated environment.', 'info');
      this.printLine('');
      this.printLine('Type "help" to see available commands.', 'info');
      this.printLine('Try starting with "git init" to initialize a repository.', 'info');
      this.printLine('─'.repeat(50), 'info');
      this.printLine('');
    },

    /**
     * Execute a command
     * @param {string} commandStr - The command string to execute
     */
    executeCommand(commandStr) {
      const trimmed = commandStr.trim();
      if (!trimmed) return;

      // Echo the command
      this.printLine(`$ ${trimmed}`, 'command');

      // Parse command and arguments
      const parts = trimmed.split(' ');
      let command = parts[0];
      let args = parts.slice(1);

      // Handle git subcommands
      if (command === 'git' && parts.length > 1) {
        command = `git ${parts[1]}`;
        args = parts.slice(2);
      }

      // Find and execute command handler
      const handler = this.commands[command];
      if (handler) {
        const result = handler.handler(this, args);
        if (result !== null) {
          this.printLine(result);
        }
      } else if (command === 'git') {
        this.printLine(`git: '${parts[1] || ''}' is not a git command. See 'help'.`, 'error');
      } else {
        this.printLine(`Command not found: ${command}. Type 'help' for available commands.`, 'error');
      }

      this.printLine('');
      this.scrollToBottom();
    },

    /**
     * Print a line to the terminal output
     * @param {string} text - Text to print
     * @param {string} type - Line type (command, error, success, info)
     */
    printLine(text, type = '') {
      const line = document.createElement('div');
      line.className = 'output-line';
      if (type) line.classList.add(type);
      
      // Handle ANSI color codes (simplified)
      text = text.replace(/\x1b\[32m/g, '<span class="text-success">');
      text = text.replace(/\x1b\[31m/g, '<span class="text-error">');
      text = text.replace(/\x1b\[0m/g, '</span>');
      
      line.innerHTML = text;
      this.output.appendChild(line);
    },

    /**
     * Clear the terminal output
     */
    clearOutput() {
      this.output.innerHTML = '';
      this.printWelcome();
    },

    /**
     * Reset the playground state
     */
    reset() {
      this.state = {
        initialized: false,
        branch: 'main',
        stagedFiles: [],
        modifiedFiles: ['README.md', 'index.html', 'style.css'],
        commits: [],
        workingDirectory: '/my-project'
      };
      this.clearOutput();
      this.updateStatusIndicator();
      this.printLine('Playground reset! Start fresh with "git init".', 'success');
      this.printLine('');
    },

    /**
     * Update the status indicator
     */
    updateStatusIndicator() {
      if (this.statusIndicator && this.statusText) {
        if (this.state.initialized) {
          this.statusIndicator.classList.add('initialized');
          this.statusIndicator.classList.remove('not-initialized');
          this.statusText.textContent = 'Repository initialized';
        } else {
          this.statusIndicator.classList.remove('initialized');
          this.statusIndicator.classList.add('not-initialized');
          this.statusText.textContent = 'No repository';
        }
      }
    },

    /**
     * Scroll terminal to bottom
     */
    scrollToBottom() {
      this.output.scrollTop = this.output.scrollHeight;
    },

    /**
     * Generate a fake commit hash
     * @returns {string} A 40-character hex string
     */
    generateHash() {
      const chars = '0123456789abcdef';
      let hash = '';
      for (let i = 0; i < 40; i++) {
        hash += chars[Math.floor(Math.random() * chars.length)];
      }
      return hash;
    }
  };

  // ============================================
  // Cheatsheet Search
  // ============================================
  
  const CheatsheetSearch = {
    init() {
      const searchInput = document.querySelector('.search-input');
      if (!searchInput) return;

      const commandItems = document.querySelectorAll('.command-item');
      const categories = document.querySelectorAll('.cheatsheet-category');

      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();

        if (!query) {
          // Show all items
          commandItems.forEach(item => item.style.display = '');
          categories.forEach(cat => cat.style.display = '');
          return;
        }

        // Filter items
        categories.forEach(category => {
          const items = category.querySelectorAll('.command-item');
          let visibleCount = 0;

          items.forEach(item => {
            const syntax = item.querySelector('.command-syntax').textContent.toLowerCase();
            const description = item.querySelector('.command-description').textContent.toLowerCase();
            const matches = syntax.includes(query) || description.includes(query);
            
            item.style.display = matches ? '' : 'none';
            if (matches) visibleCount++;
          });

          // Hide category if no visible items
          category.style.display = visibleCount === 0 ? 'none' : '';
        });
      });

      // Clear search on Escape
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          searchInput.value = '';
          searchInput.dispatchEvent(new Event('input'));
        }
      });
    }
  };

  // ============================================
  // Lesson Progress Tracking
  // ============================================
  
  const LessonProgress = {
    init() {
      this.loadProgress();
      this.bindEvents();
      this.updateUI();
    },

    /**
     * Load progress from localStorage
     */
    loadProgress() {
      const saved = localStorage.getItem(CONFIG.COMPLETED_LESSONS_KEY);
      this.completed = saved ? JSON.parse(saved) : [];
    },

    /**
     * Save progress to localStorage
     */
    saveProgress() {
      localStorage.setItem(CONFIG.COMPLETED_LESSONS_KEY, JSON.stringify(this.completed));
    },

    /**
     * Mark a lesson as complete
     * @param {string} lessonId - The lesson identifier
     */
    markComplete(lessonId) {
      if (!this.completed.includes(lessonId)) {
        this.completed.push(lessonId);
        this.saveProgress();
        this.updateUI();
      }
    },

    /**
     * Check if a lesson is complete
     * @param {string} lessonId - The lesson identifier
     * @returns {boolean}
     */
    isComplete(lessonId) {
      return this.completed.includes(lessonId);
    },

    /**
     * Bind event listeners
     */
    bindEvents() {
      // Mark as complete button
      const completeBtn = document.querySelector('[data-action="mark-complete"]');
      if (completeBtn) {
        completeBtn.addEventListener('click', () => {
          const lessonId = completeBtn.dataset.lessonId;
          this.markComplete(lessonId);
          completeBtn.textContent = '✓ Completed';
          completeBtn.disabled = true;
        });
      }
    },

    /**
     * Update UI to reflect progress
     */
    updateUI() {
      // Update sidebar navigation
      const navLinks = document.querySelectorAll('.lesson-nav-link');
      navLinks.forEach(link => {
        const lessonId = link.dataset.lessonId;
        if (lessonId && this.isComplete(lessonId)) {
          link.classList.add('completed');
        }
      });

      // Update complete button state
      const completeBtn = document.querySelector('[data-action="mark-complete"]');
      if (completeBtn) {
        const lessonId = completeBtn.dataset.lessonId;
        if (this.isComplete(lessonId)) {
          completeBtn.textContent = '✓ Completed';
          completeBtn.disabled = true;
        }
      }
    }
  };

  // ============================================
  // Smooth Scroll for Anchor Links
  // ============================================
  
  const SmoothScroll = {
    init() {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
          const href = anchor.getAttribute('href');
          if (href === '#') return;

          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });

            // Update URL without scrolling
            history.pushState(null, null, href);
          }
        });
      });
    }
  };

  // ============================================
  // Terminal Animation (Hero Section)
  // ============================================
  
  const TerminalAnimation = {
    commands: [
      { cmd: 'git init', delay: 1000 },
      { cmd: 'git add .', delay: 800 },
      { cmd: 'git commit -m "Initial commit"', delay: 1200 },
      { cmd: 'git push origin main', delay: 1000 }
    ],

    init() {
      const terminal = document.querySelector('.terminal-demo .terminal-body');
      if (!terminal || terminal.dataset.animated) return;

      terminal.dataset.animated = 'true';
      this.animate(terminal);
    },

    async animate(terminal) {
      for (const item of this.commands) {
        await this.typeCommand(terminal, item.cmd);
        await this.sleep(item.delay);
      }

      // Add completion message
      const line = document.createElement('div');
      line.className = 'terminal-line terminal-output';
      line.innerHTML = '✓ Repository pushed successfully!';
      line.style.color = '#7ee787';
      terminal.appendChild(line);
    },

    async typeCommand(terminal, command) {
      const line = document.createElement('div');
      line.className = 'terminal-line';
      line.innerHTML = '<span class="terminal-prompt">$</span> <span class="terminal-command"></span>';
      terminal.appendChild(line);

      const cmdSpan = line.querySelector('.terminal-command');
      
      for (let i = 0; i < command.length; i++) {
        await this.sleep(50 + Math.random() * 30);
        cmdSpan.textContent += command[i];
      }
    },

    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  };

  // ============================================
  // Initialize Everything on DOM Ready
  // ============================================
  
  function init() {
    ThemeManager.init();
    MobileNav.init();
    CodeCopy.init();
    GitPlayground.init();
    CheatsheetSearch.init();
    LessonProgress.init();
    SmoothScroll.init();
    TerminalAnimation.init();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();