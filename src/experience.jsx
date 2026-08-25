import { useEffect, useState, createContext, useContext } from 'react';
import { posts } from './content';
import { projects as staticProjects } from './data/projects';
import { workExperience as staticExperience } from './data/experience';
import * as staticProfile from './data/profile';
import staticConfig from './site.config';
import './experience.css';

const notes = posts.map(p=>({slug:p.id,type:p.type,date:p.date,title:p.title,deck:p.dek,body:p.body}));

const DataContext = createContext({ 
  projects: staticProjects, 
  experience: staticExperience, 
  config: staticConfig,
  profile: staticProfile,
  loading: false 
});

function DataProvider({ children }) {
  const [projects, setProjects] = useState(staticProjects);
  const [experience, setExperience] = useState(staticExperience);
  const [config, setConfig] = useState(staticConfig);
  const [profile, setProfile] = useState(staticProfile);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    if (typeof fetch === 'undefined') { setLoading(false); return; }
    Promise.all([
      fetch('/api/projects').then(r => r.ok ? r.json() : null).catch(() => null),
      fetch('/api/experience').then(r => r.ok ? r.json() : null).catch(() => null),
      fetch('/api/config').then(r => r.ok ? r.json() : null).catch(() => null),
    ]).then(([proj, exp, cfg]) => {
      if (!cancelled) {
        if (proj && proj.length > 0) setProjects(proj);
        if (exp && exp.length > 0) setExperience(exp);
        if (cfg) {
          if (cfg.site) setConfig(prev => ({ ...prev, ...cfg.site }));
          if (cfg.skills) setProfile(prev => ({ ...prev, skills: cfg.skills }));
          if (cfg.bio) setProfile(prev => ({ ...prev, bio: cfg.bio }));
          if (cfg.credentials) setProfile(prev => ({ ...prev, aboutCredentials: cfg.credentials }));
          if (cfg.certifications) setProfile(prev => ({ ...prev, certifications: cfg.certifications }));
          if (cfg.recognition) setProfile(prev => ({ ...prev, recognition: cfg.recognition }));
          if (cfg.publications) setProfile(prev => ({ ...prev, publications: cfg.publications }));
          if (cfg.education) setProfile(prev => ({ ...prev, education: cfg.education }));
          if (cfg.nowItems) setProfile(prev => ({ ...prev, nowItems: cfg.nowItems }));
        }
        setLoading(false);
      }
    }).catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return <DataContext.Provider value={{ projects, experience, config, profile, loading }}>{children}</DataContext.Provider>;
}

function Nav(){const {config}=useContext(DataContext);const [open,setOpen]=useState(false);return <><a className="skip-link" href="#main">Skip to content</a><header className="topbar"><a className="wordmark" href="/">CYN<span>I</span>K <small>OPERATOR</small></a><nav className={open?'open':''}>{config.nav.map(item=><a href={item.href} key={item.href}>{item.label}</a>)}</nav><a className="talk" href="/contact">Start a signal <b>↗</b></a><button className="nav-toggle" onClick={()=>setOpen(!open)} aria-label="Menu">{open?'×':'≡'}</button></header></>}
function Signal(){return <div className="signal" aria-hidden="true"><i/><i/><i/><i/><i/></div>}
function Frame({eyebrow,title,children,aside}){return <><Nav/><main id="main" className="page"><section className="page-intro"><p className="kicker">{eyebrow}</p><h1>{title}</h1>{aside&&<p className="intro-aside">{aside}</p>}</section>{children}</main><Footer/></>}
function Footer(){const {config}=useContext(DataContext);return <footer className="footer"><p>{config.footer.tagline}</p><div><span>{config.footer.copyright}</span><a href={`https://github.com/${config.github}`} target="_blank" rel="noreferrer">GITHUB ↗</a><a href={`https://www.linkedin.com/in/${config.linkedin}/`} target="_blank" rel="noreferrer">LINKEDIN ↗</a></div></footer>}

function ProjectArt({p,slug}){return <div className={'project-art '+(p.color||'acid')}><div className="art-top"><span>SYS / {p.number||slug}</span><b>{p.status}</b></div><div className="circuit"><i/><i/><i/><i/><i/></div><div className="readout">{(p.tech||p.tags||[]).join(' · ')}</div></div>}

