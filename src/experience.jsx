import { useEffect, useState } from 'react';
import { posts } from './content';
import { projects as allProjects, workExperience } from './data/projects';
import './experience.css';

const notes = posts.map(p=>({slug:p.id,type:p.type,date:p.date,title:p.title,deck:p.dek,body:p.body}));

const skills = ['Secure product engineering','Application security','AI systems & automation','Linux & networking','Hardware / wireless research','Cloud & release systems'];

function Nav(){const [open,setOpen]=useState(false);return <><a className="skip-link" href="#main">Skip to content</a><header className="topbar"><a className="wordmark" href="/">CYN<span>I</span>K <small>OPERATOR</small></a><nav className={open?'open':''}><a href="/projects">Projects</a><a href="/experience">Experience</a><a href="/achievements">Achievements</a><a href="/publications">Publications</a><a href="/education">Education</a><a href="/journal">Journal</a><a href="/about">Profile</a></nav><a className="talk" href="/contact">Start a signal <b>↗</b></a><button className="nav-toggle" onClick={()=>setOpen(!open)} aria-label="Menu">{open?'×':'≡'}</button></header></>}
function Signal(){return <div className="signal" aria-hidden="true"><i/><i/><i/><i/><i/></div>}
function Frame({eyebrow,title,children,aside}){return <><Nav/><main id="main" className="page"><section className="page-intro"><p className="kicker">{eyebrow}</p><h1>{title}</h1>{aside&&<p className="intro-aside">{aside}</p>}</section>{children}</main><Footer/></>}
function Footer(){return <footer className="footer"><p>BUILD CAREFULLY. LEARN IN PUBLIC. <em>LEAVE SYSTEMS STRONGER.</em></p><div><span>© 2026 NIKHIL NAGPURE</span><a href="https://github.com/5h4d0wn1k" target="_blank" rel="noreferrer">GITHUB ↗</a><a href="https://www.linkedin.com/in/nikhilnagpure24/" target="_blank" rel="noreferrer">LINKEDIN ↗</a></div></footer>}

function ProjectArt({p,slug}){return <div className={'project-art '+(p.color||'acid')}><div className="art-top"><span>SYS / {p.number||slug}</span><b>{p.status}</b></div><div className="circuit"><i/><i/><i/><i/><i/></div><div className="readout">{(p.tech||p.tags||[]).join(' · ')}</div></div>}

function Home(){return <><Nav/><main id="main"><section className="home-hero"><div className="field"/><p className="kicker">NIKHIL NAGPURE / SYSTEMS OPERATOR</p><p className="hero-side">Founder · Security practitioner ·<br/>full-stack systems builder.</p><div className="name"><span>NIKH<span>I</span>L</span><strong>NAGPURE</strong></div><div className="hero-foot"><div><Signal/><small>OPERATING ACROSS AI SYSTEMS,<br/>SECURITY, NETWORKS & PRODUCTS</small></div><a className="orb" href="/projects">ENTER<br/>THE WORK <b>↓</b></a><p>Building things the human<br/>timeline remembers.</p></div></section><section className="manifesto"><p>AMBITION BECOMES REAL<br/>WHEN THE <em>SYSTEM HOLDS.</em></p><div><span><b>57</b> PUBLIC REPOSITORIES</span><span><b>06</b> CONNECTED DISCIPLINES</span><span><b>01</b> OPERATOR</span></div></section><section className="home-work"><div className="section-label"><p className="kicker">01 / SELECTED SYSTEMS</p><h2>Proof,<br/><em>not posturing.</em></h2><p>I work across the whole shape of a system: the interface, the data, the infrastructure, the threat model, and the release.</p></div><div className="project-grid">{allProjects.slice(0,6).map(p=><a className="project-card" href={'/projects/'+p.slug} key={p.slug}><ProjectArt p={p} slug={p.slug}/><div className="project-info"><p>{p.category}</p><h3>{p.name}</h3><span>VIEW DETAILS <b>↗</b></span></div></a>)}</div><a className="line-cta" href="/projects">VIEW ALL PROJECTS <b>→</b></a></section><section className="axis"><p className="kicker">02 / OPERATOR AXIS</p><h2>See the whole<br/><em>system.</em></h2><div className="skill-list">{skills.map((s,i)=><div key={s}><span>0{i+1}</span><strong>{s}</strong><b>↗</b></div>)}</div></section><section className="home-journal"><div><p className="kicker">03 / SIGNAL JOURNAL</p><h2>Notes from the<br/><em>edge of the build.</em></h2></div><div>{notes.slice(0,3).map(n=><a className="note-preview" href={'/journal/'+n.slug} key={n.slug}><p>{n.type} / {n.date}</p><h3>{n.title}</h3><span>{n.deck}</span><b>↗</b></a>)}</div></section></main><Footer/></>}

