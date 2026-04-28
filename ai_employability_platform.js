const ALL_SKILLS = [
  'JavaScript','TypeScript','Python','Java','Go','Rust','C++','Swift',
  'React','Vue','Angular','Next.js','Node.js','Django','FastAPI','Spring Boot',
  'SQL','PostgreSQL','MongoDB','Redis','Elasticsearch','GraphQL','REST APIs',
  'Docker','Kubernetes','AWS','GCP','Azure','Terraform','CI/CD','Linux',
  'Git','GitHub Actions','Machine Learning','Deep Learning','Pandas','NumPy',
  'TensorFlow','PyTorch','Spark','Kafka','Airflow','dbt',
  'HTML/CSS','Figma','UX Research','A/B Testing','Product Strategy',
  'Agile/Scrum','Data Analysis','Tableau','Power BI','Excel',
  'System Design','Microservices','Security','Networking'
];

const ROLE_REQUIREMENTS = {
  fullstack:['JavaScript','TypeScript','React','Node.js','SQL','REST APIs','Git','Docker','HTML/CSS','System Design'],
  ml:['Python','Machine Learning','Deep Learning','Pandas','NumPy','TensorFlow','SQL','Git','Docker','Spark'],
  data:['SQL','Python','Pandas','Data Analysis','Tableau','Excel','PostgreSQL','Git','A/B Testing','dbt'],
  devops:['Docker','Kubernetes','AWS','Terraform','Linux','CI/CD','Git','Python','Networking','Security'],
  pm:['Product Strategy','A/B Testing','Agile/Scrum','Data Analysis','UX Research','Excel','Figma','SQL'],
  ux:['Figma','UX Research','HTML/CSS','A/B Testing','Product Strategy','Agile/Scrum','Tableau'],
  quant:['Python','Statistics','Probability','Time Series','Pandas','NumPy','SQL','Machine Learning','Risk Modeling','Mathematics'],
  finance:['Excel','Financial Modeling','Accounting','SQL','Data Analysis','Tableau','Economics','Risk Analysis','Statistics']
};

const ROLE_LABELS = {fullstack:'Full Stack Developer',ml:'ML Engineer',data:'Data Analyst',devops:'DevOps / Cloud Engineer',pm:'Product Manager',ux:'UX Designer',quant:'Quant Analyst',finance:'Financial Analyst'};

let selectedSkills = new Set();
let analysisResult = null;

function gotoPage(id){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById('page-'+id).classList.add('active');
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
  const nav = document.querySelector(`[onclick="gotoPage('${id}')"]`);
  if(nav) nav.classList.add('active');
}

function renderSkillsGrid(filter=''){
  const grid = document.getElementById('skills-grid');
  const filtered = filter ? ALL_SKILLS.filter(s=>s.toLowerCase().includes(filter.toLowerCase())) : ALL_SKILLS;
  grid.innerHTML = filtered.map(s=>`<div class="skill-chip ${selectedSkills.has(s)?'selected':''}" onclick="toggleSkill('${s}',this)">${s}</div>`).join('');
}

function filterSkills(v){ renderSkillsGrid(v); }

function toggleSkill(skill, el){
  if(selectedSkills.has(skill)){ selectedSkills.delete(skill); el.classList.remove('selected'); }
  else { selectedSkills.add(skill); el.classList.add('selected'); }
}

function showBanner(text){
  const existing = document.querySelector('.demo-banner');
  if(existing) existing.remove();
  const banner = document.createElement('div');
  banner.className = 'demo-banner';
  banner.textContent = text;
  const content = document.querySelector('.content');
  if(content) content.insertBefore(banner, content.firstChild);
  setTimeout(()=> banner.remove(), 4200);
}

