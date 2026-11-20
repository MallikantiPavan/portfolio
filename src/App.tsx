import { lazy, Suspense, useEffect, useState } from 'react'
import type { FormEvent, MouseEvent } from 'react'
import { ArrowDown, ArrowUpRight, Download, Mail, Menu, MoveUpRight, X } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { motion } from 'motion/react'
import * as SimpleIcons from 'simple-icons'
import { education, experience, profile, projects, skillGroups } from './data'
import './App.css'

gsap.registerPlugin(ScrollTrigger)
const ChromeSculpture = lazy(() => import('./components/ChromeSculpture'))

const iconMap: Record<string, { title: string; hex: string; path: string } | undefined> = {
  Python: SimpleIcons.siPython,
  PyTorch: SimpleIcons.siPytorch,
  TensorFlow: SimpleIcons.siTensorflow,
  OpenCV: SimpleIcons.siOpencv,
  NumPy: SimpleIcons.siNumpy,
  Pandas: SimpleIcons.siPandas,
  Git: SimpleIcons.siGit,
  Docker: SimpleIcons.siDocker,
  FastAPI: SimpleIcons.siFastapi,
  Streamlit: SimpleIcons.siStreamlit,
  LangChain: SimpleIcons.siLangchain,
  Linux: SimpleIcons.siLinux,
  SQL: SimpleIcons.siMysql,
  SQLite: SimpleIcons.siSqlite,
}

