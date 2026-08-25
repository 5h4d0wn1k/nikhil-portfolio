import { useEffect, useState, createContext, useContext } from 'react';
import Experience from './experience';
import { projects as staticProjects } from './data/projects';
import { workExperience as staticExperience } from './data/experience';
import config from './site.config';
import './archive.css';

const ArchiveContext = createContext({ projects: staticProjects, experience: staticExperience });

function ArchiveDataProvider({ children }) {
  const [projects, setProjects] = useState(staticProjects);
  const [experience, setExperience] = useState(staticExperience);

  useEffect(() => {
    let cancelled = false;
    if (typeof fetch === 'undefined') return;
    Promise.all([
      fetch('/api/projects').then(r => r.ok ? r.json() : null).catch(() => null),
      fetch('/api/experience').then(r => r.ok ? r.json() : null).catch(() => null),
    ]).then(([proj, exp]) => {
      if (!cancelled) {
        if (proj && proj.length > 0) setProjects(proj);
        if (exp && exp.length > 0) setExperience(exp);
      }
    }).catch(() => {});
    return () => { cancelled = true; };
  }, []);

  return <ArchiveContext.Provider value={{ projects, experience }}>{children}</ArchiveContext.Provider>;
}

const navItems = config.nav;
const footer = config.footer;

function GlobalNav(){
  const [open,setOpen]=useState(false);
  const [palette,setPalette]=useState(false);
  const [query,setQuery]=useState('');
  useEffect(()=>{
    const f=e=>{
      if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();setPalette(x=>!x)}
      if(e.key==='Escape'){setPalette(false);setOpen(false)}
    };
    addEventListener('keydown',f);
    return()=>removeEventListener('keydown',f)
  },[]);
  const visible=navItems.filter(x=>x.label.toLowerCase().includes(query.toLowerCase()));
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="global-nav">
      <a href="/" className="g-brand">CYN<span>I</span>K<span className="g-divider">/</span><small>OPERATOR</small></a>
      <div className="g-status"><i/> SYSTEM ONLINE</div>
      <button className="g-command" onClick={()=>setPalette(true)}>⌘ K <span>COMMAND</span></button>
      <button className="g-menu" onClick={()=>setOpen(!open)}>{open?'CLOSE':'MENU'} <b>{open?'×':'+'}</b></button>
    </header>
    {open&&<nav className="overlay-nav">{navItems.map((item,i)=><a href={item.href} key={item.href}><span>0{i+1}</span>{item.label}<b>↗</b></a>)}</nav>}
    {palette&&<div className="palette-back" onClick={()=>setPalette(false)}><div className="palette" onClick={e=>e.stopPropagation()}><div><span>COMMAND NAVIGATION</span><button onClick={()=>setPalette(false)}>ESC</button></div><input autoFocus placeholder="Find a destination…" value={query} onChange={e=>setQuery(e.target.value)}/>{visible.map((item,i)=><a href={item.href} key={item.href}><small>0{i+1}</small>{item.label}<b>↗</b></a>)}</div></div>}
  </>
}