function Home(){const {projects,config,profile}=useContext(DataContext);const {skills}=profile;return <><Nav/><main id="main"><section className="home-hero"><div className="field"/><p className="kicker">{config.name.toUpperCase()} / SYSTEMS OPERATOR</p><p className="hero-side">{config.tagline}</p><div className="name"><span>{config.name.split(' ')[0].toUpperCase().split('').map((c,i)=>i===1?<span key={i}>{c}</span>:c).join('')}</span><strong>{(config.name.split(' ')[1]||'').toUpperCase()}</strong></div><div className="hero-foot"><div><Signal/><small>OPERATING ACROSS AI SYSTEMS,<br/>SECURITY, NETWORKS & PRODUCTS</small></div><a className="orb" href="/projects">ENTER<br/>THE WORK <b>↓</b></a><p>Building things the human<br/>timeline remembers.</p></div></section><section className="manifesto"><p>AMBITION BECOMES REAL<br/>WHEN THE <em>SYSTEM HOLDS.</em></p><div>{config.stats.map(s=><span key={s.label}><b>{s.value}</b> {s.label}</span>)}</div></section><section className="home-work"><div className="section-label"><p className="kicker">01 / SELECTED SYSTEMS</p><h2>Proof,<br/><em>not posturing.</em></h2><p>I work across the whole shape of a system: the interface, the data, the infrastructure, the threat model, and the release.</p></div><div className="project-grid">{projects.slice(0,6).map(p=><a className="project-card" href={'/projects/'+p.slug} key={p.slug}><ProjectArt p={p} slug={p.slug}/><div className="project-info"><p>{p.category}</p><h3>{p.name}</h3><span>VIEW DETAILS <b>↗</b></span></div></a>)}</div><a className="line-cta" href="/projects">VIEW ALL PROJECTS <b>→</b></a></section><section className="axis"><p className="kicker">02 / OPERATOR AXIS</p><h2>See the whole<br/><em>system.</em></h2><div className="skill-list">{skills.map((s,i)=><div key={s}><span>0{i+1}</span><strong>{s}</strong><b>↗</b></div>)}</div></section><section className="home-journal"><div><p className="kicker">03 / SIGNAL JOURNAL</p><h2>Notes from the<br/><em>edge of the build.</em></h2></div><div>{notes.slice(0,3).map(n=><a className="note-preview" href={'/journal/'+n.slug} key={n.slug}><p>{n.date} / {n.type}</p><h3>{n.title}</h3><span>{n.deck}</span><b>↗</b></a>)}</div></section></main><Footer/></>}

function Projects(){const {projects}=useContext(DataContext);return <Frame eyebrow="01 / PROJECTS" title={<>All<br/><em>projects.</em></>} aside="Every system I've built or contributed to — open source, private, and production."><section className="work-index">{projects.map(p=><article key={p.slug} className="case-row"><ProjectArt p={p} slug={p.slug}/><div><p className="kicker">{p.category}</p><h2>{p.name}</h2><p>{p.summary}</p><div className="tagrow">{(p.tech||[]).map(x=><span key={x}>{x}</span>)}</div></div><div className="proof-list">{(p.proof||[]).map(x=><span key={x}>+ {x}</span>)}</div><a href={'/projects/'+p.slug}>DETAILS <b>↗</b></a></article>)}</section></Frame>}

function ProjectDetail({slug}){const {projects}=useContext(DataContext);const p=projects.find(x=>x.slug===slug);
  if(!p) return <Frame eyebrow="NOT FOUND" title={<>Project<br/><em>not found.</em></>} aside="This project doesn't exist."><section className="case-hero"><div><p>No project found with slug "{slug}".</p><a className="line-cta" href="/projects">BACK TO PROJECTS <b>→</b></a></div></section></Frame>;
  const highlights=p.highlights||[];const links=p.links||[];const proof=p.proof||[];
  return <Frame eyebrow={`PROJECT / ${p.category}`} title={<>{p.name}<span className="accent-dot">.</span></>} aside={p.summary}><section className="case-hero"><ProjectArt p={p} slug={p.slug}/><div><p className="kicker">{p.category} · {p.status}</p><h2>{p.name}<br/><em>{p.summary}</em></h2><p>{p.description}</p></div></section><section className="case-statement"><span>TECH STACK</span><p>{(p.tech||[]).join(' · ')}</p>{proof.length>0&&<small>{proof.join(' — ')}</small>}</section>{highlights.length>0&&<section className="system-layers"><div><p className="kicker">HIGHLIGHTS</p><h2>What it<br/><em>does.</em></h2></div><div>{highlights.map((h,i)=><article key={h}><span>{String(i+1).padStart(2,'0')}</span><h3>{h.split(':')[0]||h}</h3><p>{h}</p></article>)}</div></section>}{proof.length>0&&<section className="case-proof"><p className="kicker">VERIFIED STATUS</p><div className="proof-numbers">{proof.slice(0,3).map(x=><div key={x}><b>{x.split('—')[0].split(':')[0]}</b><span>{x}</span></div>)}</div></section>}{links.length>0&&<section className="case-cta"><p>{p.name}.</p>{links.map(l=><a key={l.url} href={l.url} target="_blank" rel="noreferrer">{l.label} ↗</a>)}</section>}</Frame>}