function Projects(){return <Frame eyebrow="01 / PROJECTS" title={<>All<br/><em>projects.</em></>} aside="Every system I've built or contributed to — open source, private, and production."><section className="work-index">{allProjects.map(p=><article key={p.slug} className="case-row"><ProjectArt p={p} slug={p.slug}/><div><p className="kicker">{p.category}</p><h2>{p.name}</h2><p>{p.summary}</p><div className="tagrow">{(p.tech||[]).map(x=><span key={x}>{x}</span>)}</div></div><div className="proof-list">{(p.proof||[]).map(x=><span key={x}>+ {x}</span>)}</div><a href={'/projects/'+p.slug}>DETAILS <b>↗</b></a></article>)}</section></Frame>}

function ProjectDetail({slug}){
  const p = allProjects.find(x=>x.slug===slug);
  if(!p) return <Frame eyebrow="NOT FOUND" title={<>Project<br/><em>not found.</em></>} aside="This project doesn't exist."><section className="case-hero"><div><p>No project found with slug "{slug}".</p><a className="line-cta" href="/projects">BACK TO PROJECTS <b>→</b></a></div></section></Frame>;
  const highlights = p.highlights||[];
  const links = p.links||[];
  const proof = p.proof||[];
  return <Frame eyebrow={`PROJECT / ${p.category}`} title={<>{p.name}<span className="accent-dot">.</span></>} aside={p.summary}>
    <section className="case-hero">
      <ProjectArt p={p} slug={p.slug}/>
      <div>
        <p className="kicker">{p.category} · {p.status}</p>
        <h2>{p.name}<br/><em>{p.summary}</em></h2>
        <p>{p.description}</p>
      </div>
    </section>
    <section className="case-statement">
      <span>TECH STACK</span>
      <p>{(p.tech||[]).join(' · ')}</p>
      {proof.length>0&&<small>{proof.join(' — ')}</small>}
    </section>
    {highlights.length>0&&<section className="system-layers">
      <div>
        <p className="kicker">HIGHLIGHTS</p>
        <h2>What it<br/><em>does.</em></h2>
      </div>
      <div>
        {highlights.map((h,i)=><article key={h}><span>{String(i+1).padStart(2,'0')}</span><h3>{h.split(':')[0]||h}</h3><p>{h}</p></article>)}
      </div>
    </section>}
    {proof.length>0&&<section className="case-proof">
      <p className="kicker">VERIFIED STATUS</p>
      <div className="proof-numbers">
        {proof.slice(0,3).map(x=><div key={x}><b>{x.split('—')[0].split(':')[0]}</b><span>{x}</span></div>)}
      </div>
    </section>}
    {links.length>0&&<section className="case-cta">
      <p>{p.name}.</p>
      {links.map(l=><a key={l.url} href={l.url} target="_blank" rel="noreferrer">{l.label} ↗</a>)}
    </section>}
  </Frame>;
}

function ExperienceList(){return <Frame eyebrow="02 / WORK EXPERIENCE" title={<>Roles with<br/><em>real weight.</em></>} aside="The verified timeline: every company, role, date, and what each one actually produced."><section className="xp-timeline">{workExperience.map(r=><a className="xp-item" href={'/experience/'+r.slug} key={r.slug}><span>{r.period}</span><div><h3>{r.role}</h3><p className="xp-org">{r.company}</p><p className="xp-desc">{r.summary}</p></div><i>→</i></a>)}</section></Frame>}