function loadDemo(){
  document.getElementById('user-name').value = 'Aaditya Singh';
  document.getElementById('target-role').value = 'fullstack';
  document.getElementById('exp-range').value = 2;
  document.getElementById('exp-val').textContent = '2';
  selectedSkills = new Set(['JavaScript','React','HTML/CSS','Git','SQL','Node.js']);
  renderSkillsGrid();
  gotoPage('assess');
  showBanner('Demo profile loaded — ready to analyze');
}

  // Projects UI helpers
  function addProject(){
    const list = document.getElementById('projects-list');
    if(!list) return;
    const el = document.createElement('div');
    el.className = 'project-item';
    el.innerHTML = `
      <input class="proj-title" placeholder="Project title (e.g. Expense Tracker)" style="width:100%;margin-bottom:6px;padding:8px;border-radius:6px;border:0.5px solid var(--color-border-secondary)">
      <input class="proj-stack" placeholder="Tech / stack (comma separated)" style="width:100%;margin-bottom:6px;padding:8px;border-radius:6px;border:0.5px solid var(--color-border-secondary)">
      <textarea class="proj-desc" placeholder="Short description (what you built / your role)" style="width:100%;min-height:64px;padding:8px;border-radius:6px;border:0.5px solid var(--color-border-secondary)"></textarea>
      <div style="display:flex;gap:6px;margin-top:8px"><button class="btn" onclick="removeProject(this)">Remove</button></div>
      <hr style="margin:12px 0;border:none;border-top:0.5px solid var(--color-border-tertiary)">
    `;
    list.appendChild(el);
  }

  function removeProject(btn){
    const item = btn && btn.closest('.project-item');
    if(item) item.remove();
  }

  function clearProjects(){
    const list = document.getElementById('projects-list');
    if(list) list.innerHTML = '';
  }

  function getProjects(){
    const list = document.getElementById('projects-list');
    if(!list) return [];
    const items = Array.from(list.querySelectorAll('.project-item'));
    return items.map(it=>({
      title: (it.querySelector('.proj-title')||{value:''}).value.trim(),
      stack: (it.querySelector('.proj-stack')||{value:''}).value.trim(),
      desc: (it.querySelector('.proj-desc')||{value:''}).value.trim()
    })).filter(p=>p.title||p.stack||p.desc);
  }

  function extractSkillsFromText(text){
    const found = new Set();
    if(!text) return found;
    const lower = text.toLowerCase();
    ALL_SKILLS.forEach(s=>{ if(lower.includes(s.toLowerCase())) found.add(s); });
    return found;
  }

function estimateTimeToLearn(skill){
  const long = ['Machine Learning','Deep Learning','System Design','Kubernetes','Terraform','Spark'];
  const medium = ['Docker','AWS','GCP','GraphQL','Redis','Elasticsearch','Microservices'];
  const short = ['Git','HTML/CSS','SQL','Excel','Tableau','Figma','Pandas','NumPy','React','Node.js','TypeScript','Python'];
  if(long.includes(skill)) return '4-6 months';
  if(medium.includes(skill)) return '2-4 months';
  if(short.includes(skill)) return '3-8 weeks';
  return '1-3 months';
}

function generateInsight(r){
  const {roleLabel,exp,mySkills,gaps,matched,score} = r;
  const topGaps = gaps.slice(0,3).map(s=>({skill:s, reason:`${s} is commonly required for ${roleLabel} roles.`, timeToLearn:estimateTimeToLearn(s)}));
  const quickWins = matched.slice(0,2);
  while(quickWins.length<2) quickWins.push('Git');

  // If no professional experience, provide actionable beginner suggestions
  if((exp === 0 || exp === '0')){
    const summary = `You have 0 years of professional experience. Based on selected skills, readiness for ${roleLabel} is ${score}%.`; 
    const advice = `Start with 2 small projects (1–3 weeks each), take an entry course, and contribute to open-source or internships. Showcase projects in a simple portfolio.`;
    const beginnerQuickWins = [...new Set([...quickWins, 'Build a small project'])].slice(0,2);
    return {summary, topGaps, quickWins: beginnerQuickWins, advice};
  }

  const summary = `Based on your selected skills and ${exp} years experience, your readiness for ${roleLabel} is ${score}%. Focus on the top gaps to increase job readiness.`;
  const advice = topGaps.length?`Start by learning ${topGaps[0].skill} through a short project, then apply it in a portfolio project.`:'Build a small project that ties together your existing skills.';
  return {summary, topGaps, quickWins, advice};
}