function ExperienceList(){const {experience}=useContext(DataContext);return <Frame eyebrow="02 / WORK EXPERIENCE" title={<>Roles with<br/><em>real weight.</em></>} aside="The verified timeline: every company, role, date, and what each one actually produced."><section className="xp-timeline">{experience.map(r=><a className="xp-item" href={'/experience/'+r.slug} key={r.slug}><span>{r.period}</span><div><h3>{r.role}</h3><p className="xp-org">{r.company}</p><p className="xp-desc">{r.summary}</p></div><i>→</i></a>)}</section></Frame>}

function ExperienceDetail({slug}){const {experience}=useContext(DataContext);const r=experience.find(x=>x.slug===slug);
  if(!r) return <Frame eyebrow="NOT FOUND" title={<>Role<br/><em>not found.</em></>} aside="This role doesn't exist."><section className="case-hero"><div><p>No role found with slug "{slug}".</p><a className="line-cta" href="/experience">BACK TO EXPERIENCE <b>→</b></a></div></section></Frame>;
  return <Frame eyebrow={`${r.period}`} title={<>{r.role}<span className="accent-dot">.</span></>} aside={r.company}><section className="case-hero"><div className="project-showcase"><span>{r.company}<br/>ROLE</span><i/><i/><i/></div><div><p className="kicker">{r.status}</p><h2>{r.role}<br/><em>{r.company}</em></h2><p>{r.description}</p></div></section><section className="case-statement"><span>PERIOD</span><p>{r.period}</p><small>{r.company} — {r.role}</small></section>{r.responsibilities.length>0&&<section className="system-layers"><div><p className="kicker">RESPONSIBILITIES</p><h2>What I<br/><em>did.</em></h2></div><div>{r.responsibilities.map((resp,i)=><article key={resp}><span>{String(i+1).padStart(2,'0')}</span><h3>{resp}</h3><p>{resp}</p></article>)}</div></section>}{r.tech.length>0&&<section className="case-proof"><p className="kicker">TECHNOLOGIES</p><div className="proof-numbers">{r.tech.map(t=><div key={t}><b>{t}</b><span>{t}</span></div>)}</div></section>}{r.products.length>0&&<section className="case-cta"><p>Products built.</p>{r.products.map(p=><span key={p} style={{marginRight:'20px'}}>{p}</span>)}</section>}</Frame>}

function Achievements(){const {profile}=useContext(DataContext);const {certifications,recognition}=profile;return <Frame eyebrow="03 / ACHIEVEMENTS" title={<>Recognition,<br/><em>verified only.</em></>} aside="Every claim here maps to a certificate, ranking, or record I can produce on request."><div className="kicker ach-kicker">CERTIFICATIONS</div><section className="cert-grid">{certifications.map(c=><article key={c.abbr}><b>{c.abbr}</b><h3>{c.name}</h3><span>{c.issuer}</span></article>)}</section><section className="recog"><p className="kicker">RECOGNITION & COMPETITION</p><div>{recognition.map(r=><article key={r.org+r.award}><b>{r.award}</b><h3>{r.org}</h3><p>{r.text}</p></article>)}</div></section></Frame>}

function Publications(){const {profile}=useContext(DataContext);const {publications}=profile;return <Frame eyebrow="04 / PUBLICATIONS & IP" title={<>Ideas with<br/><em>prior art.</em></>} aside="Patents and formal IP, plus the Signal Journal where build decisions are documented in public."><section className="pub-list">{publications.map(p=><article key={p.title}><p className="kicker">{p.type}</p><h2>{p.title}</h2><span>{p.status}</span><p className="pub-desc">{p.text}</p></article>)}</section><section className="pub-journal"><p className="kicker">ONGOING WRITING</p><h3>The Signal Journal.</h3><p>Operating notes on systems, security design, hardware research, and building in public — published as they are written.</p><a className="pub-link" href="/journal">READ THE JOURNAL <b>→</b></a></section></Frame>}

function Education(){const {profile}=useContext(DataContext);const {academic,ielts,certsDetailed}=profile.education;return <Frame eyebrow="07 / EDUCATION" title={<>Learning,<br/><em>verified.</em></>} aside="Academic foundation, certifications, and structured self-study — presented as verifiable records, not inflated claims."><section className="acad-list">{academic.map(a=><article key={a.qual}><p className="kicker">{a.period}</p><h2>{a.qual}</h2><p className="acad-inst">{a.inst}</p><p className="acad-details">{a.details}</p><div className="acad-highlights">{a.highlights.map(h=><span key={h}>+ {h}</span>)}</div></article>)}</section><section className="ielts-grid"><p className="kicker">IELTS SCORES</p><div className="ielts-scores"><div className="ielts-overall"><span>{ielts.overall}</span><strong>OVERALL · {ielts.cefr}</strong></div>{['listening','reading','writing','speaking'].map(k=><div key={k} className="ielts-band"><span>{ielts[k]}</span><strong>{k.toUpperCase()}</strong></div>)}</div><p className="ielts-meta">Date: {ielts.date} · Centre: {ielts.centre}</p></section><section className="certs-detail"><p className="kicker">CERTIFICATION FOCUS AREAS</p><div>{certsDetailed.map(c=><article key={c.name}><h3>{c.name}</h3><b>{c.issuer}</b><p>{c.focus}</p></article>)}</div></section></Frame>}