function ExperienceDetail({slug}){
  const r = workExperience.find(x=>x.slug===slug);
  if(!r) return <Frame eyebrow="NOT FOUND" title={<>Role<br/><em>not found.</em></>} aside="This role doesn't exist."><section className="case-hero"><div><p>No role found with slug "{slug}".</p><a className="line-cta" href="/experience">BACK TO EXPERIENCE <b>→</b></a></div></section></Frame>;
  return <Frame eyebrow={`${r.period}`} title={<>{r.role}<span className="accent-dot">.</span></>} aside={r.company}>
    <section className="case-hero">
      <div className="project-showcase"><span>{r.company}<br/>ROLE</span><i/><i/><i/></div>
      <div>
        <p className="kicker">{r.status}</p>
        <h2>{r.role}<br/><em>{r.company}</em></h2>
        <p>{r.description}</p>
      </div>
    </section>
    <section className="case-statement">
      <span>PERIOD</span>
      <p>{r.period}</p>
      <small>{r.company} — {r.role}</small>
    </section>
    {r.responsibilities.length>0&&<section className="system-layers">
      <div>
        <p className="kicker">RESPONSIBILITIES</p>
        <h2>What I<br/><em>did.</em></h2>
      </div>
      <div>
        {r.responsibilities.map((resp,i)=><article key={resp}><span>{String(i+1).padStart(2,'0')}</span><h3>{resp}</h3><p>{resp}</p></article>)}
      </div>
    </section>}
    {r.tech.length>0&&<section className="case-proof">
      <p className="kicker">TECHNOLOGIES</p>
      <div className="proof-numbers">
        {r.tech.map(t=><div key={t}><b>{t}</b><span>{t}</span></div>)}
      </div>
    </section>}
    {r.products.length>0&&<section className="case-cta">
      <p>Products built.</p>
      {r.products.map(p=><span key={p} style={{marginRight:'20px'}}>{p}</span>)}
    </section>}
  </Frame>;
}

function Achievements(){const certs=[['CEH','Certified Ethical Hacker','EC-COUNCIL'],['CNSP','Certified Network Security Practitioner','THE SECOPS GROUP'],['PEH','Practical Ethical Hacking','TCM SECURITY'],['7.5 / C1','IELTS — English proficiency','BRITISH COUNCIL'],['PY4E','Python for Everybody Specialization','UNIV. OF MICHIGAN · COURSERA'],['DSA / C++','HPC Data Structures & Algorithms','IAMNEO']];const recog=[['TryHackMe','TOP 25% GLOBALLY','Active practice profile across defensive and offensive security tracks.'],['CyVIT CTF','RANK 36','Capture-the-flag competition at VIT.'],['HackerOne','BUG BOUNTY RESEARCHER','Active recon, testing, and reporting practice on live programs.'],['Smart India Hackathon','PARTICIPANT · 2023','National-scale hackathon edition.'],['Kavach','PARTICIPANT','National cybersecurity competition.'],['DSA Dash','PARTICIPANT','Competitive programming sprint.'],['thecodemunk.in','INSTRUCTOR','Taught Git & GitHub classes to working learners.'],['DEFCON Franklin','VOLUNTEER','IT security project volunteer and participant.'],['Health O Tech Club','FORMER CORE MEMBER · VIT','Organized hackathons and security events on campus.']];return <Frame eyebrow="03 / ACHIEVEMENTS" title={<>Recognition,<br/><em>verified only.</em></>} aside="Every claim here maps to a certificate, ranking, or record I can produce on request."><div className="kicker ach-kicker">CERTIFICATIONS</div><section className="cert-grid">{certs.map(c=><article key={c[0]}><b>{c[0]}</b><h3>{c[1]}</h3><span>{c[2]}</span></article>)}</section><section className="recog"><p className="kicker">RECOGNITION & COMPETITION</p><div>{recog.map(r=><article key={r[0]+r[1]}><b>{r[1]}</b><h3>{r[0]}</h3><p>{r[2]}</p></article>)}</div></section></Frame>}

function Publications(){const pubs=[['PATENT · CO-INVENTOR','A Self-Cleaning Glasses Case System','Indian Patent Application No. 202421032123. A low-power automated hygiene system for eyewear combining sensor-driven cleaning cycles with a sealed fluid loop.','FILED 2024 · PUBLISHED · PENDING GRANT']];return <Frame eyebrow="04 / PUBLICATIONS & IP" title={<>Ideas with<br/><em>prior art.</em></>} aside="Patents and formal IP, plus the Signal Journal where build decisions are documented in public."><section className="pub-list">{pubs.map(p=><article key={p[1]}><p className="kicker">{p[0]}</p><h2>{p[1]}</h2><span>{p[3]}</span><p className="pub-desc">{p[2]}</p></article>)}</section><section className="pub-journal"><p className="kicker">ONGOING WRITING</p><h3>The Signal Journal.</h3><p>Operating notes on systems, security design, hardware research, and building in public — published as they are written.</p><a className="pub-link" href="/journal">READ THE JOURNAL <b>→</b></a></section></Frame>}