async function runAnalysis(){
  const name = document.getElementById('user-name').value;
  const roleKey = document.getElementById('target-role').value;
  const exp = document.getElementById('exp-range').value;
  if(!roleKey){ alert('Please select a target role first.'); return; }
  if(selectedSkills.size===0){ alert('Please select at least a few skills.'); return; }

  const required = ROLE_REQUIREMENTS[roleKey]||[];
  // include skills explicitly selected + skills detected from projects
  const projects = getProjects();
  const projSkillSet = new Set();
  projects.forEach(p=>{
    extractSkillsFromText([p.title,p.stack,p.desc].join(' ')).forEach(s=>projSkillSet.add(s));
  });
  const combined = new Set([...selectedSkills]);
  projSkillSet.forEach(s=>combined.add(s));
  const mySkills = [...combined];
  const gaps = required.filter(s=>!mySkills.includes(s));
  const matched = required.filter(s=>mySkills.includes(s));
  const baseScore = required.length? (matched.length/required.length):0;
  const years = parseFloat(exp) || 0;
  // factor experience modestly: +5% per year up to +25% (cap)
  const factor = 1 + Math.min(years,5) * 0.05;
  const score = Math.min(100, Math.round(baseScore * 100 * factor));

  gotoPage('gaps');

  const gapsDiv = document.getElementById('gaps-content');
  gapsDiv.innerHTML = `<div style="text-align:center;padding:1rem 0 0.5rem;font-size:13px;color:var(--color-text-secondary)">Analyzing profile...</div><div class="loading-dots" style="text-align:center;padding:0.5rem"><span></span><span></span><span></span></div>`;


  const insight = generateInsight({roleLabel: ROLE_LABELS[roleKey], exp: years, mySkills, gaps, matched, score});

  analysisResult = {name,roleKey,roleLabel:ROLE_LABELS[roleKey],exp: years,mySkills,required,gaps,matched,score,insight,projects};

  // render pages using local analysis
  gapsDiv.innerHTML = renderGapsPage(analysisResult);
  document.getElementById('path-content').innerHTML = renderPathPage(analysisResult);
  document.getElementById('jobs-content').innerHTML = renderJobsPage(analysisResult);
}