function Archive(){
  const { projects } = useContext(ArchiveContext);
  const [filter,setFilter]=useState('All');
  const [query,setQuery]=useState('');
  const categories=['All',...new Set(projects.map(x=>x.category))];
  const filtered=projects.filter(x=>(filter==='All'||x.category===filter)&&`${x.name} ${x.description||''} ${x.category}`.toLowerCase().includes(query.toLowerCase()));
  return <>
    <main id="main" className="archive">
      <section className="archive-hero">
        <p>PROJECT INTELLIGENCE / {projects.length} PUBLIC BUILDS</p>
        <h1>The public<br/><em>build archive.</em></h1>
        <div>
          <span>Not every repository is a case study. This is the wider trail: security tools, AI experiments, Linux utilities, product systems, and learning in public.</span>
          <a href={`https://github.com/${config.github}`} target="_blank" rel="noreferrer">OPEN GITHUB ↗</a>
        </div>
      </section>
      <section className="archive-controls">
        <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search builds, technologies, research…"/>
        <div>{categories.map(c=><button className={filter===c?'active':''} onClick={()=>setFilter(c)} key={c}>{c}</button>)}</div>
      </section>
      <section className="archive-grid">
        {filtered.map((p,i)=>(
          <a className="archive-card" href={`https://github.com/${config.github}/${p.slug}`} target="_blank" rel="noreferrer" key={p.slug}>
            <div>
              <span>{String(i+1).padStart(2,'0')}</span>
              <em>{p.category}</em>
              <b>↗</b>
            </div>
            <h2>{p.name}</h2>
            <p>{p.summary||p.description}</p>
            <footer>
              <span>{(p.tech||[])[0]||'Various'}</span>
              <span>GITHUB</span>
            </footer>
          </a>
        ))}
      </section>
      {filtered.length===0&&<p className="no-results">No matching public project. Try another signal.</p>}
    </main>
    <footer className="footer">
      <p>{footer.tagline}</p>
      <div>
        <span>{footer.copyright}</span>
        <a href={`https://github.com/${config.github}`} target="_blank" rel="noreferrer">GITHUB ↗</a>
        <a href={`https://www.linkedin.com/in/${config.linkedin}/`} target="_blank" rel="noreferrer">LINKEDIN ↗</a>
      </div>
    </footer>
  </>
}

function Profile(){
  const { projects, experience: workExperience } = useContext(ArchiveContext);
  return <>
    <main id="main" className="profile-plus">
      <section className="profile-hero">
        <p>PROFILE / EXPERIENCE / CAPABILITIES</p>
        <h1>One operator.<br/><em>Many systems.</em></h1>
        <span>{config.bio}</span>
      </section>
      <section className="role-timeline">
        <div>
          <p>EXPERIENCE MAP</p>
          <h2>Work with<br/><em>real weight.</em></h2>
        </div>
        <div>
          {workExperience.map(r=>(
            <article key={r.slug}>
              <span>{r.period}</span>
              <h3>{r.role}</h3>
              <h4>{r.company}</h4>
              <p>{r.summary}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="delivery-map">
        <p>PRODUCT + DELIVERY SURFACES</p>
        <h2>From a security lab<br/>to a <em>shipped system.</em></h2>
        <div>
          {projects.filter(p=>['PRIVATE/SHIPPED','SAAS/PRIVATE'].includes(p.status)||['PRIVATE/SHIPPED','SAAS/PRIVATE'].includes(p.status)).map((p,i)=>(
            <article key={p.slug}>
              <span>{String(i+1).padStart(2,'0')}</span>
              <h3>{p.name}</h3>
              <b>{p.category}</b>
              <p>{p.summary}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="cred-plus">
        <article>
          <span>EDUCATION</span>
          <h3>B.Tech CSE — Cybersecurity</h3>
          <p>VIT University · 2021–2025 · CGPA 8.33/10</p>
        </article>
        <article>
          <span>CREDENTIALS</span>
          <h3>Security practice</h3>
          <p>CEH · CNSP · PEH · IELTS 7.5 C1</p>
        </article>
        <article>
          <span>RESEARCH + HIGHLIGHTS</span>
          <h3>Builder in public</h3>
          <p>TryHackMe Top 25% · CyVIT CTF rank 36 · co-inventor, filed patent</p>
        </article>
      </section>
    </main>
    <footer className="footer">
      <p>{footer.tagline}</p>
      <div>
        <span>{footer.copyright}</span>
        <a href={`https://github.com/${config.github}`} target="_blank" rel="noreferrer">GITHUB ↗</a>
        <a href={`https://www.linkedin.com/in/${config.linkedin}/`} target="_blank" rel="noreferrer">LINKEDIN ↗</a>
      </div>
    </footer>
  </>
}

export default function PortfolioRouter(){
  const p=location.pathname.replace(/\/$/,'');
  const useGlobalNav=p==='/projects'||p.startsWith('/projects/')||p==='/about';
  const isArchive=p==='/projects';
  return <>
    {useGlobalNav&&<GlobalNav/>}
    <ArchiveDataProvider>
      {isArchive?<Archive/>:p==='/about'?<Profile/>:<Experience/>}
    </ArchiveDataProvider>
  </>
}