function Education(){const academic=[{qual:'B.Tech in Computer Science — Cybersecurity Specialization',inst:'Vellore Institute of Technology (VIT), India',period:'Sep 2021 — Oct 2025',details:'CGPA 8.33/10 · Registration No. 21BCY10249 · Awarded 18 September 2025',highlights:['Cybersecurity and Digital Forensics specialization','Coursework: OS, networking, cryptography, penetration testing, forensics','Health O Tech Club — former core member, organized hackathons and security events']},{qual:'12th Standard (MPBSE, PCM)',inst:'Keshave English School, Waraseoni, Balaghat MP',period:'2019 — 2021',details:'82.4% · Physics, Chemistry, Mathematics',highlights:['Science stream with focus on mathematics and analytical thinking']},{qual:'10th Standard (MPBSE)',inst:'Keshave English School, Waraseoni, Balaghat MP',period:'2017 — 2019',details:'82% · All subjects',highlights:['Foundation in mathematics, science, and analytical reasoning']}];const ielts={overall:'7.5',cefr:'C1',listening:'8.5',reading:'7.0',writing:'6.5',speaking:'7.0',date:'28 January 2026',centre:'British Council'};const certsDetailed=[{name:'Certified Ethical Hacker (CEH)',issuer:'EC-Council',focus:'Penetration testing methodology, reconnaissance, scanning, enumeration, system hacking, web app security'},{name:'Certified Network Security Practitioner (CNSP)',issuer:'The SecOps Group',focus:'Network security fundamentals, firewall configuration, intrusion detection, incident response'},{name:'Practical Ethical Hacking (PEH)',issuer:'TCM Security',focus:'Hands-on offensive security: web apps, APIs, Active Directory, privilege escalation, reporting'},{name:'Python for Everybody Specialization',issuer:'University of Michigan · Coursera',focus:'Python programming, data structures, databases, web scraping, automation'},{name:'HPC Data Structures & Algorithms (C++)',issuer:'IAmneo',focus:'Competitive programming, algorithm design, complexity analysis, implementation in C++'}];return <Frame eyebrow="07 / EDUCATION" title={<>Academic<br/><em>foundations.</em></>} aside="Formal education, certifications, and the structured learning behind the practical work."><section className="edu-timeline"><div><p className="kicker">ACADEMIC HISTORY</p><h2>Built on<br/><em>real study.</em></h2></div><div>{academic.map(a=><article key={a.qual}><span>{a.period}</span><h3>{a.qual}</h3><p className="edu-inst">{a.inst}</p><p className="edu-detail">{a.details}</p><ul>{a.highlights.map(h=><li key={h}>{h}</li>)}</ul></article>)}</div></section><section className="ielts-block"><div><p className="kicker">ENGLISH PROFICIENCY</p><h2>IELTS <em>7.5</em></h2><p>CEFR Level C1 · British Council · {ielts.date}</p></div><div className="ielts-scores"><div><span>LISTENING</span><b>{ielts.listening}</b></div><div><span>READING</span><b>{ielts.reading}</b></div><div><span>WRITING</span><b>{ielts.writing}</b></div><div><span>SPEAKING</span><b>{ielts.speaking}</b></div></div></section><section className="cert-detailed"><p className="kicker">CERTIFICATIONS & COURSES</p><div>{certsDetailed.map(c=><article key={c.name}><h3>{c.name}</h3><p className="cert-issuer">{c.issuer}</p><p>{c.focus}</p></article>)}</div></section></Frame>}

function Journal({post}){if(post)return <Frame eyebrow={post.type} title={post.title} aside={post.date}><article className="article"><p className="article-deck">{post.deck}</p>{post.body.map(x=><p key={x}>{x}</p>)}<div className="article-end">END / {post.date}</div></article></Frame>;return <Frame eyebrow="03 / SIGNAL JOURNAL" title={<>Research. Notes.<br/><em>Receipts.</em></>} aside="A public working record of security, systems, Linux, networking, product engineering, and authorised research."><section className="journal-list">{notes.map(n=><a href={'/journal/'+n.slug} key={n.slug}><p>{n.date} / {n.type}</p><h2>{n.title}</h2><span>{n.deck}</span><b>↗</b></a>)}</section></Frame>}