function renderGapsPage(r){
  const {name,roleLabel,score,matched,gaps,insight} = r;
  const color = score>=80?'#27500A':score>=60?'#633806':'#791F1F';
  const bgColor = score>=80?'#EAF3DE':score>=60?'#FAEEDA':'#FCEBEB';
  let html = `
  <div class="metric-grid">
    <div class="metric"><div class="metric-label">Readiness score</div><div class="metric-value" style="color:${color}">${score}%</div><div class="metric-sub">for ${roleLabel}</div></div>
    <div class="metric"><div class="metric-label">Skills matched</div><div class="metric-value">${matched.length}</div><div class="metric-sub">of ${r.required.length} required</div></div>
    <div class="metric"><div class="metric-label">Skills to learn</div><div class="metric-value">${gaps.length}</div><div class="metric-sub">identified gaps</div></div>
    <div class="metric"><div class="metric-label">Experience</div><div class="metric-value">${r.exp}</div><div class="metric-sub">years</div></div>
  </div>`;

  if(insight){
    html += `<div class="card"><div class="card-title">Analysis</div><p style="font-size:13px;color:var(--color-text-secondary);line-height:1.7;margin-bottom:10px">${insight.summary}</p><p style="font-size:13px;color:#185FA5;line-height:1.7"><strong>Next step:</strong> ${insight.advice}</p></div>`;
    if(insight.topGaps){
      html += `<div class="card"><div class="card-title">Priority gaps to fill</div>`;
      insight.topGaps.forEach(g=>{
        html += `<div style="display:flex;gap:12px;align-items:flex-start;padding:10px 0;border-bottom:0.5px solid var(--color-border-tertiary)"><div style="flex:1"><div style="font-size:13px;font-weight:500;margin-bottom:3px">${g.skill}</div><div style="font-size:12px;color:var(--color-text-secondary)">${g.reason}</div></div><span class="badge badge-amber">${g.timeToLearn}</span></div>`;
      });
      html += `</div>`;
    }
    if(insight.quickWins){
      html += `<div class="card"><div class="card-title">Quick wins — leverage now</div><div style="display:flex;gap:6px;flex-wrap:wrap">`;
      insight.quickWins.forEach(q=>{ html += `<span class="badge badge-green" style="padding:6px 12px">${q}</span>`; });
      html += `</div></div>`;
    }
  }

  html += `<div class="card"><div class="card-title">Skill gap map</div>`;
  html += `<div class="section-label" style="margin-bottom:6px">Skills you have</div><div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:14px">`;
  matched.forEach(s=>{ html += `<span class="skill-chip selected">${s}</span>`; });
  html += `</div><div class="section-label" style="margin-bottom:6px">Skills to develop</div><div style="display:flex;flex-wrap:wrap;gap:6px">`;
  gaps.forEach(s=>{ html += `<span class="skill-chip gap">${s}</span>`; });
  html += `</div></div>`;

  // show projects considered
  if(r.projects && r.projects.length){
    html += `<div class="card"><div class="card-title">Projects considered</div>`;
    r.projects.forEach(p=>{
      html += `<div style="margin-bottom:8px"><div style="font-weight:600">${p.title||'(untitled)'}</div><div style="font-size:12px;color:var(--color-text-secondary)">Stack: ${p.stack||'—'}</div><div style="font-size:12px;color:var(--color-text-secondary);margin-top:6px">${p.desc||''}</div></div>`;
    });
    html += `</div>`;
  }

  html += `<div style="display:flex;gap:8px"><button class="btn primary" onclick="gotoPage('path')">View career path →</button><button class="btn" onclick="gotoPage('jobs')">See matched jobs →</button></div>`;
  return html;
}

function renderPathPage(r){
  const {roleLabel,score,gaps,mySkills} = r;
  const phases = [
    {label:'Now',desc:'Current skills baseline',color:'#3266ad',bg:'#E6F1FB',items:mySkills.slice(0,4)},
    {label:'3 months',desc:'Fill critical gaps',color:'#854F0B',bg:'#FAEEDA',items:gaps.slice(0,3)},
    {label:'6 months',desc:'Build depth',color:'#3B6D11',bg:'#EAF3DE',items:gaps.slice(3,6)},
    {label:'12 months',desc:'Land the role',color:'#3C3489',bg:'#EEEDFE',items:[roleLabel]}
  ];

  let html = `<div class="card"><div class="card-title">Your 12-month roadmap to ${roleLabel}</div>`;
  html += `<div class="path-row" style="margin:1rem 0 1.5rem">`;
  phases.forEach((p,i)=>{
    html += `<div class="path-node">
      <div class="path-circle" style="background:${p.bg};border-color:${p.color};color:${p.color}">${i+1}</div>
      <div style="font-size:11px;font-weight:500;color:${p.color};text-align:center">${p.label}</div>
      <div style="font-size:10px;color:var(--color-text-tertiary);text-align:center">${p.desc}</div>
    </div>`;
    if(i<phases.length-1) html += `<div class="path-line" style="background:var(--color-border-tertiary);margin-top:20px"></div>`;
  });
  html += `</div></div>`;

  phases.forEach((p,i)=>{
    html += `<div class="card"><div style="display:flex;align-items:center;gap:10px;margin-bottom:10px"><div class="path-circle" style="width:32px;height:32px;font-size:10px;background:${p.bg};border-color:${p.color};color:${p.color}">${i+1}</div><div><div style="font-size:13px;font-weight:500">${p.label} — ${p.desc}</div></div></div>`;
    html += `<div style="display:flex;flex-wrap:wrap;gap:6px">`;
    p.items.forEach(item=>{ html += `<span class="badge" style="background:${p.bg};color:${p.color};padding:6px 10px">${item}</span>`; });
    html += `</div></div>`;
  });

  const courses = {
    fullstack:['The Odin Project (free)','Full Stack Open — Helsinki','AWS Certified Developer'],
    ml:['Fast.ai Practical Deep Learning','Coursera ML Specialization','Kaggle competitions'],
    data:['Mode SQL Tutorial','Kaggle Learn','Google Data Analytics Certificate'],
    devops:['Linux Foundation CKA','AWS Solutions Architect','HashiCorp Terraform Associate'],
    pm:['Reforge Growth Series','Lenny\'s Newsletter + course','AIPMM Certification'],
    ux:['Google UX Design Certificate','Interaction Design Foundation','Figma Community courses'],
    quant:['Quantitative Finance (CFE)','Coursera: Financial Engineering','CFA/FRM prep resources'],
    finance:['Financial Modeling & Valuation','Excel for Finance','CFA Level 1 prep']
  };

  const recs = courses[r.roleKey]||[];
  if(recs.length){
    html += `<div class="card"><div class="card-title">Recommended courses</div>`;
    recs.forEach((c,i)=>{ html += `<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:${i<recs.length-1?'0.5px solid var(--color-border-tertiary)':'none'}"><span class="badge badge-blue" style="min-width:24px;text-align:center">${i+1}</span><span style="font-size:13px">${c}</span></div>`; });
    html += `</div>`;
  }
  return html;
}