function Journal({post}){if(post)return <Frame eyebrow={post.type} title={post.title} aside={post.date}><article className="article"><p className="article-deck">{post.deck}</p>{post.body.map(x=><p key={x}>{x}</p>)}<div className="article-end">END / {post.date}</div></article></Frame>;return <Frame eyebrow="03 / SIGNAL JOURNAL" title={<>Research. Notes.<br/><em>Receipts.</em></>} aside="A public working record of security, systems, Linux, networking, product engineering, and authorised research."><section className="journal-list">{notes.map(n=><a href={'/journal/'+n.slug} key={n.slug}><p>{n.date} / {n.type}</p><h2>{n.title}</h2><span>{n.deck}</span><b>↗</b></a>)}</section></Frame>}

function About(){const {config,profile}=useContext(DataContext);const {bio}=profile;const {aboutCredentials}=profile;return <Frame eyebrow="04 / PROFILE" title={<>{config.name.split(' ')[0]}<br/><em>{config.name.split(' ')[1]}.</em></>} aside={config.bio}><section className="bio"><div className="bio-mark">{config.initials.split('').map((c,i)=><span key={i}>{c}</span>)}</div><div>{bio.paragraphs.map((p,i)=><p key={i}>{p}</p>)}<a className="line-cta" href={bio.cta.href}>{bio.cta.label} <b>→</b></a></div></section><section className="credentials"><p className="kicker">FOUNDATIONS</p><div>{aboutCredentials.map(c=><article key={c.tag}><span>{c.tag}</span><h3>{c.title}</h3><p>{c.text}</p></article>)}</div></section></Frame>}

function Now(){const {profile}=useContext(DataContext);const {nowItems}=profile;return <Frame eyebrow="05 / NOW" title={<>Currently<br/><em>in motion.</em></>} aside="A useful portfolio should show the direction of travel, not just finished screenshots."><section className="now-list">{nowItems.map((item,i)=><article key={item.title}><span>{String(i+1).padStart(2,'0')}</span><h2>{item.title}</h2><p>{item.text}</p></article>)}</section></Frame>}

function Contact(){const {config}=useContext(DataContext);return <Frame eyebrow="06 / OPEN CHANNEL" title={<>A difficult problem<br/><em>is a good start.</em></>} aside="For selected product, security, AI, and systems work."><section className="contact-panel"><p>Bring the real constraint, the ugly edge case, or the ambitious thing that needs an honest technical plan.</p><a href={`mailto:${config.email}`}>{config.email} <b>↗</b></a><div><a href={`https://github.com/${config.github}`} target="_blank" rel="noreferrer">GITHUB</a><a href={`https://www.linkedin.com/in/${config.linkedin}/`} target="_blank" rel="noreferrer">LINKEDIN</a></div></section></Frame>}

function NotFound(){return <Frame eyebrow="404" title={<>Page<br/><em>not found.</em></>} aside="The page you're looking for doesn't exist or has been moved."><section className="case-hero"><div><p>No route matched "{location.pathname}".</p><a className="line-cta" href="/">BACK HOME <b>→</b></a></div></section></Frame>}

function Router(){const [progress,setProgress]=useState(0);useEffect(()=>{const f=()=>setProgress((scrollY/(document.body.scrollHeight-innerHeight))*100||0);f();addEventListener('scroll',f);return()=>removeEventListener('scroll',f)},[]);const path=location.pathname.replace(/\/$/,'')||'/';const post=notes.find(n=>path==='/journal/'+n.slug);const projectSlug=path.match(/^\/projects\/(.+)$/)?.[1];const expSlug=path.match(/^\/experience\/(.+)$/)?.[1];let page=path==='/projects'&&!projectSlug?<Projects/>:projectSlug?<ProjectDetail slug={projectSlug}/>:path==='/experience'&&!expSlug?<ExperienceList/>:expSlug?<ExperienceDetail slug={expSlug}/>:path==='/journal'?<Journal/>:post?<Journal post={post}/>:path==='/about'?<About/>:path==='/achievements'?<Achievements/>:path==='/publications'?<Publications/>:path==='/education'?<Education/>:path==='/now'?<Now/>:path==='/contact'?<Contact/>:<Home/>;return <><div className="progress" style={{transform:`scaleX(${progress/100})`}}/>{page}</>}

function Experience(){return <DataProvider><Router/></DataProvider>}
export default Experience;