function About(){return <Frame eyebrow="04 / PROFILE" title={<>Nikhil<br/><em>Nagpure.</em></>} aside="A founder and systems builder connecting security thinking with real product delivery."><section className="bio"><div className="bio-mark">N<span>I</span>K</div><div><p>I build secure, useful systems where the product experience, the engineering, and the threat model agree with each other.</p><p>My work crosses AI systems, application security, full-stack platforms, Linux/networking research, and hardware exploration. I am most useful when an ambitious idea needs a technical spine.</p><a className="line-cta" href="/contact">START A CONVERSATION <b>→</b></a></div></section><section className="credentials"><p className="kicker">FOUNDATIONS</p><div><article><span>EDUCATION</span><h3>B.Tech CSE</h3><p>Cybersecurity Specialization · VIT · 2021–2025 · CGPA 8.33</p></article><article><span>SECURITY</span><h3>CEH · CNSP</h3><p>Practical Ethical Hacking (TCM Security) · OWASP / offensive-security practice</p></article><article><span>HIGHLIGHTS</span><h3>Builder / Researcher</h3><p>TryHackMe Top 25% · CyVIT CTF rank 36 · co-inventor, filed patent</p></article></div></section></Frame>}

function Now(){return <Frame eyebrow="05 / NOW" title={<>Currently<br/><em>in motion.</em></>} aside="A useful portfolio should show the direction of travel, not just finished screenshots."><section className="now-list"><article><span>01</span><h2>NAAVIS</h2><p>Building the private, local-first intelligence spine: memory, tools, perception, trust, and personal growth. The core architecture is documented; now extending action capabilities and consent-gated perception.</p></article><article><span>02</span><h2>WIRELESS RESEARCH</h2><p>ESP32 sensing, authorised security testing, and the boundary between signals and useful insight. Building a portable hardware pentesting toolkit with Wi-Fi deauth, Evil Twin, and CSI visualisation.</p></article><article><span>03</span><h2>BUG BOUNTY</h2><p>Active researcher on HackerOne and Bugcrowd. Focus: IDOR, SSRF, business logic, subdomain takeover. Building methodology and contributing findings to live programs.</p></article><article><span>04</span><h2>CTF & COMPETITIONS</h2><p>Preparing for CSAW CTF, BSides Mumbai, and Smart India Hackathon. CyVIT CTF rank 36 at VIT. Practicing on TryHackMe (Top 25%) and Hack The Box.</p></article><article><span>05</span><h2>OPEN SOURCE</h2><p>Building and maintaining security tools: pentest frameworks, hardening checkers, scanners, and educational utilities. All public on GitHub.</p></article></section></Frame>}

function Contact(){return <Frame eyebrow="06 / OPEN CHANNEL" title={<>A difficult problem<br/><em>is a good start.</em></>} aside="For selected product, security, AI, and systems work."><section className="contact-panel"><p>Bring the real constraint, the ugly edge case, or the ambitious thing that needs an honest technical plan.</p><a href="mailto:nikhilnagpure203@gmail.com">nikhilnagpure203@gmail.com <b>↗</b></a><div><a href="https://github.com/5h4d0wn1k" target="_blank" rel="noreferrer">GITHUB</a><a href="https://www.linkedin.com/in/nikhilnagpure24/" target="_blank" rel="noreferrer">LINKEDIN</a></div></section></Frame>}

function Experience(){const [progress,setProgress]=useState(0);useEffect(()=>{const f=()=>setProgress((scrollY/(document.body.scrollHeight-innerHeight))*100||0);f();addEventListener('scroll',f);return()=>removeEventListener('scroll',f)},[]);const path=location.pathname.replace(/\/$/,'')||'/';const post=notes.find(n=>path==='/journal/'+n.slug);const projectSlug=path.match(/^\/projects\/(.+)$/)?.[1];const expSlug=path.match(/^\/experience\/(.+)$/)?.[1];let page=path==='/projects'&&!projectSlug?<Projects/>:projectSlug?<ProjectDetail slug={projectSlug}/>:path==='/experience'&&!expSlug?<ExperienceList/>:expSlug?<ExperienceDetail slug={expSlug}/>:path==='/journal'?<Journal/>:post?<Journal post={post}/>:path==='/about'?<About/>:path==='/achievements'?<Achievements/>:path==='/publications'?<Publications/>:path==='/education'?<Education/>:path==='/now'?<Now/>:path==='/contact'?<Contact/>:<Home/>;return <><div className="progress" style={{transform:`scaleX(${progress/100})`}}/>{page}</>}
export default Experience;