function renderJobsPage(r){
  const jobsByRole = {
    fullstack:[
      {title:'Full Stack Developer',company:'TechCorp',location:'Remote / Delhi',salary:'₹15–22 LPA',match:r.score,skills:['React','Node.js','SQL']},
      {title:'Frontend Engineer',company:'Razorpay',location:'Bangalore',salary:'₹18–28 LPA',match:Math.max(r.score-8,40),skills:['React','TypeScript','CSS']},
      {title:'Backend Developer',company:'Zepto',location:'Mumbai',salary:'₹20–30 LPA',match:Math.max(r.score-14,35),skills:['Node.js','PostgreSQL','Docker']}
    ],
    ml:[
      {title:'ML Engineer',company:'Google',location:'Hyderabad',salary:'₹25–45 LPA',match:r.score,skills:['Python','TensorFlow','MLOps']},
      {title:'Research Engineer',company:'Microsoft Research',location:'Bengaluru',salary:'₹30–50 LPA',match:Math.max(r.score-12,30),skills:['PyTorch','Deep Learning','Research']},
      {title:'Data Scientist',company:'Meesho',location:'Remote',salary:'₹18–32 LPA',match:Math.max(r.score-6,40),skills:['Python','ML','SQL']}
    ],
    data:[
      {title:'Data Analyst',company:'Flipkart',location:'Bangalore',salary:'₹12–20 LPA',match:r.score,skills:['SQL','Python','Tableau']},
      {title:'Business Analyst',company:'Swiggy',location:'Remote',salary:'₹14–22 LPA',match:Math.max(r.score-8,40),skills:['Excel','SQL','Stakeholder mgmt']},
      {title:'Analytics Engineer',company:'PhonePe',location:'Pune',salary:'₹16–26 LPA',match:Math.max(r.score-15,35),skills:['dbt','SQL','Python']}
    ],
    devops:[
      {title:'DevOps Engineer',company:'Infosys',location:'Chennai',salary:'₹14–24 LPA',match:r.score,skills:['Docker','Kubernetes','CI/CD']},
      {title:'Cloud Architect',company:'Wipro',location:'Remote',salary:'₹22–40 LPA',match:Math.max(r.score-10,35),skills:['AWS','Terraform','Security']},
      {title:'SRE',company:'CRED',location:'Bangalore',salary:'₹20–35 LPA',match:Math.max(r.score-12,30),skills:['Linux','Kubernetes','Python']}
    ],
    pm:[
      {title:'Product Manager',company:'Zomato',location:'Gurugram',salary:'₹20–35 LPA',match:r.score,skills:['Strategy','Analytics','Roadmapping']},
      {title:'Associate PM',company:'Razorpay',location:'Bangalore',salary:'₹16–25 LPA',match:Math.max(r.score-5,45),skills:['Agile','Data','UX']},
      {title:'Growth PM',company:'ShareChat',location:'Remote',salary:'₹18–30 LPA',match:Math.max(r.score-10,40),skills:['A/B testing','SQL','Product']}
    ],
    ux:[
      {title:'UX Designer',company:'Myntra',location:'Bangalore',salary:'₹14–22 LPA',match:r.score,skills:['Figma','Research','Prototyping']},
      {title:'Product Designer',company:'Nykaa',location:'Mumbai',salary:'₹16–26 LPA',match:Math.max(r.score-8,40),skills:['Figma','Usability','Design systems']},
      {title:'UI/UX Lead',company:'Paytm',location:'Noida',salary:'₹20–32 LPA',match:Math.max(r.score-15,35),skills:['Leadership','Figma','Research']}
    ]
    ,
    quant:[
      {title:'Quant Analyst',company:'Goldman Sachs',location:'Bengaluru',salary:'₹25–50 LPA',match:r.score,skills:['Python','Statistics','Time Series']},
      {title:'Quant Researcher',company:'Morgan Stanley',location:'Mumbai',salary:'₹30–55 LPA',match:Math.max(r.score-8,40),skills:['Probability','Mathematics','Risk Modeling']},
      {title:'Risk Quant',company:'Barclays',location:'Remote',salary:'₹22–40 LPA',match:Math.max(r.score-12,35),skills:['Python','SQL','Risk Modeling']}
    ],
    finance:[
      {title:'Financial Analyst',company:'Deloitte',location:'Gurugram',salary:'₹8–16 LPA',match:r.score,skills:['Financial Modeling','Excel','Accounting']},
      {title:'Investment Analyst',company:'ICICI Securities',location:'Mumbai',salary:'₹10–18 LPA',match:Math.max(r.score-6,40),skills:['Excel','Accounting','Data Analysis']},
      {title:'Risk Analyst',company:'KPMG',location:'Bangalore',salary:'₹9–17 LPA',match:Math.max(r.score-10,35),skills:['Risk Analysis','SQL','Economics']}
    ]
  };

  const jobs = jobsByRole[r.roleKey]||[];
  let html = `<div class="metric-grid"><div class="metric"><div class="metric-label">Matched jobs</div><div class="metric-value">${jobs.length}</div><div class="metric-sub">for ${r.roleLabel}</div></div><div class="metric"><div class="metric-label">Best match</div><div class="metric-value">${Math.max(...jobs.map(j=>j.match))}%</div><div class="metric-sub">fit score</div></div></div>`;

  jobs.forEach(job=>{
    const mc = job.match>=80?'#27500A':job.match>=60?'#633806':'#791F1F';
    const mb = job.match>=80?'#EAF3DE':job.match>=60?'#FAEEDA':'#FCEBEB';
    html += `<div class="job-card"><div style="display:flex;gap:12px;align-items:flex-start">
      <div class="match-ring" style="background:${mb};color:${mc}">${job.match}%</div>
      <div style="flex:1"><div style="font-size:14px;font-weight:500;margin-bottom:2px">${job.title}</div>
      <div style="font-size:12px;color:var(--color-text-secondary);margin-bottom:6px">${job.company} · ${job.location} · ${job.salary}</div>
      <div style="display:flex;gap:4px;flex-wrap:wrap">`;
    job.skills.forEach(s=>{ html+=`<span class="badge badge-blue">${s}</span>`; });
    html += `</div></div><button class="btn primary" style="font-size:12px;padding:6px 12px">Apply</button></div></div>`;
  });
  return html;
}

renderSkillsGrid();

function toggleDemoMode(){
  const on = document.body.classList.toggle('demo');
  const btn = document.getElementById('demo-toggle');
  if(btn) btn.textContent = on ? 'Exit Demo' : 'Demo Mode';
}