function TechnologyMark({ name }: { name: string }) {
  const icon = iconMap[name]
  if (!icon) {
    return <span className="technology-monogram" aria-hidden="true">{name.slice(0, 2).toUpperCase()}</span>
  }
  return (
    <svg className="technology-icon" viewBox="0 0 24 24" role="img" aria-label={icon.title}>
      <path d={icon.path} fill={`#${icon.hex}`} />
    </svg>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [formStatus, setFormStatus] = useState('')
  const [activeSkill, setActiveSkill] = useState(skillGroups[1].title)
  const [activeProject, setActiveProject] = useState(0)
  const [environmentReady, setEnvironmentReady] = useState(false)
  const [environmentVisible, setEnvironmentVisible] = useState(true)

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const lenis = new Lenis({
      duration: reducedMotion ? 0 : 1.15,
      smoothWheel: true,
      wheelMultiplier: 0.9,
    })
    let frameId = 0
    const raf = (time: number) => {
      lenis.raf(time)
      frameId = requestAnimationFrame(raf)
    }
    frameId = requestAnimationFrame(raf)
    lenis.on('scroll', ScrollTrigger.update)

    const magneticButtons = document.querySelectorAll<HTMLElement>('.magnetic')
    const magneticListeners: Array<() => void> = []
    magneticButtons.forEach((button) => {
      const move = (event: PointerEvent) => {
        if (reducedMotion) return
        const rect = button.getBoundingClientRect()
        const x = event.clientX - rect.left - rect.width / 2
        const y = event.clientY - rect.top - rect.height / 2
        gsap.to(button, { x: x * 0.16, y: y * 0.16, duration: 0.35, ease: 'power2.out' })
      }
      const reset = () => gsap.to(button, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.3)' })
      button.addEventListener('pointermove', move)
      button.addEventListener('pointerleave', reset)
      magneticListeners.push(() => {
        button.removeEventListener('pointermove', move)
        button.removeEventListener('pointerleave', reset)
      })
    })

    gsap.utils.toArray<HTMLElement>('.cinematic-reveal').forEach((element) => {
      gsap.fromTo(
        element,
        { y: 48, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: reducedMotion ? 0 : 1.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: element, start: 'top 86%', once: true },
        },
      )
    })

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveSection(entry.target.id)
      }),
      { rootMargin: '-35% 0px -55%', threshold: 0 },
    )
    document.querySelectorAll('main section[id]').forEach((section) => observer.observe(section))

    const heroObserver = new IntersectionObserver(
      ([entry]) => setEnvironmentVisible(entry.isIntersecting),
      { rootMargin: '100px', threshold: 0 },
    )
    const hero = document.querySelector('#home')
    if (hero) heroObserver.observe(hero)

    const revealObserver = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible')
      }),
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )
    document.querySelectorAll('.reveal:not(.project-card)').forEach((element) => revealObserver.observe(element))

    const pointer = document.querySelector('.cursor-orb') as HTMLElement | null
    const onPointerMove = (event: PointerEvent) => {
      if (pointer) {
        pointer.style.transform = `translate3d(${event.clientX - 10}px, ${event.clientY - 10}px, 0)`
      }
      document.documentElement.style.setProperty('--pointer-x', `${event.clientX}px`)
      document.documentElement.style.setProperty('--pointer-y', `${event.clientY}px`)
    }
    window.addEventListener('pointermove', onPointerMove)

    return () => {
      observer.disconnect()
      revealObserver.disconnect()
      heroObserver.disconnect()
      window.removeEventListener('pointermove', onPointerMove)
      magneticListeners.forEach((remove) => remove())
      cancelAnimationFrame(frameId)
      lenis.destroy()
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  const closeMenu = () => setMenuOpen(false)

  useEffect(() => {
    if (!menuOpen) return

    const handleOutsidePointer = (event: PointerEvent) => {
      const target = event.target
      if (!(target instanceof Element)) return
      if (target.closest('.navbar')) return
      setMenuOpen(false)
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    document.addEventListener('pointerdown', handleOutsidePointer)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('pointerdown', handleOutsidePointer)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [menuOpen])

  const handleSectionNavigation = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault()
    closeMenu()
    document.getElementById(id)?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start',
    })
    window.history.replaceState(null, '', `#${id}`)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    if (!form.checkValidity()) {
      setFormStatus('Please complete all fields with valid information.')
      form.reportValidity()
      return
    }
    const data = new FormData(form)
    const subject = encodeURIComponent(String(data.get('subject')))
    const body = encodeURIComponent(`Name: ${data.get('name')}\nEmail: ${data.get('email')}\n\n${data.get('message')}`)
    setFormStatus('Opening your email app. Send the draft to complete your message.')
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`
  }

  const navItems = [
    ['home', 'Home'], ['about', 'About'], ['skills', 'Skills'],
    ['experience', 'Experience'], ['projects', 'Projects'], ['contact', 'Contact'],
  ]

  return (
    <>
      <div className="cursor-orb" aria-hidden="true" />
      <header className="navbar">
        <div className="nav-inner">
          <a className="brand" href="#home" aria-label="Go to home" onClick={closeMenu}>MP<span>.</span></a>
          <nav className={menuOpen ? 'nav-links open' : 'nav-links'} aria-label="Primary navigation">
            {navItems.map(([id, label]) => (
              <a key={id} href={`#${id}`} className={activeSection === id ? 'active' : ''} onClick={(event) => handleSectionNavigation(event, id)}>{label}</a>
            ))}
          </nav>
          <a className="nav-cta" href="#contact">Let's Talk <ArrowUpRight size={16} /></a>
          <button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={() => setMenuOpen((open) => !open)}>
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <main>
        <section className="hero-section" id="home">
          <div className={environmentReady ? 'hero-environment is-ready' : 'hero-environment'} aria-hidden="true">
            <div className="environment-fallback" />
            <Suspense fallback={null}>
              <ChromeSculpture onReady={() => setEnvironmentReady(true)} visible={environmentVisible} />
            </Suspense>
          </div>
          <div className="hero-grid container">
            <div className="hero-copy reveal">
              <p className="eyebrow"><span /> Available for opportunities <b>2026</b></p>
              <motion.h1
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.1, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="name-word first-name">
                  {[...profile.firstName].map((letter, index) => (
                    <motion.span
                      key={`${letter}-${index}`}
                      className="name-letter"
                      initial={{ y: '115%', opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.78, delay: 0.12 + index * 0.045, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {letter}
                    </motion.span>
                  ))}
                </span>{' '}
                <span className="name-word rest-name">
                  {[...profile.restName].map((letter, index) => (
                    <motion.span
                      key={`${letter}-${index}`}
                      className="name-letter"
                      initial={{ y: '115%', opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.78, delay: 0.38 + index * 0.055, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {letter}
                    </motion.span>
                  ))}
                </span>
              </motion.h1>
              <p className="role"><span className="role-prefix">/</span> {profile.title}<span className="role-caret">_</span></p>
              <p className="hero-summary">{profile.summary}</p>
              <div className="hero-actions">
                <a className="button button-primary magnetic" href="#projects" onClick={(event) => handleSectionNavigation(event, 'projects')}>Explore My Work <ArrowDown size={18} /></a>
                <a className="button button-secondary" href={profile.resume} download>Download Resume <Download size={17} /></a>
              </div>
              <div className="social-row" aria-label="Social links">
                <a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub"><span>GitHub</span></a>
                <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><span>LinkedIn</span></a>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="section">
          <div className="container">
            <div className="section-heading reveal cinematic-reveal"><p className="section-index">01 / ABOUT</p><h2>Building intelligence into <span>real-world systems.</span></h2></div>
            <div className="about-grid reveal cinematic-reveal">
              <p className="about-lead">I am an AI/ML engineer and research-minded developer focused on deep learning, computer vision, and reproducible experimentation.</p>
              <div className="about-copy">
                <p>My work spans structural MRI analysis, graph transformers, UAV detection, medical image classification, and retrieval-augmented AI systems. I enjoy turning research ideas into carefully evaluated, end-to-end applications.</p>
                <p>Currently, I am building on my foundations through a final-year exchange at IIT Madras, with an ongoing interest in explainable, efficient, and domain-aware machine learning.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="skills" className="section section-bordered">
          <div className="container">
            <div className="skills-intro reveal cinematic-reveal">
              <p className="section-index">02 / WHAT I WORK WITH</p>
              <div>
                <h2>My Technical <span>Arsenal.</span></h2>
                <p>The technologies and tools I use to turn ideas into functional digital experiences.</p>
              </div>
            </div>
            <div className="arsenal reveal cinematic-reveal">
              <aside className="arsenal-index" aria-label="Skill categories">
                {skillGroups.map((group) => (
                  <button
                    type="button"
                    key={group.title}
                    className={activeSkill === group.title ? 'arsenal-category active' : 'arsenal-category'}
                    onClick={() => setActiveSkill(group.title)}
                    aria-pressed={activeSkill === group.title}
                  >
                    <span>{group.index}</span>
                    <strong>{group.shortTitle}</strong>
                    <MoveUpRight size={16} />
                  </button>
                ))}
              </aside>

              <motion.div
                className="arsenal-feature"
                key={activeSkill}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="feature-meta">
                  <span>SELECTED FIELD</span>
                  <span>{skillGroups.find((group) => group.title === activeSkill)?.index} / 05</span>
                </div>
                <div className="feature-core">
                  <div className="feature-mark" aria-hidden="true">
                    <span>{activeSkill.slice(0, 2).toUpperCase()}</span>
                    <i />
                  </div>
                  <div>
                    <p>CATEGORY</p>
                    <h3>{activeSkill}</h3>
                  </div>
                </div>
                <div className="technology-grid">
                  {skillGroups.find((group) => group.title === activeSkill)?.skills.map((skill) => (
                    <motion.div
                      className="technology-item"
                      key={skill}
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.18 }}
                    >
                      <TechnologyMark name={skill} />
                      <span>{skill}</span>
                      <i />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="experience" className="section">
          <div className="container">
            <div className="section-heading reveal cinematic-reveal"><p className="section-index">03 / EXPERIENCE</p><h2>Research <span>experience.</span></h2></div>
            <div className="timeline">
              {experience.map((item) => (
                <article className="timeline-item reveal cinematic-reveal" key={item.role}>
                  <div className="timeline-meta"><p>{item.period}</p><span>{item.location}</span></div>
                  <div className="timeline-content">
                    <h3>{item.role}</h3><p className="company">{item.company}</p>
                    <ul>{item.points.map((point) => <li key={point}>{point}</li>)}</ul>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="projects" className="section section-bordered">
          <div className="container">
            <div className="projects-intro reveal cinematic-reveal">
              <p className="section-index">03 / SELECTED WORK</p>
              <div>
                <h2>Things I've <span>Built.</span></h2>
                <p>A selection of projects, experiments, and digital experiences built through code and creative problem-solving.</p>
              </div>
            </div>
            <div className="project-gallery">
              {projects.map((project, projectIndex) => (
                <motion.article
                  className={`project-study project-${projectIndex + 1}${activeProject === projectIndex ? ' active' : ''}`}
                  key={project.title}
                  onMouseEnter={() => setActiveProject(projectIndex)}
                  initial={{ opacity: 0, y: 34 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.12 }}
                  transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="project-story">
                    <div className="story-index" aria-hidden="true">{project.number}</div>
                    <div className="story-rail">
                      <span>{project.category}</span>
                      <span>PROJECT / {project.number}</span>
                    </div>
                    <div className="story-main">
                      <h3>{project.title}</h3>
                      <p className="story-subtitle">{project.subtitle}</p>
                      <p className="story-description">{project.description}</p>
                      <div className="story-features">
                        {project.features.slice(0, 3).map((feature) => <span key={feature}>{feature}</span>)}
                      </div>
                      <div className="story-tech">
                        {project.tech.map((tech) => <span key={tech}>{tech}</span>)}
                      </div>
                      <a
                        className="project-status project-link"
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`View ${project.title} source code on GitHub`}
                      >
                        <i />View on GitHub <ArrowUpRight size={14} />
                      </a>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section id="education" className="section">
          <div className="container education-grid">
            <div>
              <div className="section-heading reveal"><p className="section-index">05 / EDUCATION</p><h2>Academic <span>background.</span></h2></div>
              <div className="education-list">
                {education.map((item) => (
                  <article className="education-card reveal" key={item.institution}>
                    <p className="education-period">{item.period}</p><h3>{item.institution}</h3><p>{item.degree}</p>
                    {item.detail && <p className="education-detail">{item.detail}</p>}<span>{item.location}</span>
                  </article>
                ))}
              </div>
            </div>
            <aside className="publication-card reveal">
              <p className="section-index">PUBLICATION & ACHIEVEMENT</p><span className="publication-year">2026</span>
              <h3>CA-YOLONet: Enhanced System for Drone Detection in Adverse Weather</h3>
              <p>M. Pavan et al. — ICICV Conference</p><p className="publication-role">First author</p>
              <div className="achievement"><span>✓</span>Selected for the Final-Year Exchange Program at IIT Madras</div>
            </aside>
          </div>
        </section>

        <section id="contact" className="contact-section">
          <div className="container contact-grid">
            <div className="contact-copy reveal">
              <p className="section-index">06 / CONTACT</p><h2>Let's build something <span>meaningful.</span></h2>
              <p>Interested in machine learning research, an AI product, or a collaboration? Reach out and let’s start a conversation.</p>
              <a className="contact-link" href={`mailto:${profile.email}`}><Mail size={18} /> {profile.email}</a>
              <div className="contact-social">
                <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
                <a href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
              </div>
            </div>
            <form className="contact-form reveal" onSubmit={handleSubmit} noValidate>
              <div className="form-row">
                <label>Name<input name="name" type="text" placeholder="Your name" required /></label>
                <label>Email<input name="email" type="email" placeholder="you@example.com" required /></label>
              </div>
              <label>Subject<input name="subject" type="text" placeholder="What would you like to discuss?" required /></label>
              <label>Message<textarea name="message" rows={5} placeholder="Tell me about your project or opportunity..." required /></label>
              <button className="button button-primary" type="submit">Send Message <ArrowUpRight size={18} /></button>
              {formStatus && <p className="form-status" role="status">{formStatus}</p>}
              <p className="form-note">This form opens your email app; no backend data is collected.</p>
            </form>
          </div>
        </section>
      </main>

      <footer><div className="container footer-inner">
        <a className="brand" href="#home" aria-label="Go to top">MP<span>.</span></a>
        <p>© 2026 Mallikanti Pavan</p>
        <a className="back-to-top" href="#home" aria-label="Back to top">Back to top <ArrowUpRight size={16} /></a>
      </div></footer>
    </>
  )
}

export default App
