import { Component, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { posts } from './content';
import './styles.css';
import './journal.css';
import Experience from './experience';
import PortfolioRouter from './archive';

const projects = [
  { id:'01', name:'Naavis', type:'Autonomous intelligence system', tags:['AI Systems','Automation','Agentic workflows'], url:'https://github.com/5h4d0wn1k/naavis', tone:'lime', copy:'An autonomous intelligence system built to translate intent into useful, repeatable action.' },
  { id:'02', name:'API Security Platform', type:'Security engineering', tags:['OWASP','Threat insights','Next.js'], url:'https://github.com/5h4d0wn1k/ApiSecPlatform', tone:'blue', copy:'A platform for turning API risk into legible tests, useful signals, and stronger product decisions.' },
  { id:'03', name:'Wireless Security Toolkit', type:'Hardware × research', tags:['ESP32','Wireless','Authorized testing'], url:'https://github.com/5h4d0wn1k/wireless-security-toolkit', tone:'coral', copy:'A hardware security research kit for responsible wireless assessment and education.' },
  { id:'04', name:'ESP32 CSI Sensing', type:'Applied sensing', tags:['IoT','Signal processing','Visualization'], url:'https://github.com/5h4d0wn1k/esp32-csi-sensing', tone:'paper', copy:'Experiments in turning raw WiFi CSI data into live visual insight and presence detection.' }
];
const skills = ['Product systems','Offensive security','Full-stack engineering','AI automation','Hardware research','Cloud delivery'];

class RenderGuard extends Component {
 state = { error: null };
 static getDerivedStateFromError(error) { return { error }; }
 render() { return this.state.error ? <pre style={{padding:24, color:'#fff', background:'#320b0b', whiteSpace:'pre-wrap'}}>{this.state.error.stack}</pre> : this.props.children; }
}

function App(){
 const [active,setActive]=useState(0); const [menu,setMenu]=useState(false); const [cursor,setCursor]=useState({x:0,y:0}); const [selectedPost,setSelectedPost]=useState(null);
 useEffect(()=>{ const move=e=>setCursor({x:e.clientX,y:e.clientY}); window.addEventListener('pointermove',move); return()=>window.removeEventListener('pointermove',move)},[]);
 useEffect(()=>{ document.documentElement.style.setProperty('--mx',cursor.x+'px');document.documentElement.style.setProperty('--my',cursor.y+'px')},[cursor]);
 return <main>
  <div className="cursor" aria-hidden="true"/>
  <nav><a className="brand" href="#top" aria-label="Home">N<span>·</span>N</a><div className={'navlinks '+(menu?'open':'')}><a href="#work">Work</a><a href="#method">Method</a><a href="#journal">Journal</a><a href="#about">About</a></div><a className="nav-cta" href="#contact">Let’s build <i>↗</i></a><button className="menu" onClick={()=>setMenu(!menu)} aria-label="Toggle menu">{menu?'×':'≡'}</button></nav>
  <section className="hero" id="top">
   <div className="grid"/><p className="eyebrow reveal">SYSTEMS BUILDER · <span>INDIA / WORLDWIDE</span></p>
   <div className="hero-title"><h1 className="reveal name-lockup"><span>N</span><span>I</span><span>K</span><span>H</span><span>I</span><span>L</span></h1><div className="title-row"><p className="hero-note reveal">I build decisive digital systems<br/>where intelligence meets integrity.</p><h1 className="outline reveal">NAGPURE</h1></div></div>
   <div className="hero-bottom"><div className="availability"><b/><span>AVAILABLE FOR<br/>SELECTED BUILDS</span></div><a className="round-link" href="#work">EXPLORE<br/>THE WORK <span>↓</span></a><p className="statement">Founder. Security practitioner.<br/>Full-stack systems architect.</p></div>
   <div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="coordinate">{String(Math.round(cursor.x)).padStart(4,'0')} / {String(Math.round(cursor.y)).padStart(4,'0')}</div>
  </section>
  <section className="proof"><p>BUILDING SOMETHING THE<br/><em>HUMAN TIMELINE REMEMBERS.</em></p><div className="stats"><span><b>57</b>PUBLIC REPOS</span><span><b>03</b>DISCIPLINES</span><span><b>∞</b>CURIOUSITY</span></div></section>
  <section className="work" id="work"><div className="section-head"><p className="eyebrow">01 / SELECTED SYSTEMS</p><h2>Designed for<br/><i>the real world.</i></h2><p>Not just interfaces. End-to-end systems shaped around hard problems, honest constraints, and durable outcomes.</p></div>
   <div className="project-list">{projects.map((p,i)=><article className={'project '+p.tone+(active===i?' is-active':'')} key={p.name} onMouseEnter={()=>setActive(i)}><a href={p.url} target="_blank" rel="noreferrer" aria-label={'View '+p.name+' on GitHub'}><div className="project-index">{p.id}</div><div className="project-main"><p>{p.type}</p><h3>{p.name}</h3><div className="tags">{p.tags.map(t=><span key={t}>{t}</span>)}</div></div><div className="project-art"><div className="art-panel"><small>LIVE SYSTEM MAP</small><div className="nodes"><b/><b/><b/><b/></div><div className="scan"/></div></div><div className="arrow">↗</div></a></article>)}</div>
  </section>
  <section className="method" id="method"><div className="method-intro"><p className="eyebrow">02 / OPERATING METHOD</p><h2>Clarity is<br/>a <em>technical</em> skill.</h2></div><div className="steps">{[['01','Interrogate','Find the actual problem beneath the requested feature.'],['02','Model','Make the system, risk, and decision paths visible.'],['03','Build','Ship the smallest robust version with a clear operational spine.'],['04','Harden','Measure the weak points; improve what the real world reveals.']].map(x=><div className="step" key={x[0]}><span>{x[0]}</span><h3>{x[1]}</h3><p>{x[2]}</p><i>→</i></div>)}</div></section>
  <section className="capabilities"><div className="cap-top"><p className="eyebrow">03 / CAPABILITY MAP</p><p>THE DISCIPLINES I CONNECT</p></div><div className="skills">{skills.map((s,i)=><button key={s} className={'skill s'+i}><span>0{i+1}</span>{s}<i>↗</i></button>)}</div></section>
  <section className="journal" id="journal"><div className="journal-intro"><p className="eyebrow">04 / SIGNAL JOURNAL</p><h2>Notes from<br/>the <em>edge of the build.</em></h2><p>Research, field notes, architecture decisions, and the observations that make the next system sharper.</p></div><div className="post-list">{posts.map((post,index)=><button className="post" key={post.id} onClick={()=>setSelectedPost(post)}><span className="post-number">0{index+1}</span><div><p className="post-meta">{post.type} · {post.read}</p><h3>{post.title}</h3><p className="post-dek">{post.dek}</p></div><span className="post-arrow">↗</span></button>)}</div><p className="journal-foot">NEW NOTES AS THE WORK EVOLVES. <span>FOLLOW THE SIGNAL ↓</span></p></section>
  <section className="about" id="about"><div className="about-mark">N<span>·</span>N</div><div><p className="eyebrow">04 / THE OPERATOR</p><h2>Security is not<br/>a checkbox.<br/><em>It is a mindset.</em></h2></div><div className="about-copy"><p>I’m Nikhil Nagpure — a founder and systems builder working across secure full-stack products, AI automation, and hardware security research.</p><p>My work begins where the obvious solution ends: translating ambiguity into products people can rely on.</p><a href="https://github.com/5h4d0wn1k" target="_blank" rel="noreferrer">FOLLOW THE BUILD LOG <span>↗</span></a></div></section>
  <footer id="contact"><p className="eyebrow">05 / OPEN CHANNEL</p><h2>Have a difficult<br/>problem worth <em>solving?</em></h2><a className="contact-link" href="mailto:nikhilnagpure203@gmail.com">START A CONVERSATION <span>↗</span></a><div className="foot"><span>© 2026 NIKHIL NAGPURE</span><a href="https://www.linkedin.com/in/nikhilnagpure24/" target="_blank" rel="noreferrer">LINKEDIN ↗</a><a href="https://github.com/5h4d0wn1k" target="_blank" rel="noreferrer">GITHUB ↗</a><span>BUILT WITH INTENT</span></div></footer>
  {selectedPost && <div className="modal-backdrop" onClick={()=>setSelectedPost(null)}><article className="article-modal" role="dialog" aria-modal="true" aria-label={selectedPost.title} onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setSelectedPost(null)} aria-label="Close article">×</button><p className="eyebrow">{selectedPost.type} · {selectedPost.read}</p><h2>{selectedPost.title}</h2><p className="article-dek">{selectedPost.dek}</p><div className="article-body">{selectedPost.body.map(p=><p key={p}>{p}</p>)}</div><div className="article-tags">{selectedPost.tags.map(tag=><span key={tag}>{tag}</span>)}</div></article></div>}
 </main>
}
createRoot(document.getElementById('root')).render(<PortfolioRouter/>);
