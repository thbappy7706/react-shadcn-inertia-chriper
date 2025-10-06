import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const [currentPage, setCurrentPage] = useState('home');
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isLightMode, setIsLightMode] = useState(false);
    // Always use page transition
    const transitionMode = 'page';

    useEffect(() => {
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            setIsLightMode(true);
            document.body.classList.add('light-mode');
        }

        // Add transition to home page on first load
        const homePage = document.getElementById('home');
        if (homePage) {
            homePage.classList.remove('page-enter-from');
            setTimeout(() => {
                homePage.classList.remove('page-enter-active');
            }, 400);
        }

        // Add smooth scroll for navigation
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }, []);
    
    // No transition mode switching function needed anymore

    const toggleTheme = () => {
        const newMode = !isLightMode;
        setIsLightMode(newMode);
        
        if (newMode) {
            document.body.classList.add('light-mode');
            localStorage.setItem('theme', 'light');
        } else {
            document.body.classList.remove('light-mode');
            localStorage.setItem('theme', 'dark');
        }
    };

    const navigateTo = (pageName: string, event?: React.MouseEvent<HTMLElement>) => {
        if (pageName === currentPage || isTransitioning) return;

        setIsTransitioning(true);
        const currentPageEl = document.getElementById(currentPage);
        const nextPageEl = document.getElementById(pageName);

        // Update nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('text-white');
            link.classList.add('text-gray-400');
        });
        
        if (event && event.currentTarget) {
            event.currentTarget.classList.remove('text-gray-400');
            event.currentTarget.classList.add('text-white');
        }

        if (currentPageEl && nextPageEl) {
            // Start leave transition (out)
            currentPageEl.classList.add('page-leave-active');
            currentPageEl.classList.add('page-leave-to');

            // Wait for leave transition to complete
            setTimeout(() => {
                // Hide current page
                currentPageEl.classList.remove('page-leave-active', 'page-leave-to');
                currentPageEl.classList.add('page-hidden');

                // Show and prepare next page
                nextPageEl.classList.remove('page-hidden');
                nextPageEl.classList.add('page-enter-active');
                nextPageEl.classList.add('page-enter-from');

                // Scroll to top
                window.scrollTo({ top: 0, behavior: 'instant' });

                // Trigger enter transition (in)
                requestAnimationFrame(() => {
                    nextPageEl.classList.remove('page-enter-from');

                    // Clean up after enter transition
                    setTimeout(() => {
                        nextPageEl.classList.remove('page-enter-active');
                        setCurrentPage(pageName);
                        setIsTransitioning(false);
                    }, 400);
                });
            }, 400);
        }
    };

    const toggleAccordion = (index: number) => {
        const content = document.getElementById(`content-${index}`);
        const icon = document.getElementById(`icon-${index}`);

        if (content && icon) {
            // Close all other accordions
            for (let i = 0; i < 3; i++) {
                if (i !== index) {
                    const otherContent = document.getElementById(`content-${i}`);
                    const otherIcon = document.getElementById(`icon-${i}`);
                    if (otherContent && otherIcon) {
                        otherContent.classList.remove('active');
                        otherIcon.style.transform = 'rotate(0deg)';
                    }
                }
            }

            // Toggle current accordion
            content.classList.toggle('active');
            if (content.classList.contains('active')) {
                icon.style.transform = 'rotate(180deg)';
            } else {
                icon.style.transform = 'rotate(0deg)';
            }
        }
    };
    
    // Add useEffect for testimonial dots navigation
    useEffect(() => {
        // Dots navigation for testimonials
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                dots.forEach(d => {
                    d.classList.remove('active');
                    d.classList.add('bg-gray-600');
                    d.classList.remove('bg-white');
                    (d as HTMLElement).style.width = '0.5rem';
                });
                dot.classList.add('active');
                dot.classList.remove('bg-gray-600');
                dot.classList.add('bg-white');
            });
        });
        
        // Update active nav link on scroll
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        const handleScroll = () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (window.pageYOffset >= sectionTop - 200) {
                    current = section.getAttribute('id') || '';
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('text-white');
                link.classList.add('text-gray-400');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.remove('text-gray-400');
                    link.classList.add('text-white');
                }
            });
        };

        window.addEventListener('scroll', handleScroll);
        
        // Cleanup event listener on component unmount
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <>
            <Head title="Emma Thompson - UX/UI Designer">
                <script src="https://cdn.tailwindcss.com"></script>
                <style>
                    {`
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

                    :root {
                        /* Dark mode (default) */
                        --bg-primary: #0a0a0a;
                        --bg-secondary: #1a1a1a;
                        --bg-card: rgba(255, 255, 255, 0.05);
                        --bg-card-hover: rgba(255, 255, 255, 0.1);
                        --text-primary: #ffffff;
                        --text-secondary: #a0a0a0;
                        --text-tertiary: #6b7280;
                        --border-color: rgba(255, 255, 255, 0.1);
                        --accent-color: #3b82f6;
                    }

                    .light-mode {
                        /* Light mode */
                        --bg-primary: #ffffff;
                        --bg-secondary: #f5f5f5;
                        --bg-card: rgba(0, 0, 0, 0.05);
                        --bg-card-hover: rgba(0, 0, 0, 0.1);
                        --text-primary: #111827;
                        --text-secondary: #4b5563;
                        --text-tertiary: #6b7280;
                        --border-color: rgba(0, 0, 0, 0.1);
                        --accent-color: #2563eb;
                    }

                    * {
                        font-family: 'Inter', sans-serif;
                    }

                    html {
                        scroll-behavior: smooth;
                    }

                    body {
                        background-color: var(--bg-primary);
                        color: var(--text-primary);
                        transition: background-color 0.3s ease, color 0.3s ease;
                    }

                    /* Page transition (default) */
                    .page-enter-active,
                    .page-leave-active {
                        transition: all 0.4s;
                    }

                    .page-enter-from,
                    .page-leave-to {
                        opacity: 0;
                        filter: blur(1rem);
                    }
                    
                    /* Only page transition is used */

                    .nav-link {
                        transition: all 0.3s ease;
                        position: relative;
                    }

                    .nav-link:hover {
                        color: #ffffff;
                    }

                    .image-card {
                        transition: all 0.3s ease;
                    }

                    .image-card:hover {
                        transform: translateY(-8px) scale(1.02);
                    }

                    .accordion-button {
                        transition: all 0.3s ease;
                    }

                    .accordion-content {
                        max-height: 0;
                        overflow: hidden;
                        transition: max-height 0.3s ease;
                    }

                    .accordion-content.active {
                        max-height: 200px;
                    }

                    .dot {
                        transition: all 0.3s ease;
                    }

                    .dot.active {
                        background-color: #ffffff;
                        width: 2rem;
                    }

                    .page-hidden {
                        display: none;
                    }

                    .page-enter-from,
                    .page-leave-to {
                        opacity: 0;
                        filter: blur(1rem);
                    }

                    body {
                        background: transparent !important;
                    }
                    #gradient-bg {
                        background:
                                radial-gradient(ellipse 110% 70% at 25% 80%, rgba(147, 51, 234, 0.12), transparent 55%),
                                radial-gradient(ellipse 130% 60% at 75% 15%, rgba(59, 130, 246, 0.10), transparent 65%),
                                radial-gradient(ellipse 80% 90% at 20% 30%, rgba(236, 72, 153, 0.14), transparent 50%),
                                radial-gradient(ellipse 100% 40% at 60% 70%, rgba(16, 185, 129, 0.08), transparent 45%),
                                var(--bg-primary);
                        opacity: 1;
                        z-index: -1;
                        pointer-events: none;
                    }
                    .light-mode #gradient-bg {
                        opacity: 0;
                    }
                    .light-mode {
                        background: var(--bg-primary) !important;
                    }

                    #theme-toggle.dark-mode {
                        background-color: var(--bg-card);
                    }
                    #theme-toggle.dark-mode:hover {
                        background-color: var(--bg-card-hover);
                    }
                    #theme-toggle.light-mode {
                        background-color: var(--bg-card);
                    }
                    #theme-toggle.light-mode:hover {
                        background-color: var(--bg-card-hover);
                    }
                    `}
                </style>
            </Head>

            <body className="bg-black text-white transition-colors min-h-screen flex flex-col" style={{ color: 'var(--text-primary)' }}>
                {/* Gradient Background */}
                <div className="fixed inset-0 transition-opacity duration-500" id="gradient-bg"></div>

                <main className="flex-grow">
                    <nav className="fixed top-4 md:top-6 left-0 right-0 mx-auto
                        backdrop-blur-md rounded-full px-3 sm:px-4 md:px-6 py-2 md:py-3 
                        flex items-center space-x-2 sm:space-x-4 md:space-x-6 shadow-lg z-50 w-[95%] sm:w-auto max-w-2xl
                        transition-colors" 
                        style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>

                        <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('home'); }}
                        className="text-sm sm:text-base font-semibold transition-colors border-b-2 border-transparent hover:border-current" 
                        style={{ color: currentPage === 'home' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>Home</a>
                        <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('projects'); }}
                        className="text-sm sm:text-base font-medium transition-colors" 
                        style={{ color: currentPage === 'projects' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>Projects</a>
                        <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('blog'); }}
                        className="text-sm sm:text-base font-medium transition-colors" 
                        style={{ color: currentPage === 'blog' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>Blog</a>
                        <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('speaking'); }}
                        className="text-sm sm:text-base font-medium transition-colors" 
                        style={{ color: currentPage === 'speaking' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>Speaking</a>
                        <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('about'); }}
                        className="text-sm sm:text-base font-medium transition-colors" 
                        style={{ color: currentPage === 'about' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>About</a>

                        <button id="theme-toggle" onClick={toggleTheme} className={`ml-2 sm:ml-4 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-colors ${isLightMode ? 'light-mode' : 'dark-mode'}`}>
                            {/* Sun icon (for dark mode) */}
                            {!isLightMode && (
                                <svg id="sun-icon" className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" 
                                    style={{ color: 'var(--text-primary)' }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            )}
                            {/* Moon icon (for light mode) */}
                            {isLightMode && (
                                <svg id="moon-icon" className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                    style={{ color: 'var(--text-primary)' }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                                </svg>
                            )}
                        </button>
                    </nav>

                    {/* HOME PAGE */}
                    <div id="home" className={`page-content pt-24 md:pt-28 lg:pt-32 pb-6 md:pb-8 px-4 sm:px-6 space-y-10 md:space-y-16 mt-[1rem] page-enter-active page-enter-from ${currentPage === 'home' ? '' : 'page-hidden'}`}>
                        <div className="max-w-3xl mx-auto text-center">
                            <div className="mb-6 md:mb-8">
                                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop"
                                    alt="Profile"
                                    className="w-20 h-20 md:w-24 md:h-24 rounded-full mx-auto object-cover border-4 border-white/10" />
                            </div>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight">
                                Hey, I'm Emma<br />Thompson UX/UI<br />Designer
                            </h1>
                            <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto mb-6 md:mb-8">
                                I craft intuitive digital experiences where design meets functionality.<br className="hidden sm:block" />
                                Based in Boston, bringing ideas to life through code and creativity.
                            </p>
                            <div className="flex flex-wrap gap-3 md:gap-4 justify-center items-center mb-6 md:mb-8">
                                <button className="px-4 sm:px-5 md:px-6 py-2 md:py-3 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition-all text-sm md:text-base">
                                    Use this template
                                </button>
                                <div className="flex items-center gap-2 text-green-400">
                                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                                    <span className="text-xs sm:text-sm">Available for new projects</span>
                                </div>
                            </div>
                            
                            {/* Transition Mode Buttons Removed */}
                            <div className="flex justify-center gap-3 md:gap-4">
                                <a href="#" className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                                    </svg>
                                </a>
                                <a href="#" className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                    </svg>
                                </a>
                                <a href="#" className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                    {/* END HOME PAGE */}

                    {/* PROJECTS PAGE */}
                    <div id="projects" className={`page-content ${currentPage === 'projects' ? '' : 'page-hidden'}`}>
                        <section className="min-h-screen pt-24 md:pt-28 lg:pt-32 px-4 sm:px-6 pb-16 md:pb-20">
                            <div className="max-w-5xl mx-auto">
                                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 md:mb-4">Featured Projects</h1>
                                <p className="text-gray-400 mb-10 md:mb-16 text-sm md:text-base">A collection of my best work</p>

                                <div className="grid sm:grid-cols-2 gap-6 md:gap-8">
                                    {/* Project Cards */}
                                    <div className="group cursor-pointer">
                                        <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl h-60 md:h-72 lg:h-80 mb-3 md:mb-4 overflow-hidden">
                                            <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop"
                                                className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                                                alt="Project" />
                                        </div>
                                        <h3 className="text-xl md:text-2xl font-bold mb-1 md:mb-2" style={{ color: 'var(--text-primary)' }}>Mobile Banking App</h3>
                                        <p className="mb-2 md:mb-3 text-sm md:text-base" style={{ color: 'var(--text-secondary)' }}>Modern fintech app with focus on accessibility</p>
                                        <div className="flex gap-2">
                                            <span className="px-3 py-1 bg-pink-500/20 text-pink-400 rounded-full text-xs">Mobile</span>
                                            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">Fintech</span>
                                        </div>
                                    </div>

                                    <div className="group cursor-pointer">
                                        <div className="bg-gradient-to-br from-pink-600 to-orange-600 rounded-2xl h-60 md:h-72 lg:h-80 mb-3 md:mb-4 overflow-hidden">
                                            <img src="https://images.unsplash.com/photo-1555421689-d68471e189f2?w=800&h=600&fit=crop"
                                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                                                alt="Project" />
                                        </div>
                                        <h3 className="text-xl md:text-2xl font-bold mb-1 md:mb-2" style={{ color: 'var(--text-primary)' }}>Mobile Banking App</h3>
                                        <p className="mb-2 md:mb-3 text-sm md:text-base" style={{ color: 'var(--text-secondary)' }}>Modern fintech app with focus on accessibility</p>
                                        <div className="flex gap-2">
                                            <span className="px-3 py-1 bg-pink-500/20 text-pink-400 rounded-full text-xs">Mobile</span>
                                            <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs">Fintech</span>
                                        </div>
                                    </div>

                                    <div className="group cursor-pointer">
                                        <div className="bg-gradient-to-br from-green-600 to-teal-600 rounded-2xl h-60 md:h-72 lg:h-80 mb-3 md:mb-4 overflow-hidden">
                                            <img src="https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&h=600&fit=crop"
                                                className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                                                alt="Project" />
                                        </div>
                                        <h3 className="text-xl md:text-2xl font-bold mb-1 md:mb-2" style={{ color: 'var(--text-primary)' }}>E-Commerce Platform</h3>
                                        <p className="mb-2 md:mb-3 text-sm md:text-base" style={{ color: 'var(--text-secondary)' }}>Seamless shopping experience with AI recommendations</p>
                                        <div className="flex gap-2">
                                            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">Web</span>
                                            <span className="px-3 py-1 bg-teal-500/20 text-teal-400 rounded-full text-xs">E-Commerce</span>
                                        </div>
                                    </div>

                                    <div className="group cursor-pointer">
                                        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl h-60 md:h-72 lg:h-80 mb-3 md:mb-4 overflow-hidden">
                                            <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop"
                                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                                                alt="Project" />
                                        </div>
                                        <h3 className="text-xl md:text-2xl font-bold mb-1 md:mb-2">Data Visualization Tool</h3>
                                        <p className="text-gray-400 mb-2 md:mb-3 text-sm md:text-base">Interactive charts and graphs for business intelligence</p>
                                        <div className="flex gap-2">
                                            <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-full text-xs">Data Viz</span>
                                            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs">Analytics</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                    {/* END PROJECTS PAGE */}

                    {/* BLOG PAGE */}
                    <div id="blog" className={`page-content ${currentPage === 'blog' ? '' : 'page-hidden'}`}>
                        <section className="min-h-screen pt-24 md:pt-28 lg:pt-32 px-4 sm:px-6 pb-16 md:pb-20">
                            <div className="max-w-5xl mx-auto">
                                <h2 className="text-2xl md:text-3xl font-bold mb-2 md:mb-3">Latest Articles</h2>
                                <p className="text-gray-400 mb-8 md:mb-12 text-sm md:text-base">Some of my recent thoughts</p>

                                <div className="space-y-8">
                                    {/* Article 1 */}
                                    <article className="pb-8" style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <p className="text-sm mb-2" style={{ color: 'var(--text-tertiary)' }}>Apr 23, 2025</p>
                                        <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-3" style={{ color: 'var(--text-primary)' }}>From Mockup to Market: My End-to-End Product Design Process</h3>
                                        <p className="mb-3 md:mb-4 text-sm md:text-base" style={{ color: 'var(--text-secondary)' }}>
                                            A detailed breakdown of my iterative design methodology, from initial research to final handoff,
                                            with practical tips for designers at every stage.
                                        </p>
                                        <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">Read Article →</a>
                                    </article>

                                    {/* Article 2 */}
                                    <article className="pb-8" style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <p className="text-sm mb-2" style={{ color: 'var(--text-tertiary)' }}>Mar 15, 2025</p>
                                        <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-3" style={{ color: 'var(--text-primary)' }}>The Psychology of Color in UI Design</h3>
                                        <p className="mb-3 md:mb-4 text-sm md:text-base" style={{ color: 'var(--text-secondary)' }}>
                                            Exploring how strategic color choices can influence user behavior, evoke emotions, and enhance
                                            the overall user experience of digital products.
                                        </p>
                                        <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">Read Article →</a>
                                    </article>

                                    {/* Article 3 */}
                                    <article className="pb-8">
                                        <p className="text-sm text-gray-500 mb-2">Mar 5, 2025</p>
                                        <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-3">How I Built My Design System from Scratch</h3>
                                        <p className="text-gray-400 mb-3 md:mb-4 text-sm md:text-base">
                                            A practical guide to creating your own design system, from initial audit to implementation, and the
                                            lessons learned along the way.
                                        </p>
                                        <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">Read Article →</a>
                                    </article>
                                </div>
                            </div>
                        </section>
                    </div>
                    {/* END BLOG PAGE */}

                    {/* SPEAKING PAGE */}
                    <div id="speaking" className={`page-content ${currentPage === 'speaking' ? '' : 'page-hidden'}`}>
                        <section className="min-h-screen pt-24 md:pt-28 lg:pt-32 px-4 sm:px-6 pb-16 md:pb-20">
                            <div className="max-w-5xl mx-auto">
                                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 md:mb-4" style={{ color: 'var(--text-primary)' }}>Speaking & Workshops</h1>
                                <p className="mb-10 md:mb-16 text-sm md:text-base" style={{ color: 'var(--text-secondary)' }}>Sharing knowledge with the design community</p>

                                <div className="space-y-8">
                                    <div className="rounded-2xl p-4 sm:p-6 md:p-8 transition-all" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="text-xl md:text-2xl font-bold mb-1 md:mb-2" style={{ color: 'var(--text-primary)' }}>Design Systems at Scale</h3>
                                                <p style={{ color: 'var(--text-tertiary)' }}>Config Conference 2024</p>
                                            </div>
                                            <span className="px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-sm">Upcoming</span>
                                        </div>
                                        <p className="mb-3 md:mb-4 text-sm md:text-base" style={{ color: 'var(--text-secondary)' }}>A deep dive into building and maintaining design systems for enterprise applications. Learn strategies for consistency, scalability, and adoption.</p>
                                        <div className="flex items-center gap-4 text-sm text-gray-400">
                                            <span>📍 San Francisco, CA</span>
                                            <span>📅 June 15, 2025</span>
                                        </div>
                                    </div>

                                    <div className="bg-white/5 rounded-2xl p-4 sm:p-6 md:p-8 border border-white/10 hover:bg-white/10 transition-all">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="text-xl md:text-2xl font-bold mb-1 md:mb-2">From Figma to Code Workshop</h3>
                                                <p className="text-gray-400">Design + Dev Summit 2024</p>
                                            </div>
                                            <span className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-full text-sm">Past</span>
                                        </div>
                                        <p className="text-gray-300 mb-3 md:mb-4 text-sm md:text-base">Hands-on workshop covering the complete design-to-development workflow. Participants learned best practices for handoff and collaboration.</p>
                                        <div className="flex items-center gap-4 text-sm text-gray-400">
                                            <span>📍 New York, NY</span>
                                            <span>📅 March 22, 2024</span>
                                            <a href="#" className="text-blue-400 hover:underline">View Recording →</a>
                                        </div>
                                    </div>

                                    <div className="rounded-2xl p-4 sm:p-6 md:p-8 transition-all" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="text-xl md:text-2xl font-bold mb-1 md:mb-2" style={{ color: 'var(--text-primary)' }}>The Art of Micro-interactions</h3>
                                                <p style={{ color: 'var(--text-tertiary)' }}>UX Boston Meetup</p>
                                            </div>
                                            <span className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-full text-sm">Past</span>
                                        </div>
                                        <p className="mb-3 md:mb-4 text-sm md:text-base" style={{ color: 'var(--text-secondary)' }}>Exploring how subtle animations and interactions can dramatically improve user experience and create delightful moments in digital products.</p>
                                        <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--text-tertiary)' }}>
                                            <span>📍 Boston, MA</span>
                                            <span>📅 January 10, 2024</span>
                                            <a href="#" className="text-blue-400 hover:underline">View Slides →</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                    {/* END SPEAKING PAGE */}

                    {/* ABOUT PAGE */}
                    <div id="about" className={`page-content ${currentPage === 'about' ? '' : 'page-hidden'}`}>
                        <section className="min-h-screen pt-24 md:pt-28 lg:pt-32 px-4 sm:px-6 pb-16 md:pb-20">
                            <div className="max-w-5xl mx-auto">
                                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 md:mb-4">About Me</h1>
                                <p className="text-gray-400 mb-10 md:mb-16 text-sm md:text-base">Designer, developer, and lifelong learner</p>

                                <div className="grid md:grid-cols-2 gap-12 mb-20">
                                    <div>
                                        <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">My Story</h2>
                                        <div className="space-y-3 md:space-y-4 text-gray-300 text-sm md:text-base">
                                            <p>I'm a UX/UI designer and front-end developer with over 6 years of experience creating digital experiences that users love. I believe great design is invisible — it just works.</p>
                                            <p>My journey started with a degree in Interactive Design from Boston University, where I discovered my passion for combining aesthetics with functionality. Since then, I've worked with startups and established companies, helping them create products that are both beautiful and usable.</p>
                                            <p>When I'm not pushing pixels or writing code, you'll find me hiking in the White Mountains, experimenting with new coffee brewing methods, or contributing to open-source design systems.</p>
                                        </div>
                                    </div>

                                    <div>
                                        <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">What I Do</h2>
                                        <div className="space-y-4 md:space-y-6">
                                            <div>
                                                <h3 className="text-lg md:text-xl font-semibold mb-1 md:mb-2 text-purple-400">UX Research & Strategy</h3>
                                                <p className="text-gray-400 text-sm md:text-base">User interviews, usability testing, and data-driven insights to inform design decisions</p>
                                            </div>
                                            <div>
                                                <h3 className="text-lg md:text-xl font-semibold mb-1 md:mb-2 text-blue-400">UI Design</h3>
                                                <p className="text-gray-400 text-sm md:text-base">Creating beautiful, accessible interfaces that delight users and drive engagement</p>
                                            </div>
                                            <div>
                                                <h3 className="text-lg md:text-xl font-semibold mb-1 md:mb-2 text-green-400">Design Systems</h3>
                                                <p className="text-gray-400 text-sm md:text-base">Building scalable component libraries and guidelines for consistent experiences</p>
                                            </div>
                                            <div>
                                                <h3 className="text-lg md:text-xl font-semibold mb-1 md:mb-2 text-pink-400">Front-end Development</h3>
                                                <p className="text-gray-400 text-sm md:text-base">Bringing designs to life with React, Vue, and modern CSS frameworks</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Work Experience</h2>
                                    <div className="space-y-6 md:space-y-8">
                                        <div className="flex gap-4 md:gap-8 items-start">
                                            <div className="min-w-[100px] md:min-w-[140px]">
                                                <p className="text-gray-500 text-sm md:text-base">2023 - Present</p>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-lg md:text-xl font-bold mb-1 md:mb-2">Brand Designer at <span className="text-blue-400">Nuxt 🔵</span></h3>
                                                <p className="text-gray-400 text-sm md:text-base">Leading brand design initiatives, creating visual identities, and maintaining design consistency across all touchpoints.</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-4 md:gap-8 items-start">
                                            <div className="min-w-[100px] md:min-w-[140px]">
                                                <p className="text-gray-500 text-sm md:text-base">2022 - 2023</p>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-lg md:text-xl font-bold mb-1 md:mb-2">Assets Designer at <span className="text-red-400">Raycast 🔴</span></h3>
                                                <p className="text-gray-400 text-sm md:text-base">Designed icons, illustrations, and UI assets for a productivity tool used by thousands of developers worldwide.</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-4 md:gap-8 items-start">
                                            <div className="min-w-[100px] md:min-w-[140px]">
                                                <p className="text-gray-500 text-sm md:text-base">2020 - 2022</p>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-lg md:text-xl font-bold mb-1 md:mb-2">Senior UX/UI Designer at <span className="text-blue-300">Linear 🔵</span></h3>
                                                <p className="text-gray-400 text-sm md:text-base">Crafted intuitive interfaces for project management software, focusing on speed and user efficiency.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* FAQ Section */}
                        <section className="py-20 px-6 mt-[2rem] transition-colors">
                            <div className="max-w-4xl mx-auto">
                                <h2 className="text-2xl md:text-3xl font-bold mb-2 md:mb-3 text-center" style={{ color: 'var(--text-primary)' }}>Frequently Asked Questions</h2>
                                <p className="mb-8 md:mb-12 text-center text-sm md:text-base" style={{ color: 'var(--text-secondary)' }}>Answers to common questions about my process and services</p>

                                {/* Accordion */}
                                <div className="space-y-4">
                                    <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--border-color)' }}>
                                        <button className="accordion-button w-full px-4 md:px-6 py-3 md:py-4 flex justify-between items-center transition-colors" 
                                                onClick={() => toggleAccordion(0)} 
                                                style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}>
                                            <span className="font-medium text-left text-sm md:text-base">What services do you offer?</span>
                                            <svg className="w-5 h-5 transition-transform" id="icon-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                            </svg>
                                        </button>
                                        <div className="accordion-content px-4 md:px-6 pb-3 md:pb-4" id="content-0">
                                            <p className="pt-3 md:pt-4 text-sm md:text-base" style={{ color: 'var(--text-secondary)' }}>I offer comprehensive UX/UI design services including user research, wireframing, prototyping, visual design, and front-end development. I specialize in creating design systems and can work on projects from conception to implementation.</p>
                                        </div>
                                    </div>

                                    <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--border-color)' }}>
                                        <button className="accordion-button w-full px-4 md:px-6 py-3 md:py-4 flex justify-between items-center transition-colors" 
                                                onClick={() => toggleAccordion(1)}
                                                style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}>
                                            <span className="font-medium text-left text-sm md:text-base">What is your design process like?</span>
                                            <svg className="w-5 h-5 transition-transform" id="icon-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                            </svg>
                                        </button>
                                        <div className="accordion-content px-4 md:px-6 pb-3 md:pb-4" id="content-1">
                                            <p className="pt-3 md:pt-4 text-sm md:text-base" style={{ color: 'var(--text-secondary)' }}>My process follows a user-centered approach: Research & Discovery → Wireframing → Visual Design → Prototyping → Testing → Implementation. I believe in iterative design and maintain close collaboration with clients throughout each phase.</p>
                                        </div>
                                    </div>

                                    <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--border-color)' }}>
                                        <button className="accordion-button w-full px-4 md:px-6 py-3 md:py-4 flex justify-between items-center transition-colors" 
                                                onClick={() => toggleAccordion(2)}
                                                style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}>
                                            <span className="font-medium text-left text-sm md:text-base">Do you work with startups?</span>
                                            <svg className="w-5 h-5 transition-transform" id="icon-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                            </svg>
                                        </button>
                                        <div className="accordion-content px-4 md:px-6 pb-3 md:pb-4" id="content-2">
                                            <p className="pt-3 md:pt-4 text-sm md:text-base" style={{ color: 'var(--text-secondary)' }}>Absolutely! I love working with startups and have extensive experience helping early-stage companies establish their design foundations. I offer flexible engagement models tailored to startup needs and budgets.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                    {/* END ABOUT PAGE */}
                </main>

                {/* Footer */}
                <footer className="mt-auto py-8 md:py-12 px-4 md:px-6 border-t transition-all" style={{ borderColor: 'var(--border-color)' }}>
                    <div className="max-w-5xl mx-auto">
                        <div className="flex justify-between items-center">
                            <p className="text-sm md:text-base" style={{ color: 'var(--text-tertiary)' }}>Built with Nuxt UI © 2025</p>
                            <div className="flex gap-3 md:gap-4">
                                <a href="#" className="transition-colors hover:text-current" style={{ color: 'var(--text-tertiary)' }}>
                                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                    </svg>
                                </a>
                                <a href="#" className="transition-colors hover:text-current" style={{ color: 'var(--text-tertiary)' }}>
                                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                    </svg>
                                </a>
                                <a href="#" className="transition-colors hover:text-current" style={{ color: 'var(--text-tertiary)' }}>
                                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </footer>
            </body>
        </>
    );
}
